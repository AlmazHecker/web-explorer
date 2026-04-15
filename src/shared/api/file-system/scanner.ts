import { get } from "idb-keyval";

export const ROOT_HANDLE_KEY = "root-directory-handle";

type Args = {
  target: "LAST" | "NEW" | FileSystemDirectoryHandle[];
};

export const scanDirectory = async (
  args: Args,
): Promise<FileSystemDirectoryHandle[]> => {
  const { target } = args;
  let handleHistory: FileSystemDirectoryHandle[];

  if (target === "LAST") {
    const saved = await get<FileSystemDirectoryHandle[]>(ROOT_HANDLE_KEY);

    if (!saved) throw "No saved handle found";

    handleHistory = saved;
  } else if (target === "NEW") {
    handleHistory = [await window.showDirectoryPicker({ mode: "read" })];
  } else {
    handleHistory = target;
  }

  return handleHistory;
};
