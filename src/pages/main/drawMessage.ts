import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { CameraPreview } from 'ionic-native';
import { MainService } from './main.service';
import { CameraViewPage } from './cameraView';
import {LoadingController} from 'ionic-angular';

declare var cordova:any;
@Component({
  templateUrl: 'drawMessage.html'
})
export class DrawMessagePage {
  public backgroundImage: string;
  public myCanvas: HTMLCanvasElement;
  constructor(public loading:LoadingController,public navCtrl: NavController,private platform:Platform,private mainService:MainService) {
    if(this.platform.is('android')) {
      this.backgroundImage = mainService.cameraViewPicture;
    }
    else {
      this.backgroundImage = mainService.cameraPicture;
    }
  }
  ionViewDidEnter() {
    var self = this;
    var canvasPage = document.getElementById('canvasPage');
    this.myCanvas = <HTMLCanvasElement>document.getElementById('canvas');
    var canvas = this.myCanvas;
    var context = canvas.getContext("2d");
    var isDrawing = false;
    var canvasWidth = this.platform.width();
    var canvasHeight = this.platform.height();
    var undo_list = [];
    var red = "#ff0000";
    var orange = "#ffa500";
    var yellow = "#ffb90f";
    var green = "#659b41";
    var blue = "#0000ff";
    var teal = "008080";
    var turquoise = "00f5ff";
    var indigo = "#4b0082";
    var violet = "#ee82ee";
    var gray = "#8b8878";
    var brown = "#986928";
    var black = "#050505";
    var currColor = black;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    init();

    function start(event) {
      isDrawing = true;
      context.lineWidth = 5;
      context.strokeStyle = currColor;
      context.beginPath();
      var touchX = getX(event);
      var touchY = getY(event);
      context.moveTo(touchX, touchY);
      saveState(canvas);
      event.preventDefault();
    }

    function draw(event) {
      if(isDrawing) {
          context.lineTo(getX(event),getY(event));
          context.stroke();
      }
      event.preventDefault();
    }

    function stop(event) {
      if(isDrawing) {
         context.stroke();
         context.closePath();
         isDrawing = false;
      }
      event.preventDefault();
    }

    function getX(event) {
      var touch = event.targetTouches[0];
      return touch.pageX-touch.target.offsetLeft;
    }

    function getY(event) {
      var touch = event.targetTouches[0];
      return touch.pageY-touch.target.offsetTop;
    }

    function init() {
      canvas.addEventListener("touchstart",start,false);
      canvas.addEventListener("touchmove",draw,false);
      canvas.addEventListener("touchend",stop,false);
      document.getElementById('undoButton').addEventListener('click', function() {
        undo(canvas, context);
      });
      document.getElementById('exitButton').addEventListener('click', function() {
        exit();
      });
      document.getElementById('save').addEventListener('click', function() {
        save(canvas);
      });
      document.getElementById('red').addEventListener('click', function() {
        console.log("Trying to change color to red");
        currColor = red;
      });
      document.getElementById('orange').addEventListener('click', function() {
        currColor = orange;
      });
      document.getElementById('yellow').addEventListener('click', function() {
        currColor = yellow;
      });
      document.getElementById('green').addEventListener('click', function() {
        currColor = green;
      });
      document.getElementById('blue').addEventListener('click', function() {
        currColor = blue;
      });
      document.getElementById('indigo').addEventListener('click', function() {
        currColor = indigo;
      });
      document.getElementById('violet').addEventListener('click', function() {
        currColor = violet;
      });
    }

    function saveState (canvas) {
      undo_list.push(canvas.toDataURL());
    }
    function save(canvas){
      let loading = self.loading.create({
        content:"Uploading Image..",
        duration:4000
      })
      loading.present();
      self.mainService.uploadToFirebase(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
      loading.onDidDismiss(() => {
        self.navCtrl.setRoot(CameraViewPage);
      });
      /*
      loading.present().then(()=>{
          loading.dismiss()
        });
      */
    }
    function restoreState(canvas, context, pop) {
      if(pop.length) {
        var restore_state = pop.pop();
        var img = new Image(canvasWidth, canvasHeight);
        img.src = restore_state;
        img.onload = function() {
          context.clearRect(0, 0, canvasWidth, canvasHeight);
          context.drawImage(img, 0, 0, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
        }
      }
    }

    function undo(canvas, context) {
      restoreState(canvas, context, undo_list);
    }

    function exit() {
      self.navCtrl.setRoot(CameraViewPage);
    }

  }
  getImage(){
    //return this.domSanitizer.bypassSecurityTrustStyle('url(' + this.backgroundImage + ')');
    return 'url('+this.backgroundImage+')';
  }
}
