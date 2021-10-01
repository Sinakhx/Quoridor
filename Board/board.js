const cols = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
const colsKeys = cols.reduce((res, col, idx) => ({ ...res, [col]: idx }), {});

const squares = cols.map((col) =>
    Array(9).fill().map((_, i) => ({
        col,
        row: i + 1,
        wallH: false,
        wallV: false,
        isOccupied: false,
    }))
);

// helper to get surrounding squares of a specific square
const getCell = (square) => {
    const rowIndex = square.row - 1;
    const colIndex = colsKeys[square.col];
    return {
        next:{
            row: () => rowIndex < 8 && squares[colIndex][rowIndex + 1],
            col: () => colIndex < 8 && squares[colIndex + 1][rowIndex],
        },
        prev:{
            row: () => rowIndex > 0 && squares[colIndex][rowIndex - 1],
            col: () => colIndex > 0 && squares[colIndex - 1][rowIndex],
        },
    }
};