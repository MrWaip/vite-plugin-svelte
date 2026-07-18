/** @import { CompileSvelte } from '../types/compile.js' */
/** @import { ResolvedOptions } from '../types/options.js' */
/** @import { PluginAPI } from '../types/plugin-api.js' */
/** @import { Plugin } from 'vite' */

import { toRollupError } from '../utils/error.js';
import { logCompilerWarnings } from '../utils/log.js';
import { measureAsync } from '../utils/profile.js';

/**
 * @param {PluginAPI} api
 * @returns {Plugin}
 */
export function compile(api) {
	/**
	 * @type {ResolvedOptions}
	 */
	let options;

	/**
	 * @type {CompileSvelte}
	 */
	let compileSvelte;
	/** @type {Plugin} */
	const plugin = {
		name: 'vite-plugin-svelte:compile',
		configResolved() {
			//@ts-expect-error defined below but filter not in type
			plugin.transform.filter = api.filter;
			options = api.options;
			compileSvelte = api.compileSvelte;
		},
		transform: {
			async handler(code, id) {
				return measureAsync('hook:compile-transform', id, async () => {
					const ssr = this.environment.config.consumer === 'server';
					const svelteRequest = api.idParser(id, ssr);
					if (!svelteRequest || svelteRequest.raw) {
						return;
					}
					let compileData;
					const wantsSourcemap =
						!options.isBuild || this.environment.config.build.sourcemap !== false;
					try {
						compileData = await compileSvelte(
							svelteRequest,
							code,
							options,
							wantsSourcemap ? this.getCombinedSourcemap() : undefined
						);
					} catch (e) {
						throw toRollupError(e, options);
					}
					if (compileData.compiled?.warnings) {
						logCompilerWarnings(svelteRequest, compileData.compiled.warnings, options);
					}

					if (options.isBuild && compileData.compiled.css) {
						api.cssCache.set(svelteRequest.filename, compileData.compiled.css);
					}

					return {
						...compileData.compiled.js,
						moduleType: 'js',
						meta: {
							vite: {
								lang: compileData.lang
							},
							svelte: {
								css: compileData.compiled.css
							}
						}
					};
				});
			}
		}
	};
	return plugin;
}
