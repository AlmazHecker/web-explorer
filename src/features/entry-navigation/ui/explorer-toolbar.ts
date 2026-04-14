import { entryStore } from "@/features/entry-navigation/model/store";
import { gridIcon, listIcon } from "@/shared/ui/icons";

export class ExplorerToolbar {
  private container: HTMLDivElement;
  private unsubscribe: () => void;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.render();

    this.unsubscribe = entryStore.subscribe((state, prevState) => {
      if (state.viewMode !== prevState.viewMode) {
        this.render();
      }
    });

    this.container.addEventListener("input", this.handleSearchInput.bind(this));
  }

  private handleSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.id === "explorer-search") {
      entryStore.getState().setSearchQuery(target.value);
    }
  }

  private render() {
    const { searchQuery, viewMode } = entryStore.getState();

    this.container.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 p-3 border-b border-base-content/5">
        <div class="relative flex-1 min-w-[200px]">
          <input 
            id="explorer-search"
            type="text" 
            placeholder="Search in folder..." 
            value="${searchQuery}"
            class="input"
          />
        </div>

        <div class="flex items-center gap-1">
          <div class="join">
            <button 
              id="view-list-btn"
              class="btn btn-sm btn-ghost join-item px-2 ${viewMode === "list" ? "bg-base-100 shadow-sm text-primary" : "opacity-40"}"
            >
              ${listIcon()}
            </button>
            <button 
              id="view-grid-btn"
              class="btn btn-sm btn-ghost join-item px-2 ${viewMode === "grid" ? "bg-base-100 shadow-sm text-primary" : "opacity-40"}"
            >
              ${gridIcon()}
            </button>
          </div>
        </div>
      </div>
    `;

    this.container
      .querySelector("#view-list-btn")
      ?.addEventListener("click", () => {
        entryStore.getState().setViewMode("list");
      });

    this.container
      .querySelector("#view-grid-btn")
      ?.addEventListener("click", () => {
        entryStore.getState().setViewMode("grid");
      });
  }

  destroy() {
    this.unsubscribe();
  }
}
