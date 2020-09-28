export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;

        this.intervalId = setInterval(() => {
            this.updateView();
        }, this.speedOfTimer());

        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        this.view.renderGame(this.game.getState());
    }

    speedOfTimer() {
        const speed = 1000 - this.game.getState().level * 100;
        speed > 0 ? speed : 100;
        return speed;
    }

    updateView() {
        if (this.game.getState().isGameOver) {
            this.view.renderGameOverScreen(this.game.getState());
        }
        else {
            this.game.movePieceDown();
            this.view.renderGame(this.game.getState());
        }
    }

    handleKeyDown() {
        switch (event.keyCode) {
            case 37:    //ArrowLeft
                this.game.movePieceLeft();
                this.updateView();
                break;
            case 38:    //ArrowUp
                this.game.rotatePiece();
                this.updateView();
                break;
            case 39:    //ArrowRight
                this.game.movePieceRight();
                this.updateView();
                break;
            case 40:    //ArrowDown
                this.game.movePieceDown();
                this.updateView();
                break;
        }
    }
}

/*
    <H1>Введите имя игрока</H1>
    <form NAME="Sel1">
            <TABLE>
                <TR><TD><B>Имя пользователя:<B></TD>
                    <TD><INPUT NAME="Nickname" SIZE=20
                               onBlur="this.value=this.value.toUpperCase()"></TD></TR>
            </TABLE>
            <!-- Кнопки готовности и сброса -->
            <INPUT TYPE="button" VALUE="Ввод" onClick="Complete();">
        </form>
 */