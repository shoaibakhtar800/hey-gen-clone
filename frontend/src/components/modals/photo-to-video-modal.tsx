import { Trash2, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import AudioUploadModal from "./audio-upload-modal";

const samplesPhotos = [
  {
    s3Key: "samples/photos/pexels-mert-coskun-386432351-33692532.jpg",
    url: "https://public-hey-gen-clone-v2.s3.us-east-1.amazonaws.com/samples/photos/pexels-mert-coskun-386432351-33692532.jpg",
  },
  {
    s3Key: "samples/photos/pexels-silviopelegrin-33621286.jpg",
    url: "https://public-hey-gen-clone-v2.s3.us-east-1.amazonaws.com/samples/photos/pexels-silviopelegrin-33621286.jpg",
  },
  {
    s3Key: "samples/photos/pexels-tatyana-doloman-728740365-32523808.jpg",
    url: "https://public-hey-gen-clone-v2.s3.us-east-1.amazonaws.com/samples/photos/pexels-tatyana-doloman-728740365-32523808.jpg",
  },
  {
    s3Key: "samples/photos/pexels-thadowww-33545082.jpg",
    url: "https://public-hey-gen-clone-v2.s3.us-east-1.amazonaws.com/samples/photos/pexels-thadowww-33545082.jpg",
  },
];

export function PhotoToVideoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [script, setScript] = useState("");
  const [audioModalOpen, setAudioModalOpen] = useState(false);

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhotoUrl(URL.createObjectURL(file));
      setSelectedPhotoFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit max-h-[95%] w-full min-w-[95%] overflow-y-auto lg:w-full lg:max-w-5xl lg:min-w-fit">
        <div className="flex flex-col gap-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Realistic talking video with{" "}
              <span className="text-purple-600">AI Portrait Avatars</span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-base">
              Turn a single photo and script into a high-quality avatar video
              using an AI portrait model.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-8 p-8 lg:flex-row">
            <div className="flex w-full flex-col gap-4 lg:w-[340px]">
              {selectedPhotoUrl ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedPhotoUrl}
                      crossOrigin="anonymous"
                      alt="Selected Photo"
                      className="max-h-[340px] max-w-full rounded-xl border object-contain md:max-w-[340px]"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedPhotoFile(null);
                        setSelectedPhotoUrl(null);
                      }}
                      className="absolute top-2 right-2 rounded-full bg-white p-2 shadow"
                    >
                      <Trash2 className="h-5 w-5 text-gray-600" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 pt-8 pb-4">
                  <div className="flex flex-grow flex-col items-center justify-center">
                    <UploadCloud className="mb-2 h-10 w-10 text-gray-400" />
                    <label className="text-md cursor-pointer font-medium underline">
                      Upload photo
                      <Input
                        onChange={handlePhotoFileChange}
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    <div className="mt-2 text-xs text-gray-500">
                      For best results, choose a photo that's at least 720p
                    </div>
                  </div>
                  <div className="mt-6 w-full">
                    <div className="text-xs text-gray-500">
                      Try a sample photo
                    </div>
                    <div className="mt-1 flex gap-2">
                      {samplesPhotos.map((item) => (
                        <Image
                          key={item.s3Key}
                          src={item.url}
                          className="cursor-pointer rounded border object-cover"
                          width={50}
                          height={50}
                          alt="Sample Photo"
                          onClick={() => {
                            setSelectedPhotoUrl(item.url);
                            setSelectedPhotoFile(null);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div>
                <div className="relative">
                  <Textarea
                    rows={10}
                    maxLength={210}
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="min-h-32 break-all"
                    placeholder="Type your script here or "
                  />
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setAudioModalOpen(true)}
                    className={`${script ? "hidden" : ""} absolute top-7 left-0.5 text-base underline md:text-sm lg:top-[3px] lg:left-[156px]`}
                  >
                    upload or record audio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AudioUploadModal
          open={audioModalOpen}
          onOpenChange={setAudioModalOpen}
          onAudioRecorded={(audioBlob: Blob) => {

          }}
        />
      </DialogContent>
    </Dialog>
  );
}
