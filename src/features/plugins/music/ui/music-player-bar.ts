import { TrackMetadata } from "@/features/plugins/music/model/types";
import { metadataBridge } from "@/features/plugins/music/lib/metadata/metadata-bridge";
import { formatTime } from "@/shared/lib/utils";
import {
  playIcon,
  pauseIcon,
  skipBackIcon,
  skipForwardIcon,
  volume2Icon,
  volumeXIcon,
  musicIcon,
  xIcon,
} from "@/shared/ui/icons";
import { Entry } from "@/shared/api/file-system/types";
import { PluginContext } from "@/shared/api/plugin/types";

export class PlayerBar {
  private container: HTMLElement;
  private audio: HTMLAudioElement;
  private metadata: TrackMetadata | null = null;

  private currentEntries: Entry[] = [];
  private currentIndex: number = -1;

  private wrapper: HTMLElement;
  private progress: HTMLInputElement;
  private timeLabel: HTMLElement;
  private title: HTMLElement;
  private playPauseBtn: HTMLElement;
  private volumeSlider: HTMLInputElement;
  private muteBtn: HTMLElement;
  private artwork: HTMLElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private closeBtn: HTMLButtonElement;

  private isDragging = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.audio = new Audio();
    this.audio.loop = false;

    this.container.innerHTML = `
      <div id="pb-wrapper" class="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center transition-all duration-500 translate-y-full pointer-events-none">
        <div class="relative w-full max-w-lg border-t border-base-content/10 bg-base-100/80 backdrop-blur-xl shadow-2xl mb-4 border-x border-b mx-4">
          
          <button id="pb-close" class="btn btn-ghost btn-circle btn-xs absolute -top-2 -right-2 bg-base-100 border border-base-content/10 shadow-sm z-60">
            ${xIcon({ className: "size-3" })}
          </button>

          <input type="range" min="0" step="0.1" value="0" class="range-sm h-2 range w-full range-primary" id="pb-progress" />
          <div class="p-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0 flex-1 text-left group p-1" id="pb-track-info">
              <div id="pb-artwork" class="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden bg-primary/10 text-primary shrink-0"></div>
              <div class="flex flex-col min-w-0 leading-tight justify-center flex-1">
                <h3 id="pb-title" class="font-bold text-xs truncate"></h3>
                <span id="pb-time" class="text-[10px] tabular-nums opacity-60 leading-tight">0:00 / 0:00</span>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button class="btn btn-ghost btn-circle btn-sm disabled:opacity-30" id="pb-prev">${skipBackIcon()}</button>
              <button class="btn btn-primary btn-circle btn-sm" id="pb-toggle">${playIcon()}</button>
              <button class="btn btn-ghost btn-circle btn-sm disabled:opacity-30" id="pb-next">${skipForwardIcon()}</button>
            </div>
            <div class="hidden sm:flex items-center justify-end gap-2 w-28 shrink-0">
              <button class="btn btn-ghost btn-circle btn-sm" id="pb-mute">${volume2Icon()}</button>
              <input type="range" min="0" max="1" step="0.01" value="1" class="range range-xs range-primary w-16" id="pb-volume" />
            </div>
          </div>
        </div>
      </div>
    `;

    this.wrapper = this.container.querySelector("#pb-wrapper")!;
    this.progress = this.container.querySelector("#pb-progress")!;
    this.timeLabel = this.container.querySelector("#pb-time")!;
    this.title = this.container.querySelector("#pb-title")!;
    this.playPauseBtn = this.container.querySelector("#pb-toggle")!;
    this.volumeSlider = this.container.querySelector("#pb-volume")!;
    this.muteBtn = this.container.querySelector("#pb-mute")!;
    this.artwork = this.container.querySelector("#pb-artwork")!;
    this.prevBtn = this.container.querySelector("#pb-prev")!;
    this.nextBtn = this.container.querySelector("#pb-next")!;
    this.closeBtn = this.container.querySelector("#pb-close")!;

    this.initAudioListeners();
    this.bindEvents();
  }

  private initAudioListeners() {
    this.audio.ontimeupdate = () => this.updateProgress();
    this.audio.onplay = () => this.updatePlaybackState();
    this.audio.onpause = () => this.updatePlaybackState();
    this.audio.onvolumechange = () => this.updateVolumeUI();
    this.audio.onended = () => this.next();
    this.audio.onloadedmetadata = () => {
      this.progress.max = (this.audio.duration || 0).toString();
      this.updateProgress();
    };

    metadataBridge.subscribe("player", (e) => {
      if (e.error) return;
      if (e.metadata) this.metadata = e.metadata;

      if (this.metadata) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.metadata.title,
          artist: this.metadata.artist,
          album: this.metadata.album,
          artwork: this.metadata.artwork
            ? [{ src: this.metadata.artwork.src }]
            : [],
        });
        this.setupMediaSessionAPI();
      }
      this.syncFullUI();
    });
  }

  private setupMediaSessionAPI() {
    navigator.mediaSession.setActionHandler("play", () => this.toggle());
    navigator.mediaSession.setActionHandler("pause", () => this.toggle());
    navigator.mediaSession.setActionHandler("nexttrack", () => this.next());
    navigator.mediaSession.setActionHandler("previoustrack", () => this.prev());
    navigator.mediaSession.setActionHandler("stop", () => this.close());
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime != null) this.seek(details.seekTime);
    });
  }

  private seek(time: number) {
    this.audio.currentTime = time;
  }

  private bindEvents() {
    this.playPauseBtn.addEventListener("click", () => this.toggle());
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());
    this.closeBtn.addEventListener("click", () => this.close());

    this.progress.addEventListener("input", (e) => {
      this.isDragging = true;
      this.seek(parseFloat((e.target as HTMLInputElement).value));
    });
    this.progress.addEventListener("change", () => {
      this.isDragging = false;
    });

    this.volumeSlider.addEventListener("input", (e) => {
      this.audio.volume = parseFloat((e.target as HTMLInputElement).value);
    });

    this.muteBtn.addEventListener("click", () => {
      this.audio.volume = this.audio.volume === 0 ? 1 : 0;
    });
  }

  private async loadEntry(index: number) {
    const entry = this.currentEntries[index];
    if (entry?.kind === "file") {
      this.currentIndex = index;
      const file = await (entry as any).getFile();
      await this.play(file);
    }
  }

  public async play(
    target: File | FileSystemFileHandle,
    contextPromise?: Promise<PluginContext>,
  ) {
    this.cleanupResources();

    const file = target instanceof File ? target : await target.getFile();

    this.audio.src = URL.createObjectURL(file);
    metadataBridge.send({ target: "player", file, quality: "high" });
    await this.audio.play();

    if (contextPromise) {
      const { entries, relativeIndex } = await contextPromise;
      this.currentEntries = entries;
      this.currentIndex = relativeIndex;
      this.updateNavButtons();
    }
  }

  public close() {
    this.audio.pause();
    this.cleanupResources();
    this.metadata = null;
    this.currentEntries = [];
    this.currentIndex = -1;

    navigator.mediaSession.metadata = null;

    this.syncFullUI();
  }

  private cleanupResources() {
    if (this.audio.src) {
      URL.revokeObjectURL(this.audio.src);
      this.audio.src = "";
    }
    if (this.metadata?.artwork.src) {
      URL.revokeObjectURL(this.metadata.artwork.src);
    }
  }

  private toggle() {
    this.audio.paused ? this.audio.play() : this.audio.pause();
  }

  private next() {
    if (this.currentIndex < this.currentEntries.length - 1) {
      this.loadEntry(this.currentIndex + 1);
    }
  }

  private prev() {
    if (this.audio.currentTime > 3) {
      this.seek(0);
      return;
    }

    if (this.currentIndex > 0) {
      this.loadEntry(this.currentIndex - 1);
    }
  }

  private updateProgress() {
    const cur = this.audio.currentTime;
    const dur = this.audio.duration || 0;
    this.timeLabel.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;

    if (!this.isDragging) {
      this.progress.value = cur.toString();
    }
  }

  private updatePlaybackState() {
    this.playPauseBtn.innerHTML = this.audio.paused ? playIcon() : pauseIcon();
  }

  private updateVolumeUI() {
    this.muteBtn.innerHTML =
      this.audio.volume === 0 ? volumeXIcon() : volume2Icon();
    if (document.activeElement !== this.volumeSlider) {
      this.volumeSlider.value = this.audio.volume.toString();
    }
  }

  private updateNavButtons() {
    this.prevBtn.disabled = this.currentIndex <= 0;
    this.nextBtn.disabled =
      this.currentIndex >= this.currentEntries.length - 1 ||
      this.currentIndex === -1;
  }

  private syncFullUI() {
    const hasMetadata = !!this.metadata;
    this.wrapper.classList.toggle("translate-y-full", !hasMetadata);
    this.wrapper.classList.toggle("pointer-events-none", !hasMetadata);

    if (!hasMetadata) return;

    this.title.textContent = this.metadata?.title || "Unknown Track";
    this.updateNavButtons();

    if (this.metadata?.artwork.src) {
      this.artwork.innerHTML = `<img src="${this.metadata.artwork.src}" class="w-full h-full object-cover rounded-lg" />`;
    } else {
      this.artwork.innerHTML = musicIcon();
    }

    this.updateProgress();
    this.updatePlaybackState();
    this.updateVolumeUI();
  }
}
