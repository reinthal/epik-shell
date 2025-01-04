import { App } from "astal/gtk4";
import ScreenRecord from "../../../utils/screen-record";
import { QSMenuButton } from "../QSButton";
import { WINDOW_NAME } from "../QSWindow";

export default function ScreenshotQS() {
  const screenRecord = ScreenRecord.get_default();

  return (
    <QSMenuButton label={"Screenshot"} iconName={"gnome-screenshot-symbolic"}>
      <popover has_arrow={false}>
        <box vertical>
          <button
            onClicked={() => {
              App.toggle_window(WINDOW_NAME);
              screenRecord.screenshot(true);
            }}
            label={"Full"}
          />
          <button
            onClicked={() => {
              App.toggle_window(WINDOW_NAME);
              screenRecord.screenshot();
            }}
            label={"Partial"}
          />
        </box>
      </popover>
    </QSMenuButton>
  );
}
