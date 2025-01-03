import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import AstalApps from "gi://AstalApps?version=0.1";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

const hyprland = AstalHyprland.get_default();
const application = new AstalApps.Apps();

function AppButton({ app, onClicked, term, pinned = false, client }) {
  const substitute = {
    Alacritty: "terminal",
    localsend: "send-to",
  };

  const iconName = substitute[app.iconName] ?? app.iconName;

  return (
    <overlay
      cssClasses={bind(hyprland, "focused-client").as((fcsClient) => {
        const classes = [];
        if (term == "" || !fcsClient) return [];

        if (!pinned) {
          if (client.address === fcsClient.address) {
            classes.push("focused");
          }
          return classes;
        }

        if (fcsClient.class.toLowerCase().includes(term.toLowerCase())) {
          classes.push("focused");
        }

        return classes;
      })}
      setup={(self) => {
        self.add_overlay(
          <box
            cssClasses={["indicator"]}
            valign={Gtk.Align.END}
            halign={Gtk.Align.CENTER}
            visible={
              pinned &&
              bind(hyprland, "clients").as((clients) => {
                return clients
                  .map((e) => e.class.toLowerCase())
                  .includes(term.toLowerCase());
              })
            }
          />,
        );
      }}
    >
      <button onClicked={onClicked} cssClasses={["app-button"]}>
        <image
          iconName={`${iconName}-symbolic`}
          iconSize={Gtk.IconSize.LARGE}
        />
      </button>
    </overlay>
  );
}

function AppsList() {
  const pinnedApps = [
    "firefox",
    "Alacritty",
    "org.gnome.Nautilus",
    "localsend",
  ];

  const filterResult = pinnedApps
    .map((term) => ({
      app: application.list.find((e) => e.entry.split(".desktop")[0] == term),
      term,
    }))
    .filter((app) => app);

  return (
    <box spacing={6}>
      {filterResult.map(({ app, term }) => (
        <AppButton
          app={app}
          term={term}
          pinned={true}
          onClicked={() => {
            for (const client of hyprland.get_clients()) {
              if (client.class.toLowerCase().includes(term.toLowerCase()))
                return client.focus();
            }

            app.launch();
          }}
        />
      ))}
      {bind(hyprland, "clients").as((clients) =>
        clients
          .map((client) => {
            for (const appClass of pinnedApps) {
              if (client.class.toLowerCase().includes(appClass.toLowerCase())) {
                return;
              }
            }

            for (const app of application.list) {
              if (
                client.class &&
                app.entry
                  .split(".desktop")[0]
                  .toLowerCase()
                  .match(client.class.toLowerCase())
              ) {
                return (
                  <AppButton
                    app={app}
                    onClicked={() => client.focus()}
                    term={client.class}
                    client={client}
                  />
                );
              }
            }
          })
          .filter((item) => item !== undefined)
          .reverse(),
      )}
    </box>
  );
}

export default function DockApps() {
  return (
    <box cssClasses={["window-content", "dock-container"]}>
      <AppsList />
      <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
      <AppButton
        app={{ iconName: "trash-shot" }}
        onClicked={"nautilus trash:///"}
        term={""}
      />
    </box>
  );
}
