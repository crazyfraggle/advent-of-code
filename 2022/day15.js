import { lineReader } from "./utils/inputreader.js";

const testLine = parseInt(process.argv[3] || 10);
const sensors = lineReader(process.argv[2]).map((l) => {
    const [_, sx, sy, bx, by] = l.match(
        /Sensor at x=([\-\d]+), y=([\-\d]+)\: closest beacon is at x=([\-\d]+), y=([\-\d]+)/
    );
    return {
        sx: parseInt(sx),
        sy: parseInt(sy),
        bx: parseInt(bx),
        by: parseInt(by),
        distance: Math.abs(sx - bx) + Math.abs(sy - by),
    };
});

// Determine max reach of sensors
const minX = Math.min(...sensors.map((s) => s.sx - s.distance));
const minY = Math.min(...sensors.map((s) => s.sy - s.distance));
const maxX = Math.max(...sensors.map((s) => s.sx + s.distance));
const maxY = Math.max(...sensors.map((s) => s.sy + s.distance));

// console.dir(sensors);
console.log(`Maximum reach: ${minX},${minY} - ${maxX},${maxY}`);

// Find impossible locations on given Y coordinate
function bob(y, minX, maxX, exBeacon) {
    const sensorCanReach = (s, x, y) =>
        Math.abs(s.sx - x) + Math.abs(s.sy - y) <= s.distance &&
        !(exBeacon && s.bx == x && s.by == y);
    let notThere = 0;
    for (let x = minX; x <= maxX; x++) {
        // Is [x,y] covered by a sensor
        notThere += sensors.some((s) => sensorCanReach(s, x, y)) ? 1 : 0;
    }
    return notThere;
}

console.log(
    `Part 1: Not possible beacon locations on line ${testLine} is ${bob(
        testLine,
        minX,
        maxX,
        true
    )}`
);

sensors.forEach((s, i) =>
    console.log(
        `Sensor ${i}: S: (${s.sx},${s.sy}) B: (${s.bx},${s.by}) Distance: ${s.distance}`
    )
);

// For each sensor, trace border and test against other sensors, until found
const boundaryX = testLine * 2;
const boundaryY = testLine * 2;
const sensorCanReach = (s, x, y) =>
    Math.abs(s.sx - x) + Math.abs(s.sy - y) <= s.distance;
const withinBoundary = (x, y) =>
    x >= 0 && x <= boundaryX && y >= 0 && y <= boundaryY;

let beaconPosition = undefined;
for (let si = 0; si < sensors.length && !beaconPosition; si++) {
    const { sx, sy, distance } = sensors[si];
    for (let i = 0; i <= distance + 1 && !beaconPosition; i++) {
        const testCoords = [
            [sx + i, sy - (distance + 1 - i)],
            [sx + i, sy + (distance + 1 - i)],
            [sx - i, sy - (distance + 1 - i)],
            [sx - i, sy + (distance + 1 - i)],
        ]
            .filter((c) => withinBoundary(...c))
            .filter((c) => !sensors.some((s) => sensorCanReach(s, c[0], c[1])));

        if (testCoords.length) {
            beaconPosition = testCoords[0];
        }
    }
}

console.log(
    `Part 2: Found a beacon at ${beaconPosition[0]},${
        beaconPosition[1]
    }. Frequency: ${beaconPosition[1] + beaconPosition[0] * 4_000_000}`
);

// let tuningFreq = 0;
// for (let y = 0; y <= boundaryY; y++) {
//     const bobs = bob(y, 0, boundaryX, false);
//     const sensorCanReach2 = (s, x, y) =>
//         Math.abs(s.sx - x) + Math.abs(s.sy - y) <= s.distance;
//     if (bobs !== boundaryX + 1) {
//         console.log(`Found ${bobs} on line ${y}`);
//         tuningFreq += y;
//         for (let x = 0; x <= boundaryX; x++) {
//             // Is [x,y] covered by a sensor
//             if (sensors.filter((s) => sensorCanReach2(s, x, y)).length > 0) {
//                 tuningFreq += x * 4_000_000;
//                 break;
//             }
//         }

//         break;
//     }
// }

// console.log(tuningFreq);
