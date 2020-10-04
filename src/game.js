export default class Game {
    static points = {
        '1': 20,
        '2': 50,
        '3': 150,
        '4': 600
    };

    score = 0;
    rows = 0;
    topOut = false;     //Game over
    playfield = this.createPlayfield();
    activePiece = this.createPiece(); //Объект активной фигуры
    nextPiece = this.createPiece();

    get level() {
        return Math.floor(this.rows * 0.5);
    }

    movePieceLeft() {
        this.activePiece.x -= 1;

        if (this.hasCollision()) {
            this.activePiece.x += 1;
        }
    }

    movePieceRight() {
        this.activePiece.x += 1;

        if (this.hasCollision()) {
            this.activePiece.x -= 1;
        }
    }

    movePieceDown() {
        if (this.topOut) return;

        this.activePiece.y += 1;

        if (this.hasCollision()) {
            this.activePiece.y -= 1;
            this.lockPiece();   //Если дошли до низа или встретилась фигура
            const clearedRows = this.clearRows();
            this.updateScore(clearedRows);
            this.updatePieces();
        }

        if (this.hasCollision()) {
            this.topOut = true;
        }
    }

    getState() {
        const playfield = this.createPlayfield();

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = []

            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }

        for (let y = 0; y < this.activePiece.blocks.length; y++) {
            for (let x = 0; x < this.activePiece.blocks[y].length; x++) {
                if (this.activePiece.blocks[y][x]) {
                    playfield[this.activePiece.y + y][this.activePiece.x + x] = this.activePiece.blocks[y][x];
                }
            }
        }

        return {
            score: this.score,
            level: this.level,
            rows: this.rows,
            nextPiece: this.nextPiece,
            playfield,
            isGameOver: this.topOut
        };
    }

    createPlayfield() {
        const playfield = [];

        for (let y = 0; y < 20; y++) {
            playfield[y] = []

            for (let x = 0; x < 10; x++) {
                playfield[y][x] = 0;
            }
        }

        return playfield;
    }

    createPiece() {
        const index = Math.floor(Math.random() * 7);    //7 фигур
        const type = 'IJLOSTZ'[index];
        const piece = { };

        switch (type){
            case 'I':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ];
                break;

            case 'J':
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2],
                ];
                break;

            case 'L':
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [2, 0, 0],
                ];
                break;

            case 'O':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 3, 3, 0],
                    [0, 3, 3, 0],
                    [0, 0, 0, 0],
                ];
                break;

            case 'S':
                piece.blocks = [
                    [0, 0, 0],
                    [0, 4, 4],
                    [4, 4, 0],
                ];
                break;

            case 'T':
                piece.blocks = [
                    [0, 0, 0],
                    [5, 5, 5],
                    [0, 5, 0],
                ];
                break;

            case 'Z':
                piece.blocks = [
                    [0, 0, 0],
                    [4, 4, 0],
                    [0, 4, 4],
                ];
                break;

            default:
                throw new Error('Unknown type of figure');
        }

        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1;
        return piece;
    }

    rotatePiece() {
        const blocks = this.activePiece.blocks;
        const length = blocks.length;

        const tmp = [];
        for (let i = 0; i < length; i++) {
            tmp[i] = new Array(length).fill(0);
        }

        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
                tmp[x][y] = blocks[length - 1 - y][x];
            }
        }

        this.activePiece.blocks = tmp;

        if (this.hasCollision()) {
            this.activePiece.blocks = blocks;
        }
    }

    hasCollision() {
        const { y: pieceY, x:pieceX, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x] &&
                    ((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) ||
                    this.playfield[pieceY + y][pieceX + x])
                ) {
                    return true;
                }
            }
        }

        return false
    }

    lockPiece() {
        const blocks = this.activePiece.blocks;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playfield[this.activePiece.y + y][this.activePiece.x + x] = blocks[y][x];
                }
            }
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }

    updateScore(clearedRows) {
        if (clearedRows > 0) {
            this.score += Game.points[clearedRows] * (this.level + 1);
            this.rows += clearedRows;
        }
    }

    clearRows() {
        const rows = 20;
        const col = 10;
        let lines = [];

        for (let y = rows - 1; y >= 0; y--) {
            let numOfBlocks = 0;

            for (let x = 0; x < col; x++) {
                if (this.playfield[y][x]) {
                    numOfBlocks++;
                }
            }

            if (numOfBlocks === 0) {
                break;
            }
            else if (numOfBlocks < col) {
                continue;
            }
            else if (numOfBlocks === col) {
                lines.unshift(y);   //add elem to the beginning of the arr
            }
        }

        for (let i of lines) {
            this.playfield.splice(i, 1);   //delete
            this.playfield.unshift(new Array(col).fill(0));
        }

        return lines.length;
    }

    restart() {
        this.score = 0;
        this.rows = 0;
        this.topOut = false;     //Game over
        this.playfield = this.createPlayfield();
        this.activePiece = this.createPiece(); //Объект активной фигуры
        this.nextPiece = this.createPiece();
    }
}