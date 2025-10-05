import { db } from "~/server/db";
import { inngest } from "./client";
import { env } from "~/env";
import { getPresignedUrl } from "~/lib/s3";

export const photoToVideo = inngest.createFunction(
  {
    id: "photo-to-video",
    concurrency: {
      limit: 5,
      key: "event.data.userId",
    },
    onFailure: async ({ event, error }) => {
      return await db.photoToVideoGeneration.update({
        where: {
          id: (
            event?.data?.event.data as {
              photoToVideoId: string;
            }
          ).photoToVideoId,
        },
        data: {
          status: "failed",
        },
      });
    },
  },
  { event: "photo-to-video-event" },
  async ({ event, step }) => {
    const { photoToVideoId } = event.data as {
      photoToVideoId: string;
      userId: string;
    };

    const photoToVideo = await step.run("get-photo-to-video", async () => {
      return await db.photoToVideoGeneration.findUniqueOrThrow({
        where: {
          id: photoToVideoId,
        },
        include: {
          user: {
            select: {
              id: true,
              credits: true,
            },
          },
        },
      });
    });

    if (photoToVideo.user.credits > 0) {
      await step.run("set-status-processing", async () => {
        return await db.photoToVideoGeneration.update({
          where: { id: photoToVideo.id },
          data: {
            status: "processing",
          },
        });
      });

      if (photoToVideo.drivingAudioS3Key === null) {
        const ttsResponse = await step.fetch(env.TEXT_TO_SPEECH_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Modal-Key": env.MODAL_KEY,
            "Modal-Secret": env.MODAL_SECRET,
          },
          body: JSON.stringify({
            text: photoToVideo.script,
            voice_S3_key: photoToVideo.voiceS3Key,
          }),
        });

        const data = (await ttsResponse.json()) as { s3_key: string };
        photoToVideo.drivingAudioS3Key = data.s3_key;
      }

      if (photoToVideo.experimentalModel) {
        const [photoUrl, audioUrl] = await step.run(
          "create-presigned-urls",
          async () => {
            const photo = await getPresignedUrl(photoToVideo.photoS3Key!);
            const audio = await getPresignedUrl(
              photoToVideo.drivingAudioS3Key!,
            );
            return [photo, audio];
          },
        );

        const sieveJobResponse = await step.fetch("endpoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            function: "sieve/portrait-avatar",
            inputs: {
              source_image: { url: photoUrl },
              driving_audio: { url: audioUrl },
              backend: "model name",
              enhancement: photoToVideo.enhancement ? "codeformer" : "none",
            },
            webhooks: [
              {
                type: "job.complete",
                url: `https://${process.env.VERCEL_URL}/api/sieve`,
              },
            ],
          }),
        });

        const sieveJob = (await sieveJobResponse.json()) as { id: string };

        await step.run("update-db-with-sieve-job-id", async () => {
          return await db.photoToVideoGeneration.update({
            where: {
              id: photoToVideo.id,
            },
            data: {
              sieveJobId: sieveJob.id,
            },
          });
        });
      } else {
        const videoResponse = await step.fetch(env.PHOTO_TO_VIDEO_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Modal-Key": env.MODAL_KEY,
            "Modal-Secret": env.MODAL_SECRET,
          },
          body: JSON.stringify({
            transcript: photoToVideo.script,
            photo_s3_key: photoToVideo.photoS3Key,
            audio_s3_key: photoToVideo.drivingAudioS3Key,
          }),
        });

        const data = (await videoResponse.json()) as { video_s3_key: string };
        const videoS3Key = data.video_s3_key;

        await step.run("update-db-with-vide", async () => {
          return await db.photoToVideoGeneration.update({
            where: { id: photoToVideo.id },
            data: {
              videoS3Key: videoS3Key,
              status: "completed",
            },
          });
        });

        await step.run("deduct-credits", async () => {
          return await db.user.update({
            where: {
              id: photoToVideo.user.id,
            },
            data: {
              credits: { decrement: 1 },
            },
          });
        });
      }
    } else {
      await step.run("set-status-no-credits", async () => {
        return await db.photoToVideoGeneration.update({
          where: { id: photoToVideo.id },
          data: {
            status: "no credits",
          },
        });
      });
    }
  },
);
