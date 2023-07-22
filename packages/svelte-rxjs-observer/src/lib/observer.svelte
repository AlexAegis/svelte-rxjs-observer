<script lang="ts">
	import type { Observable, Subscription } from 'rxjs';
	import { onDestroy } from 'svelte';

	// Old generic syntax, remove once the <script lang="ts" generics="T"> is
	// properly supported by https://github.com/sveltejs/eslint-plugin-svelte/issues/521
	type T = $$Generic;

	interface $$Slots {
		default: {
			next: T;
		};
		error: {
			last: T;
			error: unknown;
		};
		pending: unknown;
		completed: {
			last: T;
		};
	}

	export let observable: Observable<T> | undefined | null;

	let completed = false;
	let pending = true;
	let next!: T;
	let error: unknown = undefined;

	let subscription: Subscription | undefined;

	$: {
		completed = false;
		pending = true;
		error = undefined;
		next = undefined as T;
		if (subscription) {
			subscription.unsubscribe();
		}
		subscription = observable?.subscribe({
			next: (n) => {
				next = n;
				pending = false;
			},
			error: (e) => {
				error = e;
			},
			complete: () => (completed = true),
		});
	}

	onDestroy(() => subscription?.unsubscribe());
</script>

{#if completed}
	<slot name="completed" last="{next}" />
{:else if error}
	<slot name="error" {error} last="{next}" />
{:else if pending}
	<slot name="pending" />
{:else}
	<slot {next} />
{/if}
