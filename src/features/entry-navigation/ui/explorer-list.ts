import { entryStore } from "@/features/entry-navigation/model/store";
import { Entry } from "@/shared/api/file-system/types";
import { pluginManager } from "@/shared/api/file-system/plugin-manager";
import { contextMenu } from "@/shared/ui/context-menu";
import { folderIcon, fileIcon } from "@/shared/ui/icons";
import { ExtractState } from "zustand";

export class ExplorerList {
  private container: HTMLDivElement;
  private filteredEntries: Entry[] = [];
  private unsubscribe: () => void;

  constructor(container: HTMLDivElement) {
    this.container = container;

    this.unsubscribe = entryStore.subscribe((state, prevState) => {
      if (
        state.searchQuery !== prevState.searchQuery ||
        state.viewMode !== prevState.viewMode ||
        state.isLoading !== prevState.isLoading ||
        state.entries !== prevState.entries
      ) {
        this.render(state);
      }
    });

    this.container.addEventListener("click", this.handleListClick.bind(this));
    this.container.addEventListener(
      "contextmenu",
      this.handleContextMenu.bind(this),
    );
  }

  private render(state: ExtractState<typeof entryStore>) {
    const { searchQuery, viewMode, isLoading, entries } = state;
    if (isLoading) {
      this.container.innerHTML = this.getLoadingTemplate();
      return;
    }

    this.filteredEntries = entries.filter((entry) =>
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

    const index = Number(target.getAttribute("data-id"));
    const handle = this.filteredEntries[index];
    if (!handle) return;

    if (handle.kind === "directory") {
      const event = new CustomEvent("explorer:cd", { detail: handle });
      window.dispatchEvent(event);
    } else {
      pluginManager.handleDefaultAction(this.filteredEntries, index);
    }
  }

  private handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    const target = (e.target as HTMLElement).closest("[data-id]");
    if (!target) return;

    const index = Number(target.getAttribute("data-id"));
    const handle = this.filteredEntries[index];
    if (!handle) return;

    const actions = pluginManager.getActionsForEntry(handle);
    contextMenu.show(e, actions, this.filteredEntries, index);
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
