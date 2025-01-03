import { App, Astal, Gtk } from "astal/gtk4";
import { bind } from "astal";
import Divider from "./Divider";
import TimePanelButton from "./TimePanelButton";
import BatteryPanelButton from "./BatteryPanelButton";
import WorkspacesPanelButton from "./WorkspacesPanelButton";
import NetworkSpeedPanelButton from "./NetworkSpeedPanelButton";
import RecordIndicatorPanelButton from "./RecordIndicatorPanelButton";
import ScreenRecord from "../../utils/screen-record";
import LauncherPanelButton from "./LauncherPanelButton";

function Start() {
  return (
    <box halign={Gtk.Align.START}>
      <LauncherPanelButton />
      <Divider />
      <WorkspacesPanelButton />
    </box>
  );
}

function Center() {
  return (
    <box>
      <TimePanelButton />
      <Divider />
      <BatteryPanelButton />
    </box>
  );
}

function End() {
  const screenRecord = ScreenRecord.get_default();

  return (
    <box halign={Gtk.Align.END}>
      <RecordIndicatorPanelButton />
      <Divider visible={bind(screenRecord, "recording")} />
      <NetworkSpeedPanelButton />
    </box>
  );
}

export default function Bar(gdkmonitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      anchor={TOP | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      application={App}
      animation={"slide up"}
    >
      <centerbox cssClasses={["window-content", "bar-container"]}>
        <Start />
        <Center />
        <End />
      </centerbox>
    </window>
  );
}
