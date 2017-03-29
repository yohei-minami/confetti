const Vector2 = require('./Vector2');
const ConfettiPaper = require('./ConfettiPaper');

const IS_RETINA = window.devicePixelRatio;

const SPEED = 50;
const DURATION = (1.0 / SPEED);
const PAPER_COUNT = 100;

export default class Confetti {

  constructor(_canvas) {
    const canvasWidth = _canvas.offsetWidth;
    const canvasHeight = _canvas.offsetHeight;

    this.canvas = _canvas;
    this.context = _canvas.getContext('2d');
    this.canvas.width = canvasWidth * IS_RETINA;
    this.canvas.height = canvasHeight * IS_RETINA;
    this.confettiPapers = [];

    ConfettiPaper.bounds = new Vector2(this.canvas.width, this.canvas.height);
    for (let i = 0; i < PAPER_COUNT; i += 1) {
      this.confettiPapers[i] =
        new ConfettiPaper(Math.random() * this.canvas.width, -Math.random() * this.canvas.height);
    }
  }

  resize() {
    ConfettiPaper.bounds = new Vector2(this.canvas.width, this.canvas.height);
  }

  start() {
    this.stop();
    this.update();
  }

  stop() {
    cancelAnimationFrame(this.interval);
  }

  update() {
    this.context.globalAlpha = 1;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < PAPER_COUNT; i += 1) {
      this.confettiPapers[i].Update(DURATION);
      this.confettiPapers[i].Draw(this.context);
    }
  }
}
