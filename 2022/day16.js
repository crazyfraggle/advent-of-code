import { lineReader } from "./utils/inputreader.js";

const valves = {};
lineReader(process.argv[2]).forEach((l) => {
    const [_, valve, rate, alltunnels] = l.match(
        /Valve ([A-Z]+).*=([\d]+)[\;a-z\s]+([A-Z\,\s]+)$/
    );
    valves[valve] = {
        rate,
        open: false,
        tunnels: alltunnels.split(", "),
    };
});

console.dir(valves);

const bestFlowFrom = (start, ttl) => {};

// { valve: 'AA', rate: '0', tunnels: [ 'DD', 'II', 'BB' ] },
// { valve: 'BB', rate: '13', tunnels: [ 'CC', 'AA' ] },
// { valve: 'CC', rate: '2', tunnels: [ 'DD', 'BB' ] },
// { valve: 'DD', rate: '20', tunnels: [ 'CC', 'AA', 'EE' ] },
// { valve: 'EE', rate: '3', tunnels: [ 'FF', 'DD' ] },
// { valve: 'FF', rate: '0', tunnels: [ 'EE', 'GG' ] },
// { valve: 'GG', rate: '0', tunnels: [ 'FF', 'HH' ] },
// { valve: 'HH', rate: '22', tunnels: [ 'GG' ] },
// { valve: 'II', rate: '0', tunnels: [ 'AA', 'JJ' ] },
// { valve: 'JJ', rate: '21', tunnels: [ 'II' ] }

//    CC
//   /  \
// BB-AA-DD-EE-FF-GG-HH
//     |
//    II-JJ
/*
    Pos | Pres | 
T0:  AA |    0 | BB: 13*28=364 CC: 2*27=54 DD: 20*28=560 EE: 3*27=81 HH: 22*24=528 JJ: 21*27=567
T3:  JJ |  567 | BB: 13*23=299 CC: 2*22=44 DD: 20*23=460 EE: 3*22=66 HH: 22*20=440
T7:  DD | 1027 | BB: 13*20=260 CC: 2*21=42 EE:  3*21=63  HH: 22*18=396
T12: HH | 1423 | BB: 13*11=143 CC: 2*12=24 EE:  3*14=42
T19: BB | 1566 | CC: 2*9=18 EE: 3*7=21
T23: EE | 1587 | 

*/