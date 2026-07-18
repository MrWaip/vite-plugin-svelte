import fs from 'node:fs';
import process from 'node:process';

const enabled = !!process.env.SVELTE_RS_PROFILE;

/** @type {Map<string, {count: number, total: number, max: number, maxFile: string}>} */
const buckets = new Map();

/**
 * @param {string} name
 * @param {number} ns
 * @param {string} file
 */
export function record(name, ns, file) {
	let bucket = buckets.get(name);
	if (!bucket) {
		bucket = { count: 0, total: 0, max: 0, maxFile: '' };
		buckets.set(name, bucket);
	}
	bucket.count++;
	bucket.total += ns;
	if (ns > bucket.max) {
		bucket.max = ns;
		bucket.maxFile = file;
	}
}

/**
 * @template T
 * @param {string} name
 * @param {string} file
 * @param {() => T} fn
 * @returns {T}
 */
export function measure(name, file, fn) {
	if (!enabled) return fn();
	const start = process.hrtime.bigint();
	try {
		return fn();
	} finally {
		record(name, Number(process.hrtime.bigint() - start), file);
	}
}

/**
 * @template T
 * @param {string} name
 * @param {string} file
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function measureAsync(name, file, fn) {
	if (!enabled) return fn();
	const start = process.hrtime.bigint();
	try {
		return await fn();
	} finally {
		record(name, Number(process.hrtime.bigint() - start), file);
	}
}

export const profileEnabled = enabled;

if (enabled) {
	process.on('exit', () => {
		const rows = [...buckets.entries()].sort((a, b) => b[1].total - a[1].total);
		const lines = rows.map(
			([name, b]) =>
				`${name.padEnd(28)} calls=${String(b.count).padStart(6)} total=${(b.total / 1e6).toFixed(1).padStart(9)}ms avg=${(b.total / b.count / 1e6).toFixed(3).padStart(8)}ms max=${(b.max / 1e6).toFixed(1)}ms (${b.maxFile})`
		);
		const out = `\n=== svelte-rs profile (pid ${process.pid}) ===\n${lines.join('\n')}\n`;
		const target = process.env.SVELTE_RS_PROFILE_OUT;
		if (target) {
			fs.appendFileSync(target, out);
		}
		process.stderr.write(out);
	});
}

/**
 * @returns {import('vite').Plugin}
 */
export function phasePlugin() {
	const start = process.hrtime.bigint();
	let renderedChunks = 0;
	/** @param {string} name */
	const stamp = (name) => {
		if (!enabled) return;
		const ms = Number(process.hrtime.bigint() - start) / 1e6;
		process.stderr.write(`[phase] ${name} @ ${ms.toFixed(0)}ms\n`);
	};
	return {
		name: 'vite-plugin-svelte:phase-profile',
		options() {
			stamp(`options:${this.environment?.name ?? '?'}`);
		},
		writeBundle() {
			stamp(`writeBundle:${this.environment?.name ?? '?'}`);
		},
		renderChunk: {
			order: 'post',
			handler() {
				renderedChunks++;
				return null;
			}
		},
		buildStart() {
			stamp(`buildStart:${this.environment?.name ?? '?'}`);
		},
		buildEnd() {
			stamp(`buildEnd:${this.environment?.name ?? '?'}`);
		},
		renderStart() {
			stamp(`renderStart:${this.environment?.name ?? '?'}`);
		},
		generateBundle() {
			stamp(`generateBundle:${this.environment?.name ?? '?'}`);
		},
		closeBundle() {
			stamp(`closeBundle chunks=${renderedChunks}`);
		}
	};
}
