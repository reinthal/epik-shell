import { App } from "astal/gtk4";
import windows from "./windows";
import { windowAnimation, windowBlur } from "./utils/hyprland";
import request from "./request";
import { initGtkStyle } from "./utils/style";
import { writeStyleCss } from "./utils/style";
await initGtkStyle();

App.start({
  css: COMPILED_CSS,
  requestHandler(req, res) {
    request(req, res);
  },
  main() {
    windows.map((win) => App.get_monitors().map(win));

    windowAnimation();
    windowBlur();
  },
});
