import { App } from "astal/gtk4";

export default function PanelButton({ child, window = "", setup, ...props }) {
  return (
    <button
      cssClasses={["panel-button"]}
      setup={(self) => {
        if (window !== "") {
          let open = false;

          self.add_css_class(window);

          App.connect("window-toggled", (_, win) => {
            const winName = win.name;
            const visible = win.visible;

            if (winName !== window) return;

            if (open && !visible) {
              open = false;
              self.remove_css_class("active");
            }

            if (visible) {
              open = true;
              self.add_css_class("active");
            }
          });
        }

        if (setup) setup(self);
      }}
      {...props}
    >
      {child}
    </button>
  );
}
