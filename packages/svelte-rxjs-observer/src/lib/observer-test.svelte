<script lang="ts">
	import type { Subject } from 'rxjs';

	import Observer from './observer.svelte';

	export let subject: Subject<string> | undefined | null;
</script>

<Observer observable={subject} let:next>
	{next}
	<svelte:fragment slot="pending">pending</svelte:fragment>
	<svelte:fragment slot="error" let:error let:last>
		<span>{error}</span><span>{last}</span>
	</svelte:fragment>
	<svelte:fragment let:last slot="completed">
		<span>complete</span> <span>{last}</span>
	</svelte:fragment>
</Observer>
