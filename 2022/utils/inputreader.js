import * as fs from "fs";

export const lineReader = (inputfile) => {
    return fs
        .readFileSync(inputfile, "utf-8")
        .split("\n")
        .filter((line) => !!line);
};

export const groupReader = (inputfile) => {
    return fs
        .readFileSync(inputfile, "utf-8")
        .split("\n\n")
        .filter((group) => !!group)
        .map((group) => group.split("\n").filter((line) => !!line));
};
