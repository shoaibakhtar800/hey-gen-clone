import {
  AudioWaveform,
  Loader2,
  Pause,
  Play,
  Ratio,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useAudioPlayer } from "~/hooks/use-audio-player";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import AudioUploadModal from "./audio-upload-modal";
import ChooseVoideModal, { type Voice } from "./choose-voice-modal";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import getCroppedImg from "~/utils/crop-image";

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

  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedAudioUrl, setSelectedAudioUrl] = useState<string | null>(null);
  const [selectedAudioName, setSelectedAudioName] =
    useState<string>("new_recording.wav");
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [customVoiceFile, setCustomVoiceFile] = useState<File | null>(null);

  const [experimentalModel, setExperimentalModel] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [enhancement, setEnhancement] = useState(true);
  const [expressiveness, setExpressiveness] = useState(1);
  const [resolution, setResolution] = useState("512");

  const [loading, setLoading] = useState(false);

  const { playingSrc, togglePlay } = useAudioPlayer();

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhotoUrl(URL.createObjectURL(file));
      setSelectedPhotoFile(file);
    }
  };

  const togglePlayAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  const handleGenerateVideo = async () => {
    setLoading(true);

    let photS3Key: string | null = null;
    let audioS3Key: string | null = null;
    let voiceS3Key: string | null = null;

    if (selectedPhotoUrl) {
      let fileToUpload: File | null = null;

      if (!experimentalModel && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          selectedPhotoUrl,
          croppedAreaPixels,
        );
        if (croppedImage) {
          fileToUpload = selectedPhotoFile;
        }
      } else if (selectedPhotoFile) {
        fileToUpload = selectedPhotoFile;
      }

      if (fileToUpload) {
      }
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
              {selectedPhotoUrl && !experimentalModel ? (
                <div className="relative h-64 w-64">
                  <Cropper
                    classes={{ containerClassName: "rounded-md" }}
                    image={selectedPhotoUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropComplete={(_, pixels) => {
                      setCroppedAreaPixels(pixels);
                    }}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                  />
                  <Button
                    onClick={() => {
                      if (aspectRatio === 1 / 1) {
                        setAspectRatio(3 / 2);
                      } else {
                        setAspectRatio(1 / 1);
                      }
                    }}
                    className="absolute top-2 right-2 rounded-full bg-white p-2 shadow hover:bg-gray-200"
                  >
                    <Ratio className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedPhotoUrl(null);
                      setSelectedPhotoFile(null);
                    }}
                    className="absolute top-14 right-2 rounded-full bg-white p-2 shadow hover:bg-gray-200"
                  >
                    <Trash2 className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              ) : selectedPhotoUrl ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedPhotoUrl}
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
                  {selectedAudioUrl ? (
                    <>
                      <div className="flex items-center gap-3 rounded border bg-gray-50 p-3">
                        <Button
                          className="mr-2"
                          variant="ghost"
                          onClick={togglePlayAudio}
                        >
                          <Play className="h-5 w-5 text-gray-600" />
                        </Button>
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-medium">
                            {selectedAudioName}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          className="ml-2"
                          onClick={() => {
                            setSelectedAudioUrl(null);
                          }}
                        >
                          <Trash2 className="h-5 w-5 text-gray-500" />
                        </Button>
                        <audio
                          id="audio-preview"
                          ref={audioRef}
                          src={selectedAudioUrl}
                          style={{ display: "none" }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}

                  <div className="absolute bottom-2 flex w-full flex-col gap-2 px-3">
                    <div className="mt-2 flex items-center gap-2">
                      {!selectedAudioUrl &&
                        (customVoiceFile ? (
                          <div className="flex items-center gap-2">
                            <Button
                              className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-purple-600"
                              variant="ghost"
                              onClick={() => setVoiceModalOpen(true)}
                            >
                              <AudioWaveform className="h-4 w-4" />
                              <span>{customVoiceFile.name}</span>
                            </Button>
                          </div>
                        ) : selectedVoice ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              onClick={() => setVoiceModalOpen(true)}
                              className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-purple-600"
                            >
                              <AudioWaveform className="h-4 w-4" />
                              <span>{selectedVoice.name}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600"
                              onClick={() => {
                                if (selectedVoice)
                                  togglePlay(selectedVoice.audioSrc);
                              }}
                            >
                              {playingSrc === selectedVoice.audioSrc ? (
                                <Pause className="h-5 w-5" />
                              ) : (
                                <Play className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="link"
                            className="h-0 px-0 text-xs text-gray-500"
                            onClick={() => setVoiceModalOpen(true)}
                          >
                            Select voice
                          </Button>
                        ))}
                      {!selectedAudioUrl && (
                        <span className="ml-auto text-xs text-gray-400">
                          {script.length} / 210 (15 seconds max)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={experimentalModel}
                    onCheckedChange={setExperimentalModel}
                  />
                  <span className="text-xs text-gray-700">
                    Exprimental model
                  </span>
                </div>
                {experimentalModel && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={enhancement}
                      onCheckedChange={setEnhancement}
                    />
                    <span className="text-xs text-gray-700">Enhancement</span>
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-6">
                {experimentalModel && (
                  <div>
                    <Label className="text-sm font-medium">
                      Expressiveness{" "}
                      <span className="ml-1 rounded bg-gray-100 px-1 text-xs">
                        0-1
                      </span>
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={expressiveness}
                      onChange={(e) => {
                        setExpressiveness(Number(e.target.value));
                      }}
                      className="mt-2 w-24"
                    />
                  </div>
                )}

                <div className="flex w-full items-center justify-end">
                  {experimentalModel && (
                    <Select
                      value={resolution}
                      onValueChange={(value) => setResolution(value)}
                    >
                      <SelectTrigger className="w-[100px] rounded border px-2 py-1 text-xs">
                        <SelectValue placeholder="512p" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512">512p</SelectItem>
                        <SelectItem value="640">640p</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    onClick={handleGenerateVideo}
                    className="ml-2 bg-purple-600 px-4 py-2 text-sm text-white"
                    disabled={
                      loading ||
                      !(
                        (selectedPhotoFile ?? selectedPhotoUrl) &&
                        (script.trim().length > 0 || selectedAudioUrl)
                      )
                    }
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Generate video
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
            const url = URL.createObjectURL(audioBlob);
            setSelectedAudioUrl(url);

            let name =
              "new_recording_" +
              new Date().toLocaleString().replace(/[\s:/]/g, "_") +
              ".wav";
            if ((audioBlob as File).name) {
              name = (audioBlob as File).name;
            }
            setSelectedAudioName(name);
            setAudioModalOpen(false);
          }}
        />
        <ChooseVoideModal
          open={voiceModalOpen}
          onOpenChange={setVoiceModalOpen}
          onVoiceSelected={(voice) => {
            setSelectedVoice(voice);
            setCustomVoiceFile(null);
            setVoiceModalOpen(false);
          }}
          onAudioUploaded={(file) => {
            setSelectedVoice(null);
            setCustomVoiceFile(file);
            setVoiceModalOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
