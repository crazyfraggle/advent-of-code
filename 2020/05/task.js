const fs = require("fs");
const data = fs.readFileSync("input5.txt", "utf-8");
const rows = data.split("\n").filter((line) => !!line);

const seatIds = rows.map((row) =>
  parseInt(row.replace(/[FL]/g, "0").replace(/[BR]/g, "1"), 2)
);
seatIds.sort((a, b) => b - a);

console.log("Highest seat", seatIds[0]);
seatIds.forEach((seat, idx, ids) => {
  if (ids[idx + 1] == seat - 2) {
    console.log("Your seat Id:", seat - 1);
  }
});
