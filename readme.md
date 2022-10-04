# svelte-rxjs-observer

[![Latest NPM Version](https://img.shields.io/npm/v/svelte-rxjs-observer/latest)](https://www.npmjs.com/package/svelte-rxjs-observer)
[![CI](https://github.com/AlexAegis/svelte-rxjs-observer/workflows/CI/badge.svg)](https://github.com/AlexAegis/svelte-rxjs-observer/actions?query=workflow%3ACI)

A tiny component that observes observables for you

## Usage

Install:

```sh
npm install svelte-rxjs-observer
```

## Example

```html
<script lang="ts">
  import { Subject } from 'rxjs';
  import { Observer } from 'svelte-rxjs-observer';

  let subject = new Subject<number>();
</script>

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
```
