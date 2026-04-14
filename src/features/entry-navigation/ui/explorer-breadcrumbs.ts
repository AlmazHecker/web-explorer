import { entryStore } from "@/features/entry-navigation/model/store";
import { arrowLeftIcon, chevronRightIcon } from "@/shared/ui/icons";

export class ExplorerBreadcrumbs {
  private container: HTMLDivElement;
  private unsubscribe: () => void;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.container.className =
      "flex items-center gap-2 px-4 py-1.5 bg-base-100 border-b border-base-300 overflow-x-auto no-scrollbar min-h-[40px]";

    this.unsubscribe = entryStore.subscribe((state, prevState) => {
      if (state.history !== prevState.history) {
        this.render();
      }
    });

    this.container.addEventListener("click", this.handleClick.bind(this));
    this.render();
  }

  private render() {
    const { history } = entryStore.getState();
    const backDisabled = history.length <= 1;

    this.container.innerHTML = `
      <button 
        id="breadcrumb-back" 
        class="btn btn-ghost btn-xs btn-square shrink-0 ${backDisabled ? "btn-disabled opacity-80" : ""}"
        ${backDisabled ? "disabled" : ""}
        aria-label="Go back"
      >
        ${arrowLeftIcon({ width: 14, height: 14 })}
      </button>
      
      <div class="h-4 w-px bg-base-300 mx-1 shrink-0"></div>

      <div class="flex items-center gap-0.5 text-xs font-medium whitespace-nowrap">
        ${history
          .map(
            (handle, index) => `
          ${index > 0 ? `<span class="opacity-30 mx-0.5">${chevronRightIcon({ width: 12, height: 12 })}</span>` : ""}
          <button 
            data-index="${index}" 
            class="px-1.5 py-1 rounded-md transition-colors ${
              index === history.length - 1
                ? "text-primary cursor-default font-bold"
                : "text-muted-foreground hover:bg-base-200 hover:text-base-content"
            }"
          >
            ${handle.name || "Library"}
          </button>
        `,
          )
          .join("")}
      </div>
    `;
  }

  private handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (target.closest("#breadcrumb-back")) {
      const { goBack, history } = entryStore.getState();
      if (history.length > 1) {
        goBack();
        const newHistory = entryStore.getState().history;
        this.dispatchNavigation(newHistory[newHistory.length - 1]);
      }
      return;
    }

    const segment = target.closest("[data-index]");
    if (segment) {
      const index = Number(segment.getAttribute("data-index"));
      const { history } = entryStore.getState();

      if (index === history.length - 1) return;

      const targetHandle = history[index];
      entryStore.setState({ history: history.slice(0, index + 1) });
      this.dispatchNavigation(targetHandle);
    }
  }

  private dispatchNavigation(handle: FileSystemDirectoryHandle) {
    window.dispatchEvent(new CustomEvent("explorer:cd", { detail: handle }));
  }

  destroy() {
    this.unsubscribe();
  }
}
