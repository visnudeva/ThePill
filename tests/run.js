#!/usr/bin/env node
/**
 * Minimal test runner for The Pill (no GNOME Shell required).
 */
import {readdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname);

let passed = 0;
let failed = 0;
const failures = [];

export function test(name, fn) {
    try {
        const result = fn();
        if (result && typeof result.then === 'function') {
            throw new Error(`Async test "${name}" must be awaited by suite`);
        }
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (e) {
        failed++;
        failures.push({name, error: e});
        console.log(`  ✗ ${name}`);
        console.log(`    ${e.message}`);
    }
}

export async function testAsync(name, fn) {
    try {
        await fn();
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (e) {
        failed++;
        failures.push({name, error: e});
        console.log(`  ✗ ${name}`);
        console.log(`    ${e.message}`);
    }
}

export function assert(condition, message) {
    if (!condition)
        throw new Error(message || 'Assertion failed');
}

export function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(
            (message || 'Values not equal') +
            `\n      expected: ${JSON.stringify(expected)}` +
            `\n      actual:   ${JSON.stringify(actual)}`
        );
    }
}

export function assertDeepEqual(actual, expected, message) {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) {
        throw new Error(
            (message || 'Objects not equal') +
            `\n      expected: ${b}` +
            `\n      actual:   ${a}`
        );
    }
}

const files = (await readdir(root))
    .filter(f => f.endsWith('.test.js'))
    .sort();

console.log('The Pill — test suite\n');

for (const file of files) {
    console.log(`${file}`);
    const mod = await import(pathToFileURL(path.join(root, file)).href);
    if (typeof mod.run === 'function')
        await mod.run({test, testAsync, assert, assertEqual, assertDeepEqual});
    console.log('');
}

console.log('─'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failures.length) {
    console.log('\nFailures:');
    for (const f of failures) {
        console.log(`  • ${f.name}: ${f.error.stack || f.error.message}`);
    }
    process.exit(1);
}
