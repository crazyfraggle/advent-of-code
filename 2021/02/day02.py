import sys

filename = sys.argv[1]

with open(filename) as data:
    instructions = map(lambda x: x.strip().split(" "), data.readlines())

xPos = 0
yPos = 0
zPos = 0
for l in instructions:
    if l[0] == 'forward':
        xPos += int(l[1])
        print ("Going forward "+l[1]+" to "+str(xPos))
    elif l[0] == 'up':
        zPos -= int(l[1])
        print ("Going up "+l[1]+" to "+str(zPos))
    elif l[0] == 'down':
        zPos += int(l[1])
        print ("Going down "+l[1]+" to "+str(zPos))

print ("Position: x: "+str(xPos)+", z: "+str(zPos)+". Multiplied: "+str(xPos*zPos))

pos = 0
depth = 0
aim = 0

for l in instructions:
    v = int(l[1])
    if l[0] == 'forward':
        pos += v
        depth += aim * v
        print ("Going forward "+l[1]+" to "+repr((pos,depth)))
    elif l[0] == 'up':
        aim -= v
        print ("Decreasing aim by "+l[1]+" to "+str(aim))
    elif l[0] == 'down':
        aim += v
        print ("Increasing aim by "+l[1]+" to "+str(aim))

print ("Position is: "+repr((pos,depth))+". Multiplied: "+str(pos*depth))
