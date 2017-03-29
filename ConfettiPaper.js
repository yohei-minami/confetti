const Vector2 = require('./Vector2');
const _ = require('lodash');

const IS_SPN = location.pathname.indexOf('/spn') === 0;

const PI = Math.PI;
const round = Math.round;
const random = Math.random;
const cos = Math.cos;
const sin = Math.sin;
const DEG_TO_RAD = PI / 180;
const retina = window.devicePixelRatio * (IS_SPN ? 0.5 : 1);

const colors = location.hash ? [
    ['rgb(0,175,67)', 'rgb(0,192,74)'], // green
    ['rgb(255,100,23)', 'rgb(255,110,25)'], // orange
    ['rgb(255,233,160)', 'rgb(255,233,160)'], // yellow
    ['rgb(142,201,231)', 'rgb(152,221,255)'], // blue
    ['rgb(123,90,161)', 'rgb(135,10,176)'], // purple
] : [
    ['rgb(255,233,160)', 'rgb(255,233,160)'], // yellow
    ['rgb(248,198,186)', 'rgb(248,198,186)'], // pink
];

class ConfettiPaper {
  constructor(_x, _y) {
    this.pos = new Vector2(_x, _y);
    this.pos.x = (((_.random(-1, 1) * random() * random()) + 1) / 2) * ConfettiPaper.bounds.x;

    this.rotationSpeed = (random() * 500) + 500;
    this.rotationSpeedB = (random() * 100) + 5;
    this.angle = DEG_TO_RAD * random() * 360;
    this.rotation = DEG_TO_RAD * random() * 360;
    this.cosA = 1.0;
    this.cosB = 1.0;
    this.rotationB = DEG_TO_RAD * random() * 360;
    this.size = (12.0 + (12.0 * random() * random())) * retina;
    this.oscillationSpeed = (random() * 1.5) + 0.5;
    this.xSpeed = 100.0;
    this.ySpeed = (this.size * 6) + 6.0;
    this.corners = [];
    this.time = random();

    const ci = round(random() * (colors.length - 1));

    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];

    for (let i = 0; i < 4; i += 1) {
      const dx = cos(this.angle + (DEG_TO_RAD * ((i * 90) + 45))) * ((random() + 1) / 2);
      const dy = sin(this.angle + (DEG_TO_RAD * ((i * 90) + 45))) * ((random() + 1) / 2);
      this.corners[i] = new Vector2(dx, dy);
    }
  }

  Update(_dt) {
    this.time += _dt;
    this.rotation += this.rotationSpeed * _dt;
    this.rotationB += this.rotationSpeedB * _dt;
    this.cosA = cos(DEG_TO_RAD * this.rotation);
    this.sinA = sin(DEG_TO_RAD * this.rotation);
    this.cosB = cos(DEG_TO_RAD * this.rotationB);
    this.sinB = sin(DEG_TO_RAD * this.rotationB);
    this.pos.x += cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt;
    this.pos.y += this.ySpeed * _dt;

    if (this.pos.y > ConfettiPaper.bounds.y) {
      this.pos.x = (((_.random(-1, 1) * random() * random()) + _.random(-0.6, 0.6) + 1) / 2)
        * ConfettiPaper.bounds.x;
      this.pos.y = 0;
    }
  }

  Draw(_g) {
    const context = _g;
    if (this.cosA > 0) {
      context.fillStyle = this.frontColor;
    } else {
      context.fillStyle = this.backColor;
    }
    context.beginPath();
    context.moveTo(
      this.pos.x + (this.size * ((this.corners[0].x * this.cosB)
      + (this.corners[0].y * this.sinB * this.sinA))),
      this.pos.y + (this.corners[0].y * this.size * this.cosA));
    for (let i = 1; i < 4; i += 1) {
      context.lineTo(
        this.pos.x + (this.size * ((this.corners[i].x * this.cosB)
        + (this.corners[i].y * this.sinB * this.sinA))),
        this.pos.y + (this.corners[i].y * this.size * this.cosA));
    }
    context.closePath();
    context.fill();
  }
}

ConfettiPaper.bounds = new Vector2(0, 0);

module.exports = ConfettiPaper;
