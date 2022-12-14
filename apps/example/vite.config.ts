import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		chunkSplitPlugin({
			strategy: 'single-vendor',
			customSplitting: {
				rxjs: ['rxjs'],
			},
		}),
	],
	appType: 'spa',
});
