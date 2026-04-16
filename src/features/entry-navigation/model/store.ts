import { createStore } from "zustand/vanilla";
import { Entry } from "@/shared/api/file-system/types";
import { set as IDBSet } from "idb-keyval";
import { ROOT_HANDLE_KEY } from "@/shared/api/file-system/scanner";
import { createJSONStorage, persist } from "zustand/middleware";

interface EntryStore {
  entries: Entry[];
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

export const entryStore = createStore<EntryStore>()(
  persist(
    (set, get) => ({
      entries: [],
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
        set({ history });
      },
    }),
    {
      name: "entry-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        searchQuery: state.searchQuery,
      }),
    },
  ),
);
