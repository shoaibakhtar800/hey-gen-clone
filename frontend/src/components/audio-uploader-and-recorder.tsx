import { useState } from "react";
import { AudioDropzone } from "./audio-dropzone";
import { toast } from "sonner";
import { getAudioDuration } from "~/utils/media";
import { Button } from "./ui/button";

export const AudioUploaderAndRecorder = ({
  onAudioReady,
}: {
  onAudioReady: (audioBlob: Blob) => void;
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  const handleFileSelect = async (file: File) => {
    try {
      const duration = await getAudioDuration(file);
      if (duration > 15) {
        toast.error("Audio must be 15 seconds or less.");
        return;
      }

      setAudioUrl(URL.createObjectURL(file));
      setAudioBlob(file);
    } catch {
      toast.error("Could not read the audio file.");
    }
  };

  const startRecording = async () => {};

  const stopRecording = async () => {};

  return (
    <div className="flex flex-col gap-4">
      {!audioUrl ? (
        <>
          <AudioDropzone onFileSelect={handleFileSelect} />
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          {isRecording ? (
            <div className="flex w-full flex-col items-center gap-2">
              <span className="text-xs text-gray-700">
                Recording... 00:{String(recordTime).padStart(2, "0")} / 00:15
                sec{" "}
              </span>
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="w-full"
              >
                Record audio
              </Button>
            </div>
          ) : (
            <Button onClick={startRecording} variant="secondary">
              Record audio
            </Button>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
