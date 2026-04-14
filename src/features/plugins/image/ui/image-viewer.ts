export class ImageViewer {
  private container: HTMLElement;
  private dialog: HTMLDialogElement;
  private image: HTMLImageElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.innerHTML = `
<dialog id="plugin-image-modal" class="modal">
  <div class="modal-box w-auto max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/90 flex flex-col items-center justify-center border border-white/10">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white bg-black/20 hover:bg-black/40 z-10">✕</button>
    </form>
    
    <img 
      id="plugin-image-player" 
      class="max-w-full max-h-[85vh] w-auto h-auto object-contain block mx-auto"
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

    this.dialog.addEventListener("close", this.onClose.bind(this));
  }

  public async open(file: File) {
    if (!this.dialog.open) {
      this.dialog.showModal();
    }

    this.image.src = URL.createObjectURL(file);
  }

  private onClose() {
    URL.revokeObjectURL(this.image.src);
    // this.image.src = "";
  }
}
