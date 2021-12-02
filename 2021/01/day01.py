with open('input.txt') as data:
    depths = map(int, data.readlines())

increases = 0
for i in range(1,len(depths)):
    # print("We has ", i)
    if depths[i] > depths[i-1]:
        increases += 1 

print ("Number of increases are " + repr(increases))

increases = 0
for i in range(0,len(depths)-3):
    # print("We has ", (depths[i],depths[i+1],depths[i+2]))
    window1 = sum(depths[i:i+3])
    window2 = sum(depths[i+1:i+4])
    # print("We has ", (window1, window2))
    if window2 > window1:
        increases += 1 

print ("Number of 3-window increases are " + repr(increases))
