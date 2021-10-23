#This is translation script.
#quoridorstrats_notation <---> qf_code
#This is tested on Python 2.6.9 and 3.5.1

def qfEncode(notation):
	b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
	xalpha = "abcdefghi"
	qf_bin = "01"

	movelist = notation.split(",")

	movelen = len(movelist)
	if movelen >1023:
		return "too many moves!!"

	movelen_bin = bin(movelen)
	movelen_bin = movelen_bin.replace("0b", "")
	for i in range(10 - len(movelen_bin)):
		movelen_bin = "0" + movelen_bin
	
	qf_bin += movelen_bin

	turn = 0
	p = [{"x":5, "y":1}, {"x":5, "y":9}]

	for move in movelist:
		direction = 0

		if len(move) == 2:
			#moving piece
			qf_bin += "0"

			newx = xalpha.index(move[0])+1
			newy = int(move[1])
			oldx = p[turn]["x"]
			oldy = p[turn]["y"]

			if newx > oldx:
				if newy > oldy:
					direction = 1
				elif newy < oldy:
					direction = 3
				else:
					direction = 2
			elif newx < oldx:
				if newy > oldy:
					direction = 7
				elif newy < oldy:
					direction = 5
				else:
					direction = 6
			else:
				if newy > oldy:
					direction = 0
				elif newy < oldy:
					direction = 4

			p[turn]["x"] = newx
			p[turn]["y"] = newy

			direction_bin = bin(direction)
			direction_bin = direction_bin.replace("0b", "")
			for i in range(3 - len(direction_bin)):
				direction_bin = "0" + direction_bin

			qf_bin += direction_bin

		elif len(move) == 3:
			#putting wall
			qf_bin += "1"

			if move[2] == "h":
				qf_bin += "0"
			elif move[2] == "v":
				qf_bin += "1"

			x = xalpha.index(move[0])+1
			y = int(move[1])

			wallplace = (x-1) + (y-1) * 8

			wallplace_bin = bin(wallplace)
			wallplace_bin = wallplace_bin.replace("0b", "")
			for i in range(6 - len(wallplace_bin)):
				wallplace_bin = "0" + wallplace_bin

			qf_bin += wallplace_bin

		turn = 1 - turn

	for i in range(6 - len(qf_bin) % 6):
		qf_bin += "0"
	# return qf_bin

	qf_code = ""
	for i in range(len(qf_bin)//6):
		qf_code += b64chars[int(qf_bin[i*6:i*6+6], 2)]

	return qf_code

#test
games = ["e2,e8,e3,e7", "e2,e8,e3,e7,e4,e6,e5,e4", "e2,e2v,f2h,e8,h2h,e7,d6h,f7,f6h,e7,d2,d7,c7v,d8,d3,d3h,c3,b3h,a2h,d9,b3,c9,a3,c8,c5v,c2v,h6h,c7,a4,c6,a5,a5h,b5,b6h,a7v,b1v,c5,c4,c6,b4,b6,a4,a6"]
print("py: " + qfEncode(games[2]))
