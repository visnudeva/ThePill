import {DockManager} from './docking.js';
import {Extension} from './dependencies/shell/extensions/extension.js';

export let dockManager;

export default class ThePillExtension extends Extension.Extension {
    enable() {
        dockManager = new DockManager(this);
    }

    disable() {
        dockManager?.destroy();
        dockManager = null;
    }
}
