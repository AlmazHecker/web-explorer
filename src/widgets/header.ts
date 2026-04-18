import { entryStore } from "@/features/entry-navigation/model/store";
import { ThemeToggle } from "./theme-toggle";
import { folderOpenIcon } from "@/shared/ui/icons";

export class Header {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    new ThemeToggle(this.container.querySelector("#theme-toggle-container")!);

    document
      .getElementById("load-folder-btn")
      ?.addEventListener("click", () =>
        entryStore.getState().requestDirectory("NEW"),
      );
  }

  render() {
    this.container.innerHTML = `
      <header class="sticky top-0 z-40 w-full py-4 md:px-0 px-4 flex items-center justify-between bg-base-100 border-b border-base-content/10">
        <h1 class="text-2xl font-extrabold tracking-tight">Explorer</h1>

        <div class="flex items-center gap-2">
        <button id="load-folder-btn" class="btn btn-primary btn-sm gap-2">
          <span>${folderOpenIcon()}</span>
          Load Folder
        </button>
          <div id="theme-toggle-container"></div>
        </div>
      </header>
    `;
  }
}
