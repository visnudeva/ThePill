/**
 * Pick which window middle-click / quit should close.
 * Prefers the focused owned window, then a single window, then the topmost
 * owned window on the current workspace.
 *
 * @param {object} params
 * @param {object[]} params.windows - interesting windows for this app
 * @param {object|null} params.focusWindow - currently focused window
 * @param {(w: object) => boolean} params.ownsWindow - whether the app owns w
 * @param {object[]} params.workspaceWindows - windows on the active workspace
 * @returns {object|null}
 */
export function selectWindowToClose({
    windows,
    focusWindow,
    ownsWindow,
    workspaceWindows,
}) {
    if (!windows?.length)
        return null;

    if (focusWindow && ownsWindow(focusWindow) && windows.includes(focusWindow))
        return focusWindow;

    if (windows.length === 1)
        return windows[0];

    for (let i = workspaceWindows.length - 1; i >= 0; i--) {
        const w = workspaceWindows[i];
        if (windows.includes(w) && w.showing_on_its_workspace())
            return w;
    }

    return windows[windows.length - 1];
}
