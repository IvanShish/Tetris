export default class View {
    static colors = {
        '1': '#0341AE',
        '2': '#72CB3B',
        '3': '#FFD500',
        '4': '#FF971C',
        '5': '#FF3213'
    };

    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.playfieldBorderWidth = 6;  //Ширина границы
        this.playfieldX = this.width * 1 / 3;
        this.playfieldY = this.playfieldBorderWidth;
        this.playfieldWidth = this.width * 1 / 3;
        this.playfieldHeight = this.height;
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
        this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;

        this.blockWidth = this.playfieldInnerWidth / columns;
        this.blockHeight = this.playfieldInnerHeight / rows;

        this.panelX = 0;
        this.panelY = 0;
        // this.panelWidth = this.width / 3;
        // this.panelHeight = this.height;

        this.element.appendChild(this.canvas);
    }

    renderGame(state) {
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    renderGameOverScreen({ level }) {
        this.clearScreen();

        this.context.fillStyle = 'white';
        this.context.font = '24px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, 70);
        this.context.fillText(`Player: ${localStorage["tetris.username"]}`, this.width/2, 100);
        this.context.fillText(`Level: ${level}`, this.width / 2, 130);

        const restartButton = document.querySelector(".restartButton");
        restartButton.style.visibility = 'visible';
    }

    renderPlayfield({ playfield }) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];

            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                if (block) {
                    this.renderBlock(this.playfieldX + (x * this.blockWidth),
                        this.playfieldY + (y * this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        View.colors[block]);
                }
            }
        }

        this.context.strokeStyle = "#2b2d42";
        this.context.lineWidth = this.playfieldBorderWidth;
        this.context.strokeRect(this.playfieldX - 5, 0, this.playfieldWidth, this.playfieldHeight - 2);

        // const stepX = 31;
        // this.context.strokeStyle = '#2b2d42';
        // this.context.lineWidth = 1;
        // for (var i = this.playfieldX + stepX; i < this.width * 2 / 3 - stepX; i += stepX) {
        //     this.context.moveTo(i, 0);
        //     this.context.lineTo(i, this.canvas.height);
        //     this.context.stroke();
        // }
        //
        // const stepY = 31.5;
        // for (var i = stepY + 5; i < this.playfieldHeight - 2; i += stepY) {
        //     this.context.moveTo(this.playfieldX - 5, i);
        //     this.context.lineTo(this.width * 2 / 3 - 2, i);
        //     this.context.stroke();
        // }
    }

    renderPanel({ level, score, rows, nextPiece }) {
        this.context.textAlign = 'start';   //По левому краю
        this.context.textBaseline = 'top';  //По верхнему краю
        this.context.fillStyle = 'white';
        this.context.font = '25px "Press Start 2P"';

        this.context.fillText(`Текущий уровень: ${level}`, 0, 0);
        this.context.fillText(`Следующая фигура`, 0, 30);

        for (let y = 0; y < nextPiece.blocks.length; y++) {
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];

                if (block) {
                    this.renderBlock(
                        this.panelX + 40 + (x * this.blockWidth),
                        this.panelY + 40 + (y * this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        View.colors[block]
                    );
                }
            }
        }


        this.context.fillStyle = 'white';
        this.context.font = '15px "Press Start 2P"';
        this.context.fillText(`Клавишы для управления:`, 0, 160);
        this.context.fillText(`Стрелка влево - перемещение фигуры влево`, 0, 180);
        this.context.fillText(`Стрелка вправо - перемещение фигуры вправо`, 0, 200);
        this.context.fillText(`Стрелка вниз / пробел - "уронить" фигуру`, 0, 220);
        this.context.fillText(`Стрелка вверх - повернуть фигуру`, 0, 240);
    }

    renderBlock(x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;

        this.context.fillRect(x, y, width, height);     //Прямоугольник
        this.context.strokeRect(x, y, width, height);  //Обводка
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
}