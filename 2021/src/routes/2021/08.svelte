<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/08/data.json');

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

		const displays = data[dataType].split('\n').map((line) => {
			const [inputs, outputs] = line.split(' | ');
			return { input: inputs.split(' '), output: outputs.split(' ') };
		});
		console.log(displays);

		const countOfIdentifiableNumbers = displays
			.map((display) => display.output.filter((n) => [2, 3, 4, 7].indexOf(n.length) != -1).length)
			.reduce((p, v) => p + v);
		console.log('Part 1: ', countOfIdentifiableNumbers);

		// Identify string->digit
		function identifyNumbers(strings: string[]): { [key: string]: number } {
			const nums = new Array<string>(10);
			strings = strings.map((s) => s.split('').sort().join(''));

			// Determine easy numbers
			nums[1] = strings.filter((s) => s.length == 2)[0];
			nums[7] = strings.filter((s) => s.length == 3)[0];
			nums[4] = strings.filter((s) => s.length == 4)[0];
			nums[8] = strings.filter((s) => s.length == 7)[0];

			// Determine 5 segment numbers (2, 3, 5)
			const fiveSegments = strings.filter((s) => s.length == 5); //.map((s) => s.split(''));
			nums[3] = fiveSegments.filter((s) => {
				return nums[1].split('').filter((i) => s.includes(i)).length == 2;
			})[0];
			// Find signal from 4 not in 3. This identifies 5.
			const identify5 = nums[4].split('').filter((c) => !nums[3].includes(c))[0];
			nums[5] = fiveSegments.filter((s) => s.includes(identify5))[0];
			nums[2] = fiveSegments.filter((s) => ![nums[3], nums[5]].includes(s))[0];
			// console.log(nums);

			// Determine 6 segment numbers (0, 6, 9)
			const sixSegments = strings.filter((s) => s.length == 6);
			// console.log(sixSegments);
			nums[6] = sixSegments.filter((s) => {
				return nums[1].split('').filter((c) => s.includes(c)).length < 2;
			})[0];
			// 0 is the only number missing one of the horizontal lines
			nums[0] = sixSegments.filter((s) => {
				const horizontals = nums[3].split('').filter((c) => !nums[1].includes(c));
				return horizontals.filter((h) => s.includes(h)).length == 2;
			})[0];
			nums[9] = sixSegments.filter((s) => ![nums[0], nums[6]].includes(s))[0];

			// console.log(nums);

			return nums.reduce((a, n, idx) => {
				a[n] = idx;
				return a;
			}, {});
		}

		function getNumber(numbers: string[], ident: { [key: string]: number }): number {
			const bob = numbers
				.map((s) => s.split('').sort().join(''))
				.map((n) => ident[n])
				.join('');
			return parseInt(bob);
		}

		const sum = displays.reduce((aggr, display) => {
			const ident = identifyNumbers(display.input);
			const number = getNumber(display.output, ident);
			console.log(display.output, number);
			return aggr + number;
		}, 0);
		console.log('Part 2: Sum of digits: ', sum);
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>
