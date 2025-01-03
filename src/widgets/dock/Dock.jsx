import { Variable } from "astal";
import { App, Astal } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import DockApps from "./DockApps";
import { exec } from "astal";

const hyprland = AstalHyprland.get_default();

const updateVisibility = () => {
  return (
    hyprland.get_workspace(hyprland.get_focused_workspace().id)?.get_clients()
      .length <= 0
  );
};

export const dockVisible = Variable(updateVisibility())
  .observe(hyprland, "notify::clients", () => {
    return updateVisibility();
  })
  .observe(hyprland, "notify::focused-workspace", () => {
    return updateVisibility();
  });

// transparent window to detect hover
export function DockHover(_gdkmonitor) {
  const dock = App.get_window("dock");
  const size = dock.get_child().get_preferred_size()[0];
  const width = size.width;
  const height = parseInt(
    exec("hyprctl getoption general:gaps_out")
      .split("\n")[0]
      .split("custom type:")[1]
      .split(" ")[2],
  );

  App.apply_css(`.dock-padding {
		min-width: ${width}px;
		min-height: ${height}px;
		color: transparent;
	}`);

  return (
    <window
      widthRequest={width}
      heightRequest={height}
      visible={dockVisible((v) => !v)}
      name={"dock-hover"}
      setup={(self) => {
        App.connect("window-toggled", (_, win) => {
          if (win.name == "dock" && win.visible) {
            self.visible = false;
          }
        });
      }}
      anchor={Astal.WindowAnchor.BOTTOM}
      application={App}
      onHoverEnter={() => {
        App.get_window("dock").set_visible(true);
      }}
    >
      <box cssClasses={["dock-padding"]}>
        {/* I dont know why window/box not visible when there's no child/background-color */}
        {/* So I give this child and set it to transparent so I can detect hover */}
        <label label={"Placeholder"} />
      </box>
    </window>
  );
}

export default function Dock(_gdkmonitor) {
  return (
    <window
      visible={dockVisible()}
      name={"dock"}
      namespace={"dock"}
      animation="slide up"
      anchor={Astal.WindowAnchor.BOTTOM}
      setup={(self) => {
        App.connect("window-toggled", (_, win) => {
          if (win.name == "dock-hover" && win.visible) {
            self.visible = false;
          }
        });
      }}
      onHoverLeave={() => {
        if (!updateVisibility()) {
          App.get_window("dock-hover").set_visible(true);
        }
      }}
      application={App}
    >
      <DockApps />
    </window>
  );
}
