import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { Geolocation,Geoposition } from 'ionic-native';
import { Camera } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { CameraPreview , CameraPreviewRect} from 'ionic-native'
import { DomSanitizer } from '@angular/platform-browser';
import { File } from 'ionic-native';
import { MainService } from './main.service';
import { DrawMessagePage } from './drawMessage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Map } from './Map'
declare var cordova:any;
declare var firebase: any;

//html, body, ion-content, ion-page, .nav-decor 
@Component({
  selector:'camera-view',
  templateUrl: 'cameraView.html'
})
export class CameraViewPage implements OnInit{
  public base64Image: string;
  public images:FirebaseListObservable<any>;
  public storageRef: any;
  public firebaseRef:any;
  public imagesInUserLocation:any;
  constructor(public af:AngularFire,public loading:LoadingController,public navCtrl: NavController,private platform:Platform,private domSanitizer:DomSanitizer,private mainService:MainService){
    this.storageRef = firebase.storage().ref('pics/');
    //this.firebaseRef = firebase.database().ref('images/<imgId>');
    this.mainService.watchAndQueryLocation()
    this.images = this.af.database.list('images/');
    if(this.platform.is('android')){
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
      mainService.cameraViewPicture = result[0];
      this.getBase64Image(result[0],function(dataURI){
        this.base64Image=dataURI
        console.log(this.base64Image);
        // have a string, do the search
        mainService.uploadToFirebase(this.base64Image)
        CameraPreview.hide();
        navCtrl.push(DrawMessagePage);     
      });
    });
    this.imagesInUserLocation=this.mainService.userRadius.Values();
    console.log("IMAGES");
    console.log(this.imagesInUserLocation);
    setInterval(() => {this.imagesInUserLocation=this.mainService.userRadius.Values()}, 60*1);  
  }
  ngOnInit(){

  }
  getBase64Image(url,callback) {
      var image = new Image();
      image.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
          canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
          canvas.getContext('2d').drawImage(this, 0, 0);
          callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
      };
      image.src = url;
  }
  takePicture() {
    CameraPreview.takePicture({
      maxWidth: this.platform.width(),
      maxHeight: this.platform.height()
    });
  }
}
