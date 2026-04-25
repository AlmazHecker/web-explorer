import { Entry } from "@/shared/api/file-system/types";
import { PluginContext } from "@/shared/api/plugin/types";
import { chevronLeftIcon, chevronRightIcon } from "@/shared/ui/icons";

export class VideoViewer {
  private dialog: HTMLDialogElement;
  private video: HTMLVideoElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;

  private currentEntries: Entry[] = [];
  private currentIndex: number = -1;

  constructor(
    private container: HTMLElement,
    private readonly onClosed: () => void,
  ) {
    this.container.innerHTML = `
    <dialog id="plugin-video-modal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-black relative group">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white bg-black/20 hover:bg-black/40 z-3">✕</button>
        </form>
        
        <div class="absolute inset-y-0 left-0 w-24 flex items-center justify-start pl-4 z-2">
          <button id="video-prev" class="btn btn-circle btn-ghost text-white bg-black/40 hover:bg-black/60 disabled:hidden active:scale-95 ">
            ${chevronLeftIcon({ width: 32, height: 32, className: "stroke-[2.5]" })}
          </button>
        </div>
        
        <div class="absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4 z-2">
          <button id="video-next" class="btn btn-circle btn-ghost text-white bg-black/40 hover:bg-black/60 disabled:hidden active:scale-95 ">
            ${chevronRightIcon({ width: 32, height: 32, className: "stroke-[2.5]" })}
          </button>
        </div>

        <video id="plugin-video-player" loop controls autoplay class="w-full aspect-video"></video>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button id="modal-close-btn">close</button>
      </form>
    </dialog> 
    `;

    this.dialog = this.container.querySelector("#plugin-video-modal")!;
    this.video = this.container.querySelector("#plugin-video-player")!;
    this.prevBtn = this.container.querySelector("#video-prev")!;
    this.nextBtn = this.container.querySelector("#video-next")!;

    this.prevBtn.onclick = () => this.navigate(-1);
    this.nextBtn.onclick = () => this.navigate(1);
    this.dialog.addEventListener("close", () => this.onClose(), {
      once: true,
    });
  }

  public async open(
    entry: FileSystemFileHandle,
    contextPromise?: Promise<PluginContext> | PluginContext,
  ): Promise<void> {
    if (!this.dialog.open) this.dialog.showModal();

    const file = await entry.getFile();
    this.updateUI(file);

    this.currentEntries = [];
    this.currentIndex = -1;
    this.updateNavButtons();

    if (contextPromise) {
      const { entries, relativeIndex } = await contextPromise;

      if (this.dialog.open) {
        this.currentEntries = entries;
        this.currentIndex = relativeIndex;
        this.updateNavButtons();
      }
    }
  }

  private async loadEntry(index: number) {
    const entry = this.currentEntries[index];
    if (entry?.kind === "file") {
      const file = await entry.getFile();
      this.updateUI(file);
    }
    this.updateNavButtons();
  }

  private updateUI(file: File) {
    if (this.video.src) URL.revokeObjectURL(this.video.src);

    this.video.dataset.name = file.name;
    this.video.src = URL.createObjectURL(file);
  }

  private navigate(direction: number) {
    const nextIndex = this.currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < this.currentEntries.length) {
      this.currentIndex = nextIndex;
      this.loadEntry(this.currentIndex);
    }
  }

  private updateNavButtons() {
    const hidden = this.currentEntries.length <= 1;
    this.prevBtn.classList.toggle("hidden", hidden);
    this.nextBtn.classList.toggle("hidden", hidden);

    this.prevBtn.disabled = this.currentIndex <= 0;
    this.nextBtn.disabled = this.currentIndex >= this.currentEntries.length - 1;
  }

  private cleanup() {
    if (this.video.src) {
      URL.revokeObjectURL(this.video.src);
      this.video.src = "";
    }
  }

  private onClose() {
    this.cleanup();
    this.currentEntries = [];
    this.currentIndex = -1;
    this.onClosed();
  }

  public getVideoName() {
    return this.video.dataset.name;
  }
}
