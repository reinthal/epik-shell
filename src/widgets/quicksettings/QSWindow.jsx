import PopupWindow from "../common/PopupWindow";
import DarkModeQS from "./buttons/DarkModeQS";
import ColorPickerQS from "./buttons/ColorPickerQS";
import ScreenshotQS from "./buttons/ScreenshotQS";
import DontDisturbQS from "./buttons/DontDisturbQS";
import RecordQS from "./buttons/RecordQS";
import MicQS from "./buttons/MicQS";
import BrightnessBox from "./BrightnessBox";
import { astalify, Gtk } from "astal/gtk4";
import { WINDOW_NAME as POWERMENU_WINDOW } from "../powermenu/PowerMenu";
import { App } from "astal/gtk4";

export const WINDOW_NAME = "quicksettings";

function QSButtons() {
  const maxColumn = 3;
  const Grid = astalify(Gtk.Grid, {
    setChildren(grid, children) {
      grid.set_column_homogeneous(true);
      grid.set_row_homogeneous(true);
      grid.set_column_spacing(6);
      grid.set_row_spacing(6);
      children.forEach((child, index) => {
        grid.attach(
          child,
          index % maxColumn,
          Math.floor(index / maxColumn),
          1,
          1,
        );
      });
    },
  });

  return (
    <Grid>
      <DarkModeQS />
      <ColorPickerQS />
      <ScreenshotQS />
      <MicQS />
      <DontDisturbQS />
      <RecordQS />
    </Grid>
  );
}

function Header() {
  return (
    <box hexpand={false} cssClasses={["header"]}>
      <label label={"Quick Setting"} hexpand xalign={0} />
      <button
        onClicked={() => {
          App.toggle_window(WINDOW_NAME);
          App.toggle_window(POWERMENU_WINDOW);
        }}
      >
        <image iconName={"system-shutdown-symbolic"} />
      </button>
    </box>
  );
}

export default function QSWindow(_gdkmonitor) {
  return (
    <PopupWindow name={WINDOW_NAME} layout="top_right" animation="slide top">
      <box
        cssClasses={["window-content", "qs-container"]}
        hexpand={false}
        vertical
      >
        <Header />
        <Gtk.Separator />
        <QSButtons />
        <BrightnessBox />
      </box>
    </PopupWindow>
  );
}
