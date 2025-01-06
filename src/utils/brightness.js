import GObject, { register } from "astal/gobject";
import { monitorFile, readFileAsync } from "astal/file";
import { exec, execAsync } from "astal/process";

const get = (args) => Number(exec(`brightnessctl ${args}`));
const screen = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`);
const kbd = exec(`bash -c "ls -w1 /sys/class/leds | head -1"`);

// I know there's a property decorator but I can't get it to work
@register({
  GTypeName: "Brightness",
  Properties: {
    screen: GObject.ParamSpec.int(
      "screen",
      "Screen brightness value",
      "Read and write number property",
      GObject.ParamFlags.READWRITE,
      0,
      1,
      get("get") / (get("max") || 1),
    ),
    kbd: GObject.ParamSpec.int(
      "kbd",
      "Kbd brightness value",
      "Read and write number property",
      GObject.ParamFlags.READWRITE,
      0,
      get(`--device ${kbd} max`),
      get(`--device ${kbd} get`),
    ),
  },
})
export default class Brightness extends GObject.Object {
  static instance;

  static get_default() {
    if (!this.instance) this.instance = new Brightness();

    return this.instance;
  }

  #kbdMax = get(`--device ${kbd} max`);
  #screenMax = get("max");

  get kbd() {
    return this._kbd;
  }

  set kbd(value) {
    if (value < 0 || value > this.#kbdMax) return;

    execAsync(`brightnessctl -d ${kbd} s ${value} -q`).then(() => {
      this._kbd = value;
      this.notify("kbd");
    });
  }

  get screen() {
    return this._screen;
  }

  set screen(percent) {
    if (percent < 0) percent = 0;

    if (percent > 1) percent = 1;

    execAsync(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(() => {
      this._screen = percent;
      this.notify("screen");
    });
  }

  constructor() {
    super();

    const screenPath = `/sys/class/backlight/${screen}/brightness`;
    const kbdPath = `/sys/class/leds/${kbd}/brightness`;

    monitorFile(screenPath, async (f) => {
      const v = await readFileAsync(f);
      this._screen = Number(v) / this.#screenMax;
      this.notify("screen");
    });

    monitorFile(kbdPath, async (f) => {
      const v = await readFileAsync(f);
      this._kbd = Number(v) / this.#kbdMax;
      this.notify("kbd");
    });
  }
}
