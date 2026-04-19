import { entryStore } from "@/features/entry-navigation/model/store";
import { Entry } from "@/shared/api/file-system/types";
import { pluginManager } from "@/shared/api/plugin/plugin-manager";

export class GlobalDropZone {
  private container: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.createOverlay();
    this.setupListeners();
  }

  private createOverlay() {
    this.container.className = `
      fixed inset-0 flex opacity-0 flex-col items-center justify-center
      bg-base-100/60 backdrop-blur-md pointer-events-none
      border-8 border-dashed border-primary/30 m-4 rounded-3xl transition-all duration-300
    `;

    this.container.innerHTML = `
      <div class="flex flex-col items-center gap-6 p-10 text-center animate-in fade-in zoom-in duration-300">
        <div id="drop-status-icon" class="relative">
           <div class="p-6 bg-primary text-primary-content rounded-full shadow-2xl shadow-primary/40">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
           </div>
           <span id="drop-spinner" class="loading loading-ring loading-lg text-primary absolute -inset-2 hidden"></span>
        </div>

        <div>
          <h2 class="text-3xl font-black tracking-tight text-base-content" id="drop-title">Drop to Open</h2>
          <p class="text-base-content/60 mt-2 font-medium" id="drop-subtitle">Release to initialize plugin</p>
        </div>
        
        <div class="badge badge-primary badge-outline font-mono uppercase tracking-widest text-xs">Ready for input</div>
      </div>
    `;
  }

  private setupListeners() {
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.show();
    });

    window.addEventListener("dragleave", (e) => {
      if (e.relatedTarget === null) this.hide();
    });

    window.addEventListener("drop", async (e) => {
      e.preventDefault();

      const items = e.dataTransfer?.items;
      if (!items || items.length === 0) return;

      const item = items[0];

      if (item.kind === "file" && "getAsFileSystemHandle" in item) {
        const handle = await item.getAsFileSystemHandle();
        if (handle === null) return;

        if (handle.kind === "directory") {
          entryStore
            .getState()
            .navigateTo([handle as FileSystemDirectoryHandle]);
        } else {
          const plugin = pluginManager.getPluginForEntry(handle as Entry);
          plugin?.handleSystemIntent?.(handle as Entry);
        }
      } else {
        alert("not supported...");
      }

      this.hide();
    });
  }

  public show() {
    this.container.classList.remove("opacity-0", "pointer-events-none");
    this.container.classList.add("opacity-100", "z-[9999]");
  }

  public hide() {
    this.container.classList.remove("opacity-100", "z-[9999]");
    this.container.classList.add("opacity-0", "pointer-events-none");
  }
}
