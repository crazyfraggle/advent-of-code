const fs = require('fs');

const re = new RegExp(/(\d+)-(\d+) (\w): (\w+)/)

const data = fs.readFileSync("input1.txt",'utf-8');

const validPasswords = data
  .split("\n")
  .filter(line=>!!line)
  .map(line => re.exec(line))
  .filter(match => {
    const [_, min, max, char, password] = match;
    const charsInPassword = (password.match(new RegExp(char, "g")) || []).length;
    const isValid = charsInPassword >= min && charsInPassword <= max;

    return isValid;
  });

console.log(`Found ${validPasswords.length} valid passwords according to rule 1`);

const validPasswordsRule2 = data
  .split("\n")
  .filter(line=>!!line)
  .map(line => re.exec(line))
  .filter(match => {
    const [_, c1, c2, char, password] = match;
    const pc1 = password[c1-1];
    const pc2 = password[c2-1];

    const isValid = (pc1 == char || pc2 == char) && pc1 != pc2;

    return isValid;
  });

console.log(`Found ${validPasswordsRule2.length} valid passwords according to rule 2`);
