import { set, get } from "idb-keyval";

const DB_KEY = "last-folder-handle";

type Args = {
  target: "LAST" | "NEW" | FileSystemDirectoryHandle;
};

export const scanDirectory = async (
  args: Args,
): Promise<FileSystemDirectoryHandle> => {
  const { target } = args;
  let rootDir: FileSystemDirectoryHandle;

  const saved = await get<FileSystemDirectoryHandle>(DB_KEY);
  if (target === "LAST") {
    if (
      !saved ||
      (await saved.queryPermission({ mode: "read" })) !== "granted"
    ) {
      throw "not granted";
    }
    rootDir = saved;
  } else if (target === "NEW") {
    rootDir = await window.showDirectoryPicker({ mode: "read" });
    await set(DB_KEY, rootDir);
  } else {
    rootDir = target;
  }

  return rootDir;
};
