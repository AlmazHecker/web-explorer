export class VideoViewer {
  private container: HTMLElement;
  private dialog: HTMLDialogElement;
  private video: HTMLVideoElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.innerHTML = `
    <dialog id="plugin-video-modal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-black relative">
        <video id="plugin-video-player" controls autoplay class="w-full aspect-video"></video>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button id="modal-close-btn">close</button>
      </form>
    </dialog>
    `;
    this.dialog = this.container.querySelector("#plugin-video-modal")!;
    this.video = this.container.querySelector("#plugin-video-player")!;
  }

  public async update(file: File) {
    if (!this.dialog.open) {
      this.dialog.showModal();
    } else if (this.dialog.open) {
      this.dialog.close();
    }
    if (file.name === this.video.dataset.name) {
      return;
    }

    if (this.video.src) {
      URL.revokeObjectURL(this.video.src);
    }

    this.video.src = URL.createObjectURL(file);
    this.video.dataset.name = file.name;
  }

  public getVideoName() {
    return this.video.dataset.name;
  }
}
