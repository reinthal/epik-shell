import { Gtk } from "astal/gtk4";

export function QSMenuButton({
  child,
  iconName,
  label,
  setup,
  status,
  cssClasses,
}) {
  return (
    <menubutton
      setup={setup}
      cssClasses={cssClasses ?? ["qs-button"]}
      tooltipText={label}
    >
      <image halign={Gtk.Align.CENTER} iconName={iconName} />
      {child}
    </menubutton>
  );
}
export default function QSButton({
  iconName,
  label,
  setup,
  status,
  onClicked,
  cssClasses,
}) {
  return (
    <button
      setup={setup}
      cssClasses={cssClasses ?? ["qs-button"]}
      onClicked={onClicked}
      tooltipText={label}
    >
      <image iconName={iconName} halign={Gtk.Align.CENTER} />
    </button>
  );
}
