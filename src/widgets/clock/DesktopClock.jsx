import { App, Astal, Gtk } from "astal/gtk4";
import { range, time } from "../../utils";

function Number({ shown }) {
  return (
    <box
      cssClasses={["number-box"]}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
    >
      <stack
        visibleChildName={shown}
        transitionType={Gtk.StackTransitionType.SLIDE_UP}
        transitionDuration={1000}
      >
        {range(9).map((v) => (
          <label name={v.toString()} label={v.toString()} />
        ))}
      </stack>
    </box>
  );
}

function UnitBox({ label, shown1, shown2 }) {
  return (
    <box vertical>
      <box halign={Gtk.Align.CENTER} hexpand>
        <Number shown={shown1} />
        <Number shown={shown2} />
      </box>
      <label cssClasses={["box-label"]} label={label} />
    </box>
  );
}

export default function DesktopClock(_gdkmonitor) {
  const { TOP, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      layer={Astal.Layer.BOTTOM}
      name={"clock"}
      namespace={"clock"}
      anchor={TOP | RIGHT}
      application={App}
      animation={"popin 80%"}
    >
      <box cssClasses={["clock-container"]} spacing={6}>
        <UnitBox
          label={"Hours"}
          shown1={time((t) => t.format("%H").split("")[0])}
          shown2={time((t) => t.format("%H").split("")[1])}
        />
        <label label={":"} />
        <UnitBox
          label={"Minutes"}
          shown1={time((t) => t.format("%M").split("")[0])}
          shown2={time((t) => t.format("%M").split("")[1])}
        />
        <label label={":"} />
        <UnitBox
          label={"Seconds"}
          shown1={time((t) => t.format("%S").split("")[0])}
          shown2={time((t) => t.format("%S").split("")[1])}
        />
      </box>
    </window>
  );
}
