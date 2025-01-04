import AstalNetwork from "gi://AstalNetwork?version=0.1";
import PanelButton from "../common/PanelButton";
import { hook } from "astal/gtk4";
import { bind } from "astal";

export default function NetworkPanelButton() {
  const network = AstalNetwork.get_default();

  return (
    <PanelButton>
      <box spacing={4}>
        <image
          iconName={bind(network, "primary").as((p) => {
            let n = network.wifi;
            if (p == AstalNetwork.Primary.WIRED) {
              n = network.wired;
            }
            return n.iconName;
          })}
        />
        <label
          visible={bind(network, "primary").as(
            (p) => p == AstalNetwork.Primary.WIFI,
          )}
          label={bind(network.wifi, "ssid")}
        />
      </box>
    </PanelButton>
  );
}
