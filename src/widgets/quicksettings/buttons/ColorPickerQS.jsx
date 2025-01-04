import { execAsync } from "astal";
import { App } from "astal/gtk4";
import { notifySend } from "../../../utils";
import { WINDOW_NAME } from "../QSWindow";
import QSButton from "../QSButton";
import { timeout } from "astal";

export default function ColorPickerQS({ ...props }) {
  return (
    <QSButton
      onClicked={() => {
        const wlCopy = (color) =>
          execAsync(["wl-copy", color]).catch(console.error);

        App.toggle_window(WINDOW_NAME);
        timeout(200, () => {
          execAsync("hyprpicker")
            .then((color) => {
              if (!color) return;

              wlCopy(color);
              notifySend({
                app_name: "Hyprpicker",
                summary: "Color Picker",
                body: `${color} copied to clipboard`,
              });
            })
            .catch(console.error);
        });
      }}
      iconName={"color-select-symbolic"}
      label={"Color Picker"}
      {...props}
    />
  );
}
