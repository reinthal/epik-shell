import { networkSpeed } from "../../utils/network-speed";
import PanelButton from "../common/PanelButton";

export default function NetworkSpeedPanelButton() {
  return (
    <PanelButton>
      <box cssClasses={["network-speed"]}>
        <label
          cssClasses={["label"]}
          label={networkSpeed((value) => {
            const downloadSpeed = value.download;
            const uploadSpeed = value.upload;
            let speed =
              downloadSpeed >= uploadSpeed ? downloadSpeed : uploadSpeed;

            speed = (speed / 1000).toFixed(2);

            const symbol = downloadSpeed >= uploadSpeed ? "" : "";

            return `${speed} MB/s ${symbol}`;
          })}
        />
        {/*<label cssClasses={["unit"]} label={inMb ? "MB/s" : "KB/s"} />*/}
      </box>
    </PanelButton>
  );
}
