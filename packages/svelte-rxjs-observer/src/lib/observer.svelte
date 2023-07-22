<script lang="ts" generics="T, E">
	import type { Observable, Subscription } from 'rxjs';
	import { onDestroy } from 'svelte';

	interface $$Slots {
		default: {
			next: T;
		};
		error: {
			last: T;
			error: E;
		};
		pending: unknown;
		completed: {
			last: T;
		};
	}

	export let observable: Observable<T> | undefined | null;
	export let errorType: E = undefined as E; // For generic inference only

	let completed = false;
	let pending = true;
	let next!: T;
	let error: E;

	let subscription: Subscription | undefined;

	$: {
		errorType = undefined as E; // Just so it's not unused
		completed = false;
		pending = true;
		error = undefined as E;
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
