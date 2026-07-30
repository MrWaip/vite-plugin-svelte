import node from '@sveltejs/adapter-node';
import { vitePreprocess } from '@mrwaip/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: node()
	}
};
export default config;
