import { VideoViewer } from "./video-viewer";

export class VideoPlayerBar {
  private queue: FileSystemFileHandle[] = [];
  private currentIndex: number = -1;
  private videoViewer: VideoViewer;
  private container: HTMLDivElement;

  constructor(
    container: HTMLDivElement,
    videoViewer: VideoViewer,
    private readonly onClosed: () => void,
  ) {
    this.container = container;
    this.videoViewer = videoViewer;
    this.container.className =
      "btm-nav border-t border-base-300 bg-base-200/80 backdrop-blur px-4 hidden h-12";

    this.setupListeners();
  }

  private setupListeners() {
    this.container.addEventListener(
      "click",
      this.handleContainerClick.bind(this),
    );
  }

  private handleContainerClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const entryRow = target.closest("[data-id]");
    if (!entryRow) return;

    const index = Number(entryRow.getAttribute("data-id"));

    if (target.closest(".btn-remove")) {
      this.removeFromQueue(index);
    } else {
      this.playAt(index);
    }
  }

  private destroy() {
    this.container.removeEventListener(
      "click",
      this.handleContainerClick.bind(this),
    );
    this.onClosed();
  }

  public async playAt(index: number) {
    if (index < 0 || index >= this.queue.length) return;

    this.currentIndex = index;
    const entry = this.queue[index];

    const context = { entries: this.queue, relativeIndex: index };
    this.videoViewer.open(entry, context);
    this.render();
  }

  public next() {
    if (this.currentIndex < this.queue.length - 1) {
      this.playAt(this.currentIndex + 1);
    }
  }

  public prev() {
    if (this.currentIndex > 0) {
      this.playAt(this.currentIndex - 1);
    }
  }

  public addToQueue(entry: FileSystemFileHandle) {
    const exists = this.queue.some((e) => e.name === entry.name);
    if (exists) return;

    this.queue.push(entry);
    this.render();
  }

  public removeFromQueue(index: number) {
    this.queue.splice(index, 1);

    if (this.queue.length === 0) {
      this.destroy();
      return;
    }

    if (index === this.currentIndex) {
      this.currentIndex = -1;
      this.playAt(Math.min(index, this.queue.length - 1));
    } else if (index < this.currentIndex) {
      this.currentIndex--;
    }

    this.render();
  }
  private render() {
    if (this.queue.length === 0) {
      this.container.classList.add("hidden");
      return;
    }

    this.container.classList.remove("hidden");
    const currentName = this.videoViewer.getVideoName();

    this.container.innerHTML = `
      <div class="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div class="flex flex-col min-w-0 pr-4">
          <span class="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Now Playing</span>
          <span class="text-xs font-semibold truncate w-48 sm:w-80">${currentName || "—"}</span>
        </div>

          <div class="dropdown dropdown-top dropdown-end">
            <button tabindex="0" class="btn btn-ghost btn-xs gap-2 normal-case font-medium">
              Queue <div class="badge badge-primary badge-xs">${this.queue.length}</div>
            </button>
            <div tabindex="0" class="dropdown-content z-60 card card-compact bg-base-100 border border-base-content/10 shadow-2xl mb-2">
              <div class="card-body p-0">
                <ul class="menu menu-sm max-h-72 overflow-y-auto p-1">
                  ${this.queue
                    .map((e, i) => {
                      return `
                      <li data-id="${i}">
                        <div class="flex justify-between items-center py-2 px-3">
                          <span class="truncate flex-1 cursor-pointer">${i + 1}. ${e.name}</span>
                          <button class="btn btn-ghost btn-xs btn-circle btn-remove hover:bg-error hover:text-error-content ml-2">✕</button>
                        </div>
                      </li>`;
                    })
                    .join("")}
                </ul>
              </div>
            </div>
          </div>
      </div>
    `;
  }
}
