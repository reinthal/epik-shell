import { App } from "astal/gtk4";
import windows from "./windows";
import { windowAnimation } from "./utils/hyprland";
import request from "./request";

App.start({
  css: COMPILED_CSS,
  requestHandler(req, res) {
    request(req, res);
  },
  main() {
    windows.map((win) => App.get_monitors().map(win));

    windowAnimation();
  },
});
