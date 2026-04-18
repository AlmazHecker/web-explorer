import { entryStore } from "@/features/entry-navigation/model/store";
import { gridIcon, listIcon } from "@/shared/ui/icons";
import { ExtractState } from "zustand";

export class ExplorerToolbar {
  private unsubscribe: () => void;
  private searchTimeout!: NodeJS.Timeout;

  private listBtn: HTMLButtonElement;
  private gridBtn: HTMLButtonElement;

  constructor(private readonly container: HTMLDivElement) {
    this.setupInitialUI();

    this.listBtn = this.container.querySelector("#view-list-btn")!;
    this.gridBtn = this.container.querySelector("#view-grid-btn")!;

    this.unsubscribe = entryStore.subscribe((state, prevState) => {
      if (
        state.viewMode !== prevState.viewMode ||
        state.searchQuery !== prevState.searchQuery
      ) {
        this.updateViewMode(state);
      }
    });

    this.bindEvents();
  }

  private setupInitialUI() {
    const { searchQuery, viewMode } = entryStore.getState();

    this.container.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 p-3 border-b border-base-content/5">
        <div class="relative flex-1 min-w-[200px]">
          <input 
            id="explorer-search"
            type="search" 
            placeholder="Search in folder..." 
            value="${searchQuery}"
            class="input input-sm w-full outline-none"
          />
        </div>
        <div class="join">
          <button id="view-list-btn" class="btn ${viewMode === "list" ? "bg-base-100 shadow-sm text-primary" : "opacity-40"} btn-sm btn-ghost join-item px-2">
            ${listIcon()}
          </button>
          <button id="view-grid-btn" class="btn ${viewMode === "grid" ? "bg-base-100 shadow-sm text-primary" : "opacity-40"} btn-sm btn-ghost join-item px-2">
            ${gridIcon()}
          </button>
        </div>
      </div>
    `;
  }

  private updateViewMode(state: ExtractState<typeof entryStore>) {
    const isList = state.viewMode === "list";

    const active = ["bg-base-100", "shadow-sm", "text-primary"];

    this.listBtn.classList.toggle("opacity-40", !isList);
    this.gridBtn.classList.toggle("opacity-40", isList);

    active.forEach((cls) => {
      this.listBtn.classList.toggle(cls, isList);
      this.gridBtn.classList.toggle(cls, !isList);
    });
  }

  private bindEvents() {
    this.container.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest("#view-list-btn")) {
        entryStore.getState().setViewMode("list");
      } else if (target.closest("#view-grid-btn")) {
        entryStore.getState().setViewMode("grid");
      }
    });

    this.container.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.id === "explorer-search") {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          entryStore.getState().setSearchQuery(target.value);
        }, 200);
      }
    });
  }

  destroy() {
    this.unsubscribe();
  }
}
