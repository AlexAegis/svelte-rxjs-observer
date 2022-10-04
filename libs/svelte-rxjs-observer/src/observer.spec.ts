import { render, RenderResult, waitFor } from '@testing-library/svelte';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import ObserverTest from './observer-test.svelte';

describe('observer', () => {
	let instance: RenderResult<ObserverTest>;
	let subject: Subject<string>;

	const pending = 'pending';
	const error = 'error';
	const complete = 'complete';

	beforeEach(() => {
		subject = new Subject();
		instance = render(ObserverTest, { props: { subject } });
	});

	async function assertExists(value: string) {
		const element = await waitFor(() => instance.getByText(value));
		expect(element.textContent).toBe(value);
	}

	it('should be able to render', () => {
		expect(instance.component).toBeTruthy();
	});

	it('should display the content of the pending slot before any emission happens', () => {
		const element = instance.getByText(pending);
		expect(element.textContent).toEqual(pending);
	});

	it('should display the content of the error slot when an error happens', async () => {
		subject.error(error);
		await assertExists(error);
	});

	it('should display the content of the complete slot when the observable completes', async () => {
		subject.complete();
		await assertExists(complete);
	});

	it('should display the content of the next slot when the observable emits', async () => {
		const firstEmit = 'foo';
		const secondEmit = 'bar';
		subject.next(firstEmit);
		await assertExists(firstEmit);

		subject.next(secondEmit);
		await assertExists(secondEmit);
	});

	it('should not emit after the observable completes, but resubscribe to a new observable', async () => {
		const firstEmit = 'foo';
		const secondEmit = 'bar';
		const thirdEmit = 'zed';
		await assertExists(pending);
		subject.next(firstEmit);
		subject.next(firstEmit);
		await assertExists(firstEmit);
		subject.complete();
		await assertExists(complete);
		subject.next(secondEmit);
		await assertExists(complete);
		const nextSubject = new Subject<string>();
		instance.rerender({ props: { subject: nextSubject } });
		await assertExists(pending);
		nextSubject.next(thirdEmit);
		await assertExists(thirdEmit);
	});
});
