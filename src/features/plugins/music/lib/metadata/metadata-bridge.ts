import { TrackMetadata } from "../../model/types";
import MetadataWorker from "./metadata.worker?worker";

export interface WorkerInput {
  id: string;
  file: File;
  quality: "low" | "high";
}

export interface WorkerOutput {
  id: string;
  metadata?: TrackMetadata;
  error?: string;
}

const worker = typeof window !== "undefined" ? new MetadataWorker() : null;

const pending = new Map<string, (data: WorkerOutput) => void>();

if (worker) {
  worker.onmessage = (e: MessageEvent<WorkerOutput>) => {
    const resolve = pending.get(e.data.id);
    if (resolve) {
      resolve(e.data);
      pending.delete(e.data.id);
    }
  };
}

export const metadataBridge = {
  request: (input: Omit<WorkerInput, "id">): Promise<WorkerOutput> => {
    if (!worker) {
      return Promise.reject("Worker not available");
    }

    const id = crypto.randomUUID();

    return new Promise((resolve) => {
      pending.set(id, resolve);

      worker.postMessage({ file: input.file, quality: input.quality, id });
    });
  },
};
