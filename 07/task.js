const fs = require("fs");

const data = fs.readFileSync("input7.txt", "utf-8");
const rules = data.split("\n").filter((line) => !!line);

const bagRules = rules.map((r) => {
  const [color, rawcontents] = r.split(" bags contain ");
  const contents = [];

  if (rawcontents !== "no other bags.") {
    rawcontents.split(",").forEach((c) => {
      const a = c.match(/(\d+)\s(\w+\s\w+)\sbag/);
      contents.push({ count: a[1], color: a[2] });
    });
  }

  return { color, contents };
});

// console.log(JSON.stringify(bagRules));

const canContain = (color) => {
  return bagRules.filter((bag) => bag.contents.some((c) => c.color === color));
};

const temp = ["shiny gold"];
const found = [];
while (temp.length >= 1) {
  const bob = temp.pop();
  // console.log("Checking", bob);
  if (found.indexOf(bob) === -1) {
    found.push(bob);
    temp.push(...canContain(bob).map((bag) => bag.color));
  }
}

console.log("The shiny bag can be contained within ", found.length - 1);

const bagDict = bagRules.reduce((acc, bag) => {
  acc[bag.color] = bag.contents;
  return acc;
}, {});
// console.log(JSON.stringify(bagDict));

const bagContains = (startBag) => {
  const contents = bagDict[startBag];
  let count = 0;
  contents.forEach((bagrule) => {
    count += bagrule.count * (1 + bagContains(bagrule.color));
  });
  return count;
};

console.log("Shiny gold requires", bagContains("shiny gold"));
