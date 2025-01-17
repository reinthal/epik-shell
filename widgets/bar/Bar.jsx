import { App, Astal, Gtk } from "astal/gtk4";
import TimePanelButton from "./TimePanelButton";
import WorkspacesPanelButton from "./WorkspacesPanelButton";
import NetworkSpeedPanelButton from "./NetworkSpeedPanelButton";
import RecordIndicatorPanelButton from "./RecordIndicatorPanelButton";
import LauncherPanelButton from "./LauncherPanelButton";
import NotifPanelButton from "./NotifPanelButton";
import QSPanelButton from "./QSPanelButton";
import { separatorBetween } from "../../utils";
import options from "../../options";
import { idle } from "astal";
import { windowAnimation } from "../../utils/hyprland";

const { bar } = options;
const { start, center, end } = bar;

const panelButton = {
  launcher: () => <LauncherPanelButton />,
  workspace: () => <WorkspacesPanelButton />,
  time: () => <TimePanelButton />,
  notification: () => <NotifPanelButton />,
  network_speed: () => <NetworkSpeedPanelButton />,
  quicksetting: () => <QSPanelButton />,
};

function Start() {
  return (
    <box halign={Gtk.Align.START}>
      {start((s) => [
        ...separatorBetween(
          s.map((s) => panelButton[s]()),
          Gtk.Orientation.VERTICAL,
        ),
        <RecordIndicatorPanelButton />,
      ])}
    </box>
  );
}

function Center() {
  return (
    <box>
      {center((c) =>
        separatorBetween(
          c.map((w) => panelButton[w]()),
          Gtk.Orientation.VERTICAL,
        ),
      )}
    </box>
  );
}

function End() {
  return (
    <box halign={Gtk.Align.END}>
      {end((e) =>
        separatorBetween(
          e.map((w) => panelButton[w]()),
          Gtk.Orientation.VERTICAL,
        ),
      )}
    </box>
  );
}

function Bar(gdkmonitor) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;
  const anc = bar.position.get() == "top" ? TOP : BOTTOM;

  return (
    <window
      visible
      name={"bar"}
      namespace={"bar"}
      gdkmonitor={gdkmonitor}
      anchor={anc | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      application={App}
      animation={`slide top`}
      // https://github.com/wmww/gtk4-layer-shell/issues/60
      defaultHeight={-1}
      defaultWidth={8000}
    >
      <centerbox cssClasses={["bar-container"]}>
        <Start />
        <Center />
        <End />
      </centerbox>
    </window>
  );
}

export default function (gdkmonitor) {
  Bar(gdkmonitor);

  bar.position.subscribe(() => {
    App.toggle_window("bar");
    App.remove_window(App.get_window("bar"));
    idle(() => {
      Bar(gdkmonitor);
      windowAnimation();
    });
  });
}
