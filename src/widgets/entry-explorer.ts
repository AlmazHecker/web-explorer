import { ExplorerToolbar } from "@/features/entry-navigation/ui/explorer-toolbar";
import { ExplorerList } from "@/features/entry-navigation/ui/explorer-list";

import { folderIcon } from "@/shared/ui/icons";
import { ExplorerBreadcrumbs } from "@/features/entry-navigation/ui/explorer-breadcrumbs";
import { entryStore } from "@/features/entry-navigation/model/store";

export class EntryExplorer {
  private toolbar!: ExplorerToolbar;
  private list!: ExplorerList;
  private breadcrumbs!: ExplorerBreadcrumbs;

  constructor(private readonly container: HTMLElement) {
    this.renderShell();
    entryStore.getState().requestDirectory("LAST");
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

  destroy() {
    this.toolbar?.destroy();
    this.list?.destroy();
    this.breadcrumbs?.destroy();
  }
}
