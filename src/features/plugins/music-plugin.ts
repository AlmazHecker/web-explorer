import {
  Entry,
  EntryPlugin,
  PluginAction,
} from "@/shared/api/file-system/types";
import { PlayerBar } from "./music/ui/music-player-bar";
import { musicIcon, playIcon } from "@/shared/ui/icons";

export class MusicPlugin implements EntryPlugin {
  public id = "music-plugin";
  public name = "Music Handler";
  public supportedExtensions = ["mp3", "wav", "m4a", "flac", "ogg"];
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
        handler: async (entry) => {
          if (entry.kind === "file") {
            const file = await entry.getFile();
            this.playerBar.play(file);
          }
        },
      },
    ];
  }

  public async onOpen(entry: Entry) {
    if (entry.kind === "file") {
      const file = await entry.getFile();
      this.playerBar.play(file);
    }
  }
}
