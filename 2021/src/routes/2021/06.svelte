<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/06/data.json');

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

		let ancestors = data[dataType].split(',').map((i) => parseInt(i));

		const ageAndReproduceFishes = (fishes: number[]): number[] => {
			let newAgeFish = fishes.map((age) => age - 1);
			const newBornFish = newAgeFish.filter((age) => age < 0).map((age) => 8);
			newAgeFish = newAgeFish.map((age) => (age >= 0 ? age : 6));
			return [...newAgeFish, ...newBornFish];
		};

		console.log(ancestors);
		let fishes = ancestors;
		for (let i = 1; i <= 80; i++) {
			fishes = ageAndReproduceFishes(fishes);
		}
		console.log(`Part 1: There are ${fishes.length} fishes after 80 days`);

		// Above does not scale... Take 2
		const countAncestors = (ancestors: number[]): number[] => {
			const fishCount = new Array<number>(9).fill(0);
			ancestors.forEach((age) => {
				fishCount[age] += 1;
			});
			return fishCount;
		};

		const simulateFishAgingAndReproduction_2_0 = (fishcount: number[]): number[] => {
			const newFishCount = [...fishcount];
			const parents = newFishCount.shift();
			newFishCount[6] += parents;
			newFishCount[8] = parents;
			return newFishCount;
		};

		let fishcount = countAncestors(ancestors);
		for (let i = 1; i <= 80; i++) {
			fishcount = simulateFishAgingAndReproduction_2_0(fishcount);
		}
		console.log(
			`Part 1 take 2: There are ${fishcount.reduce((p, v) => p + v)} fishes after 80 days`
		);

		fishcount = countAncestors(ancestors);
		for (let i = 1; i <= 256; i++) {
			fishcount = simulateFishAgingAndReproduction_2_0(fishcount);
		}
		console.log(`Part 2: There are ${fishcount.reduce((p, v) => p + v)} fishes after 256 days`);
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>
