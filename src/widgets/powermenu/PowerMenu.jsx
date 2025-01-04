import { Astal } from "astal/gtk4";
import Powermenu from "../../utils/powermenu";
import PopupWindow from "../common/PopupWindow";

const powermenu = Powermenu.get_default();
export const WINDOW_NAME = "powermenu";

const icons = {
  sleep: "weather-clear-night-symbolic",
  reboot: "system-reboot-symbolic",
  logout: "system-log-out-symbolic",
  shutdown: "system-shutdown-symbolic",
};

function SysButton({ action, label }) {
  return (
    <button
      cssClasses={["system-button"]}
      onClicked={() => powermenu.action(action)}
    >
      <box vertical spacing={6}>
        <image iconName={icons[action]} />
        <label label={label} />
      </box>
    </button>
  );
}

export default function PowerMenu(_gdkmonitor) {
  return (
    <PopupWindow name={WINDOW_NAME} exclusivity={Astal.Exclusivity.IGNORE}>
      <box
        cssClasses={["window-content", "powermenu-container"]}
        hexpand={false}
        spacing={6}
        homogeneous
      >
        <SysButton action={"sleep"} label={"Sleep"} />
        <SysButton action={"logout"} label={"Log Out"} />
        <SysButton action={"reboot"} label={"Reboot"} />
        <SysButton action={"shutdown"} label={"Shutdown"} />
      </box>
    </PopupWindow>
  );
}
