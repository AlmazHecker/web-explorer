import { paletteIcon } from "@/shared/ui/icons";

export class ThemeToggle {
  private container: HTMLElement;
  private currentTheme: string;
  private themes: string[] = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  constructor(container: HTMLElement) {
    this.container = container;
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.applyTheme(this.currentTheme);
    this.render();
  }

  private applyTheme(theme: string) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  private handleThemeSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.value) {
      this.applyTheme(target.value);
      this.render();
    }
  };

  render() {
    this.container.innerHTML = `
      <div class="dropdown dropdown-end">
        <button class="btn btn-ghost btn-circle" id="theme-toggle-btn" tabindex="0" role="button">
        ${paletteIcon()}
        </button>
        
        <div tabindex="0" class="dropdown-content card card-sm bg-base-200 z-1 w-52 shadow-2xl p-2 border border-base-300">
          <div class="card-body p-0">
            <fieldset class="fieldset p-2 gap-1 overflow-y-auto max-h-80">
              <legend class="fieldset-legend text-xs opacity-50 uppercase tracking-widest">Select Theme</legend>
              ${this.themes
                .map(
                  (theme) => `
                <label class="flex gap-3 cursor-pointer items-center p-2 hover:bg-base-300 rounded-btn transition-colors">
                  <input type="radio" 
                         name="theme-dropdown" 
                         class="radio radio-xs theme-controller" 
                         value="${theme}" 
                         ${this.currentTheme === theme ? "checked" : ""} />
                  <span class="text-sm capitalize">${theme}</span>
                </label>
              `,
                )
                .join("")}
            </fieldset>
          </div>
        </div>
      </div>
    `;

    this.container
      .querySelectorAll('input[name="theme-dropdown"]')
      .forEach((radio) => {
        radio.addEventListener("change", this.handleThemeSelect);
      });
  }
}
