import { Entry } from "../file-system/types";

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
  readonly id: string;
  readonly name: string;
  readonly extensions: Set<string>;

  getIcon?(entry: Entry): string | null;
  getActions?(entry: Entry): PluginAction[];
  // special action for handling system intents ("Open With" option on OS context menu)
  handleSystemIntent?(entry: Entry): void;
}
