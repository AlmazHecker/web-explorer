export class VideoViewer {
  private container: HTMLElement;
  private dialog: HTMLDialogElement;
  private video: HTMLVideoElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.innerHTML = `
    <dialog id="plugin-video-modal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-black relative">
        <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white bg-black/20 hover:bg-black/40 z-10">✕</button>
    </form>
        <video id="plugin-video-player" controls autoplay class="w-full aspect-video"></video>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button id="modal-close-btn">close</button>
      </form>
    </dialog>
    `;
    this.dialog = this.container.querySelector("#plugin-video-modal")!;
    this.video = this.container.querySelector("#plugin-video-player")!;

    this.dialog.addEventListener("close", this.onClose.bind(this));
  }

  public async open(file: File) {
    if (!this.dialog.open) {
      this.dialog.showModal();
    }

    this.video.dataset.name = file.name;
    this.video.src = URL.createObjectURL(file);
  }

  public getVideoName() {
    return this.video.dataset.name;
  }

  private onClose() {
    URL.revokeObjectURL(this.video.src);
    this.video.src = "";
  }
}
