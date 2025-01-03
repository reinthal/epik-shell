import { networkSpeed } from "../../utils/network-speed";
import PanelButton from "../common/PanelButton";

export default function NetworkSpeedPanelButton({ inMb = true }) {
  return (
    <PanelButton>
      <box vertical cssClasses={["network-speed"]}>
        <label
          cssClasses={["label"]}
          label={networkSpeed((value) => {
            const downloadSpeed = value.download;
            const uploadSpeed = value.upload;
            let speed =
              downloadSpeed >= uploadSpeed ? downloadSpeed : uploadSpeed;

            if (inMb) speed = (speed / 1000).toFixed(2);

            const symbol = downloadSpeed >= uploadSpeed ? "" : "";

            return `${speed} ${symbol}`;
          })}
        />
        <label cssClasses={["unit"]} label={inMb ? "MB/s" : "KB/s"} />
      </box>
    </PanelButton>
  );
}
