import { bind } from "astal";
import Powermenu from "../../utils/powermenu";
import PopupWindow from "../common/PopupWindow";
import { App, Astal, hook } from "astal/gtk4";
import { exec } from "astal";

const WINDOW_NAME = "verification";

export default function VerificationWindow(_gdkmonitor) {
  const powermenu = Powermenu.get_default();
  return (
    <PopupWindow name={WINDOW_NAME} exclusivity={Astal.Exclusivity.IGNORE}>
      <box
        cssClasses={["window-content", "verification-container"]}
        vertical
        spacing={6}
      >
        <label
          label={bind(powermenu, "title").as(String)}
          cssClasses={["title"]}
        />
        <label label={"Are you sure?"} cssClasses={["body"]} />
        <box cssClasses={["buttons"]} homogeneous spacing={6}>
          <button
            label={"No"}
            onClicked={() => App.toggle_window(WINDOW_NAME)}
            setup={(self) => {
              hook(self, App, "window-toggled", (_, win) => {
                if (win.name === WINDOW_NAME && win.visible) self.grab_focus();
              });
            }}
          />
          <button
            label={"Yes"}
            onClicked={() => {
              exec(powermenu.cmd);
              App.toggle_window(WINDOW_NAME);
            }}
          />
        </box>
      </box>
    </PopupWindow>
  );
}
