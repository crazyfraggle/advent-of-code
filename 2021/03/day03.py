import sys
from functools import reduce

filename = sys.argv[1]

with open(filename) as data:
    diagnostics = list(map(lambda x: x.strip(), data.readlines()))

total = len(diagnostics)
bitlen = len(diagnostics[0])

def bitCountByPos(pos, bitlist):
  return sum(map(lambda b: int(b[pos]), bitlist))

gamma = int("".join(map(lambda p: "1" if bitCountByPos(p, diagnostics) > total/2 else "0", range(bitlen))), 2)
epsilon = int("".join(map(lambda p: "0" if bitCountByPos(p, diagnostics) > total/2 else "1", range(bitlen))), 2)

print ("Part 1: gamma %i, epsilon: %i, solution: %i" % (gamma, epsilon, gamma*epsilon))

def oxygenRating(pos, bitlist):
  if (len(bitlist)) == 1:
    print ("Found %s" % bitlist[0])
    return int(bitlist[0], 2)
  else:
    # Filter bits for current position
    mostCommonBit = "1" if bitCountByPos(pos, bitlist) >= len(bitlist)/2 else "0"
    print (pos, mostCommonBit, repr(bitlist))
    filteredList = list(filter(lambda bits: bits[pos] == mostCommonBit, bitlist))
    return oxygenRating(pos+1, filteredList)

def co2Rating(pos, bitlist):
  if (len(bitlist)) == 1:
    print ("Found %s" % bitlist[0])
    return int(bitlist[0], 2)
  else:
    # Filter bits for current position
    leastCommonBit = "0" if bitCountByPos(pos, bitlist) >= len(bitlist)/2 else "1"
    print (pos, leastCommonBit, repr(bitlist))
    filteredList = list(filter(lambda bits: bits[pos] == leastCommonBit, bitlist))
    return co2Rating(pos+1, filteredList)

oxygen = oxygenRating(0, diagnostics)
co2 = co2Rating(0, diagnostics)

print ("Part 2: Oxygen rating: %i, CO2 scrubbing: %i, solution: %i" % (oxygen, co2, oxygen*co2))
