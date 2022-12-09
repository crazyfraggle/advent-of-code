import { lineReader} from "./utils/inputreader.js";

const lines = lineReader(process.argv[2]);


const z = {x:0,y:0};
let t = {x:0,y:0};
const tvst = new Set();
tvst.add("0,0");
const tvst9 = new Set();
tvst9.add("0,0");
const rope2 = [{...z}, {...z}];
const rope9 = [{...z},{...z},{...z},{...z},{...z},{...z},{...z},{...z},{...z},{...z}];
console.dir(rope2);
function moveknot(p,k){
    const movx=(thrs) => {
	const dx = p.x - k.x;
	if (dx > thrs)  {k.x += 1; return true;}
	if (dx < -thrs) {k.x -= 1; return true;}
	return false;
    }
    const movy=(thrs) => {
	const dy = p.y - k.y;
	if (dy > thrs) {k.y += 1;return true;}
	if (dy <-thrs) {k.y -= 1;return true;}
	return false;
    }
    
    if (movx(1)) movy(0);
    else if (movy(1)) movx(0);
}

function movehead(rope, dir) {
    const h = rope[0];
    const d = {
	R: {x:1,y:0},
	L: {x:-1,y:0},
	U: {x:0,y:1},
	D: {x:0,y:-1}
    };
    h.x += d[dir].x;
    h.y += d[dir].y;
}

lines.forEach(l=>{
    let [dir,len] = l.split(" ");
    while (len) {
	movehead(rope2, dir);
	for (let i=1; i<rope2.length;i++) {
	    moveknot(rope2[i-1], rope2[i]);
	}
	const t = rope2[rope2.length-1];
	tvst.add(`${t.x},${t.y}`);

	movehead(rope9, dir);
        for (let i=1; i<rope9.length;i++) {
            moveknot(rope9[i-1], rope9[i]);
        }
        const t9 = rope9[rope9.length-1];
        tvst9.add(`${t9.x},${t9.y}`);
	len--;
    }
});

console.log('Part 1: tail has visited ', tvst.size);
console.log('Part 2: tail9 has visited ', tvst9.size);
