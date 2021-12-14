<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/10/data.json');

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

	interface LineValidation {
		valid: 'yes' | 'no' | 'incomplete';
		score: number;
	}
	const starts = ['<', '[', '{', '('];
	const ends = ['>', ']', '}', ')'];
	const scores = {
		// Syntax error scores
		')': 3,
		']': 57,
		'}': 1197,
		'>': 25137,
		// Autocomplete scores
		'(': 1,
		'[': 2,
		'{': 3,
		'<': 4
	} as const;

	function run(dataType: 'test' | 'input'): void {
		console.clear();
		console.log('Running ', dataType);
		console.log(data[dataType]);

		const lines = data[dataType].split('\n');

		function validateLine(line: string): LineValidation {
			const chunkIters: string[] = [];
			for (let i = 0; i < line.length; i++) {
				const ch = line[i];
				if (starts.includes(ch)) {
					chunkIters.push(ch);
				} else {
					const start = chunkIters.pop();
					if (ends.indexOf(ch) !== starts.indexOf(start)) {
						// Syntax Error!
						console.log(`? SYNTAX ERROR\nGot '${ch}'', expected '${ends[starts.indexOf(start)]}'`);
						return { valid: 'no', score: scores[ch] };
					}
				}
			}
			if (chunkIters.length > 0) {
				const score = chunkIters
					.map((c) => scores[c])
					.reverse()
					.reduce((a, v) => a * 5 + v, 0);
				console.log('Incomplete: ', chunkIters.join(''), score);
				return { valid: 'incomplete', score };
			}
			return { valid: 'yes', score: 0 };
		}
		const solution1 = lines
			.map(validateLine)
			.filter((v) => v.valid === 'no')
			.map((v) => v.score)
			.reduce((p, v) => p + v);
		console.log(`Part 1: Score is ${solution1}`);

		const solution2Scores = lines
			.map(validateLine)
			.filter((v) => v.valid === 'incomplete')
			.map((v) => v.score)
			.sort((a, b) => a - b);
		const solution2 = solution2Scores[Math.floor(solution2Scores.length / 2)];
		console.log(`Part 2: Score is ${solution2}`);
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>
