<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/data/2021/15/data.json');

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

	interface Node {
		x: number;
		y: number;
		cost: number;
		distance: number;
		visited: boolean;
	}

	function run(dataType: 'test' | 'input'): void {
		console.clear();
		console.log('Running ', dataType);
		console.log(data[dataType]);

		const lines = data[dataType].split('\n');
		const height = lines.length;
		const width = lines[0].length;
		console.log(width, height);
		let unvisited = new Array<Node>();

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				unvisited.push({
					x,
					y,
					cost: parseInt(lines[y][x]),
					distance: Number.MAX_SAFE_INTEGER,
					visited: false
				});
			}
		}

		let node = unvisited.splice(
			unvisited.findIndex((node) => node.x === 0 && node.y === 0),
			1
		)[0];

		node.distance = 0;
		while (!(node.x === width - 1 && node.y === height - 1)) {
			// Visit adjacent nodes
			const adjacents = unvisited.filter(
				(n) =>
					(n.x === node.x && (n.y === node.y + 1 || n.y === node.y - 1)) ||
					(n.y === node.y && (n.x === node.x + 1 || n.x === node.x - 1))
			);
			adjacents.forEach((a) => {
				a.distance = Math.min(a.distance, a.cost + node.distance);
			});

			// // Mark current node as visited
			// visited.push(node);

			// Get next candidate node
			unvisited.sort((a, b) => a.distance - b.distance);
			node = unvisited.shift();
		}
		console.log(`Part: Distance to target is ${node.distance}`);

		const leMap: Node[][] = new Array(width * 5).fill(0).map(() => new Array(height * 5));
		const max9 = (n: number): number => (n > 9 ? n - 9 : n);
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				for (let i = 0; i < 5; i++) {
					for (let j = 0; j < 5; j++) {
						const xx = x + i * width,
							yy = y + j * height;
						leMap[xx][yy] = {
							x: xx,
							y: yy,
							cost: max9(parseInt(lines[y][x]) + i + j),
							distance: Number.MAX_SAFE_INTEGER,
							visited: false
						};
					}
				}
			}
		}

		node = leMap[0][0];
		node.distance = 0;
		let seenNodes = new Array<Node>();

		while (!(node.x === width * 5 - 1 && node.y === height * 5 - 1)) {
			// Visit adjacent nodes
			const nx = node.x,
				ny = node.y;
			const adjacents = [
				leMap[nx - 1]?.[ny],
				leMap[nx][ny - 1],
				leMap[nx + 1]?.[ny],
				leMap[nx][ny + 1]
			]
				.filter((n) => !!n)
				.filter((n) => !n.visited);

			adjacents.forEach((a) => {
				if (a.distance === Number.MAX_SAFE_INTEGER) seenNodes.push(a);
				const d = Math.min(a.distance, a.cost + node.distance);
				a.distance = d;
			});

			// Mark current node as visited
			node.visited = true;

			// Get next candidate node
			seenNodes.sort((a, b) => a.distance - b.distance);
			node = seenNodes.shift();
		}
		console.log(`Part 2: Distance to target is ${node.distance}`);
	}
</script>

<div>
	<button on:click={() => run('test')}>Run Test Data</button>
	<button on:click={() => run('input')}>Run Input Data</button>
</div>

<canvas width="500" height="500" id="cancan" />
