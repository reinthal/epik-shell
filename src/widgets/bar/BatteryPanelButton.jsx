import AstalBattery from "gi://AstalBattery?version=0.1";
import PanelButton from "../common/PanelButton";
import { Gtk } from "astal/gtk4";
import { bind } from "astal";

export default function BatteryPanelButton() {
  const battery = AstalBattery.get_default();

  return (
    <PanelButton>
      <box
        visible={bind(battery, "is-present")}
        cssClasses={["battery"]}
        valign={Gtk.Align.CENTER}
      >
        <image
          iconName={bind(battery, "battery-icon-name")}
          cssClasses={["icon"]}
        />
        <label
          label={bind(battery, "percentage").as(
            (p) => `${Math.floor(p * 100)}%`,
          )}
        />
      </box>
    </PanelButton>
  );
}
