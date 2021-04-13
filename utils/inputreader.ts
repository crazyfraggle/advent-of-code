const fs = require("fs");

export const lineReader = (inputfile: string): string[] => {
  return fs
    .readFileSync(inputfile, "utf-8")
    .split("\n")
    .filter((line) => !!line);
};

export const groupReader = (inputfile: string): string[][] => {
  return fs
    .readFileSync(inputfile, "utf-8")
    .split("\n\n")
    .filter((group) => !!group)
    .map((group) => group.split("\n").filter((line) => !!line));
};
