/**
 * Locked The Pill defaults — single source of truth for behavior and tests.
 * dockPosition uses St.Side.BOTTOM numeric value (2).
 */
export const THE_PILL_DEFAULTS = Object.freeze({
    autohide: true,
    intellihide: false,
    dockFixed: false,
    manualhide: false,
    requirePressureToShow: false,
    showTrash: false,
    showMounts: false,
    multiMonitor: false,
    dockPosition: 2, // St.Side.BOTTOM
    showShowAppsButton: false,
    danceUrgentApplications: false,
    showDockUrgentNotify: false,
    autohideInFullscreen: false,
    disableOverviewOnStartup: true,
    runningIndicatorStyle: 11, // TIDE underline pills
    clickAction: 1, // minimize
    middleClickAction: 11, // quit / close focused
    shiftMiddleClickAction: 11,
    scrollAction: 0,
    scrollSwitchWorkspace: false,
    showIconsEmblems: false,
    showIconsNotificationsCounter: false,
    applyCustomTheme: false,
    dashMaxIconSize: 40,
    iconSizeFixed: false,
    showDelay: 0.05,
    hideDelay: 0.15,
    extendHeight: false,
    alwaysCenterIcons: true,
    heightFraction: 0.9,
    forceStraightCorner: false,
});

/** Running-indicator style ids used by The Pill. */
export const RunningIndicatorStyle = Object.freeze({
    DEFAULT: 0,
    DOTS: 1,
    SQUARES: 2,
    DASHES: 3,
    SEGMENTED: 4,
    SOLID: 5,
    CILIORA: 6,
    METRO: 7,
    BINARY: 8,
    DOT: 9,
    TIDE: 11,
});

/** Click-action ids used by The Pill. */
export const ClickAction = Object.freeze({
    SKIP: 0,
    MINIMIZE: 1,
    LAUNCH: 2,
    CYCLE_WINDOWS: 3,
    MINIMIZE_OR_OVERVIEW: 4,
    PREVIEWS: 5,
    MINIMIZE_OR_PREVIEWS: 6,
    FOCUS_OR_PREVIEWS: 7,
    FOCUS_OR_APP_SPREAD: 8,
    FOCUS_MINIMIZE_OR_PREVIEWS: 9,
    FOCUS_MINIMIZE_OR_APP_SPREAD: 10,
    QUIT: 11,
});

export const clamp = (v, m, M) => Math.min(Math.max(v, m), M);
export const clampDouble = v => clamp(v, 0, 1);
