import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { CameraPreview , CameraPreviewRect} from 'ionic-native'
import { DomSanitizer } from '@angular/platform-browser';
import { File } from 'ionic-native';
import { MainService } from './main.service';
import { DrawMessagePage } from './drawMessage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
declare var cordova:any;
//html, body, ion-content, ion-page, .nav-decor 
@Component({
  selector:'camera-view',
  templateUrl: 'cameraView.html'
})
export class CameraViewPage {
  public base64Image: string;
  public images:FirebaseListObservable<any>;
  constructor(public af:AngularFire,public navCtrl: NavController,private platform:Platform,private domSanitizer:DomSanitizer,private mainService:MainService) {
    
    if(this.platform.is('android')){
      console.log("GETS TO ANDROID PLAT");
        let tapEnabled = false;
        let dragEnabled = false;
        let toBack = true;
        let rect  = {
          x : 0,
          y : 0,
          width :  this.platform.width(),
          height: this.platform.height()
        };
        cordova.plugins.camerapreview.startCamera(rect, "rear", tapEnabled, dragEnabled,toBack);
        CameraPreview.show();
    } 
    CameraPreview.setOnPictureTakenHandler().subscribe((result) => {
      this.base64Image = result[0];
      mainService.cameraViewPicture = this.base64Image;
      mainService.uploadToFirebase(this.base64Image);
      console.log(this.base64Image);
      CameraPreview.hide();
      this.navCtrl.push(DrawMessagePage);

    });
    this.images = this.af.database.list('images/');
  }
  takePicture() {
    CameraPreview.takePicture({
      maxWidth: this.platform.width(),
      maxHeight: this.platform.height()
    });
  }
}
