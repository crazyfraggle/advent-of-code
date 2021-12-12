<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/09/data.json');

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
		console.clear();
		console.log('Running ', dataType);
		console.log(data[dataType].replace(/9/g, ' '));

		const heights = data[dataType]
			.split('\n')
			.map((line) => line.split('').map((d) => parseInt(d)));
		console.log(heights);

		const width = heights[0].length;
		const height = heights.length;
		console.log(`Width: ${width}, height: ${height}`);
		const lows = new Array<number>();

		function isLowPoint(x: number, y: number): boolean {
			const ctrl = heights[y][x];
			const adjacents: number[] = [];
			if (x > 0) adjacents.push(heights[y][x - 1]);
			if (y > 0) adjacents.push(heights[y - 1][x]);
			if (x < width - 1) adjacents.push(heights[y][x + 1]);
			if (y < height - 1) adjacents.push(heights[y + 1][x]);

			return adjacents.reduce((a, v) => a && v > ctrl, true);
		}

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (isLowPoint(x, y)) {
					lows.push(heights[y][x]);
				}
			}
		}
		const totalRisk = lows.map((l) => l + 1).reduce((a, v) => a + v);
		console.log(`Part 1: Total risk factor is ${totalRisk}`);

		const flatHeights: number[] = [].concat(...heights);
		// Part 2: Find Basins
		// console.log(JSON.stringify(heights));
		let basinBase = 10;
		let basinCount = 0;
		let currentBasin: number;
		for (let x = 0; x < flatHeights.length; x++) {
			// New line, reset basin
			if (x % width == 0) {
				currentBasin = undefined;
			}
			if (flatHeights[x] < 9) {
				if (!currentBasin) {
					// In a new basin
					basinCount += 1;
					currentBasin = basinBase + basinCount;
				}
				flatHeights[x] = currentBasin;
				if (x + width < flatHeights.length && flatHeights[x + width] < 9) {
					flatHeights[x + width] = currentBasin;
				}
			} else if (flatHeights[x] == 9) {
				// Found wall. Reset current basin
				currentBasin = undefined;
			} else if (flatHeights[x] >= basinBase) {
				// found an existing basin
				if (!currentBasin) {
					currentBasin = flatHeights[x];
					if (x + width < flatHeights.length && flatHeights[x + width] < 9) {
						flatHeights[x + width] = currentBasin;
					}
				} else if (flatHeights[x] === currentBasin) {
					// Mark  downwards.
					if (x + width < flatHeights.length && flatHeights[x + width] < 9) {
						flatHeights[x + width] = currentBasin;
					}
				} else {
					// Need to merge basins
					const oldBasin = flatHeights[x];
					console.log(
						`Need to merge ${currentBasin} and ${oldBasin} at ${x % width},${(x / width) | 1}`
					);
					for (let i = 0; i < flatHeights.length; i++) {
						if (flatHeights[i] == oldBasin) {
							flatHeights[i] = currentBasin;
						}
					}
					if (x + width < flatHeights.length && flatHeights[x + width] < 9) {
						flatHeights[x + width] = currentBasin;
					}
				}
			}
		}
		console.log(flatHeights);

		// Gather basin sizes
		const basins = flatHeights
			.filter((h) => h >= basinBase)
			.reduce((a, v) => {
				if (a[v]) {
					a[v] += 1;
				} else {
					a[v] = 1;
				}
				return a;
			}, []);
		const sorted = basins.filter((b) => !!b).sort((a, b) => b - a);
		console.log(sorted);
		const solution = sorted[0] * sorted[1] * sorted[2]; // product of 3 largest basin sizes
		console.log(`Part 2: Total risk factor is ${solution}`);
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>
<!-- 
[11,11,09,09,09,12,12,12,12,12],
[11,09,13,13,13,09,12,09,12,12],
[09,14,13,13,13,14,09,15,09,12],
[12,14,12,12,12,09,16,15,16,09],
[09,17,09,09,09,18,16,18,16,18]] -->
11,11,__,__,__,12,12,12,12,12, 11,__,16,16,16,__,12,__,12,12, __,16,16,16,16,16,__,19,__,12, 16,16,16,16,16,__,19,19,19,__,
__,18,__,__,__,19,19,19,19,19 11,11,__,__,__,12,12,12,12,12, 11,__,16,16,16,__,12,__,12,12, __,16,16,16,16,16,__,18,__,12,
16,16,16,16,16,__,18,18,18,__, __,16,__,__,__,18,18,18,18,18
