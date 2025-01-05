import { App } from "astal/gtk4";
import windows from "./windows";
import { windowAnimation, windowBlur } from "./utils/hyprland";
import request from "./request";
import { initGtkStyle } from "./utils/style";
import { GLib } from "astal";

export default async function start(style) {
  await initGtkStyle();

  GLib.setenv("LD_PRELOAD", "", true);

  App.start({
    css: style,
    requestHandler(req, res) {
      request(req, res);
    },
    main() {
      windows.map((win) => App.get_monitors().map(win));

      windowAnimation();
      windowBlur();
    },
  });
}
