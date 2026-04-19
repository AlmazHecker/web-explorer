import { Entry } from "@/shared/api/file-system/types";
import { EntryPlugin, PluginAction } from "@/shared/api/plugin/types";
import { playIcon, plusIcon, videoIcon } from "@/shared/ui/icons";
import { VideoViewer } from "./video/ui/video-viewer";
import { VideoPlayerBar } from "./video/ui/video-player-bar";

export class VideoPlugin implements EntryPlugin {
  public id = "video-plugin";
  public name = "Video Handler";
  public extensions = new Set(["mp4", "webm"]);
  private videoViewer!: VideoViewer;
  private videoPlayerBar!: VideoPlayerBar;

  public initialize(rootSlot: HTMLElement) {
    // viewer mount point
    const viewerContainer = document.createElement("div");
    viewerContainer.id = "video-viewer-container";
    rootSlot.appendChild(viewerContainer);
    this.videoViewer = new VideoViewer(viewerContainer);

    // player bar mount point
    const playerBarContainer = document.createElement("div");
    playerBarContainer.id = "video-player-bar-container";
    rootSlot.appendChild(playerBarContainer);
    this.videoPlayerBar = new VideoPlayerBar(
      playerBarContainer,
      this.videoViewer,
    );
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
            this.videoViewer.open(entry, context);
          }
        },
        requiresContext: true,
      },
      {
        label: "Add to Queue",
        icon: plusIcon(),
        handler: (entry) => {
          if (entry.kind === "file") {
            this.videoPlayerBar.addToQueue(entry);
          }
        },
        requiresContext: false,
      },
    ];
  }

  public handleSystemIntent(entry: Entry) {
    if (entry.kind === "file") {
      this.videoViewer.open(entry);
    }
  }
}
