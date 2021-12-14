<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/11/data.json');

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
	let flashes = 0;
	function iterate(input: number[]): number[] {
		const increased = input.map((o) => o + 1);

		const flashing = (toFlash: number[]): boolean => {
			let flashed = false;
			for (let i = 0; i < toFlash.length; i++) {
				if (toFlash[i] > 9) {
					// console.log('flash', toFlash[i]);
					const spread = [i - 11, i - 10, i - 9, i - 1, i + 1, i + 9, i + 10, i + 11];
					spread
						.filter((s) => s >= 0 && s < toFlash.length) // Avoid overflow
						.filter((s) => Math.abs((i % 10) - (s % 10)) <= 1) // Avoid wrapping
						.filter((s) => toFlash[s] >= 0) // Only increase unflashed octopi
						.forEach((s) => (toFlash[s] = toFlash[s] + 1));
					toFlash[i] = -1;
					flashed = true;
					flashes += 1;
				}
			}
			return flashed;
		};
		while (flashing(increased)) {
			// console.log('flashed', increased);
		}

		return increased.map((o) => (o < 0 ? 0 : o));
	}

	function write(s: number[]): void {
		const lines = [];
		for (let y = 0; y < 10; y++) {
			lines.push(s.slice(y * 10, (y + 1) * 10).join(''));
		}
		console.log(lines.join('\n'));
	}

	function run(dataType: 'test' | 'input'): void {
		console.clear();
		console.log('Running ', dataType);
		console.log(data[dataType]);
		flashes = 0;

		const octopi = data[dataType]
			.split('\n')
			.join('')
			.split('')
			.map((o) => parseInt(o));

		let octs = [...octopi];
		for (let i = 0; i < 1000; i++) {
			octs = iterate(octs);
			if (octs.filter((o) => o > 0).length === 0) {
				console.log(`Part 2: Everybody flashed at ${i + 1}`);
				break;
			}
			// write(octs);
		}
		console.log(`Part 1: ${flashes} flashes`);
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>
