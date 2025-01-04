import AstalWp from "gi://AstalWp?version=0.1";
import PopupWindow from "../common/PopupWindow";
import { bind } from "astal";

export const WINDOW_NAME = "audio";
export default function AudioWindow(_gdkmonitor) {
  const speaker = AstalWp.get_default()?.audio.default_speaker;

  return (
    <PopupWindow name={WINDOW_NAME} animation="slide top" layout={"top_right"}>
      <box
        cssClasses={["window-content", "audio-container"]}
        hexpand={false}
        vertical
      >
        <box cssClasses={["volume-box"]}>
          <image iconName={bind(speaker, "volumeIcon")} />
          <slider
            hexpand
            onChangeValue={(self) => {
              speaker.volume = self.value;
            }}
            value={bind(speaker, "volume")}
          />
        </box>
      </box>
    </PopupWindow>
  );
}
