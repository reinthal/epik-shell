import { Gtk } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import { range } from "../../utils";
import { bind } from "astal";

const hyprland = AstalHyprland.get_default();

function WorkspaceButton({ ws, ...props }) {
  return (
    <button
      cssClasses={bind(hyprland, "focused-workspace").as((fws) => {
        let classes = ["workspace-button"];
        const active = fws.id === ws.id;
        if (active) {
          classes.push("active");
        }

        const occupied =
          hyprland.get_workspace(ws.id)?.get_clients().length > 0;
        if (occupied) {
          classes.push("occupied");
        }

        return classes;
      })}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      onClicked={() => ws.focus()}
      setup={(self) => {
        hyprland.connect("notify::clients", () => {
          if (hyprland.get_workspace(ws.id)?.get_clients().length > 0) {
            self.add_css_class("occupied");
          } else {
            self.remove_css_class("occupied");
          }
        });
      }}
      {...props}
    />
  );
}

export default function WorkspacesPanelButton() {
  return (
    <box cssClasses={["workspace-container"]} spacing={4}>
      {range(6).map((i) => (
        <WorkspaceButton ws={AstalHyprland.Workspace.dummy(i + 1, null)} />
      ))}
    </box>
  );
}
