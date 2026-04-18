import { pluginManager } from "@/shared/api/plugin/plugin-manager";

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
