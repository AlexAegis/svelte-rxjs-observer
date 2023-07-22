# [svelte-rxjs-observer](https://github.com/AlexAegis/svelte-rxjs-observer#readme)

[![npm](https://img.shields.io/npm/v/svelte-rxjs-observer/latest)](https://www.npmjs.com/package/svelte-rxjs-observer)
[![ci](https://github.com/AlexAegis/svelte-rxjs-observer/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/svelte-rxjs-observer/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/c2f27ff062b74be1a141e215bdd39fcb)](https://app.codacy.com/gh/AlexAegis/svelte-rxjs-observer/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![codecov](https://codecov.io/github/AlexAegis/svelte-rxjs-observer/branch/master/graph/badge.svg?token=MUyY3RXTqa)](https://codecov.io/github/AlexAegis/svelte-rxjs-observer)
[![Vercel](https://vercelbadge.vercel.app/api/alexaegis/svelte-rxjs-observer)](https://vercel.com/alexaegis/svelte-rxjs-observer)

A tiny component that observes observables for you

[Example app available @ Vercel](https://svelte-rxjs-observer.vercel.app/)

## Usage

Install:

```sh
npm install svelte-rxjs-observer
```

## Examples

### Simple

```svelte
<script lang="ts">
  import { Subject } from 'rxjs';
  import { Observer } from 'svelte-rxjs-observer';

  let subject = new Subject<number>();
</script>

<Observer {subject} let:next>
  {next}
  <svelte:fragment slot="pending">loading...</svelte:fragment>
</Observer>
```

### Typed error and completion states

```svelte
<script lang="ts">
  import { Subject } from 'rxjs';
  import { Observer } from 'svelte-rxjs-observer';

  let subject = new Subject<number>();
  let errorType: TypeError; // Optinal typehint for the error
</script>

<Observer {subject} let:next {errorType}>
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
```
