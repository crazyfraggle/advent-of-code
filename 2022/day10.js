import { lineReader} from "./utils/inputreader.js";
import { sum } from "./utils/sum.js";

const lines = lineReader(process.argv[2]);

const bm = [1];

lines.forEach(l=>{
    const tail = bm[bm.length-1];
    // both add and noop ticks the previous value
    bm.push(tail);
    if (l !== 'noop') {
	const [i,v]=l.split(' ');
	bm.push(tail+parseInt(v));
    }
});

//console.dir(bm);
const ic = [20, 60, 100, 140, 180, 220];
const ss = ic.map(i=>(bm[i-1]*i));
console.dir(ss);
console.log(`Part 1: Signal strength: ${sum(ss)}`);

for (let y=0;y<6;y++) {
    const pixs=[];
    for (let x=0;x<40;x++) {
	const pos = bm[x+40*y];
	pixs.push(pos < x-1 || pos > x+1 ? ' ' : '#');
    }
    console.log(pixs.join(''));
}
