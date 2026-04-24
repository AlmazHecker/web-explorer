import { Entry } from "@/shared/api/file-system/types";
import { PluginContext } from "@/shared/api/plugin/types";
import { chevronLeftIcon, chevronRightIcon } from "@/shared/ui/icons";

export class ImageViewer {
  private dialog: HTMLDialogElement;
  private image: HTMLImageElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;

  private currentEntries: Entry[] = [];
  private currentIndex: number = -1;

  constructor(
    private container: HTMLElement,
    private onClosed: () => void,
  ) {
    this.container.innerHTML = `
    <dialog id="plugin-image-modal" class="modal">
      <div class="modal-box w-11/12 max-w-7xl h-[90vh] p-0 overflow-hidden bg-black/95 flex flex-col items-center justify-center border border-white/10 relative group">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white bg-black/40 hover:bg-black/60 z-30 transition-colors">✕</button>
        </form>

        <div class="absolute inset-y-0 left-0 w-24 flex items-center justify-start pl-4 z-20 transition-all duration-200 md:opacity-0 md:group-hover:opacity-100">
          <button id="image-prev" class="btn btn-circle btn-ghost text-white bg-black/40 hover:bg-black/60 disabled:hidden active:scale-95 transition-transform">
            ${chevronLeftIcon({ width: 32, height: 32, className: "stroke-[2.5]" })}
          </button>
        </div>
        
        <div class="absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4 z-20 transition-all duration-200 md:opacity-0 md:group-hover:opacity-100">
          <button id="image-next" class="btn btn-circle btn-ghost text-white bg-black/40 hover:bg-black/60 disabled:hidden active:scale-95 transition-transform">
            ${chevronRightIcon({ width: 32, height: 32, className: "stroke-[2.5]" })}
          </button>
        </div>
        
        <img 
          id="plugin-image-player" 
          class="w-full h-full object-contain block pointer-events-none select-none p-2"
          alt="Preview"
        />
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    `;

    this.dialog = this.container.querySelector("#plugin-image-modal")!;
    this.image = this.container.querySelector("#plugin-image-player")!;
    this.prevBtn = this.container.querySelector("#image-prev")!;
    this.nextBtn = this.container.querySelector("#image-next")!;

    this.prevBtn.onclick = (e) => {
      e.stopPropagation();
      this.navigate(-1);
    };
    this.nextBtn.onclick = (e) => {
      e.stopPropagation();
      this.navigate(1);
    };
    this.dialog.addEventListener(
      "close",
      () => {
        this.dialog.addEventListener("transitionend", this.onClosed, {
          once: true,
        });
      },
      { once: true },
    );
  }

  public async open(
    target: File | FileSystemFileHandle,
    contextPromise?: Promise<PluginContext>,
  ) {
    if (!this.dialog.open) this.dialog.showModal();

    const file =
      target instanceof File ? target : await (target as any).getFile();
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
      const file = await (entry as any).getFile();
      this.updateUI(file);
    }
    this.updateNavButtons();
  }

  private updateUI(file: File) {
    if (this.image.src) URL.revokeObjectURL(this.image.src);
    this.image.src = URL.createObjectURL(file);
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

  private onClose() {
    URL.revokeObjectURL(this.image.src);
    this.currentEntries = [];
    this.currentIndex = -1;
    this.onClosed();
  }
}
