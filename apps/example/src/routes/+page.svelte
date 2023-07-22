<script lang="ts">
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import { Subject, Subscription } from 'rxjs';
	import packageJson from '../../../../package.json';

	import { onDestroy } from 'svelte';
	import { Observer } from 'svelte-rxjs-observer';

	let count = 0;
	let subject = new Subject<number>();

	function reset() {
		count = 0;
		subject = new Subject();
	}

	let subjectState: 'cold' | 'hot' | 'completed' | 'errored';
	let subscription: Subscription | undefined;
	$: {
		if (subscription) {
			subscription.unsubscribe();
		}
		subjectState = 'cold';
		subscription = subject.subscribe({
			next: () => (subjectState = 'hot'),
			error: () => (subjectState = 'errored'),
			complete: () => (subjectState = 'completed'),
		});
	}

	onDestroy(() => subscription?.unsubscribe());
</script>

<div class="app">
	<h1 class="h2">{packageJson.name} ({packageJson.version})</h1>
	<div class="controls">
		<button
			type="button"
			class="btn {subjectState === 'errored' || subjectState === 'completed'
				? 'variant-filled-primary'
				: 'variant-ghost'}"
			on:click="{reset}"
		>
			Reset
		</button>
		<button
			type="button"
			class="btn {subjectState === 'errored' || subjectState === 'completed'
				? 'variant-ghost'
				: 'variant-filled'}"
			on:click="{() => subject.next((count = count + 1))}"
		>
			Next
		</button>
		<button
			type="button"
			class="btn {subjectState === 'errored'
				? 'variant-ghost-error'
				: subjectState === 'completed'
				? 'variant-ghost'
				: 'variant-filled'}"
			on:click="{() => subject.error('Error message')}"
		>
			Error
		</button>
		<button
			type="button"
			class="btn {subjectState === 'errored'
				? 'variant-ghost'
				: subjectState === 'completed'
				? 'variant-ghost-tertiary'
				: 'variant-filled'}"
			on:click="{() => subject.complete()}"
		>
			Complete
		</button>
	</div>

	<h2 class="h4">Value with the Observer component</h2>
	<code class="code">
		<Observer observable="{subject}" let:next>
			{JSON.stringify({ next }, undefined, 2)}
			<svelte:fragment slot="pending">
				{JSON.stringify({ slot: 'pending' }, undefined, 2)}
			</svelte:fragment>
			<svelte:fragment slot="error" let:error let:last>
				{JSON.stringify({ slot: 'error', error, last }, undefined, 2)}
			</svelte:fragment>
			<svelte:fragment slot="completed" let:last>
				{JSON.stringify({ slot: 'completed', last }, undefined, 2)}
			</svelte:fragment>
		</Observer>
	</code>

	<aside class="aside card variant-glass p-2">
		After an 'error' or a 'complete' emission, an observable won't emit anymore
	</aside>

	<CodeBlock
		language="html"
		code="{`
<Observer observable="{subject}" let:next>
	{JSON.stringify({ next })}
	<svelte:fragment slot="pending">
		{JSON.stringify({ slot: 'pending' })}
	</svelte:fragment>
	<svelte:fragment slot="error" let:error let:last>
		{JSON.stringify({ slot: 'error', error, last })}
	</svelte:fragment>
	<svelte:fragment slot="completed" let:last>
		{JSON.stringify({ slot: 'completed', last })}
	</svelte:fragment>
</Observer>
		`}"
	/>

	<h2 class="h4">Value with regular store subscription:</h2>
	<code class="code">
		{$subject}
	</code>

	<CodeBlock language="html" code="{`{$subject}`}" />

	<aside class="aside card variant-glass p-2">
		With a regular <code>$</code> you won't get access to the error or completion states of an observable,
		nor do you have a fallback if it haven't yet emitted (Which is not a possible scenario for signal
		like structures that are more similar to BehaviorSubjects).
	</aside>
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
</style>
