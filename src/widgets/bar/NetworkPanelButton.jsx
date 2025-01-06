import AstalNetwork from "gi://AstalNetwork?version=0.1";
import PanelButton from "../common/PanelButton";
import { bind, Variable } from "astal";

export default function NetworkPanelButton({ showLabel = false }) {
  const network = AstalNetwork.get_default();
  const networkIcon = Variable.derive(
    [bind(network, "primary"), bind(network, "wifi"), bind(network, "wired")],
    (primary, wifi, wired) => {
      if (primary == AstalNetwork.Primary.WIRED) {
        return wired.iconName;
      } else {
        return wifi.iconName;
      }
    },
  );

  return (
    <PanelButton>
      <box spacing={4}>
        <image iconName={networkIcon()} />
        {showLabel && (
          <label
            visible={bind(network, "primary").as(
              (p) => p == AstalNetwork.Primary.WIFI,
            )}
            label={bind(network.wifi, "ssid")}
          />
        )}
      </box>
    </PanelButton>
  );
}
