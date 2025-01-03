import { exec } from "astal";

export function compileScss() {
  const scss = `${SRC}/styles.scss`;
  const css = `${SRC}/style.css`;

  exec(`sass ${scss} ${css}`);

  return css;
}
