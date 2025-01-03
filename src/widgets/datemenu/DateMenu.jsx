import { Gtk } from "astal/gtk4";
import PopupWindow from "../common/PopupWindow";

export const WINDOW_NAME = "datemenu-window";

export default function DateMenu(_gdkmonitor) {
  return (
    <PopupWindow name={WINDOW_NAME} animation="slide top" layout="top_center">
      <box vertical cssClasses={["window-content", "datemenu-container"]}>
        <Gtk.Calendar />
      </box>
    </PopupWindow>
  );
}
