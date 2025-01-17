import GObject, { register } from "astal/gobject";
import { App } from "astal/gtk4";

const options = {
  sleep: "systemctl suspend",
  reboot: "systemctl reboot",
  logout: "pkill Hyprland",
  shutdown: "shutdown now",
};

@register({
  GTypeName: "Powermenu",
  Properties: {
    title: GObject.ParamSpec.string(
      "title",
      "Title",
      "Read write",
      GObject.ParamFlags.READWRITE,
      "",
    ),
    cmd: GObject.ParamSpec.string(
      "cmd",
      "cmd",
      "Read write",
      GObject.ParamFlags.READWRITE,
      "",
    ),
  },
})
export default class Powermenu extends GObject.Object {
  static instance;

  static get_default() {
    if (!this.instance) this.instance = new Powermenu();
    return this.instance;
  }

  get title() {
    return this._title;
  }

  get cmd() {
    return this._cmd;
  }

  action(action) {
    [this._cmd, this._title] = {
      sleep: [options.sleep, "Sleep"],
      reboot: [options.reboot, "Reboot"],
      logout: [options.logout, "Log Out"],
      shutdown: [options.shutdown, "Shutdown"],
    }[action];

    this.notify("cmd");
    this.notify("title");
    App.get_window("powermenu").hide();
    App.get_window("verification").show();
  }
}
