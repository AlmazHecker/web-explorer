import { Entry } from "@/shared/api/file-system/types";
import { EntryPlugin, PluginAction } from "@/shared/api/plugin/types";
import { playIcon, plusIcon, videoIcon } from "@/shared/ui/icons";
import { VideoViewer } from "./video/ui/video-viewer";
import { VideoPlayerBar } from "./video/ui/video-player-bar";

export class VideoPlugin implements EntryPlugin {
  public id = "video-plugin";
  public name = "Video Handler";
  public extensions = new Set(["mp4", "webm"]);
  private videoViewer: VideoViewer | null = null;
  private videoPlayerBar: VideoPlayerBar | null = null;
  constructor(private readonly rootSlot: HTMLElement) {}
  private get viewer(): VideoViewer {
    if (!this.videoViewer) {
      const viewerContainer = document.createElement("div");
      viewerContainer.id = "video-viewer-container";
      this.rootSlot.appendChild(viewerContainer);
      this.videoViewer = new VideoViewer(viewerContainer, () => {
        viewerContainer.remove();
        this.videoViewer = null;
      });
    }
    return this.videoViewer;
  }

  private get player(): VideoPlayerBar {
    if (!this.videoPlayerBar) {
      const playerBarContainer = document.createElement("div");
      playerBarContainer.id = "video-player-bar-container";
      this.rootSlot.appendChild(playerBarContainer);
      this.videoPlayerBar = new VideoPlayerBar(
        playerBarContainer,
        this.viewer,
        () => {
          playerBarContainer.remove();
          this.videoPlayerBar = null;
        },
      );
    }
    return this.videoPlayerBar;
  }

  public getIcon(): string {
    return videoIcon({ className: "size-full" });
  }

  public getActions(entry: Entry): PluginAction[] {
    return [
      {
        label: "Play Video",
        icon: playIcon(),
        handler: (entry, context) => {
          if (entry.kind !== "directory") {
            this.viewer.open(entry, context);
          }
        },
        requiresContext: true,
      },
      {
        label: "Add to Queue",
        icon: plusIcon(),
        handler: (entry) => {
          if (entry.kind === "file") {
            this.player.addToQueue(entry);
          }
        },
        requiresContext: false,
      },
    ];
  }

  public handleSystemIntent(entry: Entry) {
    if (entry.kind === "file") {
      this.viewer.open(entry);
    }
  }
}
