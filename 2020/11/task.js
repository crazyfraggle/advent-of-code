const { exit } = require("process");
const ir = require("../inputreader");
const filename = process.argv[2] || "testdata.txt";

const floorMap = ir
  .lineReader(filename)
  .map((row) => `.${row}.`)
  .map((row) => row.split(""));

const width = floorMap[0].length;
floorMap.unshift(new Array(width).fill("."));
floorMap.push(new Array(width).fill("."));
const height = floorMap.length;
const mapIterations = [floorMap];

function minmax(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function spy(map, x, y, dir, limit) {
  let distance = 1;
  while (distance <= limit) {
    const cx = minmax(x + dir.x * distance, 0, width - 1);
    const cy = minmax(y + dir.y * distance, 0, height - 1);
    if (map[cy][cx] === ".") {
      distance++;
      continue;
    }
    return map[cy][cx] === "#";
  }
}

function seatCanBeOccupied(map, x, y, limit) {
  if (map[y][x] !== "L") {
    return false;
  }
  return (
    !spy(map, x, y, { x: -1, y: -1 }, limit) &&
    !spy(map, x, y, { x: 0, y: -1 }, limit) &&
    !spy(map, x, y, { x: 1, y: -1 }, limit) &&
    !spy(map, x, y, { x: -1, y: 0 }, limit) &&
    !spy(map, x, y, { x: 1, y: 0 }, limit) &&
    !spy(map, x, y, { x: -1, y: 1 }, limit) &&
    !spy(map, x, y, { x: 0, y: 1 }, limit) &&
    !spy(map, x, y, { x: 1, y: 1 }, limit)
  );
}

function seatIsSurrounded(map, x, y, limit, peopleThreshold) {
  if (map[y][x] !== "#") {
    return false;
  }
  const surroundings = [
    spy(map, x, y, { x: -1, y: -1 }, limit),
    spy(map, x, y, { x: 0, y: -1 }, limit),
    spy(map, x, y, { x: 1, y: -1 }, limit),
    spy(map, x, y, { x: -1, y: 0 }, limit),
    spy(map, x, y, { x: 1, y: 0 }, limit),
    spy(map, x, y, { x: -1, y: 1 }, limit),
    spy(map, x, y, { x: 0, y: 1 }, limit),
    spy(map, x, y, { x: 1, y: 1 }, limit),
  ].filter((spotted) => !!spotted).length;

  return surroundings >= peopleThreshold;
}

function mapsAreEqual(map1, map2) {
  if (map1.length !== map2.length) {
    console.log("What have you done?!");
    exit();
  }

  let equal = true;
  for (let y = 0; equal && y < height; y++) {
    for (let x = 0; equal && x < width; x++) {
      equal = equal && map1[y][x] == map2[y][x];
      if (!equal) {
        console.log(`not equal at ${x},${y}: ${map1[y][x]} vs ${map2[y][x]}`);
      }
    }
  }
  return equal;
}

function iterateMap(map, limit, peopleThreshold) {
  const newMap = new Array(height);
  newMap[0] = new Array(width).fill(".");
  newMap[height - 1] = new Array(width).fill(".");
  for (let y = 1; y < height - 1; y++) {
    newMap[y] = ["."];
    newMap[y][width - 1] = ".";
    for (let x = 1; x < width - 1; x++) {
      if (seatCanBeOccupied(map, x, y, limit)) {
        newMap[y][x] = "#";
      } else if (seatIsSurrounded(map, x, y, limit, peopleThreshold)) {
        newMap[y][x] = "L";
      } else {
        newMap[y][x] = map[y][x];
      }
    }
  }
  console.log(
    map
      .map((row, idx) => `${row.join("")} -> ${newMap[idx].join("")}`)
      .join("\n")
  );

  return newMap;
}

let iterations = 0;
mapIterations.push(iterateMap(mapIterations[mapIterations.length - 1]));
while (
  iterations < 1000 &&
  !mapsAreEqual(
    mapIterations[mapIterations.length - 1],
    mapIterations[mapIterations.length - 2]
  )
) {
  mapIterations.push(iterateMap(mapIterations[mapIterations.length - 1], 1, 4));
  iterations++;
}

console.log(`Needed ${iterations} iterations.`);
const occupiedSeats = mapIterations[mapIterations.length - 1]
  .map((row) => row.filter((seat) => seat === "#").length)
  .reduce((acc, row) => (acc += row), 0);
console.log(`Found ${occupiedSeats} occupied seats`);

// Task 2

iterations = 0;
const t2Maps = [floorMap];
t2Maps.push(iterateMap(t2Maps[t2Maps.length - 1]));
while (
  iterations < 1000 &&
  !mapsAreEqual(t2Maps[t2Maps.length - 1], t2Maps[t2Maps.length - 2])
) {
  t2Maps.push(
    iterateMap(t2Maps[t2Maps.length - 1], Math.max(width, height), 5)
  );
  iterations++;
}
console.log(`Needed ${iterations} iterations.`);
const occupiedSeatsT2 = t2Maps[t2Maps.length - 1]
  .map((row) => row.filter((seat) => seat === "#").length)
  .reduce((acc, row) => (acc += row), 0);
console.log(`Found ${occupiedSeatsT2} occupied seats`);
