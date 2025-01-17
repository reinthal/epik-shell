import { App } from "astal/gtk4";
import PanelButton from "../common/PanelButton";
import { WINDOW_NAME } from "../quicksettings/QSWindow";
import AstalBattery from "gi://AstalBattery?version=0.1";
import AstalWp from "gi://AstalWp?version=0.1";
import { bind } from "astal";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";

export default function QSPanelButton() {
  const battery = AstalBattery.get_default();
  const speaker = AstalWp.get_default()?.audio.default_speaker;
  const wp = AstalWp.get_default();
  const powerprofile = AstalPowerProfiles.get_default();

  return (
    <PanelButton
      window={WINDOW_NAME}
      onClicked={() => {
        App.toggle_window(WINDOW_NAME);
      }}
    >
      <box spacing={2}>
        <image iconName={bind(battery, "battery-icon-name")} />
        <image iconName={bind(speaker, "volumeIcon")} />
        <image
          marginStart={2}
          visible={bind(powerprofile, "activeProfile").as(
            (p) => p === "power-saver",
          )}
          iconName={`power-profile-power-saver-symbolic`}
        />
        <image
          marginStart={2}
          visible={bind(wp.default_microphone, "mute")}
          iconName="microphone-disabled-symbolic"
        />
      </box>
    </PanelButton>
  );
}
