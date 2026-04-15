import { createStore } from "zustand/vanilla";
import { Entry } from "@/shared/api/file-system/types";
import { set as IDBSet } from "idb-keyval";
import { ROOT_HANDLE_KEY } from "@/shared/api/file-system/scanner";

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
  setHistory: (root: FileSystemDirectoryHandle[]) => void;
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

  setHistory: (history) => {
    IDBSet(ROOT_HANDLE_KEY, history);
    set({ history, searchQuery: "" });
  },
}));
