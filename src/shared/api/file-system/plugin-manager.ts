import { PluginContext, Entry, EntryPlugin, PluginAction } from "./types";

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

    const name = entry.name;
    const dotIndex = name.lastIndexOf(".");
    if (dotIndex <= 0) return null;
    const ext = name.slice(dotIndex + 1).toLowerCase();

    return this.plugins.find((p) => p.extensions.has(ext)) || null;
  }

  public getIconForEntry(entry: Entry): string | null {
    const plugin = this.getPluginForEntry(entry);
    return plugin?.getIcon?.(entry) || null;
  }

  public getActionsForEntry(entry: Entry): PluginAction[] {
    const plugin = this.getPluginForEntry(entry);
    return plugin?.getActions?.(entry) || [];
  }

  public executeAction(action: PluginAction, entries: Entry[], at: number) {
    const targetEntry = entries[at];
    // plugin constant should be either passed as param or obtained in some other way
    // Currently we are recomputing plugin for each action
    const plugin = this.getPluginForEntry(targetEntry);
    if (!plugin) return;

    if (action.requiresContext) {
      const contextPromise = this.getContextEntries(
        entries,
        at,
        plugin.extensions,
      );
      return action.handler(targetEntry, contextPromise);
    }
    return action.handler(targetEntry);
  }

  public handleDefaultAction(entries: Entry[], at: number) {
    const actions = this.getActionsForEntry(entries[at]);
    if (actions.length > 0) {
      this.executeAction(actions[0], entries, at);
    }
  }

  private getContextEntries(
    entries: Entry[],
    at: number,
    extensions: Set<string>,
  ): Promise<PluginContext> {
    return new Promise((resolve) => {
      let relativeIndex = -1;
      let counter = 0;

      const filteredEntries = entries.filter((e, index) => {
        if (e.kind !== "file") return false;

        const name = e.name;
        const dotIndex = name.lastIndexOf(".");
        if (dotIndex <= 0) return false;

        const ext = name.slice(dotIndex + 1).toLowerCase();
        const isSupported = extensions.has(ext);

        if (isSupported) {
          if (index === at) relativeIndex = counter;
          counter++;
          return true;
        }
        return false;
      });

      resolve({ entries: filteredEntries, relativeIndex });
    });
  }
}

export const pluginManager = new PluginManager();
