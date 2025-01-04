import { themeMode } from "../../../utils/style";
import QSButton from "../QSButton";

export default function DarkModeQS({ ...props }) {
  return (
    <QSButton
      cssClasses={themeMode().as((t) => {
        const classes = ["qs-button"];
        !t && classes.push("active");
        return classes;
      })}
      iconName={"dark-mode-symbolic"}
      label={"Dark Mode"}
      status={themeMode((t) => (t ? "Off" : "On"))}
      onClicked={() => {
        themeMode.set(!themeMode.get());
      }}
      {...props}
    />
  );
}
