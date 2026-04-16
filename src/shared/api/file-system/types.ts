export type Entry = FileSystemDirectoryHandle | FileSystemFileHandle;

export interface PluginAction {
  label: string;
  icon?: string;
  handler: (entry: Entry, entries: Entry[]) => void;
}

export interface EntryPlugin {
  id: string;
  name: string;
  supportedExtensions?: string[];

  initialize?(rootSlot: HTMLElement): void;
  getIcon?(entry: Entry): string | null;
  getActions?(entry: Entry): PluginAction[];
  getSlotView?(slotName: string): { new (container: HTMLElement): any } | null;
  onOpen(entry: Entry, entries: Entry[]): void;
}
