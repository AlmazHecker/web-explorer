import { Entry } from "@/shared/api/file-system/types";
import { pluginManager } from "@/shared/api/plugin/plugin-manager";
import { PluginAction } from "@/shared/api/plugin/types";

export class ContextMenu {
  private container: HTMLUListElement;

  constructor() {
    this.container = document.createElement("ul");
    this.container.id = "entry-context-menu";
    this.container.className =
      "dropdown menu fixed bg-base-100 shadow-sm z-[100] bg-base-200 border border-base-content/10 rounded-xl min-w-[160px] hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200";
    document.body.appendChild(this.container);

    window.addEventListener("click", () => this.hide());
    window.addEventListener("contextmenu", (e) => {
      if (!this.container.classList.contains("hidden")) {
        e.preventDefault();
      }
    });
  }

  public show(
    e: MouseEvent,
    actions: PluginAction[],
    entries: Entry[],
    at: number,
  ) {
    if (actions.length === 0) return;

    this.container.innerHTML = actions
      .map(
        (action, index) => `
        <li data-id="${index}">
          <span class="flex items-center gap-2">
            ${action.icon ? `<span>${action.icon}</span>` : ""}
            ${action.label}
          </span>
        </li>
      `,
      )
      .join("");

    this.container.querySelectorAll("[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-id")!, 10);
        pluginManager.executeAction(actions[index], entries, at);
        this.hide();
      });
    });

    this.container.classList.remove("hidden");

    const { innerWidth, innerHeight } = window;
    const { offsetWidth, offsetHeight } = this.container;

    let left = e.clientX;
    let top = e.clientY;

    if (e.clientX + offsetWidth > innerWidth) left = e.clientX - offsetWidth;
    if (e.clientY + offsetHeight > innerHeight) top = e.clientY - offsetHeight;

    this.container.style.left = `${left}px`;
    this.container.style.top = `${top}px`;
  }

  public hide() {
    this.container.classList.add("hidden");
  }
}

export const contextMenu = new ContextMenu();
