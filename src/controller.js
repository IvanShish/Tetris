export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        let speed = 1000;
        let changeSpeed;
        this.gameOver = false;

        this.intervalId = setTimeout(changeSpeed = () => {
            this.updateView(true);
            this.intervalId = setTimeout(changeSpeed, this.speedOfTimer());
        }, speed);

        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        this.view.renderGame(this.game.getState());
    }

    speedOfTimer() {
        const speed = 1000 - this.game.getState().level * 100;
        speed > 0 ? speed : 100;
        return speed;
    }

    updateView(isNeedToUpdateTimer) {
        if (this.game.getState().isGameOver) {
            this.view.renderGameOverScreen(this.game.getState());
            this.renderRecord();
            clearTimeout(this.intervalId);
            this.gameOver = true;
        }
        else if (isNeedToUpdateTimer) {
            this.game.movePieceDown();
            this.view.renderGame(this.game.getState());
        }
        else {
            this.view.renderGame(this.game.getState());
        }
    }

    handleKeyDown(event) {
        if (this.gameOver) return;

        switch (event.keyCode) {
            case 37:    //ArrowLeft
                this.game.movePieceLeft();
                this.updateView(false);
                break;
            case 38:    //ArrowUp
                this.game.rotatePiece();
                this.updateView(false);
                break;
            case 39:    //ArrowRight
                this.game.movePieceRight();
                this.updateView(false);
                break;
            case 40:    //ArrowDown
                this.game.movePieceDown();
                this.updateView(false);
                break;
            case 32:    //Space character
                this.game.movePieceDown();
                this.updateView(false);
                break;
        }
    }

    store(src, name, level) {
        const elem = {
            name: name,
            level: level
        }
        localStorage.setItem(src.toString(), JSON.stringify(elem));
    }

    read(src) {
        return JSON.parse(localStorage.getItem(src.toString()));
    }

    renderRecord() {
        let i = 0;
        let elem;

        for (i; i < 5; i++){
            elem = this.read(i + 1);
            if ((elem == null) || (elem.level < this.game.level)){
                this.store(i + 1, localStorage["tetris.username"], this.game.level);

                if (elem != null) {
                    i++;
                    let buff;

                    for (i; i < 5; i++){
                        buff = this.read(i + 1);
                        this.store(i + 1, elem.name, elem.level);
                        elem = buff;
                        if (elem == null){
                            break;
                        }
                    }
                }
                break;
            }
        }
    }


    // startTimer() {
    //     if (this.intervalId) {
    //         console.log("YES");
    //         this.intervalId = setInterval(() => {
    //             this.updateView(true);
    //         }, this.speedOfTimer());
    //     }
    // }
    //
    // stopTimer() {
    //     if (this.intervalId) {
    //         clearInterval(this.intervalId);
    //         this.intervalId = null;
    //     }
    // }
}