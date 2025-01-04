import AstalNotifd from "gi://AstalNotifd?version=0.1";
import PopupWindow from "../common/PopupWindow";
import { Gtk } from "astal/gtk4";
import { bind } from "astal";
import Notification from "./Notification";

export const WINDOW_NAME = "notifications";
const notifd = AstalNotifd.get_default();

function NotifsScrolledWindow() {
  const notifd = AstalNotifd.get_default();
  return (
    <Gtk.ScrolledWindow vexpand>
      <box vertical hexpand={false} spacing={8}>
        {bind(notifd, "notifications").as((notifs) =>
          notifs.map((e) => <Notification n={e} showActions={false} />),
        )}
        <box
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          cssClasses={["not-found"]}
          vertical
          vexpand
          visible={bind(notifd, "notifications").as((n) => n.length === 0)}
        >
          <image
            iconName="notification-disabled-symbolic"
            iconSize={Gtk.IconSize.LARGE}
          />
          <label label="Your inbox is empty" />
        </box>
      </box>
    </Gtk.ScrolledWindow>
  );
}

function DNDButton() {
  return (
    <button
      tooltipText={"Do Not Disturb"}
      onClicked={() => {
        notifd.set_dont_disturb(!notifd.get_dont_disturb());
      }}
      cssClasses={bind(notifd, "dont_disturb").as((dnd) => {
        const classes = ["dnd"];
        dnd && classes.push("active");
        return classes;
      })}
      label={"DND"}
    />
  );
}

function ClearButton() {
  return (
    <button
      cssClasses={["clear"]}
      onClicked={() => {
        notifd.notifications.forEach((n) => n.dismiss());
      }}
      sensitive={bind(notifd, "notifications").as((n) => n.length > 0)}
    >
      <image iconName={"user-trash-full-symbolic"} />
    </button>
  );
}

export default function NotificationWindow(_gdkmonitor) {
  return (
    <PopupWindow name={WINDOW_NAME} animation="slide top" layout="top_center">
      <box
        cssClasses={["window-content", "notifications-container"]}
        vertical
        vexpand={false}
      >
        <box cssClasses={["window-header"]}>
          <label label={"Notifications"} hexpand xalign={0} />
          <DNDButton />
          <ClearButton />
        </box>
        <Gtk.Separator />
        <NotifsScrolledWindow />
      </box>
    </PopupWindow>
  );
}
