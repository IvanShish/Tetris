export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.intervalId = setInterval(() => {
            this.updateView(true);
        }, this.speedOfTimer());

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        //document.addEventListener('keyup', this.handleKeyUp.bind(this));

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
                //this.stopTimer();
                this.game.movePieceDown();
                this.updateView(false);
                break;
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