import { App, hook } from "astal/gtk4";
import ScreenRecord from "../../../utils/screen-record";
import QSButton from "../QSButton";
import { WINDOW_NAME } from "../QSWindow";
import { bind } from "astal";
import { timeout } from "astal";

export default function RecordQS() {
  const screenRecord = ScreenRecord.get_default();

  return (
    <QSButton
      setup={(self) => {
        hook(self, screenRecord, "notify::recording", () => {
          if (screenRecord.recording) {
            self.add_css_class("active");
          } else {
            self.remove_css_class("active");
          }
        });
      }}
      onClicked={() => {
        if (screenRecord.recording) {
          screenRecord.stop();
        } else {
          App.toggle_window(WINDOW_NAME);
          timeout(200, () => {
            screenRecord.start();
          });
        }
      }}
      iconName={"screencast-recorded-symbolic"}
      label={"Screen Record"}
      status={bind(screenRecord, "recording").as((r) =>
        r ? "Recording" : "Off",
      )}
    />
  );
}
