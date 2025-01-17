import { App, astalify, Gtk, hook } from "astal/gtk4";
import { Variable } from "astal";
import Pango from "gi://Pango?version=1.0";
import AstalApps from "gi://AstalApps?version=0.1";
import PopupWindow from "../common/PopupWindow";
import { Gio } from "astal";
import options from "../../options";

const { wallpaper } = options;
const apps = new AstalApps.Apps();
const text = Variable("");

export const WINDOW_NAME = "applauncher";

function hide() {
  App.get_window(WINDOW_NAME).set_visible(false);
}

function AppButton({ app }) {
  return (
    <button
      cssClasses={["app-button"]}
      onClicked={() => {
        hide();
        app.launch();
      }}
    >
      <box>
        <image iconName={app.iconName} />
        <box valign={Gtk.Align.CENTER} vertical>
          <label
            cssClasses={["name"]}
            ellipsize={Pango.EllipsizeMode.END}
            xalign={0}
            label={app.name}
          />
          {app.description && (
            <label
              cssClasses={["description"]}
              wrap
              xalign={0}
              label={app.description}
            />
          )}
        </box>
      </box>
    </button>
  );
}

function SearchEntry() {
  const onEnter = () => {
    apps.fuzzy_query(text.get())?.[0].launch();
    hide();
  };

  const Picture = astalify(Gtk.Picture);

  return (
    <overlay cssClasses={["entry-overlay"]} heightRequest={100}>
      <Gtk.ScrolledWindow
        visible={wallpaper.current((v) => v != "")}
        heightRequest={100}
      >
        <Picture
          file={wallpaper.current((w) => Gio.file_new_for_path(w))}
          contentFit={Gtk.ContentFit.COVER}
          overflow={Gtk.Overflow.HIDDEN}
        />
      </Gtk.ScrolledWindow>
      <entry
        type="overlay"
        vexpand
        primaryIconName={"system-search-symbolic"}
        placeholderText="Search..."
        text={text.get()}
        setup={(self) => {
          hook(self, App, "window-toggled", (_, win) => {
            const winName = win.name;
            const visible = win.visible;

            if (winName == WINDOW_NAME && visible) {
              text.set("");
              self.set_text("");
              self.grab_focus();
            }
          });
        }}
        onChanged={(self) => text.set(self.text)}
        onActivate={onEnter}
      />
    </overlay>
  );
}

function AppsScrolledWindow() {
  const list = text((text) => apps.fuzzy_query(text));

  return (
    <Gtk.ScrolledWindow vexpand>
      <box spacing={6} vertical>
        {list.as((list) => list.map((app) => <AppButton app={app} />))}
        <box
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          cssClasses={["not-found"]}
          vertical
          vexpand
          visible={list.as((l) => l.length === 0)}
        >
          <image
            iconName="system-search-symbolic"
            iconSize={Gtk.IconSize.LARGE}
          />
          <label label="No match found" />
        </box>
      </box>
    </Gtk.ScrolledWindow>
  );
}

export default function Applauncher(_gdkmonitor) {
  return (
    <PopupWindow name={WINDOW_NAME}>
      <box
        cssClasses={["window-content", "applauncher-container"]}
        vertical
        vexpand={false}
      >
        <SearchEntry />
        <AppsScrolledWindow />
      </box>
    </PopupWindow>
  );
}
