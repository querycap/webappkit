// @ts-ignore
// import { registerSW } from "virtual:pwa-register";

const start = () => {
  void import("./bootstrap").then(({ bootstrap }) => {
    bootstrap(document.querySelector("#root") as Element);
  });
};

start();

// registerSW({
//   onOfflineReady() {
//     start();
//   },
// });
