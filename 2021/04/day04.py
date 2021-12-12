import sys
import itertools
from functools import reduce

filename = sys.argv[1]

with open(filename) as data:
  lines = list(map(lambda x: x.strip(), data.readlines()))

numbers = list(map(int, lines[0].split(",")))
numbers2 = list(map(int, lines[0].split(",")))

lines = lines[2:]
bingos = [list(l) for x, l in itertools.groupby(lines, lambda w: w == '') if not x]

# tranfsorm 5 lines of numbers in strings into 5x5 array of (number, hit: boolean)
def createBingoSheet(bl):
  nums = map(lambda l: l.split(), bl)
  return list(map(lambda l: list(map(lambda n: (int(n, 10), False), l)), nums))

sheets = list(map(createBingoSheet, bingos))

def markSheet(sheet, number):
  for i in range(5):
    for j in range(5):
      t = sheet[i][j]
      if (t[0]) == number:
        sheet[i][j] = (t[0], True)

def filterSheetWithBingo(sheet):
  for i in range(5):
    row = sheet[i]
    # print (row)
    rowHit = reduce(lambda a,b: a and b[1], row, True)
    colHit = reduce(lambda a,b: a and b[1], map(lambda r: r[i], sheet), True)
    # print (i, rowHit, colHit)
    if rowHit or colHit: return True
  return False

while len(list(filter(filterSheetWithBingo, sheets))) == 0:
  tallet = numbers.pop(0)
  print ("No bingo, calling %d" % tallet)

  for s in sheets:
    markSheet(s, tallet)

winningSheet = list(filter(filterSheetWithBingo, sheets))[0]

print (repr(winningSheet))
print (tallet)
ls = sum(map(lambda row: sum(map(lambda a: a[0] if a[1] == False else 0, row)), winningSheet))
print ("Part 1: Sum of unmarked numbers is %d, bingo on %d. Solution: %d" % (ls, tallet, ls*tallet))


sheets2 = list(map(createBingoSheet, bingos))
# sheetsleft = len(sheets2)
while len(sheets2) > 0:
  tallet = numbers2.pop(0)
  print ("Calling %d, sheets left: %d" % (tallet, len(sheets2)))

  for s in sheets2:
    markSheet(s, tallet)

  lastSheet = sheets2[0]
  sheets2 = list(filter(lambda s: not filterSheetWithBingo(s), sheets2))

# losingSheet = list(filter(lambda s: not filterSheetWithBingo(s), sheets))[0]
print (repr(lastSheet))
print (tallet)
ls = sum(map(lambda row: sum(map(lambda a: a[0] if a[1] == False else 0, row)), lastSheet))
print ("Part 2: Sum of unmarked numbers is %d, bingo on %d. Solution: %d" % (ls, tallet, ls*tallet))
