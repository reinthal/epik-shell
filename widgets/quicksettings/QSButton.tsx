import { Binding } from "astal";
import { Gtk } from "astal/gtk4";
import { ButtonProps, MenuButtonProps } from "astal/gtk4/widget";

type QSMenuButtonProps = MenuButtonProps & {
  child?: unknown;
  iconName: string;
  label: string;
};
export function QSMenuButton({
  child,
  iconName,
  label,
  setup,
  cssClasses,
}: QSMenuButtonProps) {
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

type QSButtonProps = ButtonProps & {
  iconName: string | Binding<string>;
  label: string | Binding<string>;
};
export default function QSButton({
  iconName,
  label,
  setup,
  onClicked,
  cssClasses,
}: QSButtonProps) {
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
