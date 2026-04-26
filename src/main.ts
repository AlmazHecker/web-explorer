import { Header } from "@/widgets/header";
import { EntryExplorer } from "@/widgets/entry-explorer";
import { pluginManager } from "@/shared/api/plugin/plugin-manager";
import { MusicPlugin } from "./features/plugins/music-plugin";
import { VideoPlugin } from "./features/plugins/video-plugin";
import { ImagePlugin } from "./features/plugins/image-plugin";
import { GlobalDropZone } from "./features/global-dropzone/global-dropzone";
import { setupLaunchQueue } from "./features/launch-queue/launch-queue";

const bootstrapApp = () => {
  const theme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);

  const app = document.getElementById("app")!;
  app.className =
    "md:max-w-3xl w-full mx-auto flex flex-col h-screen overflow-hidden";
  app.innerHTML = `
  <div id="header-container"></div>

  <div id="explorer-container" class="flex-1 flex flex-col overflow-hidden bg-base-200/30 border border-base-content/5">
  </div>

  <div id="plugin-slots-root"></div>

  <div id="global-dropzone"></div>
`;
  pluginManager.setRootSlot(document.getElementById("plugin-slots-root")!);

  pluginManager.register(MusicPlugin);
  pluginManager.register(VideoPlugin);
  pluginManager.register(ImagePlugin);
  setupLaunchQueue(pluginManager);

  new Header(document.getElementById("header-container")!);
  new EntryExplorer(document.getElementById("explorer-container")!);
  new GlobalDropZone(document.getElementById("global-dropzone")!);
};

bootstrapApp();

if ("serviceWorker" in navigator && !import.meta.env.DEV) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}
