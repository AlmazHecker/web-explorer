import { Header } from "@/widgets/header";
import { EntryExplorer } from "@/widgets/entry-explorer";
import { pluginManager } from "./shared/api/file-system/plugin-manager";
import { MusicPlugin } from "./features/plugins/music-plugin";
import { VideoPlugin } from "./features/plugins/video-plugin";
import { ImagePlugin } from "./features/plugins/image-plugin";

export const PLUGIN_SLOTS_ROOT = "plugin-slots-root";

const bootstrapApp = async () => {
  const theme = localStorage.getItem("theme");
  if (theme) {
    document.documentElement.classList.add(theme);
    document.body.setAttribute("data-theme", theme);
  } else {
    document.body.setAttribute("data-theme", "dark");
  }

  const app = document.getElementById("app")!;
  app.className = "md:max-w-3xl w-full mx-auto";
  app.innerHTML = `
    <!-- Top Nav -->
    <div id="header-container"></div>

    <!-- Main Content -->
    <div id="explorer-container" class="flex-1 overflow-auto no-scrollbar relative bg-base-200/30 border border-base-content/5">
    </div>

    <!-- Slots (Plugins) -->
    <div id="${PLUGIN_SLOTS_ROOT}"></div>
    `;

  pluginManager.setRootSlot(document.getElementById(PLUGIN_SLOTS_ROOT)!);

  pluginManager.register(MusicPlugin);
  pluginManager.register(VideoPlugin);
  pluginManager.register(ImagePlugin);

  new Header(document.getElementById("header-container")!);
  const entryExplorer = new EntryExplorer(
    document.getElementById("explorer-container")! as HTMLDivElement,
  );

  document.getElementById("load-folder-btn")?.addEventListener("click", () => {
    entryExplorer.loadDirectoryContent("NEW");
  });
};

bootstrapApp();

if ("serviceWorker" in navigator && !import.meta.env.DEV) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}
