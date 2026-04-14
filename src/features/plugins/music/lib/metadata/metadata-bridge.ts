import { TrackMetadata } from "../../model/types";
import MetadataWorker from "./metadata.worker?worker";

type WorkerTarget = "player";

export interface WorkerInput {
  target: WorkerTarget;
  file: File;
  quality: "low" | "high";
}

export interface WorkerOutput {
  target: WorkerTarget;
  metadata?: TrackMetadata;
  error?: string;
}

const worker = typeof window !== "undefined" ? new MetadataWorker() : null;
const listeners = new Map<string, (data: WorkerOutput) => void>();
if (worker) {
  worker.onmessage = (e: MessageEvent<WorkerOutput>) => {
    listeners.get(e.data.target)?.(e.data);
  };
}

export const metadataBridge = {
  send: (tasks: WorkerInput) => {
    worker?.postMessage(tasks);
  },
  subscribe: (target: WorkerTarget, callback: (data: WorkerOutput) => void) => {
    listeners.set(target, callback);
    return () => listeners.delete(target);
  },
};
