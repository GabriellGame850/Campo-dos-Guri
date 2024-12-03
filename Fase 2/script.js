document.addEventListener('DOMContentLoaded', () => {
    const rows = 8;
    const cols = 8;
    const numMines = 10;
    const board = document.getElementById('minesweeper');
    let cells = [];
    let mines = new Set();
    let revealedCount = 0;
    let gameOver = false;
    let botaoFase = 0;
    let flagCount = 0;

    function startGame() {
        board.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
        board.style.gridTemplateRows = `repeat(${rows}, 40px)`;
        board.innerHTML = '';
        cells = [];
        mines = new Set();
        revealedCount = 0;
        gameOver = false;
        createBoard();
    }

    function createBoard() {
        for (let i = 0; i < rows; i++) {
            cells[i] = [];
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => revealCell(i, j));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    toggleFlag(i, j);
                });
                board.appendChild(cell);
                cells[i][j] = cell;
            }
        }
        placeMines();
    }

    function placeMines() {
        while (mines.size < numMines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            mines.add(`${row},${col}`);
        }
    }

    function revealCell(row, col) {
        if (gameOver) return;

        const cell = cells[row][col];
        if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) return;

        cell.classList.add('revealed');
        revealedCount++;
        //Perdeu
        if (mines.has(`${row},${col}`)) {
            cell.classList.add('mine', 'exploded');
            revealAllMines();
            gameOver = true;
            document.getElementById("Restart").style.display = "block";
            return;
        }
        
        const adjacentMines = countAdjacentMines(row, col);
        if (adjacentMines > 0) {
            cell.textContent = adjacentMines;
        } else {
            for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
                for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
                    revealCell(i, j);
                }
            }
        }
        //Ganhou
        if (revealedCount === rows * cols - numMines) {
            revealAllMines();
            gameOver = true;
            botaoFase = 1;
            document.getElementById("Restart").style.display = "block";
            document.getElementById("Restart").style.fontWeight = "bold";
            document.getElementById("Restart").innerText = "Avançar";
        }
    }
    
    function toggleFlag(row, col) {
        if (gameOver) return;
        
        const cell = cells[row][col];
        if (cell.classList.contains('revealed')) return;
        
        if (cell.classList.contains('flagged')) {
            cell.classList.remove('flagged');
            cell.textContent = '';
            flagCount--;
            document.getElementById("numberFlags").innerText = numMines - flagCount;
        } else {
            cell.classList.add('flagged');
            flagCount++;
            document.getElementById("numberFlags").innerText = numMines - flagCount;
        }
    }
    
    function countAdjacentMines(row, col) {
        let count = 0;
        for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
            for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
                if (mines.has(`${i},${j}`)) {
                    count++;
                }
            }
        }
        return count;
    }
    
    function revealAllMines() {
        mines.forEach(mine => {
            const [row, col] = mine.split(',').map(Number);
            const cell = cells[row][col];
            if (!cell.classList.contains('revealed')) {
                cell.classList.add('revealed');
                cell.classList.add('mine');
            }
        });
    }
    
    startGame();
    
    document.getElementById("Restart").addEventListener('click', function(){
        if(botaoFase === 0){
            document.getElementById("Restart").style.display = "none";
            if(revealedCount <= 3){
                startGame();
            } else {
                window.location.href = "/Fase 1/index.html";
            }
        } else if (botaoFase === 1){
            window.location.href = "/Fase 3/index.html";
        }
    })
});
