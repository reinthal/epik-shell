import PopupWindow from "../common/PopupWindow";
import DarkModeQS from "./buttons/DarkModeQS";
import ColorPickerQS from "./buttons/ColorPickerQS";
import ScreenshotQS from "./buttons/ScreenshotQS";
import DontDisturbQS from "./buttons/DontDisturbQS";
import RecordQS from "./buttons/RecordQS";
import MicQS from "./buttons/MicQS";
import BrightnessBox from "./BrightnessBox";
import { Gtk } from "astal/gtk4";
import { WINDOW_NAME as POWERMENU_WINDOW } from "../powermenu/PowerMenu";
import { App } from "astal/gtk4";
import { FlowBox } from "../common/FlowBox";
import { bind, Variable } from "astal";
import options from "../../options";
import VolumeBox from "./VolumeBox";
import AstalBattery from "gi://AstalBattery?version=0.1";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import { toggleWallpaperPicker } from "../wallpaperpicker/WallpaperPicker";

export const WINDOW_NAME = "quicksettings";
export const qsPage = Variable("main");
const { bar } = options;

const layout = Variable.derive(
  [bar.position, bar.start, bar.center, bar.end],
  (pos, start, center, end) => {
    if (start.includes("quicksetting")) return `${pos}_left`;
    if (center.includes("quicksetting")) return `${pos}_center`;
    if (end.includes("quicksetting")) return `${pos}_right`;

    return `${pos}_center`;
  },
);

function QSButtons() {
  return (
    <FlowBox maxChildrenPerLine={3} homogeneous>
      <DarkModeQS />
      <ColorPickerQS />
      <ScreenshotQS />
      <MicQS />
      <DontDisturbQS />
      <RecordQS />
    </FlowBox>
  );
}

function Header() {
  const battery = AstalBattery.get_default();

  return (
    <box hexpand={false} cssClasses={["header"]} spacing={6}>
      <label label={"Quick Setting"} hexpand xalign={0} />
      <button
        onClicked={() => {
          App.toggle_window(WINDOW_NAME);
          toggleWallpaperPicker();
        }}
        iconName={"preferences-desktop-wallpaper-symbolic"}
      />
      <button
        cssClasses={["battery"]}
        onClicked={() => {
          qsPage.set("battery");
        }}
      >
        <box spacing={2}>
          <image
            iconName={bind(battery, "battery-icon-name")}
            iconSize={Gtk.IconSize.NORMAL}
            cssClasses={["icon"]}
          />
          <label
            label={bind(battery, "percentage").as(
              (p) => `${Math.floor(p * 100)}%`,
            )}
          />
        </box>
      </button>
      <button
        cssClasses={["powermenu"]}
        onClicked={() => {
          App.toggle_window(WINDOW_NAME);
          App.toggle_window(POWERMENU_WINDOW);
        }}
      >
        <image
          iconName={"system-shutdown-symbolic"}
          iconSize={Gtk.IconSize.NORMAL}
        />
      </button>
    </box>
  );
}

function Main() {
  return (
    <box name={"main"} vertical>
      <Header />
      <Gtk.Separator />
      <BrightnessBox />
      <VolumeBox />
      <QSButtons />
    </box>
  );
}

function Battery() {
  const powerprofiles = AstalPowerProfiles.get_default();
  return (
    <box name={"battery"} cssClasses={["battery-page"]} vertical>
      <box hexpand={false} cssClasses={["header"]} spacing={6}>
        <button
          onClicked={() => {
            qsPage.set("main");
          }}
          iconName={"go-previous-symbolic"}
        />
        <label label={"Battery"} hexpand xalign={0} />
      </box>
      <Gtk.Separator />
      <box vertical spacing={6}>
        {bind(powerprofiles, "profiles").as((profiles) =>
          profiles.map((p) => {
            return (
              <button
                cssClasses={bind(powerprofiles, "active-profile").as(
                  (active) => {
                    const classes = ["profile"];
                    active === p.profile && classes.push("active");
                    return classes;
                  },
                )}
                onClicked={() => {
                  powerprofiles.set_active_profile(p.profile);
                  qsPage.set("main");
                }}
              >
                <box>
                  <image iconName={`power-profile-${p.profile}-symbolic`} />
                  <label
                    label={p.profile
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  />
                </box>
              </button>
            );
          }),
        )}
      </box>
    </box>
  );
}

function QSWindow(_gdkmonitor) {
  return (
    <PopupWindow name={WINDOW_NAME} layout={layout.get()} animation="slide top">
      <box
        cssClasses={["window-content", "qs-container"]}
        hexpand={false}
        vertical
      >
        <stack
          visibleChildName={qsPage()}
          transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
        >
          <Main />
          <Battery />
        </stack>
      </box>
    </PopupWindow>
  );
}

export default function (gdkmonitor) {
  QSWindow(gdkmonitor);

  App.connect("window-toggled", (_, win) => {
    if (win.name == WINDOW_NAME && !win.visible) {
      qsPage.set("main");
    }
  });

  layout.subscribe(() => {
    App.remove_window(App.get_window(WINDOW_NAME));
    QSWindow(gdkmonitor);
  });
}
