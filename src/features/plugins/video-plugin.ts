import {
  Entry,
  EntryPlugin,
  PluginAction,
} from "@/shared/api/file-system/types";
import { playIcon, plusIcon, videoIcon } from "@/shared/ui/icons";
import { VideoViewer } from "./video/ui/video-viewer";
import { VideoPlayerBar } from "./video/ui/video-player-bar";

export class VideoPlugin implements EntryPlugin {
  public id = "video-plugin";
  public name = "Video Handler";
  public supportedExtensions = ["mp4", "webm"];
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
        handler: async (entry: Entry) => {
          if (entry.kind === "file") {
            const file = await entry.getFile();
            this.videoViewer.update(file);
          }
        },
      },
      {
        label: "Add to Queue",
        icon: plusIcon(),
        handler: (entry: Entry) => {
          if (entry.kind === "file") {
            this.videoPlayerBar.addToQueue(entry);
          }
        },
      },
    ];
  }

  public async onOpen(entry: Entry) {
    if (entry.kind === "file") {
      const file = await entry.getFile();
      this.videoViewer.update(file);
    }
  }
}
