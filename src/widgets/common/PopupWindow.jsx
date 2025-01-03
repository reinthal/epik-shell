import { App, Astal, Gdk } from "astal/gtk4";

function Padding({ winName, vertical, horizontal }) {
  return (
    <box
      onButtonReleased={(_, event) => {
        if (event.get_button() == Gdk.BUTTON_PRIMARY) {
          App.toggle_window(winName);
        }
      }}
      vexpand={vertical ?? false}
      hexpand={horizontal ?? false}
    />
  );
}

function Layout({ child, name, position }) {
  switch (position) {
    case "top_center":
      return (
        <box>
          <Padding winName={name} horizontal />
          <box vertical>
            {child}
            <Padding winName={name} vertical />
          </box>
          <Padding winName={name} horizontal />
        </box>
      );
    case "top_right":
      return (
        <box>
          <Padding winName={name} horizontal />
          <box vertical>
            {child}
            <Padding winName={name} vertical />
          </box>
        </box>
      );
    default:
      return (
        <box>
          <Padding winName={name} horizontal vertical />
          <box vertical>
            <Padding winName={name} vertical />
            {child}
            <Padding winName={name} vertical />
          </box>
          <Padding winName={name} horizontal vertical />
        </box>
      );
  }
}

export default function PopupWindow({
  child,
  name,
  animation = "popin 80%",
  layout,
  ...props
}) {
  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor;
  return (
    <window
      name={name}
      namespace={name}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.EXCLUSIVE}
      application={App}
      anchor={TOP | BOTTOM | RIGHT | LEFT}
      onKeyPressed={(_, keyval) => {
        if (keyval === Gdk.KEY_Escape) {
          App.toggle_window(name);
        }
      }}
      animation={animation}
      {...props}
    >
      <Layout name={name} position={layout}>
        {child}
      </Layout>
    </window>
  );
}
