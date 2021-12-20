<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/14/data.json');

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
		const polymer = lines[0];
		const pairs = lines
			.splice(2)
			.reduce<{ [key: string]: { target?: string; count: number } }>((rules, line) => {
				const [rule, char] = line.split(' -> ');
				return { ...rules, [rule]: { target: char, count: 0 } };
			}, {});

		// This was a bad idea from the start...
		// let polymorph = polymer;
		// console.log(insertionRules);
		// for (let l = 0; l < 40; l++) {
		// 	for (let i = 0; i < polymorph.length; i++) {
		// 		const currentPair = polymorph.substring(i, i + 2);
		// 		// console.log(`currentPair: ${currentPair}`);
		// 		if (insertionRules[currentPair]) {
		// 			polymorph =
		// 				polymorph.substring(0, i) +
		// 				currentPair.split('').join(insertionRules[currentPair]) +
		// 				polymorph.substring(i + 2);
		// 			// console.log(
		// 			// 	`Rule ${currentPair}=>${insertionRules[currentPair]} results in ${polymorph}`
		// 			// );
		// 			i++;
		// 		}
		// 	}
		// }
		// const chars = {};
		// // console.log(polymorph);
		// // Count chars and sort.
		// for (let i = 0; i < polymorph.length; i++) {
		// 	if (chars[polymorph[i]]) {
		// 		chars[polymorph[i]]++;
		// 	} else {
		// 		chars[polymorph[i]] = 1;
		// 	}
		// }
		// console.log(chars);

		const increaseCount = (pair: string, inc: number) => {
			if (pairs[pair]) {
				pairs[pair].count += inc;
			} else {
				// Pair without an insertion rule
				pairs[pair] = { count: inc };
			}
		};
		const listPairCounts = (): string => {
			return Object.keys(pairs)
				.map((p) => `${p}:${pairs[p].count}`)
				.join(',');
		};
		const charCount = (): { [key: string]: number } => {
			return Object.keys(pairs)
				.map((pair) => [pair[0], pairs[pair].count])
				.reduce((a, v) => {
					if (a[v[0]]) {
						a[v[0]] += v[1];
					} else {
						a[v[0]] = v[1];
					}
					return a;
				}, {});
		};

		// Seed rules from polymer
		for (let i = 0; i < polymer.length; i++) {
			const pair = polymer.substring(i, i + 2);
			increaseCount(pair, 1);
		}

		for (let i = 1; i <= 40; i++) {
			const increases = Object.keys(pairs)
				.map((rule) => {
					if (pairs[rule].target && pairs[rule].count > 0) {
						return [
							{ pair: rule[0] + pairs[rule].target, inc: pairs[rule].count },
							{ pair: pairs[rule].target + rule[1], inc: pairs[rule].count },
							{ pair: rule, inc: 0 - pairs[rule].count }
						];
					}
					return [];
				})
				.reduce((a, v) => a.concat(v));

			increases.forEach((tp) => increaseCount(tp.pair, tp.inc));

			if (i === 10 || i === 40) {
				const cc = charCount();
				const counts = Object.keys(cc)
					.map((k) => cc[k])
					.sort((a, b) => b - a);
				const diff = counts[0] - counts[counts.length - 1];
				console.log(`After ${i} iterations: ${diff}`);
			}
		}

		// Find diff between most common and least common.
		// console.log(`Part 1: Solution: ${diff}`);
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>

<canvas width="1200" height="1000" id="cancan" />
