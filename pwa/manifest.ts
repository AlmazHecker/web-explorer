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
  };
};
