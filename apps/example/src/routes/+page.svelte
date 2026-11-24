<script lang="ts">
	import hljs from 'highlight.js';
	import { Observable, Subject, Subscription, map } from 'rxjs';
	import packageJson from '../../../../package.json';

	import { onDestroy } from 'svelte';
	import { Observer } from 'svelte-rxjs-observer';

	let count = 0;

	let subject: Subject<number>;
	let observable: Observable<number>;

	function reset() {
		count = 0;
		subject = new Subject<number>();
		observable = subject.pipe(
			map((c) => {
				if (typeof c !== 'number') {
					// eslint-disable-next-line unicorn/prefer-type-error
					throw new Error('Not a number!');
				}
				return c;
			}),
		);
	}
	reset();
	function next() {
		count += 1;
		subject.next(count);
	}

	function error() {
		// I'm not using subject.error because that will leak the error to the console regardless
		// if the pipe has a catchError or not. `reportUnhandledError` will report it.
		subject.next("I'm a lie" as unknown as number);
	}

	function stringify(o: object): string {
		return JSON.stringify(o, undefined, 2);
	}

	let subjectState: 'cold' | 'hot' | 'completed' | 'errored';
	let subscription: Subscription | undefined;

	$: {
		if (subscription) {
			subscription.unsubscribe();
		}
		subjectState = 'cold';
		subscription = observable.subscribe({
			next: () => (subjectState = 'hot'),
			error: () => (subjectState = 'errored'),
			complete: () => (subjectState = 'completed'),
		});
	}

	const errorType = undefined as unknown as TypeError;

	onDestroy(() => subscription?.unsubscribe());

	// eslint-disable-next-line unicorn/no-incorrect-template-string-interpolation
	const observerCode = `<Observer {observable} let:next {errorType}>
	{stringify({ next })}
	<svelte:fragment slot="pending">
		{stringify({ slot: 'pending' })}
	</svelte:fragment>
	<svelte:fragment slot="error" let:error let:last>
		{stringify({ slot: 'error', error: { message: error.message }, last })}
	</svelte:fragment>
	<svelte:fragment slot="completed" let:last>
		{stringify({ slot: 'completed', last })}
	</svelte:fragment>
</Observer>`;

	function highlight(node: HTMLElement) {
		hljs.highlightElement(node);
	}
</script>

<div class="app">
	<h1 class="h2">{packageJson.name} ({packageJson.version})</h1>
	<div class="controls">
		<button
			type="button"
			class="btn {subjectState === 'errored' || subjectState === 'completed'
				? 'preset-filled-primary-500'
				: 'preset-outlined-surface-500'}"
			on:click={reset}
		>
			Reset
		</button>
		<button
			type="button"
			class="btn {subjectState === 'errored' || subjectState === 'completed'
				? 'preset-outlined-surface-500'
				: 'preset-filled'}"
			on:click={next}
		>
			Next
		</button>
		<button
			type="button"
			class="btn {subjectState === 'errored'
				? 'preset-outlined-error-500'
				: subjectState === 'completed'
					? 'preset-outlined-surface-500'
					: 'preset-filled'}"
			on:click={error}
		>
			Error
		</button>
		<button
			type="button"
			class="btn {subjectState === 'errored'
				? 'preset-outlined-surface-500'
				: subjectState === 'completed'
					? 'preset-outlined-tertiary-500'
					: 'preset-filled'}"
			on:click={() => subject.complete()}
		>
			Complete
		</button>
	</div>

	<h2 class="h4">Value with the Observer component</h2>
	<code class="pre">
		<Observer {observable} let:next {errorType}>
			{stringify({ next })}
			<svelte:fragment slot="pending">
				{stringify({ slot: 'pending' })}
			</svelte:fragment>
			<svelte:fragment slot="error" let:error let:last>
				{stringify({ slot: 'error', error: { message: error.message }, last })}
			</svelte:fragment>
			<svelte:fragment slot="completed" let:last>
				{stringify({ slot: 'completed', last })}
			</svelte:fragment>
		</Observer>
	</code>

	<aside class="card preset-tonal-surface p-2">
		After an 'error' or a 'complete' emission, an observable won't emit anymore
	</aside>

	<pre class="pre"><code class="language-html" use:highlight>{observerCode}</code></pre>

	<h2 class="h4">Value with regular store subscription:</h2>
	<code class="pre">
		{$subject}
	</code>

	<pre class="pre"><code class="language-html" use:highlight>{'{$subject}'}</code></pre>

	<aside class="card preset-tonal-surface p-2">
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
		place-content: center;
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
