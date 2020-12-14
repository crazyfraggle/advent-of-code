const { time } = require("console");
const ir = require("../inputreader");
const filename = process.argv[2] || "testdata.txt";

const [arrival, buses] = ir.lineReader(filename);

const arrivalTime = parseInt(arrival);
const busTimes = buses
  .split(",")
  .filter((b) => b !== "x")
  .map((b) => parseInt(b));

const timeUntilDeparture = busTimes.map((bt) => ({
  id: bt,
  ttd: bt - (arrivalTime % bt),
  mp: bt * (bt - (arrivalTime % bt)),
}));

console.table(timeUntilDeparture);

// Part 2

const p2Bus = buses
  .split(",")
  .map((bus, idx) => ({
    idx,
    bus,
  }))
  .filter((bus) => bus.bus !== "x");

console.table(p2Bus);

// numbers are all prime, coincident?
// meetingpoint for all prime is product of all...
// ... but we want to chain at idx interval...
