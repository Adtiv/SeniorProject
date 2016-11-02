import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'canvas-page',
  templateUrl: 'canvas.html'
})
export class Canvas {
  public myCanvas: HTMLCanvasElement;
  // public context: CanvasRenderingContext2D;
  // public isDrawing: boolean;
  constructor(public navCtrl: NavController, private platform:Platform) {
    console.log("inside canvas constructor");
  }
  ionViewDidEnter() {
    console.log("Initializing");
    this.myCanvas = <HTMLCanvasElement>document.getElementById('canvas');
    var canvas = this.myCanvas;
    var context = canvas.getContext("2d");
    var isDrawing = false;
    canvas.width = this.platform.width();
    canvas.height = this.platform.height();
    console.log("Canvas Width: " + canvas.width);
    console.log("Canvas Height: " + canvas.height);
    init();

    function start(event) {
      console.log("START!!!!");
      isDrawing = true;
      console.log("isDrawing:" + isDrawing);
      console.log("Context inside start: " + context);
      context.beginPath();
      console.log("Made it after begin path");
      var touchX = getX(event);
      var touchY = getY(event);
      console.log("TOUCH X: " + touchX);
      console.log("TOUCH Y: " + touchY);
      context.moveTo(touchX, touchY);
      event.preventDefault();
    }

    function draw(event) {
      console.log("Draw");
      if(isDrawing) {
          console.log("Draw if statement");
          context.lineTo(getX(event),getY(event));
          context.stroke();
      }
      event.preventDefault();
    }

    function stop(event) {
      console.log("STOP!!!");
      if(isDrawing) {
         console.log("Inside stop statement");
         context.stroke();
         context.closePath();
         isDrawing = false;
      }
      event.preventDefault();
    }

    function getX(event) {
      var touch = event.targetTouches[0];
      console.log("GETX: " + (touch.pageX-touch.target.offsetLeft));
      return touch.pageX-touch.target.offsetLeft;
    }

    function getY(event) {
      var touch = event.targetTouches[0];
      console.log("GETY: " + (touch.pageY-touch.target.offsetTop));
      return touch.pageY-touch.target.offsetTop;
    }

    function init() {
      canvas.addEventListener("touchstart",start,false);
      canvas.addEventListener("touchmove",draw,false);
      canvas.addEventListener("touchend",stop,false);
    }
  }
}
