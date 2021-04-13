import { lineReader } from "../utils/inputreader";

const filename = process.argv[2] || "input.txt";
const lines = lineReader(filename)
  .map((line) => line.replace(/ /g, ""))
  .map((line) => Array.from(line));

function calcLtr(expression: string[]): number {
  let acc = -1;
  let op = "";
  // console.log("Expression: ", expression.join(""));
  while (expression.length) {
    const char = expression.shift();
    let num = -1;

    if (char === "(") {
      let nest = 1;
      let i = 0;
      for (i = 0; nest > 0; i++) {
        if (expression[i] === "(") nest++;
        if (expression[i] === ")") nest--;
      }
      num = calcLtr(expression.splice(0, i));
    }

    if (char.match(/[\d]/)) {
      // Digit
      num = parseInt(char);
    }

    if (op === "*") {
      acc = acc * num;
      op = "";
    } else if (op === "+") {
      acc = acc + num;
      op = "";
    } else if (acc === -1) {
      // console.log(`initial number ${num}`);
      acc = num;
    }

    if (char === "*" || char === "+") {
      op = char;
    }
  }

  return acc;
}

function calcPlusPri(expression: string[]): number {
  let acc = -1;
  let op = "";
  console.log("Expression: ", expression.join(""));
  while (expression.length) {
    const char = expression.shift();
    let num = -1;

    if (char === "(") {
      let nest = 1;
      let i = 0;
      for (i = 0; nest > 0; i++) {
        if (expression[i] === "(") nest++;
        if (expression[i] === ")") nest--;
      }
      num = calcPlusPri(expression.splice(0, i));
    }

    if (char.match(/[\d]/)) {
      // Digit
      num = parseInt(char);
    }

    if (char === "*") {
      acc = acc * calcPlusPri(expression);
      expression = [];
      op = "";
      // } else if (op === "+") {
      //   acc = acc + num;
      //   op = "";
    } else if (acc === -1) {
      // console.log(`initial number ${num}`);
      acc = num;
    } else if (num > -1) {
      acc += num;
    }

    if (char === "*" || char === "+") {
      op = char;
    }
  }

  return acc;
}

const tests = [
  "4",
  "1+2",
  "2*6",
  "2+(3*3)",
  "2+3*4",
  "(2+(3*4)+1)+2",
  "2 * 3 + (4 * 5) ",
  "5 + (8 * 3 + 9 + 3 * 4 * 3) ",
  "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) ",
  "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 ",
];
tests.forEach((test) => {
  console.log(`${test} = ${calcPlusPri(test.replace(/ /g, "").split(""))}`);
});

console.log(
  "LTR Sum of results:",
  lines
    .map((l) => l.slice())
    .map(calcLtr)
    .reduce((acc, num) => acc + num)
);

console.log(
  "PlusPri Sum of results:",
  lines
    .map((l) => l.slice())
    .map(calcPlusPri)
    .reduce((acc, num) => acc + num)
);
