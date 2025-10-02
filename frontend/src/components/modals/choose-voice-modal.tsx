import { AudioUploaderAndRecorder } from "../audio-uploader-and-recorder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export interface Voice {
  id: string;
  name: string;
  tags: string[];
  accent: string;
  flag: string;
  audioSrc: string;
  s3Key: string;
}

const heyGenLibraryVoice: Voice[] = [
  {
    id: "v1",
    name: "Jeff",
    tags: ["Deep", "American", "Assertive"],
    accent: "American",
    flag: "us",
    audioSrc:
      "https://public-hey-gen-clone-v2.s3.us-east-1.amazonaws.com/samples/voices/hell-yeah-shout-101933.mp3",
    s3Key: "samples/voices/hell-yeah-shout-101933.mp3",
  },
  {
    id: "v2",
    name: "Kamala",
    tags: ["Articulate", "American"],
    accent: "American",
    flag: "us",
    audioSrc:
      "https://public-hey-gen-clone-v2.s3.us-east-1.amazonaws.com/samples/voices/sample-pack-links-in-bio-sampled-stuff-288267.mp3",
    s3Key: "samples/voices/sample-pack-links-in-bio-sampled-stuff-288267.mp3",
  },
  {
    id: "v3",
    name: "Mark",
    tags: ["Articulate", "American"],
    accent: "American",
    flag: "us",
    audioSrc:
      "https://public-hey-gen-clone-v2.s3.us-east-1.amazonaws.com/samples/voices/vocal-shot-247291.mp3",
    s3Key: "samples/voices/vocal-shot-247291.mp3",
  },
];

const VoiceCard = ({
  voice,
  onSelect,
  onPlayToggle,
  isPlaying,
}: {
  voice: Voice;
  onSelect: (voice: Voice) => void;
  onPlayToggle: (voice: Voice) => void;
  isPlaying: boolean;
}) => {
  const handlePlayClick = (e: MouseEvent) => {
    e.stopPropagation();
    onPlayToggle(voice);
  };

  return <p>Hello</p>;
};

export default function ChooseVoideModal({
  open,
  onOpenChange,
  onVoiceSelected,
  onAudioUploaded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoiceSelected: (voice: Voice) => void;
  onAudioUploaded: (file: File) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Choose Voice</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="heygen-library">
          <TabsList>
            <TabsTrigger value="my-voices">My Voices</TabsTrigger>
            <TabsTrigger value="heygen-library">HeyGen Library</TabsTrigger>
          </TabsList>
          <TabsContent value="my-voices" className="p-4">
            <AudioUploaderAndRecorder
              onAudioReady={function (blob: Blob): void {
                const file = new File([blob], "custom_voice.wav", {
                  type: blob.type,
                });

                onAudioUploaded(file);
                onOpenChange(false);
              }}
            />
          </TabsContent>
          <TabsContent
            value="heygen-library"
            className="flex max-h-[60vh] flex-wrap gap-4 overflow-y-auto p-4"
          >
            {heyGenLibraryVoice.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                onSelect={(voice: Voice) => {
                    onVoiceSelected(voice);
                }}
                onPlayToggle={(voice: Voice) => {
                    // togglePlay(voice)
                }}
                isPlaying={false}
              />
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
