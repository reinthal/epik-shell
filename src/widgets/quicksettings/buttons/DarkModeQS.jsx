import { themeMode } from "../../../utils/style";
import QSButton from "../QSButton";

export default function DarkModeQS({ ...props }) {
  return (
    <QSButton
      setup={(self) => {
        themeMode.subscribe((val) => {
          if (!val) {
            self.add_css_class("active");
          } else {
            self.remove_css_class("active");
          }
        });
      }}
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
