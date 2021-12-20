<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/13/data.json');

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
		console.log(data[dataType]);

		const lines = data[dataType].split('\n');
		const dots = lines
			.filter((l) => l.match(/[\d+]\,[\d+]/))
			.map((l) => l.split(',').map((i) => parseInt(i)));
		const folds = lines
			.filter((l) => l.startsWith('fold along'))
			.map((l) => l.replace('fold along ', '').split('='))
			.map((f) => ({ dir: f[0], pos: parseInt(f[1]) }));

		console.log(dots, folds);

		let mutableDots = [...dots];
		folds.forEach((fold) => {
			console.log(`Folding ${fold.dir} along ${fold.pos}`);
			if (fold.dir === 'x') {
				// vertical fold
				mutableDots = mutableDots.map((dot) => {
					return dot[0] > fold.pos ? [fold.pos - (dot[0] - fold.pos), dot[1]] : dot;
				});
			} else {
				// horizontal fold
				mutableDots = mutableDots.map((dot) => {
					return dot[1] > fold.pos ? [dot[0], fold.pos - (dot[1] - fold.pos)] : dot;
				});
			}
			console.log(mutableDots);
			const uniqueDots = new Set(mutableDots.map((dot) => dot.join(',')));
			console.log(`Part 1: We got ${uniqueDots.size} dots after folding.`);
		});
		const canvas = <HTMLCanvasElement>document.getElementById('cancan');
		const context = canvas.getContext('2d', { alpha: false });
		mutableDots.forEach((dot) => {
			context.fillStyle = '#ffffff';

			context.fillRect(dot[0] * 4, dot[1] * 4, 3, 3);
		});
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>

<canvas width="1200" height="1000" id="cancan" />
