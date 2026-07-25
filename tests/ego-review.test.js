import {readFileSync, existsSync, readdirSync, statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
    return readFileSync(path.join(root, rel), 'utf8');
}

function collectJs(dir = root, acc = []) {
    for (const name of readdirSync(dir)) {
        if (['tests', 'node_modules', 'media', 'lint', '_build', 'dependencies'].includes(name))
            continue;
        const full = path.join(dir, name);
        if (statSync(full).isDirectory())
            collectJs(full, acc);
        else if (name.endsWith('.js'))
            acc.push(full);
    }
    return acc;
}

export async function run({test, assert, assertEqual}) {
    const metadata = JSON.parse(read('metadata.json'));
    const schema = read('schemas/org.gnome.shell.extensions.thepill.gschema.xml');
    const extensionJs = read('extension.js');
    const dockingJs = read('docking.js');
    const jsFiles = collectJs();
    const allSource = jsFiles.map(f => readFileSync(f, 'utf8')).join('\n');

    test('metadata has no preferences key (EGO)', () => {
        assert(!('preferences' in metadata),
            'metadata.json must not include preferences');
    });

    test('metadata has no incorrect donate key (EGO)', () => {
        assert(!('donate' in metadata),
            'use donations object, not donate key');
        if (metadata.donations)
            assert(typeof metadata.donations === 'object');
    });

    test('metadata uuid and schema match The Pill', () => {
        assertEqual(metadata.uuid, 'ThePill@visnudeva.github.io');
        assertEqual(metadata['settings-schema'],
            'org.gnome.shell.extensions.thepill');
        assert(metadata['shell-version'].includes('48'));
    });

    test('no prefs.js without connectObject misuse (EGO)', () => {
        const prefsPath = path.join(root, 'prefs.js');
        if (!existsSync(prefsPath))
            return;
        const prefs = read('prefs.js');
        assert(!prefs.includes('.connectObject(') &&
            !prefs.includes('.disconnectObject('),
            'prefs.js must not use connectObject/disconnectObject');
        assert(
            prefs.includes("connect('close-request'") ||
            prefs.includes('connect("close-request"'),
            'prefs.js cleanup should use window close-request');
    });

    test('single getSettings() call site (EGO)', () => {
        const matches = dockingJs.match(/getSettings\s*\(/g) || [];
        assertEqual(matches.length, 1,
            `expected one getSettings() call, found ${matches.length}`);
        assertEqual((extensionJs.match(/getSettings\s*\(/g) || []).length, 0);
    });

    test('no this._enabled flag (EGO)', () => {
        assert(!/\bthis\._enabled\b/.test(allSource),
            'this._enabled is discouraged by EGO reviewers');
    });

    test('no this.connectObject / this.disconnectObject (EGO)', () => {
        assert(!/\bthis\.connectObject\b/.test(allSource),
            'use INSTANCE.connectObject(..., this)');
        assert(!/\bthis\.disconnectObject\b/.test(allSource),
            'use INSTANCE.disconnectObject(this)');
    });

    test('connectObject calls pass owner as last arg when used', () => {
        // INSTANCE.connectObject(..., owner) — owner is the final argument
        const re = /\.connectObject\s*\(/g;
        let m;
        const bad = [];
        while ((m = re.exec(allSource))) {
            const start = m.index + m[0].length;
            let depth = 1;
            let i = start;
            let inStr = null;
            for (; i < allSource.length && depth > 0; i++) {
                const ch = allSource[i];
                const prev = allSource[i - 1];
                if (inStr) {
                    if (ch === inStr && prev !== '\\')
                        inStr = null;
                    continue;
                }
                if (ch === "'" || ch === '"' || ch === '`') {
                    inStr = ch;
                    continue;
                }
                if (ch === '(')
                    depth++;
                else if (ch === ')')
                    depth--;
            }
            const args = allSource.slice(start, i - 1).replace(/\s+/g, ' ').trim();
            if (!/,\s*[\w.]+$/.test(args))
                bad.push(args.slice(0, 100));
        }
        assert(bad.length === 0,
            `connectObject missing owner argument:\n${bad.join('\n')}`);
    });

    test('extension enable/disable has no selective disable (EGO)', () => {
        assert(extensionJs.includes('enable()'));
        assert(extensionJs.includes('disable()'));
        assert(extensionJs.includes('dockManager?.destroy()') ||
            extensionJs.includes('dockManager.destroy()'));
    });

    test('timeouts are cleared before recreate / on destroy (EGO)', () => {
        assert(dockingJs.includes(
            'GLib.source_remove(this._removeBarrierTimeoutId)'));
        assert(dockingJs.includes(
            'GLib.source_remove(this._triggerTimeoutId)'));
        assert(dockingJs.includes(
            'GLib.source_remove(this._dockDwellTimeoutId)'));
    });

    test('schema includes TIDE running-indicator style', () => {
        assert(schema.includes("nick='TIDE'"),
            'TIDE must be in running-indicator-style enum');
        assert(schema.includes("value='11'"),
            'TIDE uses value 11');
    });

    test('no console.debug / debugger statements', () => {
        assert(!/\bconsole\.(log|debug|info)\b/.test(allSource));
        assert(!/\bdebugger\b/.test(allSource));
    });

    test('DockManager has a single settings instance getter', () => {
        const getters = dockingJs.match(/^\s*get settings\(\)/gm) || [];
        assertEqual(getters.length, 1,
            `duplicate get settings() found: ${getters.length}`);
    });
}
