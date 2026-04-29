import { Entry } from "@/shared/api/file-system/types";
import { ValueOf } from "@/shared/lib/utils";
import { plusIcon, trashIcon } from "@/shared/ui/icons";
import { TagLib } from "taglib-wasm";
import type {
  Picture,
  PictureType,
  AudioFile,
  PropertyMap,
  PropertyKey,
} from "taglib-wasm";

const ACTION = {
  DELETE_IMAGE: "del-img",
  DELETE_TAG: "del-tag",
  ADD_TAG: "add-tag",
  CANCEL: "cancel",
} as const;

export class MusicMetadataEditor {
  private dialog: HTMLDialogElement;
  private form: HTMLFormElement;
  private fieldGrid: HTMLElement;
  private additionalTagsContainer: HTMLElement;
  private coverList: HTMLElement;
  private audioFile: AudioFile | null = null;
  private currentEntry: FileSystemFileHandle | null = null;
  private currentPictures: Picture[] = [];
  private coverUrls: Map<number, string> = new Map();

  private readonly numericFields: (keyof PropertyMap)[] = [
    "year",
    "track",
    "discNumber",
    "bpm",
    "totalTracks",
    "totalDiscs",
  ];
  private readonly pictureTypes: PictureType[] = [
    "FrontCover",
    "BackCover",
    "Artist",
    "Band",
    "LeafletPage",
    "Media",
    "LeadArtist",
    "Illustration",
    "Other",
  ];

  constructor(
    private container: HTMLElement,
    private readonly onClosed: () => void,
  ) {
    this.container.innerHTML = `
    <dialog id="metadata-editor-modal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl bg-base-200 border border-white/10 p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div class="bg-base-300 px-6 py-4 flex justify-between items-center border-b border-white/5 shrink-0">
          <div class="flex items-center gap-3">
            <h3 class="font-bold text-xl tracking-tight">Tag Editor</h3>
          </div>
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>
        
        <form id="metadata-form" class="p-6 space-y-10 overflow-y-auto grow text-base">
          <section>
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-xs font-black uppercase opacity-40 tracking-[0.2em]">Embedded Artwork</h4>
              <label class="btn btn-sm btn-outline btn-primary gap-2">
              ${plusIcon()}
                Add Image
                <input type="file" id="add-cover-input" accept="image/*" class="hidden" multiple />
              </label>
            </div>
            <div id="cover-list" class="flex gap-4 overflow-x-auto pb-2 min-h-[160px]"></div>
          </section>

          <div class="space-y-10">
            <section>
              <div class="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                <h4 class="text-xs font-black uppercase opacity-40 tracking-[0.2em]">Standard Tags</h4>
              </div>
              <div id="fields-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6"></div>
            </section>

            <section>
              <div class="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                <h4 class="text-xs font-black uppercase opacity-40 tracking-[0.2em]">Extended Metadata</h4>
                <button type="button" data-action="${ACTION.ADD_TAG}" class="btn btn-xs btn-ghost text-primary font-bold tracking-wider">+ ADD FIELD</button>
              </div>
              <div id="additional-tags" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            </section>
          </div>

          <div class="modal-action border-t border-white/5 pt-6 shrink-0">
            <button type="button" data-action="${ACTION.CANCEL}" class="btn btn-ghost px-8">Cancel</button>
            <button type="submit" class="btn btn-primary px-16 font-bold">Save Changes</button>
          </div>
        </form>
      </div>
    </dialog>`;

    this.dialog = this.container.querySelector("#metadata-editor-modal")!;
    this.form = this.container.querySelector("#metadata-form")!;
    this.fieldGrid = this.container.querySelector("#fields-grid")!;
    this.coverList = this.container.querySelector("#cover-list")!;
    this.additionalTagsContainer =
      this.container.querySelector("#additional-tags")!;

    this.bindEvents();
  }

  private registerUrl(index: number, pic: Picture) {
    const url = URL.createObjectURL(
      new Blob([pic.data as BlobPart], { type: pic.mimeType }),
    );
    this.coverUrls.set(index, url);
  }

  private cleanup() {
    this.coverUrls.forEach((url) => URL.revokeObjectURL(url));
    this.coverUrls.clear();
    this.currentPictures = [];

    if (this.audioFile) {
      this.audioFile.dispose();
      this.audioFile = null;
    }

    this.currentEntry = null;
    this.fieldGrid.innerHTML = "";
    this.additionalTagsContainer.innerHTML = "";
    this.coverList.innerHTML = "";
    this.form.reset();
  }

  private syncUrlsAfterSplice(deletedIndex: number) {
    const deletedUrl = this.coverUrls.get(deletedIndex);
    if (deletedUrl) URL.revokeObjectURL(deletedUrl);

    const newUrls = new Map<number, string>();
    this.coverUrls.forEach((url, index) => {
      if (index < deletedIndex) newUrls.set(index, url);
      else if (index > deletedIndex) newUrls.set(index - 1, url);
    });
    this.coverUrls = newUrls;
  }

  private bindEvents() {
    this.dialog.addEventListener(
      "close",
      () => {
        this.cleanup();
        this.onClosed();
      },
      { once: true },
    );

    this.form.addEventListener("click", (e) => {
      const target = (e.target as HTMLElement).closest("[data-action]");
      if (!target) return;
      const action = target.getAttribute("data-action");
      const indexStr = target.getAttribute("data-index");

      switch (action) {
        case ACTION.CANCEL:
          this.dialog.close();
          break;
        case ACTION.ADD_TAG:
          this.addCustomTagRow("", []);
          break;
        case ACTION.DELETE_TAG:
          target.closest(".tag-input-row")?.remove();
          break;
        case ACTION.DELETE_IMAGE:
          if (indexStr !== null) {
            const index = Number(indexStr);
            this.currentPictures.splice(index, 1);
            this.syncUrlsAfterSplice(index);
            this.renderCovers();
          }
          break;
      }
    });

    const coverInput = this.container.querySelector(
      "#add-cover-input",
    ) as HTMLInputElement;
    coverInput.addEventListener("change", async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      for (const file of files) {
        const pic: Picture = {
          data: new Uint8Array(await file.arrayBuffer()),
          mimeType: file.type,
          type: "FrontCover",
        };
        const newIndex = this.currentPictures.length;
        this.currentPictures.push(pic);
        this.registerUrl(newIndex, pic);
      }
      coverInput.value = "";
      this.renderCovers();
    });

    this.form.onsubmit = async (e) => {
      e.preventDefault();
      if (!this.audioFile || !this.currentEntry) return;

      // THIS SHOULD BE FIXED!
      const tags: any = {};
      const typeSelects =
        this.form.querySelectorAll<HTMLSelectElement>(".pic-type-select");

      this.currentPictures.forEach((pic, index) => {
        if (typeSelects[index])
          // @ts-ignore
          pic.type = typeSelects[index].value as PictureType;
      });

      this.form.querySelectorAll(".tag-input-row").forEach((row) => {
        const key = (
          row.querySelector(".tag-key") as HTMLInputElement
        ).value.trim();
        const val = (
          row.querySelector(".tag-val") as HTMLInputElement
        ).value.trim();
        if (!key || !val) return;
        tags[key] = this.numericFields.includes(key)
          ? [`${parseInt(val, 10)}`]
          : val
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
      });

      this.audioFile.setProperties(tags);

      this.audioFile.removePictures();
      this.currentPictures.forEach((pic) => this.audioFile!.addPicture(pic));
      this.audioFile.save();

      const finalBlob = this.audioFile.getFileBuffer();

      const writable = await this.currentEntry.createWritable();
      await writable.write(finalBlob as BlobPart);
      await writable.close();

      this.dialog.close();
    };
  }

  public async open(entry: Entry) {
    if (entry.kind !== "file") return;
    this.cleanup();
    this.currentEntry = entry;
    const tagLib = await TagLib.initialize();
    const file = await entry.getFile();
    this.audioFile = await tagLib.open(file, { partial: false });

    const tags = this.audioFile.properties();

    this.currentPictures = this.audioFile.getPictures();
    this.currentPictures.forEach((pic, index) => this.registerUrl(index, pic));

    this.fieldGrid.innerHTML = "";
    this.additionalTagsContainer.innerHTML = "";
    this.renderFields(tags);
    this.renderCovers();

    this.dialog.showModal();
  }

  private renderCovers() {
    this.coverList.innerHTML = "";
    this.currentPictures.forEach((pic, index) => {
      const url = this.coverUrls.get(index) || "";
      const card = document.createElement("div");
      card.className =
        "flex-shrink-0 w-36 space-y-3 group relative bg-base-300 p-3 rounded-2xl border border-white/5";
      card.innerHTML = `
        <div class="aspect-square rounded-xl overflow-hidden shadow-inner relative ring-1 ring-white/10">
          <img src="${url}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
             <button type="button" data-action="${ACTION.DELETE_IMAGE}" data-index="${index}" class="btn btn-circle btn-error scale-75 group-hover:scale-100 transition-transform">
               ${trashIcon()}
             </button>
          </div>
        </div>
        <select class="pic-type-select select select-xs select-bordered w-full text-[10px] font-black uppercase h-7">
          ${this.pictureTypes.map((t) => `<option value="${t}" ${pic.type === t ? "selected" : ""}>${t}</option>`).join("")}
        </select>
      `;
      this.coverList.appendChild(card);
    });
  }

  private addStandardTagRow(
    key: keyof PropertyMap,
    value: ValueOf<PropertyMap>,
  ) {
    const displayValue = Array.isArray(value)
      ? value.join(", ")
      : (value ?? "");
    const div = document.createElement("div");
    div.className = "form-control w-full tag-input-row";
    div.innerHTML = `
      <label class="label py-1"><span class="label-text text-xs font-black opacity-40 uppercase tracking-wider">${key}</span></label>
      <input type="hidden" class="tag-key" value="${key}" />
      <input type="${this.numericFields.includes(key) ? "number" : "text"}" 
             class="tag-val input input-bordered bg-base-300/50 focus:input-primary w-full h-10" 
             value="${displayValue}" />
    `;
    this.fieldGrid.appendChild(div);
  }

  private addCustomTagRow(key: string, value: ValueOf<PropertyMap>) {
    const displayValue = Array.isArray(value)
      ? value.join(", ")
      : (value ?? "");
    const div = document.createElement("div");
    div.className =
      "flex gap-2 tag-input-row group bg-base-100/30 p-2 rounded-lg border border-white/5 items-center";
    div.innerHTML = `
      <input type="text" placeholder="Key" class="tag-key input input-sm input-bordered font-mono font-medium uppercase" value="${key}" />
      <input type="text" placeholder="Value" class="tag-val input input-sm input-bordered font-medium" value="${displayValue}" />
      <button type="button" data-action="${ACTION.DELETE_TAG}" class="btn btn-xs btn-circle btn-ghost text-error opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
    `;
    this.additionalTagsContainer.appendChild(div);
  }

  private renderFields(tags: PropertyMap) {
    const priorityKeys: PropertyKey[] = [
      "title",
      "artist",
      "album",
      "date",
      "genre",
      "trackNumber",
      "albumArtist",
      "composer",
      "lyrics", // this should be either text area or any other better UI for this
    ];

    priorityKeys.forEach((key) => this.addStandardTagRow(key, tags[key]));
    Object.keys(tags).forEach((key) => {
      if (["pictures"].includes(key)) return;
      if (priorityKeys.includes(key as PropertyKey)) return;

      this.addCustomTagRow(key, tags[key]);
    });
  }
}
