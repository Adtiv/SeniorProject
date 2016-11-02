import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { CameraPreview } from 'ionic-native';
import { MainService } from './main.service';
declare var cordova:any;;
//declare var MainService: any;
@Component({
  templateUrl: 'drawMessage.html'
})
export class DrawMessagePage {
  public backgroundImage: string;
  public canvas;
  constructor(public navCtrl: NavController,private platform:Platform,private mainService:MainService) {
    if(this.platform.is('android')) {
      this.backgroundImage = mainService.cameraViewPicture;
    }
    else {
      this.backgroundImage = mainService.cameraPicture;
    }
  }
  getImage(){
    //return this.domSanitizer.bypassSecurityTrustStyle('url(' + this.backgroundImage + ')');
    return 'url('+this.backgroundImage+')';
  }
  /*
  markPoint(event) {
      alert("HERE");
      var position = event.center;
      let ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
      ctx.beginPath();
      ctx.arc(position.x, position.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = '#00DD00';
      ctx.fill();
  }
  */
}
