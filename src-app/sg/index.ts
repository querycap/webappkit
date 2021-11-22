// @ts-ignore
// import { registerSW } from "virtual:pwa-register";

const start = () =>
  void import("./bootstrap").then(({ bootstrap }) => {
    bootstrap(document.querySelector("#root") as Element, true);
  });

start();

// registerSW({
//   onOfflineReady() {
//     start();
//   },
// });
