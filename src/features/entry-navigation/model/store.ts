import { createStore } from "zustand/vanilla";
import { Entry } from "@/shared/api/file-system/types";
import { set as IDBSet, get as IDBGet } from "idb-keyval";
import { createJSONStorage, persist } from "zustand/middleware";

const ROOT_HANDLE_KEY = "root-directory-handle";

interface EntryStore {
  entries: Entry[];
  history: FileSystemDirectoryHandle[];
  searchQuery: string;
  viewMode: "list" | "grid";
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: "list" | "grid") => void;

  isLoading: boolean;

  navigateTo: (target: FileSystemDirectoryHandle[]) => Promise<void>;
  cdInto: (target: FileSystemDirectoryHandle) => void;
  requestDirectory: (target: "NEW" | "LAST") => Promise<void>;
  error: unknown;
}

export const entryStore = createStore<EntryStore>()(
  persist(
    (set, get) => ({
      entries: [],
      history: [],
      isLoading: false,
      searchQuery: "",
      viewMode: "list",
      error: null,

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setViewMode: (viewMode) => set({ viewMode }),
      requestDirectory: async (target) => {
        try {
          let handle: FileSystemDirectoryHandle[] | null = null;
          if (target === "NEW") {
            handle = [await window.showDirectoryPicker({ mode: "read" })];
          } else {
            handle =
              (await IDBGet<FileSystemDirectoryHandle[]>(ROOT_HANDLE_KEY)) ||
              [];
          }

          return get().navigateTo(handle);
        } catch (error) {
          if (error instanceof Error && error?.name === "AbortError") {
            return;
          }
          set({ error });
        }
      },

      navigateTo: async (target: FileSystemDirectoryHandle[]) => {
        try {
          set({ isLoading: true });
          if (!target || target.length === 0) return;
          IDBSet(ROOT_HANDLE_KEY, target);

          const entries: Entry[] = [];
          for await (const handle of target[target.length - 1].values()) {
            entries.push(handle);
          }

          entries.sort((a, b) => {
            if (a.kind === "directory" && b.kind === "file") return -1;
            if (a.kind === "file" && b.kind === "directory") return 1;
            return a.name.localeCompare(b.name);
          });

          set({ entries, history: target, error: null });
        } catch (error) {
          set({ error });
        } finally {
          set({ isLoading: false });
        }
      },

      cdInto: (target: FileSystemDirectoryHandle) => {
        const { history } = get();
        const newHistory = [...history, target];
        return get().navigateTo(newHistory);
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
