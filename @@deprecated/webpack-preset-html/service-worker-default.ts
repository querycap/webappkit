import { setCacheNameDetails, skipWaiting } from "workbox-core";
import { enable } from "workbox-navigation-preload";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

setCacheNameDetails({
  prefix: "app",
});

enable();
skipWaiting();
cleanupOutdatedCaches();

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
const manifest = (self as any).__WB_MANIFEST as Array<{ revision: string; url: string }>;

precacheAndRoute(
  manifest.concat({
    revision: `${Date.now()}`,
    url: "/",
  }),
);

registerRoute(new NavigationRoute(createHandlerBoundToURL("/")));

registerRoute(
  /\.(?:chunk\.js)$/,
  new CacheFirst({
    cacheName: "chunk-cache",
  }),
  "GET",
);

registerRoute(
  /\.(?:png|jpg|jpeg|svg)$/,
  new CacheFirst({
    cacheName: "image-cache",
  }),
  "GET",
);
