f = open("inputsorted.txt")
numbers = [int(l.strip()) for l in f.readlines()]
f.close()

target = 2020


def findFirstSumOfTwo(numbers, target):
    low = numbers[0]
    for higher in numbers[1:]:
        if low + higher == target:
            return [low, higher]

    if len(numbers) > 2:
        return findFirstSumOfTwo(numbers[1:], target)
    else:
        return [-1, -1]


pair = findFirstSumOfTwo(numbers, target)
print("Found: " + str(pair[0]) + " + " + str(pair[1]) + " = "+str(target))
print(str(pair[0]) + " * " + str(pair[1]) + " = " + str(pair[0]*pair[1]))

trioFound = False
while not trioFound:
    f = numbers[0]
    newtarget = target - f
    lasttwo = findFirstSumOfTwo(numbers[1:], newtarget)
    if lasttwo[0] != -1:
        trioFound = True
        print("Found: " + str(f) + " + " +
              str(lasttwo[0]) + " + " + str(lasttwo[1]) + " = 2020")
        print(str(f) + " * " + str(lasttwo[0]) + " * " +
              str(lasttwo[1]) + " = " + str(f*lasttwo[0]*lasttwo[1]))
    else:
        numbers = numbers[1:]
