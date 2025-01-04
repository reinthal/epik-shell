import { App, Astal, Gdk, Gtk } from "astal/gtk4";

function Padding({ winName }) {
  return (
    <box
      onButtonReleased={(_, event) => {
        if (event.get_button() == Gdk.BUTTON_PRIMARY) {
          App.toggle_window(winName);
        }
      }}
      vexpand
      hexpand
    />
  );
}

function Layout({ child, name, position }) {
  switch (position) {
    case "top_center":
      return (
        <box>
          <Padding winName={name} />
          <box vertical hexpand={false}>
            {child}
            <Padding winName={name} />
          </box>
          <Padding winName={name} />
        </box>
      );
    case "top_right":
      return (
        <box>
          <Padding winName={name} />
          <box vertical hexpand={false}>
            {child}
            <Padding winName={name} />
          </box>
        </box>
      );
    //default to center
    default:
      return (
        <centerbox>
          <Padding winName={name} />
          <centerbox orientation={Gtk.Orientation.VERTICAL}>
            <Padding winName={name} />
            {child}
            <Padding winName={name} />
          </centerbox>
          <Padding winName={name} />
        </centerbox>
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
