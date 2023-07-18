<script lang="ts">
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
		<button on:click="{reset}"> Reset </button>
		<button on:click="{() => subject.next((count = count + 1))}"> Next </button>
		<button on:click="{() => subject.error('Error message')}"> Error </button>
		<button on:click="{() => subject.complete()}"> Complete </button>
	</div>
	{$subject}
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

	<span> (After an error or a complete emission an observable won't emit anymore) </span>
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
