import AstalWp from "gi://AstalWp?version=0.1";
import QSButton from "../QSButton";
import { bind } from "astal";

export default function MicQS() {
  const wireplumber = AstalWp.get_default();
  return (
    <QSButton
      cssClasses={bind(wireplumber.default_microphone, "mute").as((mute) => {
        const classes = ["qs-button"];
        !mute && classes.push("active");
        return classes;
      })}
      iconName={bind(wireplumber.default_microphone, "mute").as((mute) =>
        mute
          ? "microphone-disabled-symbolic"
          : "microphone-sensitivity-high-symbolic",
      )}
      label={"Mic Access"}
      status={bind(wireplumber.get_default_microphone(), "mute").as((m) =>
        m ? "Off" : "On",
      )}
      onClicked={() => {
        const mute = wireplumber.default_microphone.mute;
        wireplumber.default_microphone.set_mute(!mute);
      }}
    />
  );
}
