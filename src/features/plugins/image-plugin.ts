import {
  Entry,
  EntryPlugin,
  PluginAction,
} from "@/shared/api/file-system/types";
import { playIcon, imageIcon } from "@/shared/ui/icons";
import { ImageViewer } from "./image/ui/image-viewer";

export class ImagePlugin implements EntryPlugin {
  public id = "image-plugin";
  public name = "Image Handler";
  public supportedExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
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
        handler: async (entry: Entry) => {
          if (entry.kind === "file") {
            const file = await entry.getFile();
            this.imageViewer.open(file);
          }
        },
      },
    ];
  }

  public async onOpen(entry: Entry) {
    if (entry.kind === "file") {
      const file = await entry.getFile();
      this.imageViewer.open(file);
    }
  }
}
