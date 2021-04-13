const ir = require("../inputreader");
const filename = process.argv[2] || "testdata.txt";

const [fieldsInput, myTicketInput, ticketsInput] = ir.groupReader(filename);

// Parse field input
console.log(JSON.stringify(fieldsInput));
const fieldRe = /^([\w ]+): ([\d\- or]+)$/;
const [fields, allRanges] = fieldsInput.reduce(
  (acc, f) => {
    const [_, field, ranges] = fieldRe.exec(f);
    const rr = ranges.split(" or ").map((r) => {
      const [_, min, max] = /([\d]+)-([\d]+)/.exec(r);
      return { min: parseInt(min), max: parseInt(max) };
    });

    acc[0].push({ field: field, ranges: rr });
    acc[1].push(...rr);
    return acc;
  },
  [[], []]
);

const ticketFields = (line) => line.split(",").map((f) => parseInt(f));
const myTicketFields = ticketFields(myTicketInput[1]);
// console.log(myTicketFields);

const tickets = ticketsInput.slice(1).map(ticketFields);
// console.table(tickets);

// Task 1: Find invalid ticket fields
const invalidFields = [];

tickets.forEach((t) => {
  t.forEach((f) => {
    if (!allRanges.some((range) => f <= range.max && f >= range.min)) {
      invalidFields.push(f);
    }
  });
});
// console.log(invalidFields);
console.info(`Sum of invalid fields: ${invalidFields.reduce((a, f) => a + f)}`);

// Task 2: Multiply the 6 departure values on my ticket
const validTickets = tickets.filter((t) =>
  t.reduce((valid, f) => {
    return valid && allRanges.some((range) => f <= range.max && f >= range.min);
  }, true)
);
validTickets.push(myTicketFields);
// console.table(validTickets);

const possibleFields = (f) => {
  return fields
    .filter((field) =>
      field.ranges.some((range) => f <= range.max && f >= range.min)
    )
    .map((field) => field.field);
};

const fieldMap = validTickets
  .map((tckt) => {
    const ticketPossibleFields = tckt.map((f) => possibleFields(f));
    return ticketPossibleFields;
  })
  .reduce((acc, tpf) => {
    return acc.map((f, idx) => f.filter((v) => tpf[idx].includes(v)));
  })
  .map((field, idx) => ({ field, idx }))
  .sort((a, b) => a.field.length - b.field.length);

// console.table(fieldMap);

for (let i = 0; i < fieldMap.length; i++) {
  let fi = fieldMap[i].field[0];
  for (let j = i + 1; j < fieldMap.length; j++) {
    let pos = fieldMap[j].field.indexOf(fi);
    console.log(fi, fieldMap[j].field, pos);
    if (pos > -1) {
      fieldMap[j].field.splice(pos, 1);
    }
  }
}

const myDepartureValues = fieldMap
  .filter((f) => f.field[0].indexOf("departure") === 0)
  .map((f) => f.idx)
  .map((idx) => myTicketFields[idx])
  .reduce((acc, mtf) => acc * mtf);
console.table(myDepartureValues);
