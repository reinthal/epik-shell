import { App, Astal, Gtk } from "astal/gtk4";
import { bind } from "astal";
import TimePanelButton from "./TimePanelButton";
import BatteryPanelButton from "./BatteryPanelButton";
import WorkspacesPanelButton from "./WorkspacesPanelButton";
import NetworkSpeedPanelButton from "./NetworkSpeedPanelButton";
import RecordIndicatorPanelButton from "./RecordIndicatorPanelButton";
import ScreenRecord from "../../utils/screen-record";
import LauncherPanelButton from "./LauncherPanelButton";
import NotifPanelButton from "./NotifPanelButton";
import QSPanelButton from "./QSPanelButton";
import AudioPanelButton from "./AudioPanelButton";
import NetworkPanelButton from "./NetworkPanelButton";

function Start() {
  const screenRecord = ScreenRecord.get_default();

  return (
    <box halign={Gtk.Align.START}>
      <LauncherPanelButton />
      <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
      <WorkspacesPanelButton />
      <Gtk.Separator
        orientation={Gtk.Orientation.VERTICAL}
        visible={bind(screenRecord, "recording")}
      />
      <RecordIndicatorPanelButton />
    </box>
  );
}

function Center() {
  return (
    <box>
      <TimePanelButton />
      <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
      <NotifPanelButton />
    </box>
  );
}

function End() {
  return (
    <box halign={Gtk.Align.END}>
      <NetworkSpeedPanelButton />
      <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
      <NetworkPanelButton />
      <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
      <BatteryPanelButton />
      <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
      <AudioPanelButton />
      <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
      <QSPanelButton />
    </box>
  );
}

export default function Bar(gdkmonitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      name={"bar"}
      namespace={"bar"}
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
