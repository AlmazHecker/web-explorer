import { Entry } from "@/shared/api/file-system/types";
import { EntryPlugin, PluginAction } from "@/shared/api/plugin/types";
import { PlayerBar } from "./music/ui/music-player-bar";
import { musicIcon, playIcon } from "@/shared/ui/icons";
import { MusicMetadataEditor } from "./music/ui/music-metadata-editor";

export class MusicPlugin implements EntryPlugin {
  public readonly id = "music-plugin";
  public readonly name = "Music Handler";
  public readonly extensions = new Set(["mp3", "wav", "m4a", "flac", "ogg"]);

  private playerBar: PlayerBar | null = null;
  private metadataEditor: MusicMetadataEditor | null = null;

  constructor(private readonly rootSlot: HTMLElement) {}

  private get player() {
    if (!this.playerBar) {
      const viewerContainer = document.createElement("div");
      viewerContainer.id = "music-player-bar-container";
      this.rootSlot.appendChild(viewerContainer);
      this.playerBar = new PlayerBar(viewerContainer, () => {
        viewerContainer.remove();
        this.playerBar = null;
      });
    }

    return this.playerBar;
  }

  private get editor() {
    if (!this.metadataEditor) {
      const editorContainer = document.createElement("div");
      editorContainer.id = "music-metadata-editor-container";
      this.rootSlot.appendChild(editorContainer);
      this.metadataEditor = new MusicMetadataEditor(editorContainer, () => {
        editorContainer.remove();
        this.metadataEditor = null;
      });
    }

    return this.metadataEditor;
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
            this.player.play(entry, contextPromise);
          }
        },
        requiresContext: true,
      },
      {
        label: "Edit Music Metadata",
        icon: playIcon(),
        handler: async (entry) => {
          if (entry.kind !== "directory") {
            if (this.playerBar) this.playerBar.close();
            this.editor.open(entry);
          }
        },
      },
    ];
  }

  public handleSystemIntent(entry: Entry) {
    if (entry.kind === "file") {
      return this.player.play(entry);
    }
  }
}
