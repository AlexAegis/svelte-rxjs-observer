<script lang="ts">
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import { Subject } from 'rxjs';
	import packageJson from '../../../../package.json';

	import { Observer } from 'svelte-rxjs-observer';

	let count = 0;
	let subject = new Subject<number>();

	function reset() {
		count = 0;
		subject = new Subject();
	}
</script>

<div class="app">
	<h1>{packageJson.name} ({packageJson.version})</h1>
	<div class="controls">
		<button type="button" class="btn variant-filled" on:click="{reset}"> Reset </button>
		<button
			type="button"
			class="btn variant-filled"
			on:click="{() => subject.next((count = count + 1))}"
		>
			Next
		</button>
		<button
			type="button"
			class="btn variant-filled"
			on:click="{() => subject.error('Error message')}"
		>
			Error
		</button>
		<button type="button" class="btn variant-filled" on:click="{() => subject.complete()}">
			Complete
		</button>
	</div>

	<h2>Value with regular $subject:</h2>
	<p>
		{$subject}
	</p>

	<CodeBlock language="html" code="{`{$subject}`}" />

	<h2>Value with the Observer component</h2>

	<div>
		<Observer observable="{subject}" let:next>
			Next: {next}
			<svelte:fragment slot="pending">Pending</svelte:fragment>
			<svelte:fragment slot="error" let:error let:last>
				Error: {error}. last received: {last}
			</svelte:fragment>
			<svelte:fragment slot="completed" let:last>
				Completed. Last received: {last}
			</svelte:fragment>
		</Observer>
	</div>

	<CodeBlock
		language="html"
		code="{`
<Observer observable="{subject}" let:next>
	Next: {next}
	<svelte:fragment slot="pending">Pending</svelte:fragment>
	<svelte:fragment slot="error" let:error let:last>
		Error: {error}. last received: {last}
	</svelte:fragment>
	<svelte:fragment slot="completed" let:last>
		Completed. Last received: {last}
	</svelte:fragment>
</Observer>
		`}"
	/>

	<span> (After an 'error' or a 'complete' emission, an observable won't emit anymore) </span>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		gap: 1em;
		margin: auto;
		justify-content: center;
		align-content: center;
		width: 40em;
		margin-top: 2em;
	}

	button {
		width: 8em;
	}

	.controls {
		display: flex;
		gap: 1em;
		width: 100%;
		justify-content: space-between;
	}

	span {
		color: gray;
	}
</style>
