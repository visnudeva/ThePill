// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-

import {St} from './dependencies/gi.js';

import {Main} from './dependencies/shell/ui.js';

import {
    Docking,
    Utils,
} from './imports.js';

const {signals: Signals} = imports;

export const PositionStyleClass = Object.freeze([
    'top',
    'right',
    'bottom',
    'left',
]);

const Labels = Object.freeze({
    THEME_CHANGED: Symbol('theme-changed'),
});

/**
 * Manage theme customization for the always-visible pill dock.
 */
export class ThemeManager {
    constructor(dock) {
        this._signalsHandler = new Utils.GlobalSignalsHandler(this);
        this._bindSettingsChanges();
        this._actor = dock;
        this._dash = dock.dash;

        this._signalsHandler.add([
            Main.overview,
            'showing',
            this._onOverviewShowing.bind(this),
        ], [
            Main.overview,
            'hiding',
            this._onOverviewHiding.bind(this),
        ]);

        this._signalsHandler.addWithLabel(Labels.THEME_CHANGED,
            St.ThemeContext.get_for_stage(global.stage), 'changed',
            () => this.updateCustomTheme());

        const maybeUpdateCustomTheme = () => {
            if (this._actor.mapped) {
                this._signalsHandler.unblockWithLabel(Labels.THEME_CHANGED);
                this.updateCustomTheme();
            } else {
                this._signalsHandler.blockWithLabel(Labels.THEME_CHANGED);
            }
        };

        this._signalsHandler.add(this._actor, 'notify::mapped',
            () => maybeUpdateCustomTheme());

        maybeUpdateCustomTheme();

        if (Main.overview.visible)
            this._onOverviewShowing();
        else
            this._onOverviewHiding();

        this._signalsHandler.add(this._actor, 'destroy', () => this.destroy());
    }

    destroy() {
        this.emit('destroy');
        this._destroyed = true;
    }

    _onOverviewShowing() {
        this._actor.add_style_pseudo_class('overview');
    }

    _onOverviewHiding() {
        this._actor.remove_style_pseudo_class('overview');
    }

    _updateCustomStyleClasses() {
        const {settings} = Docking.DockManager;

        if (settings.applyCustomTheme)
            this._actor.add_style_class_name('dashtodock');
        else
            this._actor.remove_style_class_name('dashtodock');

        if (settings.customThemeShrink)
            this._actor.add_style_class_name('shrink');
        else
            this._actor.remove_style_class_name('shrink');

        this._actor.remove_style_class_name('running-dots');

        if (!settings.applyCustomTheme) {
            if (settings.forceStraightCorner)
                this._actor.add_style_class_name('straight-corner');
            else
                this._actor.remove_style_class_name('straight-corner');
        } else {
            this._actor.remove_style_class_name('straight-corner');
        }
    }

    _applyPillTheme() {
        const {settings} = Docking.DockManager;

        if (settings.applyCustomTheme)
            return;

        this._dash._background.set_style('border-radius: 9999px;');
        this._dash._background.show();
    }

    updateCustomTheme() {
        if (this._destroyed)
            throw new Error(`Impossible to update a destroyed ${this.constructor.name}`);
        this._updateCustomStyleClasses();
        this._applyPillTheme();
        this.emit('updated');
    }

    _bindSettingsChanges() {
        const keys = [
            'apply-custom-theme',
            'custom-theme-shrink',
            'custom-theme-running-dots',
            'extend-height',
            'force-straight-corner',
        ];

        this._signalsHandler.addWithLabel(Labels.THEME_CHANGED, ...keys.map(key => [
            Docking.DockManager.settings,
            `changed::${key}`,
            () => this.updateCustomTheme(),
        ]));
    }
}
Signals.addSignalMethods(ThemeManager.prototype);
