import AstalWp from "gi://AstalWp?version=0.1";
import PanelButton from "../common/PanelButton";
import { bind } from "astal";
import { WINDOW_NAME } from "../audio/AudioWindow";
import { App } from "astal/gtk4";

export default function AudioPanelButton() {
  const audio = AstalWp.get_default()?.audio.default_speaker;
  return (
    <PanelButton
      window={WINDOW_NAME}
      onClicked={() => App.toggle_window(WINDOW_NAME)}
    >
      <box spacing={4}>
        <image iconName={bind(audio, "volume-icon")} />
        <label
          label={bind(audio, "volume").as((p) => `${Math.floor(p * 100)}%`)}
        />
      </box>
    </PanelButton>
  );
}
