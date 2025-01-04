import { Gio, GLib } from "astal";
import theme from "../theme.json";
import { writeFileAsync } from "astal";
import { Variable } from "astal";

const settings = new Gio.Settings({
  schema: "org.gnome.desktop.interface",
});

export const themeMode = Variable(
  settings.get_string("color-scheme") == "prefer-light",
);

async function writeCss(themeMode) {
  const dir = GLib.get_home_dir() + "/.themes/colors.css";
  const mode = themeMode ? "default" : "dark";
  let colors = theme[mode];
  colors = undefined == colors ? theme["default"] : colors;
  const gtk = {
    window_bg_color: colors.background,
    view_fg_color: colors.foreground,
    view_bg_color: colors.background,
    sidebar_bg_color: colors.background,
    headerbar_bg_color: colors.background,
    popover_bg_color: colors.background,
  };
  const content = [];
  Object.entries(gtk).forEach(([key, value]) => {
    content.push(`@define-color ${key} ${value};`);
  });

  await writeFileAsync(dir, content.join("\n"));
}

export async function initGtkStyle() {
  themeMode.subscribe(async (isLight) => {
    await writeCss(isLight).then(() => {
      settings.set_string(
        "color-scheme",
        isLight ? "prefer-light" : "prefer-dark",
      );
      settings.set_string("gtk-theme", `adw-gtk3${isLight ? "" : "-dark"}`);
    });
  });

  await writeCss(themeMode.get()).then(() => {
    settings.set_string(
      "gtk-theme",
      `adw-gtk3${themeMode.get() ? "" : "-dark"}`,
    );
  });
}
