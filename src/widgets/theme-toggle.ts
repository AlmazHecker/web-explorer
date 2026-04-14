import { sunIcon, moonIcon } from "@/shared/ui/icons";

export class ThemeToggle {
  private container: HTMLElement;
  private isDark: boolean;

  constructor(container: HTMLElement) {
    this.container = container;
    this.isDark = document.documentElement.classList.contains("dark");
    this.render();
  }

  private toggle = () => {
    this.isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", this.isDark ? "dark" : "light");
    this.setThemeColor(this.isDark);
    this.render();
  };

  render() {
    this.container.innerHTML = `
      <button class="btn btn-ghost btn-circle" id="theme-toggle-btn">
        ${this.isDark ? sunIcon() : moonIcon()}
      </button>
    `;

    this.container
      .querySelector("#theme-toggle-btn")
      ?.addEventListener("click", this.toggle);
  }

  private setThemeColor(dark: boolean) {
    const theme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        "content",
        dark ? "oklch(0.147 0.004 49.25)" : "oklch(1 0 0)",
      );
    }
  }
}
