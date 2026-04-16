import { Header } from "@/widgets/header";
import { EntryExplorer } from "@/widgets/entry-explorer";
import { pluginManager } from "./shared/api/file-system/plugin-manager";
import { MusicPlugin } from "./features/plugins/music-plugin";
import { VideoPlugin } from "./features/plugins/video-plugin";
import { ImagePlugin } from "./features/plugins/image-plugin";

export const PLUGIN_SLOTS_ROOT = "plugin-slots-root";

const bootstrapApp = () => {
  const theme = localStorage.getItem("theme");
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  const app = document.getElementById("app")!;
  app.className =
    "md:max-w-3xl w-full mx-auto flex flex-col h-screen overflow-hidden";
  app.innerHTML = `
  <div id="header-container"></div>

  <div id="explorer-container" class="flex-1 flex flex-col overflow-hidden bg-base-200/30 border border-base-content/5">
  </div>

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

if ("launchQueue" in window && window.launchQueue) {
  window.launchQueue.setConsumer(async (launchParams) => {
    if (launchParams.files.length > 0) {
      const fileHandle = launchParams.files[0];
      if (fileHandle.kind === "directory") {
        return alert("not supported yet...");
      }
      const file = await (fileHandle as FileSystemFileHandle).getFile();

      const plugin = pluginManager.getPluginForEntry(file as File);
      if (plugin?.handleSystemIntent) {
        plugin.handleSystemIntent(file);
      } else {
        alert("No handler found...");
      }
    }
  });
}
