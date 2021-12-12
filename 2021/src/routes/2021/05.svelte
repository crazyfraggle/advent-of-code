<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/05/data.json');

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
		console.log(data[dataType].length);

		const lines = data[dataType]
			.split('\n')
			.filter((line) => line !== '')
			.map((line) =>
				line.split(' -> ').map((tuple) => tuple.split(',').map((number) => parseInt(number)))
			)
			.map((fume) => ({
				start: { x: fume[0][0], y: fume[0][1] },
				end: { x: fume[1][0], y: fume[1][1] }
			}));

		const hvLines = lines
			// Include vertical or horisontal lines only
			.filter((fume) => fume.start.x === fume.end.x || fume.start.y === fume.end.y);

		const diagonals = lines
			// Include vertical or horisontal lines only
			.filter(
				(fume) => Math.abs(fume.start.x - fume.end.x) === Math.abs(fume.start.y - fume.end.y)
			);

		console.log(hvLines, diagonals);

		const writeArray = new Array(1000 * 1000).fill(0);
		const incPoint = (x: number, y: number): void => {
			writeArray[x + y * 1000] += 1;
		};
		hvLines.forEach((line) => {
			// Draw a line in the writeArray
			if (line.start.x === line.end.x) {
				for (
					let y = Math.min(line.start.y, line.end.y);
					y <= Math.max(line.start.y, line.end.y);
					y++
				) {
					incPoint(line.start.x, y);
				}
			} else {
				for (
					let x = Math.min(line.start.x, line.end.x);
					x <= Math.max(line.start.x, line.end.x);
					x++
				) {
					incPoint(x, line.start.y);
				}
			}
		});
		const overlaps1 = writeArray.filter((point) => point > 1).length;
		console.log(`Part 1: Got ${overlaps1} intersections`);

		diagonals.forEach((line) => {
			const len = Math.abs(line.start.x - line.end.x);
			const xDir = line.start.x - line.end.x > 0 ? -1 : 1;
			const yDir = line.start.y - line.end.y > 0 ? -1 : 1;
			for (let i = 0; i <= len; i++) {
				incPoint(line.start.x + i * xDir, line.start.y + i * yDir);
			}
		});

		const overlaps2 = writeArray.filter((point) => point > 1).length;
		console.log(`Part 2: Got ${overlaps2} intersections`);
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>

<!-- <canvas width="1000" height="1000" class="fumes" /> -->

<div class="consoled" />

<style>
	.consoled {
		white-space: pre-line;
	}
	.fumes {
		background-color: black;
	}
</style>
