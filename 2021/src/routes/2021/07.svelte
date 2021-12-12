<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/07/data.json');

		if (res.ok) {
			const data: { test: string; input: string } = await res.json();

			return {
				props: { data }
			};
		}

		const { message } = await res.json();

		return {
			error: new Error(message)
		};
	};
</script>

<script lang="ts">
	export let data: { test: string; input: string };

	function run(dataType: 'test' | 'input'): void {
		console.log('Running ', dataType);
		console.log(data[dataType]);

		let initialPositions = data[dataType].split(',').map((i) => parseInt(i));

		// Find median
		const sortedPositions = initialPositions.sort((a, b) => a - b); // Thank you JS for alfabetically sorting numbers...
		const median = sortedPositions[Math.floor(sortedPositions.length / 2)];

		console.log('Median', median);

		// Calculate cost of moving all to median
		const cost = sortedPositions.map((pos) => Math.abs(pos - median)).reduce((a, v) => a + v);
		console.log(`Part 1: Cost of moving to ${median} is ${cost}.`);

		const averagePosition = Math.round(
			initialPositions.reduce((a, v) => a + v) / initialPositions.length
		);
		const incrementalCost = (n: number): number => {
			let cost = n;
			while (n > 0) {
				cost += --n;
			}
			return cost;
		};
		for (let n = averagePosition - 2; n < averagePosition + 3; n++) {
			const cost2 = initialPositions
				.map((pos) => incrementalCost(Math.abs(pos - n)))
				.reduce((a, v) => a + v);
			console.log(`Part 2: Cost of moving to ${n} is ${cost2}.`);
		}
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>
