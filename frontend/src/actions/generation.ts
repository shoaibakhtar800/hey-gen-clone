"use server";

import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

export async function getPresignedUrl(
  fileName: string,
  fileType: string,
  purpose: "ptvPhoto" | "ptvAudio" | "ttsVoiceClone" | "videoTranslation",
) {
  let folder: string | null = null;

  if (purpose === "ptvPhoto" || purpose === "ptvAudio") folder = "ptv";
  if (purpose === "ttsVoiceClone") folder = "tts";

  if (folder === null) {
    throw new Error("Invalid purpose for presigned upload URL");
  }

  const ext = fileName.split(".").pop();
  const uuid = randomUUID();
  const key = `${folder}/${uuid}.${ext}`;

  const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY_ID,
    },
  });

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });

  return { url, key };
}
