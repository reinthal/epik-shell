import { bind } from "astal";
import ScreenRecord from "../../utils/screen-record";
import PanelButton from "../common/PanelButton";

const screenRecord = ScreenRecord.get_default();

export default function RecordIndicatorPanelButton() {
  return (
    <PanelButton
      visible={bind(screenRecord, "recording")}
      onClicked={() => screenRecord.stop().catch(() => "")}
    >
      <box>
        <image iconName={"media-record-symbolic"} />
        <label
          cssClasses={["timer"]}
          label={bind(screenRecord, "timer").as((time) => {
            const sec = time % 60;
            const min = Math.floor(time / 60);
            return `${min}:${sec < 10 ? "0" + sec : sec}`;
          })}
        />
      </box>
    </PanelButton>
  );
}
