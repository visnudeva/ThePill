import {
    THE_PILL_DEFAULTS,
    ClickAction,
    RunningIndicatorStyle,
    clamp,
    clampDouble,
} from '../defaults.js';
import {selectWindowToClose} from '../windowClose.js';

function win(id, {showing = true} = {}) {
    return {
        id,
        showing_on_its_workspace: () => showing,
    };
}

export async function run({test, assert, assertEqual}) {
    test('defaults lock autohide dock without intellihide', () => {
        assertEqual(THE_PILL_DEFAULTS.autohide, true);
        assertEqual(THE_PILL_DEFAULTS.intellihide, false);
        assertEqual(THE_PILL_DEFAULTS.dockFixed, false);
        assertEqual(THE_PILL_DEFAULTS.multiMonitor, false);
        assertEqual(THE_PILL_DEFAULTS.dockPosition, 2); // BOTTOM
    });

    test('defaults hide trash, mounts, show-apps, emblems', () => {
        assertEqual(THE_PILL_DEFAULTS.showTrash, false);
        assertEqual(THE_PILL_DEFAULTS.showMounts, false);
        assertEqual(THE_PILL_DEFAULTS.showShowAppsButton, false);
        assertEqual(THE_PILL_DEFAULTS.showIconsEmblems, false);
    });

    test('defaults use TIDE indicator and minimize click', () => {
        assertEqual(THE_PILL_DEFAULTS.runningIndicatorStyle,
            RunningIndicatorStyle.TIDE);
        assertEqual(THE_PILL_DEFAULTS.clickAction, ClickAction.MINIMIZE);
    });

    test('middle-click defaults to quit (close focused window)', () => {
        assertEqual(THE_PILL_DEFAULTS.middleClickAction, ClickAction.QUIT);
        assertEqual(THE_PILL_DEFAULTS.shiftMiddleClickAction, ClickAction.QUIT);
    });

    test('icon size and animation delays are pill-tuned', () => {
        assertEqual(THE_PILL_DEFAULTS.dashMaxIconSize, 40);
        assertEqual(THE_PILL_DEFAULTS.showDelay, 0.05);
        assertEqual(THE_PILL_DEFAULTS.hideDelay, 0.15);
        assertEqual(THE_PILL_DEFAULTS.alwaysCenterIcons, true);
    });

    test('selectWindowToClose returns null for empty list', () => {
        assertEqual(selectWindowToClose({
            windows: [],
            focusWindow: null,
            ownsWindow: () => false,
            workspaceWindows: [],
        }), null);
    });

    test('selectWindowToClose prefers focused owned window', () => {
        const a = win('a');
        const b = win('b');
        const picked = selectWindowToClose({
            windows: [a, b],
            focusWindow: b,
            ownsWindow: w => w === b,
            workspaceWindows: [a, b],
        });
        assertEqual(picked, b);
    });

    test('selectWindowToClose returns sole window', () => {
        const a = win('a');
        assertEqual(selectWindowToClose({
            windows: [a],
            focusWindow: null,
            ownsWindow: () => false,
            workspaceWindows: [a],
        }), a);
    });

    test('selectWindowToClose picks topmost owned on workspace when unfocused', () => {
        const a = win('a');
        const b = win('b');
        const c = win('c');
        // workspace list: bottom → top (last is topmost)
        const picked = selectWindowToClose({
            windows: [a, b, c],
            focusWindow: null,
            ownsWindow: () => true,
            workspaceWindows: [a, b, c],
        });
        assertEqual(picked, c);
    });

    test('selectWindowToClose skips windows not showing on workspace', () => {
        const a = win('a');
        const b = win('b', {showing: false});
        const c = win('c');
        const picked = selectWindowToClose({
            windows: [a, b, c],
            focusWindow: null,
            ownsWindow: () => true,
            workspaceWindows: [a, b, c],
        });
        // walks from end: c showing → pick c
        assertEqual(picked, c);

        const picked2 = selectWindowToClose({
            windows: [a, b],
            focusWindow: null,
            ownsWindow: () => true,
            workspaceWindows: [a, b],
        });
        assertEqual(picked2, a);
    });

    test('selectWindowToClose falls back to last interesting window', () => {
        const a = win('a');
        const b = win('b');
        const other = win('other');
        const picked = selectWindowToClose({
            windows: [a, b],
            focusWindow: null,
            ownsWindow: () => true,
            workspaceWindows: [other],
        });
        assertEqual(picked, b);
    });

    test('clamp / clampDouble', () => {
        assertEqual(clamp(5, 0, 10), 5);
        assertEqual(clamp(-1, 0, 10), 0);
        assertEqual(clamp(99, 0, 10), 10);
        assertEqual(clampDouble(1.5), 1);
        assertEqual(clampDouble(-0.2), 0);
        assertEqual(clampDouble(0.4), 0.4);
    });

    test('defaults object is frozen', () => {
        assert(Object.isFrozen(THE_PILL_DEFAULTS));
        let threw = false;
        try {
            THE_PILL_DEFAULTS.autohide = false;
        } catch {
            threw = true;
        }
        // frozen may throw in strict mode; value must remain true either way
        assertEqual(THE_PILL_DEFAULTS.autohide, true);
        assert(threw || THE_PILL_DEFAULTS.autohide === true);
    });
}
