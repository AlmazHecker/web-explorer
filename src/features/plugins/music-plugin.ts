import { Entry } from "@/shared/api/file-system/types";
import { EntryPlugin, PluginAction } from "@/shared/api/plugin/types";
import { PlayerBar } from "./music/ui/music-player-bar";
import { musicIcon, playIcon } from "@/shared/ui/icons";
import { MusicMetadataEditor } from "./music/ui/music-metadata-editor";

export class MusicPlugin implements EntryPlugin {
  public id = "music-plugin";
  public name = "Music Handler";
  public extensions = new Set(["mp3", "wav", "m4a", "flac", "ogg"]);
  private playerBar!: PlayerBar;
  private metadataEditor!: MusicMetadataEditor;

  public initialize(rootSlot: HTMLElement) {
    // viewer mount point
    const viewerContainer = document.createElement("div");
    viewerContainer.id = "music-player-bar-container";
    rootSlot.appendChild(viewerContainer);
    this.playerBar = new PlayerBar(viewerContainer);

    const editorContainer = document.createElement("div");
    editorContainer.id = "music-metadata-editor-container";
    rootSlot.appendChild(editorContainer);
    this.metadataEditor = new MusicMetadataEditor(editorContainer);
  }

  public getIcon(): string {
    return musicIcon({ className: "size-full" });
  }

  public getActions(entry: Entry): PluginAction[] {
    return [
      {
        label: "Play Music",
        icon: playIcon(),
        handler: async (entry, contextPromise) => {
          if (entry.kind !== "directory") {
            this.playerBar.play(entry, contextPromise);
          }
        },
        requiresContext: true,
      },
      {
        label: "Edit Music Metadata",
        icon: playIcon(),
        handler: async (entry) => {
          if (entry.kind !== "directory") {
            this.playerBar.close();
            this.metadataEditor.open(entry);
          }
        },
      },
    ];
  }

  public handleSystemIntent(entry: Entry) {
    if (entry.kind === "file") {
      return this.playerBar.play(entry);
    }
  }
}
