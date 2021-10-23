const bin = (dec) => (dec >>> 0).toString(2);
const int = parseInt;

function qfEncode(notation = "e2,d2h,f2,e8,e7v,e7") {
    const b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const xalpha = "abcdefghi";
    let qf_bin = "01";
    const movelist = notation.split(",");
    const movelen = movelist.length;
    if (movelen > 1023) return "too many moves!!";
    let movelen_bin = bin(movelen)
    movelen_bin = "0".repeat(10 - movelen_bin.length) + movelen_bin;
    
    qf_bin += movelen_bin;
    let turn = 0;
    let p = [
        { x: 5, y: 1 },
        { x: 5, y: 9 },
    ];
    
    for (let move of movelist) {
        let direction = 0;
        if (move.length === 2) {
            // moving piece
            qf_bin += "0";
            let newx = xalpha.indexOf(move[0]) + 1;
            let newy = int(move[1]);
            let oldx = p[turn]["x"];
            let oldy = p[turn]["y"];
            if (newx > oldx) {
                if (newy > oldy) {
                    direction = 1;
                } else if (newy < oldy) {
                    direction = 3;
                } else {
                    direction = 2;
                }
            } else if (newx < oldx) {
                if (newy > oldy) {
                    direction = 7;
                } else if (newy < oldy) {
                    direction = 5;
                } else {
                    direction = 6;
                }
            } else {
                if (newy > oldy) {
                    direction = 0;
                } else if (newy < oldy) {
                    direction = 4;
                }
            }
            p[turn]["x"] = newx;
            p[turn]["y"] = newy;
            
            let direction_bin = bin(direction);
            direction_bin = "0".repeat(3 - direction_bin.length) + direction_bin;
            qf_bin += direction_bin;

        } else if (move.length === 3) {
            //putting wall
            qf_bin += "1";
            if (move[2] === "h") qf_bin += "0";
            else if (move[2] === "v") qf_bin += "1";
            let x = xalpha.indexOf(move[0]) + 1;
            let y = int(move[1]);
            let wallplace = x - 1 + (y - 1) * 8;
            let wallplace_bin = bin(wallplace);
            wallplace_bin = "0".repeat(6 - wallplace_bin.length) + wallplace_bin;
            qf_bin += wallplace_bin;
        }
        turn = 1 - turn;
    }
    qf_bin += "0".repeat(6 - (qf_bin.length % 6));

    let qf_code = "";
    for (let i = 0; i < Math.floor(qf_bin.length / 6); i++) {
        qf_code += b64chars[int(qf_bin.slice(i * 6, i * 6 + 6), 2)] ?? "";
    }
    return qf_code;
}

// const games = ["e2,e8,e3,e7", "e2,e8,e3,e7,e4,e6,e5,e4", "e2,e2v,f2h,e8,h2h,e7,d6h,f7,f6h,e7,d2,d7,c7v,d8,d3,d3h,c3,b3h,a2h,d9,b3,c9,a3,c8,c5v,c2v,h6h,c7,a4,c6,a5,a5h,b5,b6h,a7v,b1v,c5,c4,c6,b4,b6,a4,a6"]
// console.log("js:", qfEncode(games[2]));