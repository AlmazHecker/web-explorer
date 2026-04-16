export type Entry = FileSystemDirectoryHandle | FileSystemFileHandle;

export type PluginContext = {
  entries: Entry[];
  relativeIndex: number;
};

type HandlerWithContext = (
  entry: Entry,
  context: Promise<PluginContext>,
) => void;

type HandlerWithoutContext = (entry: Entry) => void;

export type PluginAction =
  | {
      label: string;
      icon?: string;
      requiresContext: true;
      handler: HandlerWithContext;
    }
  | {
      label: string;
      icon?: string;
      requiresContext?: false;
      handler: HandlerWithoutContext;
    };

export interface EntryPlugin {
  id: string;
  name: string;
  extensions: Set<string>;

  initialize?(rootSlot: HTMLElement): void;
  getIcon?(entry: Entry): string | null;
  getActions?(entry: Entry): PluginAction[];
}
