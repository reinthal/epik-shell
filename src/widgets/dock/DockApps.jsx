import { timeout } from "astal";
import { bind } from "astal";
import { App, Gtk } from "astal/gtk4";
import AstalApps from "gi://AstalApps?version=0.1";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import AstalMpris from "gi://AstalMpris?version=0.1";
import Pango from "gi://Pango?version=1.0";

const hyprland = AstalHyprland.get_default();
const application = new AstalApps.Apps();

function AppButton({ app, onClicked, term, pinned = false, client }) {
  const substitute = {
    Alacritty: "terminal",
    localsend: "send-to",
    "spotify-client": "org.gnome.Lollypop-spotify-symbolic",
  };

  const iconName = substitute[app.iconName] ?? app.iconName;

  return (
    <button
      onClicked={onClicked}
      cssClasses={bind(hyprland, "focused-client").as((fcsClient) => {
        const classes = ["app-button"];
        if (term == "" || fcsClient == null) return classes;

        if (!pinned) {
          if (client.address == fcsClient.address) {
            classes.push("focused");
          }
          return classes;
        }

        if (fcsClient?.class.toLowerCase().includes(term.toLowerCase())) {
          classes.push("focused");
        }

        return classes;
      })}
    >
      <overlay>
        <box cssClasses={["box"]} />
        <image
          type="overlay"
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.END}
          iconName={`${iconName}-symbolic`}
          iconSize={Gtk.IconSize.LARGE}
        />
        <box
          type="overlay"
          cssClasses={["indicator"]}
          valign={Gtk.Align.END}
          halign={Gtk.Align.CENTER}
          visible={bind(hyprland, "clients").as((clients) => {
            return clients
              .map((e) => e.class.toLowerCase())
              .includes(term.toLowerCase());
          })}
        />
      </overlay>
    </button>
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
              if (client.class.toLowerCase().includes(term.toLowerCase())) {
                timeout(1, () => {
                  App.get_window("dock-hover").set_visible(true);
                });
                return client.focus();
              }
            }

            app.launch();
          }}
        />
      ))}
      {bind(hyprland, "clients").as((clients) =>
        clients
          .reverse()
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
                    onClicked={() => {
                      timeout(1, () => {
                        App.get_window("dock-hover").set_visible(true);
                      });
                      client.focus();
                    }}
                    term={client.class}
                    client={client}
                  />
                );
              }
            }
          })
          .filter((item) => item !== undefined),
      )}
    </box>
  );
}

function MediaPlayer({ player }) {
  if (!player) {
    return <box />;
  }
  const title = bind(player, "title").as((t) => t || "Unknown Track");
  const artist = bind(player, "artist").as((a) => a || "Unknown Artist");
  const coverArt = bind(player, "coverArt");

  const playIcon = bind(player, "playbackStatus").as((s) =>
    s === AstalMpris.PlaybackStatus.PLAYING
      ? "media-playback-pause-symbolic"
      : "media-playback-start-symbolic",
  );

  return (
    <box cssClasses={["media-player"]} hexpand>
      <image
        overflow={Gtk.Overflow.HIDDEN}
        pixelSize={35}
        cssClasses={["cover"]}
        file={coverArt}
      />
      <box vertical hexpand>
        <label
          ellipsize={Pango.EllipsizeMode.END}
          halign={Gtk.Align.START}
          label={title}
          maxWidthChars={15}
        />
        <label halign={Gtk.Align.START} label={artist} />
      </box>
      <button
        halign={Gtk.Align.END}
        valign={Gtk.Align.CENTER}
        onClicked={() => player.play_pause()}
        visible={bind(player, "canControl")}
      >
        <image iconName={playIcon} pixelSize={18} />
      </button>
      <button
        halign={Gtk.Align.END}
        valign={Gtk.Align.CENTER}
        onClicked={() => player.next()}
        visible={bind(player, "canGoNext")}
      >
        <image iconName="media-skip-forward-symbolic" pixelSize={24} />
      </button>
    </box>
  );
}

export default function DockApps() {
  const mpris = AstalMpris.get_default();
  return (
    <box cssClasses={["window-content", "dock-container"]} hexpand={false}>
      <AppsList />
      {bind(mpris, "players").as((players) => (
        <MediaPlayer player={players[0]} />
      ))}
      <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
      <AppButton
        app={{ iconName: "trash-shot" }}
        onClicked={"nautilus trash:///"}
        term={""}
      />
    </box>
  );
}
