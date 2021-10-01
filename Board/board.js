const cols = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
const squares = cols.map((col) =>
    Array(9).fill().map((_, i) => ({
        col,
        row: i + 1,
        wallH: false,
        wallV: false,
        isOccupied: false,
    }))
);