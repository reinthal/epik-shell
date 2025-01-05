import GObject, { register, GLib, property } from "astal/gobject";
import { bash, ensureDirectory, notifySend, now, sh } from ".";
import { interval } from "astal";

const HOME = GLib.get_home_dir();

@register({
  GTypeName: "Screenrecord",
  Properties: {
    recording: GObject.ParamSpec.boolean(
      "recording",
      "Record Indicator",
      "Read only boolean property",
      GObject.ParamFlags.READABLE,
    ),
    timer: GObject.ParamSpec.int(
      "timer",
      "Record Timer",
      "Read only number property",
      GObject.ParamFlags.READABLE,
    ),
  },
})
export default class ScreenRecord extends GObject.Object {
  static instance;

  static get_default() {
    if (!this.instance) this.instance = new ScreenRecord();
    return this.instance;
  }

  #recordings = `${HOME}/Videos/Screencasting`;
  #screenshots = `${HOME}/Pictures/Screenshots`;
  #file = "";
  #interval = "";

  get recording() {
    return this._recording;
  }

  get timer() {
    return this._timer;
  }

  async start() {
    if (this._recording) return;

    ensureDirectory(this.#recordings);
    this.#file = `${this.#recordings}/${now()}.mp4`;
    sh(
      `wf-recorder -g "${await sh("slurp")}" -f ${this.#file} --pixel-format yuv420p`,
    );

    this._recording = true;
    this.notify("recording");

    this._timer = 0;
    this.#interval = interval(1000, () => {
      this.notify("timer");
      this._timer++;
    });
  }

  async stop() {
    if (!this._recording) return;

    await bash("killall -INT wf-recorder");
    this._recording = false;
    this.notify("recording");
    this.#interval.cancel();

    notifySend({
      icon: "folder-videos-symbolic",
      app_name: "Screen Recorder",
      summary: "Screen recording saved",
      body: `Available in ${this.#recordings}`,
      actions: {
        "Show in Files": () => sh(`xdg-open ${this.#recordings}`),
        View: () => sh(`xdg-open ${this.#file}`),
      },
    });
  }

  async screenshot(full = false) {
    const file = `${this.#screenshots}/${now()}.png`;

    ensureDirectory(this.#screenshots);
    if (full) {
      await sh(`wayshot -f ${file}`);
    } else {
      const size = await sh("slurp -b#00000066 -w 0");
      if (!size) return;

      await sh(`wayshot -f ${file} -s "${size}"`);
    }

    bash(`wl-copy < ${file}`);

    notifySend({
      image: file,
      app_name: "Screenshot",
      summary: "Screenshot saved",
      body: `Available in ${this.#screenshots}`,
      actions: {
        "Show in Files": () => sh(`xdg-open ${this.#screenshots}`),
        View: () => sh(`xdg-open ${file}`),
        Edit: () => sh(`swappy -f ${file}`),
      },
    });
  }
}
