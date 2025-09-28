import io
import os
import uuid
from typing import Optional

import torch
import torchaudio
from chatterbox.tts import ChatterboxTTS
import modal
from pydantic import BaseModel

app = modal.App("chatterbox-tts-generator")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(["numpy"])
    .pip_install_from_requirements("text-to-speech/requirements.txt")
    .apt_install("ffmpeg")
)

volume = modal.Volume.from_name("hf-cache-chatterbox", create_if_missing=True)

s3_secret = modal.Secret.from_name("hey-gen-secret")

class TextToSpeechRequest(BaseModel):
    text: str
    voice_S3_key: Optional[str] = None

class TextToSpeechResponse(BaseModel):
    s3_key: str

@app.cls(
    image=image,
    gpu="L40S",
    volumes={
        "/root/.cache/huggingface": volume,
        "/s3-mount": modal.CloudBucketMount("hey-gen-bucket-v2", secret=s3_secret)
    },
    scaledown_window=120,
    secrets=[s3_secret]
)
class TextToSpeechServer:
    @modal.enter()
    def load_model(self):
        print("Loading model...")
        self.model = ChatterboxTTS.from_pretrained(device="cuda")
        print("Model loaded")

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_speech(self, request: TextToSpeechRequest) -> TextToSpeechResponse:
        print(f"Received request: {request.text}")

        with torch.no_grad():
            if request.voice_S3_key:
                print("Using voice cloning with S3 speech prompt...")
                audio_prompt_path = f"/s3-mount/{request.voice_S3_key}"
                if not os.path.exists(audio_prompt_path):
                    raise FileNotFoundError(f"Audio prompt file not found: {audio_prompt_path}")
                wav = self.model.generate(request.text, audio_prompt_path=audio_prompt_path)
            else:
                print("Using basic text-to-speech without voice cloning...")
                wav = self.model.generate(request.text)

            wav_cpu = wav.cpu()

        buffer = io.BytesIO()
        torchaudio.save(buffer, wav_cpu, self.model.sr, format="wav")
        buffer.seek(0)
        audio_bytes = buffer.read()

        audio_uuid = str(uuid.uuid4())
        s3_key = f"tts/{audio_uuid}.wav"
        s3_path = f"/s3-mount/{s3_key}"
        os.makedirs(os.path.dirname(s3_path), exist_ok=True)
        with open(s3_path, "wb") as f:
            f.write(audio_bytes)
        print(f"S3 key {s3_key} saved to {s3_path}")

        return TextToSpeechResponse(s3_key=s3_key)

@app.local_entrypoint()
def main():
    import requests

    server = TextToSpeechServer()
    endpoint_url = server.generate_speech.get_web_url()

    request = TextToSpeechRequest(
        text="Hello from Modal!! This is a test of chatterbox!",
        voice_S3_key="samples/voices/vocal-shot-247291.mp3"
    )

    payload = request.model_dump()

    response = requests.post(endpoint_url, json=payload)
    response.raise_for_status()

    result = TextToSpeechResponse(**response.json())
    print(result.s3_key)