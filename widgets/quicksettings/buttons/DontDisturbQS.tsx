import AstalNotifd from "gi://AstalNotifd";
import QSButton from "../QSButton";
import { bind } from "astal";

export default function DontDisturbQS() {
  const notifd = AstalNotifd.get_default();

  return (
    <QSButton
      cssClasses={bind(notifd, "dontDisturb").as((dnd) => {
        const classes = ["qs-button"];
        dnd && classes.push("active");
        return classes;
      })}
      onClicked={() => {
        notifd.set_dont_disturb(!notifd.get_dont_disturb());
      }}
      iconName={bind(notifd, "dontDisturb").as(
        (dnd) => `notification-${dnd ? "disabled-" : ""}symbolic`,
      )}
      label={"Do Not Disturb"}
    />
  );
}
