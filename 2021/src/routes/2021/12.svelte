<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/12/data.json');

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

	interface Cave {
		name: string;
		size: 'small' | 'big';
		edges: string[];
	}

	let caves: { [key: string]: Cave } = {};

	const caveSize = (name: string): 'small' | 'big' => {
		return name.toUpperCase() === name ? 'big' : 'small';
	};

	function run(dataType: 'test' | 'input'): void {
		console.clear();
		console.log('Running ', dataType);
		console.log(data[dataType]);
		const newCaves = {};

		const edges = data[dataType].split('\n');
		edges.forEach((e) => {
			const [c1, c2] = e.split('-');
			const cave1: Cave = newCaves[c1] || { name: c1, size: caveSize(c1), edges: [] };
			const cave2: Cave = newCaves[c2] || { name: c2, size: caveSize(c2), edges: [] };
			if (!newCaves[c1]) newCaves[c1] = cave1;
			if (!newCaves[c2]) newCaves[c2] = cave2;
			if (c2 !== 'start') cave1.edges.push(c2);
			if (c1 !== 'start') cave2.edges.push(c1);
		});
		caves = { ...newCaves };
		console.log(caves);

		const findPathFrom = (name: string, visitedSmallCaves: string[]): string[][] => {
			if (name === 'end') return [[name]];

			if (caveSize(name) === 'small') {
				visitedSmallCaves = [...visitedSmallCaves, name];
			}

			// Get all possible subpaths
			const paths = caves[name].edges.filter((p) => !visitedSmallCaves.includes(p));
			const subpaths = paths
				.map((p) => findPathFrom(p, visitedSmallCaves))
				.reduce((p, v) => p.concat(v), []);

			console.log(`Subpaths from ${name}:`, subpaths);

			// Prepend this node and return list
			return subpaths.map((sp) => [name, ...sp]);
		};

		const possiblePaths1 = findPathFrom('start', []);
		console.log(`Part 1: Possible paths rule 1: ${possiblePaths1.length}`);

		const findPathFrom2 = (name: string, visitedSmallCaves: string[]): string[][] => {
			if (name === 'end') return [[name]];
			if (visitedSmallCaves.length > 10) {
				return [];
			}

			if (caveSize(name) === 'small') {
				visitedSmallCaves = [...visitedSmallCaves, name];
			}

			const revisitPossible: boolean = visitedSmallCaves.reduce(
				// (possible, curr, idx, arr) => possible && !arr.includes(curr, idx + 1),
				(possible, curr, idx, arr) => {
					const p = possible && arr.filter((f) => f == curr).length === 1;
					// console.log('POSSIBLE:', p, possible, curr, idx, arr);
					return p;
				},
				true
			);

			// Get all possible subpaths
			const paths = caves[name].edges.filter(
				(p) => revisitPossible || !visitedSmallCaves.includes(p)
			);

			console.log(`Cave ${visitedSmallCaves.join(',')}
Can revisit: ${revisitPossible}
Outbound paths: ${paths.join(',')}`);

			const subpaths = paths
				.map((p) => findPathFrom2(p, visitedSmallCaves))
				.reduce((p, v) => p.concat(v), []);

			// console.log(`Subpaths from ${name}:`, subpaths);

			// Prepend this node and return list
			return subpaths.map((sp) => [name, ...sp]);
		};
		const possiblePaths2 = findPathFrom2('start', []);
		// console.log(
		// 	possiblePaths2
		// 		.map((caves) => caves.join(','))
		// 		.sort()
		// 		.join('\n')
		// );
		console.log(`Part 2: Possible paths rule 2: ${possiblePaths2.length}`);
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>

<div>{JSON.stringify(caves)}</div>
