import { timeout } from "astal";
import { App, Astal, hook } from "astal/gtk4";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import Notification from "./Notification";

export default function NotificationPopup(gdkmonitor) {
  const { TOP } = Astal.WindowAnchor;
  const notifd = AstalNotifd.get_default();

  return (
    <window
      namespace={"notification-popup"}
      setup={(self) => {
        const notificationQueue = [];
        let isProcessing = false;

        hook(self, notifd, "notified", (_, id) => {
          if (
            notifd.dont_disturb &&
            notifd.get_notification(id).urgency != AstalNotifd.Urgency.CRITICAL
          ) {
            return;
          }
          notificationQueue.push(id);
          processQueue();
        });

        hook(self, notifd, "resolved", (_, __) => {
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

          self.set_child(
            <box vertical>
              {Notification({ n: notifd.get_notification(id) })}
              <box vexpand />
            </box>,
          );
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
