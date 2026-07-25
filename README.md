
# <img src="https://github.com/visnudeva/ThePill/blob/main/docs/assets/logo.png?raw=true" width="100"> The Pill

<table>
  <tr>
    <td>
      <strong>A minimal GNOME Shell dock — invisible until your windows need it.</strong><br>
      Autohides at the bottom of the screen, reveals on hover, and stays out of the way<br>
      with tide-style running indicators and a clean, centered icon strip.<br>
      No preferences window — behavior is locked to a deliberate minimal defaults.
    </td>
      <td>
      <img src="https://github.com/visnudeva/ThePill/blob/main/docs/assets/Screenshot.png?raw=true" width="600">
    </td>
  </tr>
</table>

## Features

- **Autohide dock**: Hidden by default; slides in when you move the pointer to the bottom edge
- **Minimal chrome**: No trash, mounts, or Show Applications button — just your apps
- **Tide indicators**: Underline-style “pill” markers for running applications
- **Click to minimize**: Left-click a running app minimizes its window
- **Middle-click to quit**: Middle-click closes the focused window for that app
- **Fast show/hide**: Short delays tuned for a snappy reveal and dismiss
- **Centered icons**: Icons stay centered on the bottom edge
- **No startup overview**: Skips the overview on login for a quieter desktop

## Installation

### From GNOME Extensions (Recommended)

Once published, install directly from [extensions.gnome.org](https://extensions.gnome.org/).

### Manual Installation

Clone or copy the extension into your local extensions directory:

```bash
# Install path (uuid must match metadata.json)
cp -r ThePill ~/.local/share/gnome-shell/extensions/ThePill@visnudeva.github.io

# Or clone directly into place
git clone https://github.com/visnudeva/ThePill.git \
  ~/.local/share/gnome-shell/extensions/ThePill@visnudeva.github.io

# Compile schemas (required after a fresh copy)
glib-compile-schemas \
  ~/.local/share/gnome-shell/extensions/ThePill@visnudeva.github.io/schemas

# Enable the extension
gnome-extensions enable ThePill@visnudeva.github.io

# Restart GNOME Shell (Wayland: log out and back in, X11: Alt+F2, type 'r')
```

## How It Works

1. Places a bottom dock that stays hidden while you work
2. Reveals the dock when the pointer reaches the bottom edge
3. Shows favorite and running apps with tide-style running indicators
4. Left-click minimizes a running app; middle-click quits the focused window
5. Hides again shortly after the pointer leaves

## Behavior

The Pill ships without a preferences UI. Defaults are intentional and fixed:

- **Position** — bottom edge
- **Visibility** — autohide on; intellihide and fixed dock off
- **Icons** — max size 40px, centered; emblems and notification badges off
- **Indicators** — TIDE underline style
- **Clicks** — left-click minimize; middle-click quit
- **Extras** — trash, mounts, and Show Applications button hidden

## Troubleshooting

**Extension not working?**
- Ensure the extension is enabled: `gnome-extensions list --enabled`
- Check logs: `journalctl -f | grep -i thepill`
- Restart GNOME Shell after installation (Wayland: log out and back in)

**Dock never appears?**
- Move the pointer to the bottom edge of the primary monitor
- Confirm you are not in an exclusive fullscreen session that blocks edge hits

**Schemas / enable fails?**
- Run `glib-compile-schemas` on the extension’s `schemas` directory
- Verify the install path uuid is `ThePill@visnudeva.github.io`

## Requirements

- GNOME Shell 48–50

## License

GNU General Public License v2.0 or later. See the [COPYING](COPYING) file for details.

Based on Dash to Dock; original author credit in `metadata.json`.

## Contributing

Issues and pull requests welcome at [GitHub](https://github.com/visnudeva/ThePill).
