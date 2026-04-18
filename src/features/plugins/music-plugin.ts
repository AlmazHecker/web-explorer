import { Entry } from "@/shared/api/file-system/types";
import { EntryPlugin, PluginAction } from "@/shared/api/plugin/types";
import { PlayerBar } from "./music/ui/music-player-bar";
import { musicIcon, playIcon } from "@/shared/ui/icons";

export class MusicPlugin implements EntryPlugin {
  public id = "music-plugin";
  public name = "Music Handler";
  public extensions = new Set(["mp3", "wav", "m4a", "flac", "ogg"]);
  private playerBar!: PlayerBar;

  public initialize(rootSlot: HTMLElement) {
    this.playerBar = new PlayerBar(rootSlot);
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
    ];
  }

  public handleSystemIntent(file: File) {
    return this.playerBar.play(file);
  }
}
