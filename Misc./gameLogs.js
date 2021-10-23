const COLORS = { white: "f29a00", black: "3d1303" };

const int = parseInt;
const bin = (dec) => (dec >>> 0).toString(2);
const getDateString = d => `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;

const qfEncode = (notation = "e2,d2h,f2,e8,e7v,e7") => {
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

const getBoardData = () => {
    const isLiveGame = window?.quoridorstrats_notation?.length;
    let notationsArray = window.quoridorstrats_notation || window.d || [];
    if (!isLiveGame) notationsArray = window.g_gamelogs.map((i) => i.data).map((item) => item[0]?.args?.quoridorstrats_notation).filter(Boolean) || window.d || [];
    let [black, white] = window.gameui.gamedatas.gamestate.args?.result || Object.values(window.gameui.gamedatas.players);
    if (black.color === COLORS.white) {
        [black, white] = [white, black];
    };
    const playerWhite = white.name;
    const playerBlack = black.name;
    const WhiteElo = document.querySelector(`#player_elo_${white.id || white.player}`).textContent;
    const BlackElo = document.querySelector(`#player_elo_${black.id || black.player}`).textContent;
    const date = getDateString(new Date(window.dataLayer[1]["gtm.start"]));
    const result = notationsArray.length % 2 === 1 ? "1-0" : "0-1"; 
    const movesList = notationsArray.map((move, idx) => idx % 2 === 1 ? move : `${Math.ceil((idx + 1) / 2)}.${move}`).join(" ") + ` ${result}`;
    const qfCode = qfEncode(notationsArray.join(","));
    const output = {
        playerWhite, playerBlack, WhiteElo, BlackElo, date, result, movesList, qfCode
    };
    console.table(output);
    return output;
}