import { timeout } from "astal";
import { App, Astal } from "astal/gtk4";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import Notification from "./Notification";

export default function NotificationWindow(gdkmonitor) {
  const { TOP } = Astal.WindowAnchor;
  const notifd = AstalNotifd.get_default();

  return (
    <window
      namespace={"notification-popup"}
      setup={(self) => {
        const notificationQueue = [];
        let isProcessing = false;

        notifd.connect("notified", (_, id) => {
          notificationQueue.push(id);
          processQueue();
        });

        notifd.connect("resolved", (_, __) => {
          self.visible = false;
          isProcessing = false;
          timeout(300, () => {
            processQueue();
          });
        });

        function processQueue() {
          if (isProcessing || notificationQueue.length === 0) return;
          isProcessing = true;
          const id = notificationQueue.shift();

          self.set_child(Notification({ n: notifd.get_notification(id) }));
          self.visible = true;

          timeout(5000, () => {
            self.set_child(null);
            self.visible = false;
            isProcessing = false;
            timeout(300, () => {
              processQueue();
            });
          });
        }
      }}
      gdkmonitor={gdkmonitor}
      application={App}
      anchor={TOP}
    ></window>
  );
}
