import { App, Gtk } from "astal/gtk4";
import { exec, Variable } from "astal";
import Pango from "gi://Pango?version=1.0";
import AstalApps from "gi://AstalApps?version=0.1";
import PopupWindow from "../common/PopupWindow";

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

export default function Applauncher(_gdkmonitor) {
  const { CENTER } = Gtk.Align;
  const apps = new AstalApps.Apps();

  const text = Variable("");
  const list = text((text) => apps.fuzzy_query(text));
  const onEnter = () => {
    apps.fuzzy_query(text.get())?.[0].launch();
    hide();
  };

  let imagePath = null;
  try {
    imagePath = exec("swww query").split("image:")[1].trim();
  } catch {
    imagePath = null;
  }

  App.apply_css(`.applauncher-container .background-entry {
		min-height: 100px;
		min-width: 450px;
    background-image: url("file://${imagePath}");
    background-size: cover;
    background-position: center;
	}`);

  return (
    <PopupWindow name={WINDOW_NAME} layout="top_right" animation="slide right">
      <box
        cssClasses={["window-content", "applauncher-container"]}
        overflow={Gtk.Overflow.HIDDEN}
        vertical
        widthRequest={450}
      >
        <overlay
          setup={(self) => {
            self.add_overlay(
              <entry
                primaryIconName={"system-search-symbolic"}
                placeholderText="Search..."
                text={text.get()}
                setup={(self) => {
                  App.connect("window-toggled", (_, win) => {
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
              />,
            );
          }}
        >
          <box cssClasses={["background-entry"]}></box>
        </overlay>
        <Gtk.ScrolledWindow minContentHeight={300}>
          <box spacing={6} vertical>
            {list.as((list) => list.map((app) => <AppButton app={app} />))}{" "}
            <box
              halign={CENTER}
              valign={CENTER}
              cssClasses={["not-found"]}
              vertical
              visible={list.as((l) => l.length === 0)}
            >
              <image iconName="system-search-symbolic" />
              <label label="No match found" />
            </box>
          </box>
        </Gtk.ScrolledWindow>
      </box>
    </PopupWindow>
  );
}
