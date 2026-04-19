import { Entry } from "@/shared/api/file-system/types";
import { EntryPlugin, PluginAction } from "@/shared/api/plugin/types";
import { playIcon, imageIcon } from "@/shared/ui/icons";
import { ImageViewer } from "./image/ui/image-viewer";

export class ImagePlugin implements EntryPlugin {
  public id = "image-plugin";
  public name = "Image Handler";
  public extensions = new Set(["png", "jpg", "jpeg", "gif", "webp"]);
  private imageViewer!: ImageViewer;

  public initialize(rootSlot: HTMLElement) {
    const viewerContainer = document.createElement("div");
    viewerContainer.id = "image-viewer-container";
    rootSlot.appendChild(viewerContainer);
    this.imageViewer = new ImageViewer(viewerContainer);
  }

  public getIcon(): string {
    return imageIcon({ className: "size-full" });
  }

  public getActions(entry: Entry): PluginAction[] {
    return [
      {
        label: "Open Image",
        icon: playIcon(),
        handler: (entry, context) => {
          if (entry.kind !== "directory") {
            this.imageViewer.open(entry, context);
          }
        },
        requiresContext: true,
      },
    ];
  }

  public handleSystemIntent(entry: Entry) {
    if (entry.kind === "file") {
      this.imageViewer.open(entry);
    }
  }
}
