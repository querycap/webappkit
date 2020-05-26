const run = () =>
  import("./bootstrap").then(({ bootstrap }) => {
    bootstrap(document.querySelector("#root") as Element, true);
  });

if ("serviceWorker" in navigator) {
  void navigator.serviceWorker.register("/sw.js").then(() => run());
} else {
  void run();
}
