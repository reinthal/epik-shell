import AstalIO from "gi://AstalIO?version=0.1";
import GLib from "gi://GLib";
import { exit, programPath } from "system";

async function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    AstalIO.Process.exec_asyncv(cmd, (_, res) => {
      try {
        resolve(AstalIO.Process.exec_asyncv_finish(res));
      } catch (error) {
        reject(error);
      }
    });
  });
}

const currentDir = GLib.path_get_dirname(programPath);

const entry = `${currentDir}/src/app.js`;
const outfile = `${currentDir}/app.js`;

const styleEntry = `${currentDir}/src/styles.scss`;
const styleOut = `${currentDir}/style.css`;

//bundle js and scss
try {
  await execAsync(["sass", styleEntry, styleOut]);
  await execAsync([
    "esbuild",
    "--bundle",
    entry,
    `--outfile=${outfile}`,
    "--sourcemap=inline",
    "--format=esm",
    "--external:gi://*",
    "--external:system",
    "--platform=node",
    "--loader:.js=ts",
    `--define:SRC="${currentDir}/src"`,
    `--define:COMPILED_CSS="${styleOut}"`,
  ]);
} catch (error) {
  console.error(error);
  exit(0);
}

GLib.setenv("LD_PRELOAD", "", true);
await import(`file://${outfile}`).catch(console.error);
