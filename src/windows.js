import Applauncher from "./widgets/applauncher/Applauncher.jsx";
import Bar from "./widgets/bar/Bar.jsx";
import DesktopClock from "./widgets/clock/DesktopClock.jsx";
import DateMenu from "./widgets/datemenu/DateMenu.jsx";
import Dock, { DockHover } from "./widgets/dock/Dock.jsx";
import NotificationWindow from "./widgets/notification/NotificationWindow.jsx";

export default [
  Dock,
  Bar,
  DateMenu,
  DesktopClock,
  Applauncher,
  DockHover,
  NotificationWindow,
];
