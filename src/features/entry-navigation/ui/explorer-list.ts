import { entryStore } from "@/features/entry-navigation/model/store";
import { Entry } from "@/shared/api/file-system/types";
import { pluginManager } from "@/shared/api/file-system/plugin-manager";
import { contextMenu } from "@/shared/ui/context-menu";
import { folderIcon, fileIcon } from "@/shared/ui/icons";

export class ExplorerList {
  private container: HTMLDivElement;
  private entries: Entry[] = [];
  private filteredEntries: Entry[] = [];
  private unsubscribe: () => void;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.container.className = "flex-1 overflow-y-auto no-scrollbar p-2";

    this.unsubscribe = entryStore.subscribe((state, prevState) => {
      if (
        state.searchQuery !== prevState.searchQuery ||
        state.viewMode !== prevState.viewMode ||
        state.isLoading !== prevState.isLoading
      ) {
        this.render();
      }
    });

    this.container.addEventListener("click", this.handleListClick.bind(this));
    this.container.addEventListener(
      "contextmenu",
      this.handleContextMenu.bind(this),
    );
  }

  public setEntries(entries: Entry[]) {
    this.entries = entries;
  }

  private render() {
    const { searchQuery, viewMode, isLoading } = entryStore.getState();
    if (isLoading) {
      this.container.innerHTML = this.getLoadingTemplate();
      return;
    }

    this.filteredEntries = this.entries.filter((entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (this.filteredEntries.length === 0) {
      this.container.innerHTML = this.getEmptyTemplate();
      return;
    }

    if (viewMode === "list") {
      this.container.innerHTML = `<div class="flex flex-col gap-1">${this.filteredEntries.map(this.createListEntryHtml).join("")}</div>`;
    } else {
      this.container.innerHTML = `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">${this.filteredEntries.map(this.createGridEntryHtml).join("")}</div>`;
    }
  }

  private createListEntryHtml(handle: Entry, index: number): string {
    const isFolder = handle.kind === "directory";
    const icon = isFolder
      ? folderIcon({ className: "size-full" })
      : pluginManager.getIconForEntry(handle) ||
        fileIcon({ className: "size-full" });

    return `
      <button
        data-id="${index}"
        class="flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all hover:bg-base-200 group w-full"
      >
        <div class="flex items-center justify-center w-8 h-8 rounded-md bg-primary/5 text-primary shrink-0 transition-colors group-hover:bg-primary/10">
          <span class="size-4/5">${icon}</span>
        </div>
        <span class="font-medium text-sm truncate">
          ${handle.name}
        </span>
      </button>
    `;
  }

  private createGridEntryHtml(handle: Entry, index: number): string {
    const isFolder = handle.kind === "directory";
    const icon = isFolder
      ? folderIcon({ className: "size-full" })
      : pluginManager.getIconForEntry(handle) ||
        fileIcon({ className: "size-full" });

    return `
      <button
        data-id="${index}"
        class="flex flex-col items-center gap-2 p-3 text-center rounded-xl transition-all hover:bg-base-200 group w-full"
      >
        <div class="flex items-center justify-center aspect-square w-full rounded-lg bg-primary/5 text-primary shrink-0 transition-transform">
          <span class="size-3/5 mx-auto">${icon}</span>
        </div>
        <span class="font-medium text-xs truncate w-full">
          ${handle.name}
        </span>
      </button>
    `;
  }

  private handleListClick(e: MouseEvent) {
    const target = (e.target as HTMLElement).closest("[data-id]");
    if (!target) return;

    const handle = this.filteredEntries[Number(target.getAttribute("data-id"))];
    if (!handle) return;

    if (handle.kind === "directory") {
      const event = new CustomEvent("explorer:cd", { detail: handle });
      window.dispatchEvent(event);
    } else {
      pluginManager.onOpen(handle);
    }
  }

  private handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    const target = (e.target as HTMLElement).closest("[data-id]");
    if (!target) return;

    const handle = this.filteredEntries[Number(target.getAttribute("data-id"))];
    if (!handle) return;

    const actions = pluginManager.getActionsForEntry(handle);
    contextMenu.show(e.clientX, e.clientY, actions, handle);
  }

  private getEmptyTemplate() {
    return `
      <div class="flex flex-col items-center justify-center h-48 gap-2 opacity-50">
        ${fileIcon({ className: "mx-auto size-1/5" })}
        <p class="text-sm font-medium">No items</p>
      </div>
    `;
  }

  private getLoadingTemplate() {
    return `
      <div class="flex flex-col items-center justify-center h-48 gap-2 text-primary">
        <span class="loading loading-ring loading-xl"></span>
        <p class="text-sm font-medium animate-pulse">Parsing directory...</p>
      </div>  
    `;
  }

  destroy() {
    this.unsubscribe();
  }
}
