import { Entry } from "@/shared/api/file-system/types";
import { pluginManager } from "@/shared/api/plugin/plugin-manager";

if ("launchQueue" in window && window.launchQueue) {
  window.launchQueue.setConsumer(async (launchParams) => {
    if (launchParams.files.length > 0) {
      const fileHandle = launchParams.files[0];
      if (fileHandle.kind === "directory") {
        return alert("not supported yet...");
      }

      const plugin = pluginManager.getPluginForEntry(fileHandle as Entry);
      if (plugin?.handleSystemIntent) {
        plugin.handleSystemIntent(fileHandle as Entry);
      } else {
        alert("No handler found...");
      }
    }
  });
}
