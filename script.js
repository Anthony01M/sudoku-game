document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const checkButton = document.getElementById('check-sudoku');
    const tipButton = document.getElementById('tip-sudoku');
    const restartButton = document.getElementById('restart-sudoku');

    let solution = generateCompleteSudoku();
    let sudoku = [...solution];
    removeCells(sudoku);
    fillBoard(sudoku);

    checkButton.addEventListener('click', () => {
        const inputs = board.querySelectorAll('input');
        const values = Array.from(inputs).map(input => input.value === '' ? 0 : parseInt(input.value));

        if (isValidSudoku(values)) {
            alert('Sudoku is correct!');
            restartButton.style.display = 'block';
        } else {
            alert('Sudoku is incorrect.');
        }
    });

    tipButton.addEventListener('click', () => {
        const inputs = board.querySelectorAll('input');
        const emptyCells = Array.from(inputs).filter(input => input.value === '');
        if (emptyCells.length === 0) {
            alert('No empty cells left!');
            return;
        }
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const index = Array.from(inputs).indexOf(randomCell);
        randomCell.value = solution[index];
    });

    restartButton.addEventListener('click', () => {
        solution = generateCompleteSudoku();
        sudoku = [...solution];
        removeCells(sudoku);
        fillBoard(sudoku);
        restartButton.style.display = 'none';
    });

    function generateCompleteSudoku() {
        const board = Array(81).fill(0);
        fillSudoku(board);
        return board;
    }

    function fillSudoku(board) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 81; i++) {
            if (board[i] === 0) {
                shuffle(numbers);
                for (const num of numbers) {
                    if (isValidPlacement(board, i, num)) {
                        board[i] = num;
                        if (fillSudoku(board)) {
                            return true;
                        }
                        board[i] = 0;
                    }
                }
                return false;
            }
        }
        return true;
    }

    function removeCells(board) {
        const cellsToRemove = 40;
        for (let i = 0; i < cellsToRemove; i++) {
            let cell;
            do {
                cell = Math.floor(Math.random() * 81);
            } while (board[cell] === 0);
            board[cell] = 0;
        }
    }

    function isValidPlacement(board, index, num) {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const regionRow = Math.floor(row / 3) * 3;
        const regionCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 9; i++) {
            if (board[row * 9 + i] === num || board[i * 9 + col] === num) {
                return false;
            }
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[(regionRow + i) * 9 + (regionCol + j)] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function fillBoard(sudoku) {
        board.innerHTML = '';
        sudoku.forEach((value, index) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = value === 0 ? '' : value;
            board.appendChild(input);
        });
    }

    function isValidSudoku(values) {
        for (let i = 0; i < 9; i++) {
            const row = values.slice(i * 9, i * 9 + 9);
            if (!isValidGroup(row)) return false;
        }

        for (let i = 0; i < 9; i++) {
            const column = [];
            for (let j = 0; j < 9; j++) {
                column.push(values[i + j * 9]);
            }
            if (!isValidGroup(column)) return false;
        }

        const regions = [
            [0, 1, 2, 9, 10, 11, 18, 19, 20],
            [3, 4, 5, 12, 13, 14, 21, 22, 23],
            [6, 7, 8, 15, 16, 17, 24, 25, 26],
            [27, 28, 29, 36, 37, 38, 45, 46, 47],
            [30, 31, 32, 39, 40, 41, 48, 49, 50],
            [33, 34, 35, 42, 43, 44, 51, 52, 53],
            [54, 55, 56, 63, 64, 65, 72, 73, 74],
            [57, 58, 59, 66, 67, 68, 75, 76, 77],
            [60, 61, 62, 69, 70, 71, 78, 79, 80]
        ];

        for (const region of regions) {
            const group = region.map(index => values[index]);
            if (!isValidGroup(group)) return false;
        }

        return values.every(value => value !== 0);
    }

    function isValidGroup(group) {
        const seen = new Set();
        for (const value of group) {
            if (value === 0) continue;
            if (seen.has(value)) return false;
            seen.add(value);
        }
        return true;
    }
});