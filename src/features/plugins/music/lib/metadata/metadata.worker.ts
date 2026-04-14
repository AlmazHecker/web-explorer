import { TagLib } from "taglib-wasm";
import { WorkerInput, WorkerOutput } from "./metadata-bridge";

const wasmReady = TagLib.initialize();

self.onmessage = async (e: MessageEvent<WorkerInput>) => {
  const { target, file, quality } = e.data;

  try {
    const taglib = await wasmReady;

    const audioFile = await taglib.open(file);
    const tags = audioFile.tag();
    const coverData = audioFile.getPictures();

    audioFile.dispose();

    const artwork: MediaImage = { src: "" };
    const picture = coverData?.[0];

    if (picture) {
      const originalBlob = new Blob([picture.data as BlobPart], {
        type: picture.mimeType,
      });

      if (quality === "low") {
        const thumbBitmap = await createImageBitmap(originalBlob, {
          resizeWidth: 80,
          resizeHeight: 80,
          resizeQuality: "low",
        });
        thumbBitmap.close();

        const canvas = new OffscreenCanvas(80, 80);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(thumbBitmap, 0, 0);

        const thumbBlob = await canvas.convertToBlob({
          type: "image/jpeg",
          quality: 0.7,
        });

        artwork.src = URL.createObjectURL(thumbBlob);
        artwork.sizes = "80x80";
        artwork.type = "image/jpeg";
      } else {
        const originalBitmap = await createImageBitmap(originalBlob);
        originalBitmap.close();

        artwork.src = URL.createObjectURL(originalBlob);
        artwork.sizes = `${originalBitmap.width}x${originalBitmap.height}`;
        artwork.type = picture.mimeType;
      }
    }

    const response: WorkerOutput = {
      target,
      metadata: {
        artist: tags?.artist || "Unknown Artist",
        title: tags?.title || file.name,
        album: tags?.album || "Unknown Album",
        artwork,
        lyrics: "",
        // lyrics: tags?.lyrics || "",
      },
    };

    self.postMessage(response);
  } catch (error) {
    self.postMessage({
      target,
      error:
        error instanceof Error ? error.message : "Failed to parse metadata",
    });
  }
};
