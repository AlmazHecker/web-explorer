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
} from "@/shared/ui/icons";

export class PlayerBar {
  private container: HTMLElement;
  private audio: HTMLAudioElement;
  private metadata: TrackMetadata | null = null;

  private wrapper: HTMLElement;
  private progress: HTMLInputElement;
  private timeLabel: HTMLElement;
  private title: HTMLElement;
  private playPauseBtn: HTMLElement;
  private volumeSlider: HTMLInputElement;
  private muteBtn: HTMLElement;
  private artwork: HTMLElement;

  private isDragging = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.audio = new Audio();
    this.audio.loop = true;

    this.container.innerHTML = `
      <div id="pb-wrapper" class="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center transition-all duration-500 translate-y-full pointer-events-none">
        <div class="w-full max-w-lg border-t border-base-content/10 bg-base-100/80 backdrop-blur-xl shadow-2xl mb-4 border-x border-b mx-4">
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
              <button class="btn btn-ghost btn-circle btn-sm" id="pb-prev">${skipBackIcon()}</button>
              <button class="btn btn-primary btn-circle btn-sm" id="pb-toggle">${playIcon()}</button>
              <button class="btn btn-ghost btn-circle btn-sm" id="pb-next">${skipForwardIcon()}</button>
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
          artwork: this.metadata.artwork ? [this.metadata.artwork] : [],
        });
        this.setupMediaSessionAPI();
      }
      this.syncFullUI();
    });
  }

  private setupMediaSessionAPI() {
    navigator.mediaSession.setActionHandler("play", () => {
      this.toggle();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      this.toggle();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      this.next();
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      this.prev();
    });

    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      const offset = details.seekOffset ?? 10;
      this.seek(this.audio.currentTime - offset);
    });

    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      const offset = details.seekOffset ?? 10;
      this.seek(this.audio.currentTime + offset);
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime == null) return;
      this.seek(details.seekTime);
    });
  }

  private seek(time: number) {
    this.audio.currentTime = time;
  }

  private bindEvents() {
    this.playPauseBtn.addEventListener("click", () => this.toggle());

    this.progress.addEventListener("input", (e) => {
      this.isDragging = true;
      this.seek(parseFloat((e.target as HTMLInputElement).value));
    });
    this.progress.addEventListener("change", (e) => {
      this.isDragging = false;
    });

    this.volumeSlider.addEventListener("input", (e) => {
      this.audio.volume = parseFloat((e.target as HTMLInputElement).value);
    });

    this.muteBtn.addEventListener("click", () => {
      this.audio.volume = this.audio.volume === 0 ? 1 : 0;
    });

    this.container
      .querySelector("#pb-next")
      ?.addEventListener("click", () => this.next());
    this.container
      .querySelector("#pb-prev")
      ?.addEventListener("click", () => this.prev());
  }

  async play(file: File) {
    if (this.audio.src) {
      URL.revokeObjectURL(this.audio.src);
    }
    if (this.metadata?.artwork.src) {
      URL.revokeObjectURL(this.metadata.artwork.src);
    }

    metadataBridge.send({ target: "player", file, quality: "high" });

    this.audio.src = URL.createObjectURL(file);
    await this.audio.play();
  }

  toggle() {
    this.audio.paused ? this.audio.play() : this.audio.pause();
  }

  next() {
    // Logic for next track in playlist
  }

  prev() {
    // Logic for previous track in playlist
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

  private syncFullUI() {
    const hasMetadata = !!this.metadata;
    this.wrapper.classList.toggle("translate-y-full", !hasMetadata);
    this.wrapper.classList.toggle("pointer-events-none", !hasMetadata);

    if (!hasMetadata) return;

    this.title.textContent = this.metadata?.title || "Unknown Track";
    this.progress.max = (this.audio.duration || 100).toString();

    if (this.metadata?.artwork.src) {
      this.artwork.innerHTML = `<img src="${this.metadata.artwork.src}" alt="Cover" class="w-full h-full object-cover rounded-lg" />`;
    } else {
      this.artwork.innerHTML = `<div class="w-full h-full flex items-center justify-center rounded-lg bg-primary/5">${musicIcon()}</div>`;
    }

    this.updateProgress();
    this.updatePlaybackState();
    this.updateVolumeUI();
  }
}
