import 'babel-polyfill';
import ControlKit from 'controlkit';
import Vector2 from './Vector2';
import $ from 'jquery';

const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const DEG_TO_RAD = PI / 180;

class Learn {
  constructor() {
    console.log('Learn');

    this.canvas = document.querySelector('.firstCanvas');
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;

    this.canvas2 = document.querySelector('.secondCanvas');
    this.context2 = this.canvas2.getContext('2d');

    this.multiView = false;

    this.frontColor = '#7debff';
    this.backColor = '#4e6cff';

    this.move = true;
    this.guide = true;
    this.fill = true;
    this.skeleton = true;
    this.edge = true;
    this.postimage = false;

    this.position = new Vector2(this.width / 2, this.height / 2);

    this.squareAngle = 0;
    this.rotationAngle = 0;
    this.twistAngle = 0;
    this.angleRange = [0, 360];

    this.rotationSpeed = 10;
    this.rotationSpeedRange = [0, 30];
    this.twistSpeed = 1;
    this.twistSpeedRange = [0, 2];

    this.sinRotation = sin(this.rotationAngle);
    this.cosRotation = cos(this.rotationAngle);
    this.sinTwist = sin(this.twistAngle);
    this.cosTwist = cos(this.twistAngle);

    this.isFront = this.sinRotation > 0 === this.sinTwist > 0;
    this.isFront2 = this.sinRotation > 0;

    this.size = 200;

    this.corners = [];
    this.points = [];
    this.points2 = [];

    this.controlKit = new ControlKit();

    this.controlKit.addPanel()

      .addGroup({'label': 'MOVE'})
      .addCheckbox(this, 'move')
      .addCheckbox(this, 'guide')
      .addCheckbox(this, 'edge')
      .addCheckbox(this, 'skeleton')
      .addCheckbox(this, 'fill')
      .addCheckbox(this, 'postimage')
      .addButton('2 views', ()=> {
        this.multiView = !this.multiView;
        if (this.multiView) {
          $('body').addClass('multiView');
        } else {
          $('body').removeClass('multiView');
        }
      })

      .addGroup({'label': 'COLORS'})
      .addColor(this, 'frontColor', {colorMode: 'hex'})
      .addColor(this, 'backColor', {colorMode: 'hex'})

      .addGroup({'label': 'ANGLES'})
      .addSlider(this, 'squareAngle', 'angleRange')
      .addSlider(this, 'rotationAngle', 'angleRange')
      .addSlider(this, 'twistAngle', 'angleRange')

      .addGroup({'label': 'SPEEDS'})
      .addSlider(this, 'rotationSpeed', 'rotationSpeedRange')
      .addSlider(this, 'twistSpeed', 'twistSpeedRange')

      .addGroup({'label': 'OUTPUT'})
      .addValuePlotter(this, 'sinRotation')
      .addValuePlotter(this, 'sinTwist')

    this.start();
  }

  start() {
    this.resize();
    this.draw();
    this.frame();
  }

  resize() {
    for (let i = 0; i < 4; i += 1) {
      const dx = cos((DEG_TO_RAD * (i * 90 + 45)) + DEG_TO_RAD * this.squareAngle);
      const dy = sin((DEG_TO_RAD * (i * 90 + 45)) + DEG_TO_RAD * this.squareAngle);
      this.corners[i] = new Vector2(dx, dy);
      this.points[i] = new Vector2(dx, dy);
      this.points2[i] = new Vector2(dx, dy);
    }
  }

  frame() {
    requestAnimationFrame(() => {
      this.frame();
    });
    this.update();
    this.draw();
  }

  update() {

    this.resize();

    if (this.move) {
      this.rotationAngle = (this.rotationAngle + this.rotationSpeed) % 360;
      this.twistAngle = (this.twistAngle + this.twistSpeed) % 360;
    }

    this.sinRotation = sin(this.rotationAngle * DEG_TO_RAD);
    this.cosRotation = cos(this.rotationAngle * DEG_TO_RAD);
    this.sinTwist = sin(this.twistAngle * DEG_TO_RAD);
    this.cosTwist = cos(this.twistAngle * DEG_TO_RAD);

    for (let i = 0; i < 4; i += 1) {
      this.points[i].x = this.position.x + (this.size * ((this.corners[i].x * this.cosTwist)
        + (this.corners[i].y * this.sinTwist * this.sinRotation)));
      this.points[i].y =
        this.position.y + (this.corners[i].y * this.size * this.cosRotation);

      this.points2[i].x = this.position.x + (this.size * ((this.corners[i].x * this.cosTwist)
        + (this.corners[i].y * this.sinTwist * this.sinRotation)));
      this.points2[i].y = this.position.y + (this.size * ((this.corners[i].x * this.sinTwist)
        - (this.corners[i].y * this.cosTwist * this.sinRotation)));
    }
  }

  draw() {

    this.isFront = this.cosRotation > 0 === this.cosTwist > 0;
    this.isFront2 = this.sinRotation > 0;

    this.context.globalAlpha = 1;
    this.context2.globalAlpha = 1;

    if (this.postimage) {
      this.context.fillStyle = 'rgba(0, 0, 0, .1)';
      this.context.rect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fill();
      this.context2.fillStyle = 'rgba(0, 0, 0, .03)';
      this.context2.rect(0, 0, this.canvas.width, this.canvas.height);
      this.context2.fill();
    } else {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context2.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.fill) {
      this.drawPaper();
    }

    if (this.skeleton) {
      this.drawSkeleton();
    }
    if (this.edge) {
      this.drawEdge();
    }

    if (this.guide) {
      this.drawGuide();
    }

    this.controlKit.update();
  }

  drawPaper() {
    this.context.fillStyle = this.isFront ? this.frontColor : this.backColor;
    this.context.beginPath();
    this.context.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < 4; i += 1) {
      this.context.lineTo(this.points[i].x, this.points[i].y);
    }
    this.context.closePath();
    this.context.fill();

    this.context2.fillStyle = this.isFront2 ? this.frontColor : this.backColor;
    this.context2.beginPath();
    this.context2.moveTo(this.points2[0].x, this.points2[0].y);
    for (let i = 1; i < 4; i += 1) {
      this.context2.lineTo(this.points2[i].x, this.points2[i].y);
    }
    this.context2.closePath();
    this.context2.fill();
  }

  drawGuide() {
    const ctx = this.context;

    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();

    ctx.strokeText('0', 237, 263);
    ctx.strokeText('x', 5, 263);
    ctx.strokeText('y', 237, 10);

    if (this.multiView) {
      this.drawGuide2();
    }
  }

  drawSkeleton() {
    this.context.beginPath();
    this.context.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < 4; i += 1) {
      this.context.lineTo(this.points[i].x, this.points[i].y);
    }
    this.context.closePath();
    this.context.stroke();

    this.context2.beginPath();
    this.context2.moveTo(this.points2[0].x, this.points2[0].y);
    for (let i = 1; i < 4; i += 1) {
      this.context2.lineTo(this.points2[i].x, this.points2[i].y);
    }
    this.context2.closePath();
    this.context2.stroke();

  }

  drawEdge() {
    const ctx = this.context;

    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(this.points[i].x, this.points[i].y, 5, 0, PI * 2, false);
      ctx.stroke();
    }

    const ctx2 = this.context2;

    for (let i = 0; i < 4; i += 1) {
      ctx2.beginPath();
      ctx2.arc(this.points2[i].x, this.points2[i].y, 5, 0, PI * 2, false);
      ctx2.stroke();
    }


  }

  drawGuide2() {
    const ctx = this.context2;

    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();

    ctx.strokeText('0', 237, 263);
    ctx.strokeText('x', 5, 263);
    ctx.strokeText('z', 237, 10);
  }
}

window.learn = window.learn || new Learn();
