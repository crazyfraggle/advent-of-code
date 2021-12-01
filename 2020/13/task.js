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
    bus,
    idx,
  }))
  .filter((bus) => bus.bus !== "x");

console.table(p2Bus);

// numbers are all prime, coincident?
// meetingpoint for all prime is product of all...
// ... but we want to chain at idx interval...
/*        7,13,x,x,59,x,31,19
time     bus 7   bus 13  bus 59  bus 31  bus 19
1068773    .       .       .       .       .
1068774    D       .       .       .       .
1068775    .       .       .       .       .
1068776    .       .       .       .       .
1068777    .       .       .       .       .
1068778    .       .       .       .       .
1068779    .       .       .       .       .
1068780    .       .       .       .       .
1068781    D       .       .       .       .
1068782    .       D       .       .       .
1068783    .       .       .       .       .
1068784    .       .       .       .       .
1068785    .       .       D       .       .
1068786    .       .       .       .       .
1068787    .       .       .       D       .
1068788    D       .       .       .       D
1068789    .       .       .       .       .
1068790    .       .       .       .       .
1068791    .       .       .       .       .
1068792    .       .       .       .       .
1068793    .       .       .       .       .
1068794    .       .       .       .       .
1068795    D       D       .       .       .
1068796    .       .       .       .       .
1068797    .       .       .       .       .

t % 7 = 0
t % 13 = 12 (13-idx)
t % 59 = 55 (59-idx)
t % 31 = 25 (31-idx)
t % 19 = 12 (19-idx)

7 * 11


7*x0  = t    => x0 = t/7
13*x1 = t+1  => x1 = (t+1)/13
59*x4 = t+4  => x4 = (t+4)/59
31*x6 = t+6  => x6 = (t+6)/31
19*x7 = t+7  => x7 = (t+7)/19


*/
