import Applauncher from "./widgets/applauncher/Applauncher.jsx";
import AudioWindow from "./widgets/audio/AudioWindow.jsx";
import Bar from "./widgets/bar/Bar.jsx";
import BatteryWindow from "./widgets/battery/BatteryWindow.jsx";
import DesktopClock from "./widgets/clock/DesktopClock.jsx";
import DateMenu from "./widgets/datemenu/DateMenu.jsx";
import Dock, { DockHover } from "./widgets/dock/Dock.jsx";
import NotificationPopup from "./widgets/notification/NotificationPopup.jsx";
import NotificationWindow from "./widgets/notification/NotificationWindow.jsx";
import PowerMenu from "./widgets/powermenu/PowerMenu.jsx";
import VerificationWindow from "./widgets/powermenu/VerificationWindow.jsx";
import QSWindow from "./widgets/quicksettings/QSWindow.jsx";

export default [
  Dock,
  Bar,
  DateMenu,
  DesktopClock,
  Applauncher,
  DockHover,
  NotificationPopup,
  NotificationWindow,
  QSWindow,
  PowerMenu,
  VerificationWindow,
  BatteryWindow,
  AudioWindow,
];
