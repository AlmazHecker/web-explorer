export const getAppManifest = (BASE: string) => {
  return {
    name: "Explorer",
    id: "explorer",
    short_name: "Explorer",
    description: "Explorer, explore your files",
    start_url: BASE,
    display: "standalone",
    categories: ["music", "utilities"],
    scope: BASE,
    icons: [
      {
        src: `${BASE}android-chrome-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${BASE}android-chrome-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: `${BASE}android-chrome-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${BASE}android-chrome-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    screenshots: [
      {
        src: `${BASE}screenshot-wide.png`,
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: `${BASE}screenshot-narrow.png`,
        sizes: "720x599",
        type: "image/png",
        form_factor: "narrow",
      },
    ],

    edge_side_panel: {
      preferred_width: 480,
    },

    file_handlers: [
      {
        action: BASE,
        name: "Media files",
        accept: {
          "image/jpeg": [".jpg", ".jpeg"],
          "image/png": [".png"],
          "image/gif": [".gif"],
          "image/webp": [".webp"],
          "audio/mpeg": [".mp3"],
          "audio/wav": [".wav"],
          "audio/x-m4a": [".m4a"],
          "audio/flac": [".flac"],
          "audio/ogg": [".ogg"],
          "video/mp4": [".mp4"],
          "video/webm": [".webm"],
        },
      },
    ],
  };
};
