import { Entry, PluginAction } from "@/shared/api/file-system/types";

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

  public show(x: number, y: number, actions: PluginAction[], entry: Entry) {
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
        actions[index].handler(entry);
        this.hide();
      });
    });

    this.container.classList.remove("hidden");

    const { innerWidth, innerHeight } = window;
    const { offsetWidth, offsetHeight } = this.container;

    let left = x;
    let top = y;

    if (x + offsetWidth > innerWidth) left = x - offsetWidth;
    if (y + offsetHeight > innerHeight) top = y - offsetHeight;

    this.container.style.left = `${left}px`;
    this.container.style.top = `${top}px`;
  }

  public hide() {
    this.container.classList.add("hidden");
  }
}

export const contextMenu = new ContextMenu();
