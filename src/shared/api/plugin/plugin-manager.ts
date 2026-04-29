import { Entry } from "../file-system/types";
import { PluginContext, EntryPlugin, PluginAction } from "./types";

class PluginManager {
  private plugins: EntryPlugin[] = [];
  private rootSlot!: HTMLElement;
  private extensionToPlugin: Map<string, EntryPlugin> = new Map();

  public setRootSlot(rootSlot: HTMLElement) {
    this.rootSlot = rootSlot;
  }

  public register(Plugin: { new (rootSlot: HTMLElement): EntryPlugin }) {
    const plugin = new Plugin(this.rootSlot);
    if (this.plugins.some((p) => p.id === plugin.id)) return;
    this.plugins.push(plugin);

    for (const ext of plugin.extensions) {
      this.extensionToPlugin.set(ext.toLowerCase(), plugin);
    }
  }

  public getPluginForEntry(entry: Entry): EntryPlugin | null {
    if (entry.kind === "directory") return null;

    const name = entry.name;
    const dotIndex = name.lastIndexOf(".");

    if (dotIndex <= 0) return null;
    const ext = name.slice(dotIndex + 1).toLowerCase();
    return this.extensionToPlugin.get(ext) || null;
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

    if (action.requiresContext) {
      const plugin = this.getPluginForEntry(targetEntry);
      if (!plugin) return;
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
