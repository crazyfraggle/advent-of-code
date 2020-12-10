const fs = require("fs");

const lineReader = (inputfile) => {
  return fs
    .readFileSync(inputfile, "utf-8")
    .split("\n")
    .filter((line) => !!line);
};

const groupReader = (inputfile) => {
  return fs
    .readFileSync(inputfile, "utf-8")
    .split("\n\n")
    .filter((group) => !!group)
    .map((group) => group.split("\n"));
};

module.exports = { lineReader, groupReader };
