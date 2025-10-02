"use client";

import { Image, Languages, Video } from "lucide-react";
import { useState } from "react";
import { PhotoToVideoModal } from "./modals/photo-to-video-modal";

enum featureType {
    PhotoToVideo,
    TranslateVideo,
    ChangeVideoAudio
}

const features = [
  {
    label: "Photo to Video with Portrait Avartar",
    icon: Image,
    color: "bg-blue-50 text-blue-500",
    description: "Turn photo and script into talking video.",
    featureType: featureType.PhotoToVideo
  },
  {
    label: "Translate Video",
    icon: Languages,
    color: "bg-orange-50 text-orange-500",
    description: "Translate with original voice and lip sync.",
    featureType: featureType.TranslateVideo
  },
  {
    label: "Change Video Audio",
    icon: Video,
    color: "bg-purple-50 text-purple-500",
    description: "Replace the audio track of your video.",
    featureType: featureType.ChangeVideoAudio
  },
];

export function ClientHome() {
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [translateModalOpen, setTranslateModalOpen] = useState(false);
  const [changeVideoAudioOpen, setChangeVideoAudioOpen] = useState(false);

  return (
    <div className="p-8">
      <h2 className="mb-6 text-lg font-semibold">Create something new</h2>
      <div className="mb-2 flex flex-wrap gap-4">
        {features.map((feature) => (
          <div
            key={feature.label}
            className="group relative flex min-w-80 cursor-pointer items-center gap-4 rounded-lg bg-white p-2 transition-all duration-300"
            onClick={() => {
                if (feature.featureType === featureType.PhotoToVideo) {
                    setPhotoModalOpen(true);
                }
                if (feature.featureType === featureType.TranslateVideo) {
                    setTranslateModalOpen(true);
                }
                if (feature.featureType === featureType.ChangeVideoAudio) {
                    setChangeVideoAudioOpen(true);
                }
            }}
          >
            <div
              className={`flex items-center justify-center rounded-lg p-3 ${feature.color}`}
            >
              <feature.icon className="h-5 w-5" />
            </div>
            <div className="relative flex w-full flex-col justify-center">
              <div className="text-sm font-medium text-gray-900 transition-all duration-300 group-hover:-translate-y-2.5">
                {feature.label}
              </div>
              <div className="pointer-events-none absolute top-3 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {feature.description}
              </div>
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-lg border border-transparent opacity-0 shadow transition-all duration-300 group-hover:border-gray-200 group-hover:opacity-100 group-hover:shadow-md"></span>
          </div>
        ))}
      </div>
      
      <PhotoToVideoModal open={photoModalOpen} onOpenChange={setPhotoModalOpen} />
    </div>
  );
}
