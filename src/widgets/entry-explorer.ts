import { entryStore } from "@/features/entry-navigation/model/store";
import { scanDirectory } from "@/shared/api/file-system/scanner";
import { ExplorerToolbar } from "@/features/entry-navigation/ui/explorer-toolbar";
import { ExplorerList } from "@/features/entry-navigation/ui/explorer-list";

import { Entry } from "@/shared/api/file-system/types";
import { folderIcon } from "@/shared/ui/icons";
import { ExplorerBreadcrumbs } from "@/features/entry-navigation/ui/explorer-breadcrumbs";

export class EntryExplorer {
  private container: HTMLDivElement;
  private toolbar?: ExplorerToolbar;
  private list?: ExplorerList;
  private breadcrumbs?: ExplorerBreadcrumbs;

  constructor(container: HTMLDivElement) {
    this.container = container;

    this.renderShell();

    window.addEventListener("explorer:cd", ((
      e: CustomEvent<FileSystemDirectoryHandle[]>,
    ) => {
      this.loadDirectoryContent(e.detail);
    }) as EventListener);

    this.loadDirectoryContent("LAST");
  }

  private renderShell() {
    this.container.innerHTML = `
      <div id="explorer-toolbar-container"></div>
      <div id="explorer-breadcrumbs-container"></div>
<div id="explorer-list-container" class="flex-1 overflow-y-auto overflow-x-hidden"></div>`;

    this.breadcrumbs = new ExplorerBreadcrumbs(
      this.container.querySelector("#explorer-breadcrumbs-container")!,
    );

    this.toolbar = new ExplorerToolbar(
      this.container.querySelector("#explorer-toolbar-container")!,
    );
    this.list = new ExplorerList(
      this.container.querySelector("#explorer-list-container")!,
    );
  }

  public async loadDirectoryContent(
    target:
      | "LAST"
      | "NEW"
      | FileSystemDirectoryHandle[]
      | FileSystemDirectoryHandle,
  ) {
    const { setIsLoading, setHistory, setEntries, history } =
      entryStore.getState();
    try {
      setIsLoading(true);

      if (target instanceof FileSystemDirectoryHandle) {
        target = [...history, target];
      }

      const newHistory = await scanDirectory({ target });
      if (!newHistory) return;
      setHistory(newHistory);

      const entries: Entry[] = [];
      for await (const handle of newHistory[newHistory.length - 1].values()) {
        entries.push(handle);
      }

      entries.sort((a, b) => {
        if (a.kind === "directory" && b.kind === "file") return -1;
        if (a.kind === "file" && b.kind === "directory") return 1;
        return a.name.localeCompare(b.name);
      });

      setEntries(entries);
    } catch (error) {
      if (error === "not granted") {
        this.renderNoPermission();
        return;
      }
      console.error("Failed to read directory:", error);
    } finally {
      setIsLoading(false);
    }
  }

  private renderNoPermission() {
    const listContainer = this.container.querySelector(
      "#explorer-list-container",
    );
    if (!listContainer) return;

    listContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8 text-center">
        <div class="size-16 opacity-20">
          <span class="size-full">${folderIcon()}</span>
        </div>
        <div>
           <p class="text-lg font-bold">Permission Required</p>
           <p class="text-sm opacity-70">Please click 'Load Folder' to authorize access to your library.</p>
        </div>
      </div>
    `;
  }

  destroy() {
    this.toolbar?.destroy();
    this.list?.destroy();
    this.breadcrumbs?.destroy();
  }
}
