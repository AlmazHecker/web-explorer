import { Entry, EntryPlugin, PluginAction } from "./types";

class PluginManager {
  private plugins: EntryPlugin[] = [];
  private rootSlot!: HTMLElement;

  public setRootSlot(rootSlot: HTMLElement) {
    this.rootSlot = rootSlot;
  }

  public register(Plugin: { new (): EntryPlugin }) {
    const plugin = new Plugin();
    if (this.plugins.some((p) => p.id === plugin.id)) return;
    this.plugins.push(plugin);
    plugin.initialize?.(this.rootSlot);
  }

  public getPluginForEntry(entry: Entry): EntryPlugin | null {
    if (entry.kind === "directory") return null;

    const name = entry.name.toLowerCase();
    const extension = name.split(".").pop() || "";

    return (
      this.plugins.find((p) => p.supportedExtensions?.includes(extension)) ||
      null
    );
  }

  public getIconForEntry(entry: Entry): string | null {
    const plugin = this.getPluginForEntry(entry);
    return plugin?.getIcon?.(entry) || null;
  }

  public getActionsForEntry(entry: Entry): PluginAction[] {
    const plugin = this.getPluginForEntry(entry);
    return plugin?.getActions?.(entry) || [];
  }

  public onOpen(entry: Entry) {
    const plugin = this.getPluginForEntry(entry);
    plugin?.onOpen?.(entry);
  }
}

export const pluginManager = new PluginManager();
