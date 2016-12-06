import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { Geolocation,Geoposition } from 'ionic-native';
import { Camera } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { CameraPreview , CameraPreviewRect} from 'ionic-native'
import { MainService } from './main.service';
import { DrawMessagePage } from './drawMessage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Map } from './Map';
declare var cordova:any;
declare var firebase: any;

@Component({
  selector:'camera-view',
  templateUrl: 'cameraView.html'
})
export class CameraViewPage implements OnInit{
  public base64Image: string;
  public platformWidth: any;
  public platformHeight: any;
  public images:FirebaseListObservable<any>;
  public storageRef: any;
  public firebaseRef:any;
  public imagesInUserLocation:any;

  constructor(public af:AngularFire,public loading:LoadingController,public navCtrl: NavController,private platform:Platform,private mainService:MainService){
    this.platformWidth = this.platform.width();
    this.platformHeight = this.platform.height();
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
      /*
      this.getBase64Image(result[0],function(dataURI){
        this.base64Image=dataURI
        console.log(this.base64Image);
        // have a string, do the search
        mainService.uploadToFirebase(this.base64Image)
        CameraPreview.hide();
      });*/
        navCtrl.setRoot(DrawMessagePage);
    });

    this.imagesInUserLocation=this.mainService.userRadius.keyValues();
    setInterval(() => {this.imagesInUserLocation=this.mainService.userRadius.keyValues()}, 60*1);
  }
  ngOnInit(){

  }
  ionViewDidEnter() {
    document.getElementById('cameraView').style.width = "" + this.platform.width() + "px";
    document.getElementById('cameraView').style.height = "" + this.platform.height() + "px";
  }
  getMargin(key){
    console.log("MESSAGE LOCATION: "+this.mainService.messageLocationsInRadius.item(key));
    return "50%";
  }

  scaleAndLocation(key){
    var distance:any = this.mainService.userRadius.item(key).distance;
    var scaleFactor:any = (((.05-distance)/.05)*150)
    var margin:any = ((.05-distance)/.05)*45
    var style;
    if(this.mainService.userRadius.item(key).isLeft){
      if(this.mainService.userRadius.item(key).isBottom){
        style={"position":"absolute","left":0,"bottom":0,"width":scaleFactor+"px","height":scaleFactor+"px","margin-left":margin+"%","margin-bottom":margin+"%"}
      }
      else{
        style={"position":"absolute","left":0,"top":0,"width":scaleFactor+"px","height":scaleFactor+"px","margin-left":margin+"%","margin-top":margin+"%"}
      }
    }
    else{
      if(this.mainService.userRadius.item(key).isBottom){
        style={"position":"absolute","right":0,"bottom":0,"width":scaleFactor+"px","height":scaleFactor+"px","margin-right":margin+"%","margin-bottom":margin+"%"}
      }
      else{
        style={"position":"absolute","right":0,"top":0,"width":scaleFactor+"px","height":scaleFactor+"px","margin-right":margin+"%","margin-top":margin+"%"}
      }
    }
    return style;/*
    else if(distance>.04 || (distance>.02 && distance <.03) || (distance>0 && distance <.01)){
      margin+=25;
    }
    */
    //console.log("scale"+scaleFactor);
    //console.log("margin"+margin);
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
    if(this.platform.is('android')) {
      CameraPreview.takePicture({
        maxWidth: this.platform.width(),
        maxHeight: this.platform.height()
      });
    }
    else {
      Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: this.platformWidth,
        targetHeight: this.platformHeight
      }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        console.log("BASE64 IMAGE: " + this.base64Image);
        this.mainService.cameraPicture = this.base64Image;
        this.navCtrl.setRoot(DrawMessagePage);
      }, (err) => {
        console.log("UH OH THAT DID NOT WORK " + err);
      });
    }
  }
}
