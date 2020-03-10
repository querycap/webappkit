import("./bootstrap").then(({ bootstrap }) => {
  bootstrap(document.querySelector("#root") as Element);
});
