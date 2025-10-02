export const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audio = document.createElement("audio");
        const url = URL.createObjectURL(file);
        audio.src = url;
        audio.addEventListener("loadedmetadata", () => {
            URL.revokeObjectURL(url);
            resolve(audio.duration);
        });

        audio.addEventListener("error", () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load audio metadata"));
        });
    });
}