// librarySvelteViteConfig
import { libraryViteConfig } from '@alexaegis/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, mergeConfig } from 'vite';

export default mergeConfig(
	libraryViteConfig,
	defineConfig({
		plugins: [svelte({})],
	})
);
