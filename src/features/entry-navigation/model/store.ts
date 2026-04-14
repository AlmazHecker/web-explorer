import { createStore } from "zustand/vanilla";
import { Entry } from "@/shared/api/file-system/types";

interface EntryStore {
  entries: Entry[];
  activeDirectory: FileSystemDirectoryHandle | null;
  history: FileSystemDirectoryHandle[];
  isLoading: boolean;
  searchQuery: string;
  viewMode: "list" | "grid";
  setEntries: (entries: Entry[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: "list" | "grid") => void;
  cd: (directory: FileSystemDirectoryHandle) => void;
  goBack: () => void;
  resetHistory: (root: FileSystemDirectoryHandle) => void;
}

export const entryStore = createStore<EntryStore>((set, get) => ({
  entries: [],
  activeDirectory: null,
  history: [],
  isLoading: false,
  searchQuery: "",
  viewMode: "list",

  setEntries: (entries) => set({ entries }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setViewMode: (viewMode) => set({ viewMode }),

  resetHistory: (root) => set({ history: [root], searchQuery: "" }),

  cd: (directory) => {
    set((state) => ({ history: [...state.history, directory] }));
  },

  goBack: () => {
    const { history } = get();
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    set({ history: newHistory });
  },
}));
