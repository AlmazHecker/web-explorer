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

  public onOpen(entry: Entry, entries: Entry[]) {
    const plugin = this.getPluginForEntry(entry);

    const availableEntries = entries.filter((e) => {
      if (e.kind !== "file") return false;
      return plugin?.supportedExtensions?.some((ext) => e.name.endsWith(ext));
    });
    plugin?.onOpen(entry, availableEntries);
  }
}

export const pluginManager = new PluginManager();
