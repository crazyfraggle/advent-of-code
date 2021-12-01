const lineReader = require("../inputreader").lineReader;

type Cube = number[];
interface Bound {
  min: number;
  max: number;
}

const filename = process.argv[2] || "testdata.txt";
const lines: string[] = lineReader(filename);
const initialCubes: Cube[] = lines
  .map((line, y) =>
    line
      .split("")
      .map((c, x) => ({ char: c, coords: [x, y, 0] }))
      .filter((cc) => cc.char === "#")
      .map<Cube>((c) => c.coords)
  )
  .reduce((acc: Cube[], l: Cube[]) => acc.concat(l));

console.table(initialCubes);

function outerBounds(activeCubes: Cube[]): Bound[] {
  const len = activeCubes[0].length;
  const bounds = new Array<Bound>(len).fill({ min: 0, max: 0 });
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < activeCubes.length; j++) {
      bounds[i] = {
        min: Math.min(bounds[i].min, activeCubes[j][i]),
        max: Math.max(bounds[i].max, activeCubes[j][i]),
      };
    }
  }
  return bounds;
}

function cubeEquals(c1: Cube, c2: Cube): boolean {
  return c1.reduce((acc, dim, idx) => acc && dim === c2[idx], true);
}

function activeNeighbors(cube: Cube, activeCubes: Cube[]): Cube[] {
  return activeCubes
    .filter((dd) => !cubeEquals(dd, cube))
    .filter((dd) =>
      cube.reduce((acc, dim, idx) => acc && Math.abs(dim - dd[idx]) <= 1, true)
    );
}

function isActive(cube: Cube, activeCubes: Cube[]): boolean {
  return activeCubes.some((c) => cubeEquals(c, cube));
}

function cyclePocket(inputCubes: Cube[]): Cube[] {
  const bounds = outerBounds(inputCubes);

  const testCubes: Cube[] = bounds.reduce((acc: Cube[], bound) => {
    const range = [];
    for (let i = bound.min - 1; i <= bound.max + 1; i++) {
      range.push(i);
    }

    if (acc.length === 0) {
      return range.map((i) => [i]);
    }

    const ret = [];
    acc.forEach((c) => {
      range.forEach((r) => {
        ret.push([...c, r]);
      });
    });

    return ret;
  }, []);

  return testCubes.filter((cube) => {
    const activeNbors = activeNeighbors(cube, inputCubes);
    return (
      activeNbors.length === 3 ||
      (activeNbors.length === 2 && isActive(cube, inputCubes))
    );
  });
}

// Task 1: Active cubes after 6 cycles in 3D
let cubes = initialCubes.slice();
for (let i = 0; i < 6; i++) {
  cubes = cyclePocket(cubes);
}
console.log(`After 6 cycles, we got ${cubes.length} active cubes`);

// Task 2: Active cubes after 6 cycles in 4D
let cubes4d = initialCubes.map((cube): Cube => [...cube, 0]);
for (let i = 0; i < 6; i++) {
  cubes4d = cyclePocket(cubes4d);
}
console.log(`After 6 cycles, we got ${cubes4d.length} active cubes`);
