import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function run({test, assert, assertEqual}) {
    test('extension.js exports enable/disable lifecycle', () => {
        const src = readFileSync(path.join(root, 'extension.js'), 'utf8');
        assert(src.includes('class ThePillExtension'));
        assert(src.includes('new DockManager(this)'));
        assert(src.includes('disable()'));
        assert(src.includes('dockManager = null'));
    });

    test('stylesheet is present for pill chrome', () => {
        const css = readFileSync(path.join(root, 'stylesheet.css'), 'utf8');
        assert(css.includes('#dashtodockContainer'));
        assert(css.includes('border-radius') || css.includes('dash-background'));
    });

    test('gschema compiles cleanly', () => {
        const schemaDir = path.join(root, 'schemas');
        execFileSync('glib-compile-schemas', [schemaDir], {stdio: 'pipe'});
        assert(true);
    });

    test('settings schema id matches metadata', () => {
        const metadata = JSON.parse(
            readFileSync(path.join(root, 'metadata.json'), 'utf8'));
        const schema = readFileSync(
            path.join(root, 'schemas/org.gnome.shell.extensions.thepill.gschema.xml'),
            'utf8');
        assert(schema.includes(`id="${metadata['settings-schema']}"`));
    });

    test('theming applies pill border-radius when custom theme off', () => {
        const src = readFileSync(path.join(root, 'theming.js'), 'utf8');
        assert(src.includes('border-radius: 9999px'));
        assert(src.includes('_applyPillTheme'));
    });

    test('underline / TIDE indicator draws segmented pills', () => {
        const src = readFileSync(
            path.join(root, 'appIconIndicators.js'), 'utf8');
        assert(src.includes('RunningIndicatorUnderline'));
        assert(src.includes('case RunningIndicatorStyle.TIDE:'));
        assert(src.includes('this._lengthScale = 0.65'));
    });

    test('middle-click QUIT path calls closeFocusedWindow', () => {
        const src = readFileSync(path.join(root, 'appIcons.js'), 'utf8');
        assert(src.includes('case clickAction.QUIT:'));
        assert(src.includes('this.closeFocusedWindow()'));
        assert(src.includes('selectWindowToClose'));
    });

    test('docking wires THE_PILL_DEFAULTS', () => {
        const src = readFileSync(path.join(root, 'docking.js'), 'utf8');
        assert(src.includes("from './defaults.js'"));
        assert(src.includes('_applyThePillDefaults'));
        assert(src.includes('Object.entries(THE_PILL_DEFAULTS)'));
    });
}
