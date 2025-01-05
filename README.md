# Epik Shell

A shell based on [Astal](https://github.com/Aylur/Astal/).

## Screenshots

![Screenshot 1](https://github.com/user-attachments/assets/63766acc-53e6-4e6c-9a99-4c3eba874dde)  
![Screenshot 2](https://github.com/user-attachments/assets/17d6b2e9-65a6-4837-b77f-5c61688d5a72)  
![Screenshot 3](https://github.com/user-attachments/assets/cc80a16d-70dc-4dcb-a6d5-dbbb0a91fc3c)

---

## Notes

- Most widgets are copied from [Aylur dotfiles](https://github.com/Aylur/dotfiles), the creator of Astal/AGS. Thanks, Aylur!
- Some features may not work as expected. Feel free to ask if you encounter any issues.
- **Only Hyprland is supported**, although some widgets might work with other Wayland compositors.

---

## Dependencies

### Required

- `astal` (`libastal-meta` & `libastal-gjs`)
- `dart-sass`
- `esbuild`

### Optional

- `hyprpicker`
- `swappy`
- `wf-recorder`
- `wayshot`
- `slurp`
- `wl-copy`

---

## Quick Start Guide

1. Clone the repository
   ```bash
   git clone https://github.com/ezerinz/epik-shell
   ```
2. Navigate to project directory
   ```bash
   cd epik-shell
   ```
3. Run
   ```bash
   LD_PRELOAD=/usr/lib/libgtk4-layer-shell.so gjs -m build.js
   ```

---

## GTK Theme

### Theme Settings

- **Theme:** `adw-gtk3`
- **Icons:** `Qogir`

### Making GTK Apps Match Astal Theme

1. Install `libadwaita-without-adwaita`.
2. This configuration generates a `colors.css` file in `$HOME/.themes` based on theme settings in `src/theme.json`. Import the `colors.css` file into the `adw-gtk3` theme to apply it to your GTK apps.

Locate the following files:

- `adw-gtk3/gtk-3.0/gtk.css`
- `adw-gtk3/gtk-4.0/gtk.css`
- `adw-gtk3-dark/gtk-3.0/gtk-dark.css`
- `adw-gtk3.dark/gtk-4.0/gtk-dark.css`

Add the following line after the `define-color` section:

> **This assumes your adw-gtk3 folder is inside $HOME/.themes. If it's not, adjust the path accordingly.**

```css
/* Import after many define-color lines */
@import "../../colors.css";
```
