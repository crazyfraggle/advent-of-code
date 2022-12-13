import { groupReader, lineReader } from "./utils/inputreader.js";
import { sum, multiply } from "./utils/sum.js";

const pairs = groupReader(process.argv[2]).map((g) =>
    g.map((l) => JSON.parse(l))
);
// console.dir(pairs);
/**
 *
 * @param {number[][] | number[] | number | undefined} p0
 * @param {number[][] | number[] | number | undefined} p1
 * @returns {undefined | boolean}
 */
const isCorrectOrder = (p0, p1) => {
    // console.dir(p0);
    // console.dir(p1);
    if (Number.isInteger(p0) && Number.isInteger(p1)) {
        return p0 < p1 ? true : p1 < p0 ? false : undefined;
    }

    // At least one of these should be an array, make sure both are.
    if (!Array.isArray(p0)) p0 = [p0];
    if (!Array.isArray(p1)) p1 = [p1];
    for (let i = 0; i < Math.min(p0.length, p1.length); i++) {
        const p00 = p0[i];
        const p10 = p1[i];
        const res = isCorrectOrder(p00, p10);
        if (res !== undefined) {
            return res;
        }
    }
    // Both arrays emptied
    if (p0.length == p1.length) return undefined;
    // Left side ran out of items.
    if (p0.length < p1.length) return true;
    if (p1.length < p0.length) return false;

    console.error("What>", p0, p1);
    return undefined;
};

const correctPairs = pairs.map((p, i) =>
    isCorrectOrder(p[0], p[1]) ? i + 1 : 0
);
// console.dir(correctPairs);
console.log(`Part 1: Sum of pairs in correct order is ${sum(correctPairs)}`);

const packets = lineReader(process.argv[2])
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l));
packets.push([[2]]);
packets.push([[6]]);
// console.dir(packets);
const sp = packets.sort((a, b) => (isCorrectOrder(a, b) ? -1 : 1));
console.dir(sp);

const decoderKey = sp
    .map((p, i) =>
        Array.isArray(p[0]) &&
        p.length == 1 &&
        p[0].length == 1 &&
        (p[0][0] == 2 || p[0][0] == 6)
            ? i + 1
            : -1
    )
    .filter((i) => i !== -1);

console.log(`Part 2: Decoder key is ${multiply(decoderKey)}`);
