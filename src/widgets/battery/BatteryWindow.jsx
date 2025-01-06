import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import PopupWindow from "../common/PopupWindow";
import AstalBattery from "gi://AstalBattery?version=0.1";
import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import { notifySend } from "../../utils";

export const WINDOW_NAME = "battery";

export default function BatteryWindow(_gdkmonitor) {
  const powerprofiles = AstalPowerProfiles.get_default();
  const battery = AstalBattery.get_default();

  //Maybe I shouldn't write it here
  battery.connect("notify::warning-level", () => {
    switch (battery.warningLevel) {
      case AstalBattery.WarningLevel.LOW:
        notifySend({
          app_name: "Battery",
          urgency: "critical",
          app_icon: "battery-symbolic",
          icon: "battery-caution-symbolic",
          summary: "Power Running Low",
          body: "Your battery is running low on power",
        });
        break;
      case AstalBattery.WarningLevel.CRITICIAL:
        notifySend({
          app_name: "Battery",
          app_icon: "battery-symbolic",
          urgency: "critical",
          icon: "battery-caution-symbolic",
          summary: "Critial Power Warning",
          body: "Battery is almost empty. Your device may shut down soon",
        });
        break;
    }
  });
  return (
    <PopupWindow name={WINDOW_NAME} animation="slide top" layout={"top_right"}>
      <box
        hexpand={false}
        cssClasses={["window-content", "battery-container"]}
        vertical
        spacing={6}
      >
        <overlay>
          <levelbar
            hexpand
            value={bind(battery, "percentage")}
            visible={bind(battery, "is-present")}
          />
          <label
            type="overlay clip"
            halign={Gtk.Align.START}
            label={bind(battery, "percentage").as(
              (p) => `${Math.floor(p * 100)}%`,
            )}
          />
        </overlay>
        <label label={"Power Profile"} halign={Gtk.Align.START} />
        <box homogeneous cssClasses={["power-profiles"]} spacing={6}>
          {bind(powerprofiles, "profiles").as((profiles) =>
            profiles.map((p) => {
              return (
                <button
                  iconName={`power-profile-${p.profile}-symbolic`}
                  cssClasses={bind(powerprofiles, "active-profile").as(
                    (active) => {
                      if (active === p.profile) {
                        return ["active"];
                      }
                      return [];
                    },
                  )}
                  tooltipText={p.profile.toUpperCase()}
                  onClicked={() => {
                    powerprofiles.set_active_profile(p.profile);
                  }}
                />
              );
            }),
          )}
        </box>
      </box>
    </PopupWindow>
  );
}
