import OfflinePlugin, { InstallOptions } from "offline-plugin/runtime";

export function offlineSetup(opts: InstallOptions) {
  OfflinePlugin.install({
    ...opts,
    onUpdateReady: function () {
      OfflinePlugin.applyUpdate();
    },
  });
}
