import { lineReader } from "./utils/inputreader.js";

const lines = lineReader(process.argv[2]);

const trees = lines.map(line => line
			.split('')
			.map(c => parseInt(c)));
const height = trees.length;
const width = trees[0].length;
const visibleTreeCount = height * 2 + width * 2 - 4;
const visibleTrees = new Set();

// add corners to set
visibleTrees.add('0_0');
visibleTrees.add(`0_${width-1}`);
visibleTrees.add(`${height-1}_0`);
visibleTrees.add(`${height-1}_${width-1}`);


function rowtree(row) {
    let ct = -1;
    const ret = [];
    for (let x=0; x<row.length && ct<9; x++){
	if (row[x] > ct){
	    ret.push(x);
	    ct=row[x];
	}
    }

    ct =-1;
    for (let x=row.length-1; x>=0 && ct<9; x--){
        if (row[x] > ct){
            ret.push(x);
            ct=row[x];
        }
    }
    return ret;
}

for(let y=1; y < height - 1; y++) {
    rowtree(trees[y])
	.map(x=>`${y}_${x}`)
	.forEach(t=>visibleTrees.add(t));
}
    
for(let x=1;x<width-1;x++){
    const col=trees.map(l=>l[x]);
    rowtree(col)
	.map(y=>`${y}_${x}`)
	.forEach(t=>visibleTrees.add(t));
}
console.dir(visibleTrees);
console.log(`Part 1: number of visible trees is ${visibleTrees.size}`);

function scenic(x,y){
    if (x==0 || y==0 || x==width-1 || y==height-1) return 0;
    const th = trees[y][x];
    let right=1, left=1, up=1, down=1;
    for (let i=x+1;i<width-1 && trees[y][i]<th;i++,right++);
    for (let i=x-1;i>=1 && trees[y][i]<th;i--,left++);
    for (let i=y+1;i<height-1 && trees[i][x]<th;i++,down++);
    for (let i=y-1;i>=1 && trees[i][x]<th;i--,up++);
    console.log(x,y,up,down,left,right);
    return up*down*left*right;
}

let bs=0;
for (let y=0; y<height;y++){
    for (let x=0;x<width;x++){
	bs=Math.max(bs,scenic(x,y));
    }
}
console.log(`Part 2: best scenic score: ${bs}`);
