<script>
	// Most of your app wide CSS should be put in this file
	import 'highlight.js/styles/github-dark.css';
	import packageJson from '../../../../package.json';
	import '../app.css';
</script>

<div class="flex h-full flex-col">
	<header class="preset-filled-surface-100-900 flex items-center justify-between p-4">
		<strong class="text-xl uppercase">{packageJson.name}</strong>
		<a
			class="btn btn-sm preset-outlined-surface-500"
			href="https://github.com/AlexAegis/svelte-rxjs-observer"
			target="_blank"
			rel="noreferrer"
		>
			GitHub
		</a>
	</header>

	<main class="flex-1 overflow-y-auto">
		<div class="main-layout">
			<slot />
		</div>
	</main>
</div>

<style>
	.main-layout {
		padding: 1em;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
