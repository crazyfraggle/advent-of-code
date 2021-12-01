const fs = require("fs");

const data = fs.readFileSync("input6.txt", "utf-8");

const groups = data.split("\n\n").filter((line) => !!line);

const anyAnswers = groups.map(
  (group) =>
    group
      .replace(/\s/g, "")
      .split("")
      .reduce((arr, a, idx) => {
        if (arr.indexOf(a) === -1) {
          arr.push(a);
        }
        return arr;
      }, []).length
);

console.log(
  "Sum of anyAnswers:",
  anyAnswers.reduce((acc, x) => acc + x, 0)
);

const everyOneAnswered = groups.map((group) => {
  const answers = group.split("\n").map((a) => a.split(""));
  const numPeople = answers.length;
  const commonAnswers = answers[0].filter(
    (chr) =>
      true &&
      answers
        .slice(1)
        .reduce((found, a2) => found && a2.indexOf(chr) !== -1, true)
  );

  return commonAnswers.length;
});
console.log(
  "Sum of everyOneAnswered",
  everyOneAnswered.reduce((acc, x) => acc + x, 0)
);
