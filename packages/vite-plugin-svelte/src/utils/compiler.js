/** @import { CompileOptions, ModuleCompileOptions } from 'svelte/compiler' */
/** @import { CompileOptions as RustCompileOptions, ModuleCompileOptions as RustModuleCompileOptions } from '@mrwaip/svelte-rs/compiler' */

import process from 'node:process';
import {
	VERSION,
	compile as compileWithJs,
	compileModule as compileModuleWithJs
} from 'svelte/compiler';
import {
	compile as compileWithRust,
	compileAsync as compileAsyncWithRust,
	compileModule as compileModuleWithRust,
	compileModuleAsync as compileModuleAsyncWithRust,
	preprocess
} from '@mrwaip/svelte-rs/compiler';
import { measure, measureAsync } from './profile.js';

const useJsCompiler = process.env.SVELTE_JS_COMPILER === '1';

/**
 * drops the options the rust compiler does not support
 *
 * the result is untyped on purpose, the rust and the js compiler describe the same options with
 * slightly different types, so each call site casts to the flavor it needs
 *
 * @param {CompileOptions | ModuleCompileOptions} [options]
 * @returns {Record<string, any>}
 */
function sanitizeCompileOptions(options) {
	const supportedOptions = { .../** @type {Record<string, any>} */ (options ?? {}) };
	delete supportedOptions.ast;
	delete supportedOptions.outputFilename;
	return supportedOptions;
}

/**
 * @param {string} source
 * @param {CompileOptions} [options]
 * @returns {any}
 */
export function compile(source, options) {
	return measure(`compile:${options?.generate ?? 'client'}`, options?.filename ?? '', () =>
		compileWithRust(source, /** @type {RustCompileOptions} */ (sanitizeCompileOptions(options)))
	);
}

/**
 * @param {string} source
 * @param {CompileOptions} [options]
 * @returns {Promise<any>}
 */
export function compileAsync(source, options) {
	if (useJsCompiler) {
		return measureAsync(
			`compileJs:${options?.generate ?? 'client'}`,
			options?.filename ?? '',
			async () =>
				compileWithJs(source, /** @type {CompileOptions} */ (sanitizeCompileOptions(options)))
		);
	}
	return measureAsync(
		`compileAsync:${options?.generate ?? 'client'}`,
		options?.filename ?? '',
		() =>
			compileAsyncWithRust(
				source,
				/** @type {RustCompileOptions} */ (sanitizeCompileOptions(options))
			)
	);
}

/**
 * @param {string} source
 * @param {ModuleCompileOptions} [options]
 * @returns {Promise<any>}
 */
export function compileModuleAsync(source, options) {
	return measureAsync(
		`compileModuleAsync:${options?.generate ?? 'client'}`,
		options?.filename ?? '',
		() =>
			compileModuleAsyncWithRust(
				source,
				/** @type {RustModuleCompileOptions} */ (sanitizeCompileOptions(options))
			)
	);
}

/**
 * @param {string} source
 * @param {ModuleCompileOptions} [options]
 * @returns {any}
 */
export function compileModule(source, options) {
	if (useJsCompiler) {
		return measure(
			`compileModuleJs:${options?.generate ?? 'client'}`,
			options?.filename ?? '',
			() =>
				compileModuleWithJs(
					source,
					/** @type {ModuleCompileOptions} */ (sanitizeCompileOptions(options))
				)
		);
	}
	return measure(`compileModule:${options?.generate ?? 'client'}`, options?.filename ?? '', () =>
		compileModuleWithRust(
			source,
			/** @type {RustModuleCompileOptions} */ (sanitizeCompileOptions(options))
		)
	);
}

/**
 * @param {string} source
 * @param {any} preprocessors
 * @param {any} [options]
 * @returns {any}
 */
function preprocessMeasured(source, preprocessors, options) {
	return measureAsync('preprocess:total', options?.filename ?? '', () =>
		preprocess(source, preprocessors, options)
	);
}

export { preprocessMeasured as preprocess, VERSION };
