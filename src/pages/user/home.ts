import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform} from 'ionic-angular';
import { LoginPage} from './login';
import { SignUpPage } from './signUp';
import { CameraViewPage } from '../main/cameraView';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import { CameraPreview } from 'ionic-native';
import { Map } from '../main/Map'
//declare var LoginPage:any;
//declare var SignUpPage:any;
//declare var CameraViewPage:any;
declare var firebase : any;
declare var cordova;
var x;
@Component({
  templateUrl: 'home.html',
})
export class HomePage  implements OnInit{
  testPic:any;
  public auth:any;
  public images:FirebaseListObservable<any>;
  public storageRef: any;
  constructor(private af:AngularFire, private nav:NavController, private platform:Platform){
    var fileReader = new FileReader();
    //console.log(this.map["hello"]="hi");
    //console.log(downloadURL);
    this.auth = firebase.auth();
    this.images = this.af.database.list('images/');
    this.storageRef = firebase.storage().ref('pics/');
    var file;
    this.af.database.list('images/').subscribe((pics)=>{
    });
    var test = function(){
      console.log("HERE");
      console.log(this.auth);
    }
    test()
  }
  ngOnInit(){
    //this.initPics();
  }
  getTestPic():any{
      console.log("URL"+this.testPic);
    return this.testPic;
  }
  initPics(){
    var storageRef = firebase.storage().ref();
    var img;
    //this.testPic="";
    x=this.testPic;
    var setPic = function(url){
      console.log("setPicUrl"+url);
      x=url;
    }
    storageRef.child('pics/catmull.jpg').getDownloadURL().then(function(url) {
      setPic(url);
      console.log("GETS TO THIS?"+url);
      //this.testPic=url;
      //console.log(url);
    }).catch(function(error) {
      console.log(error);
      // Handle any errors
    });
  }
  navLogin(){
    this.nav.push(LoginPage)
  }
  navSignUp(){
    this.nav.push(SignUpPage)
  }
  navMain(){
    this.nav.setRoot(CameraViewPage);
  }
  preview(){
      if(!this.platform.is('android')){
        localStorage.setItem('hasBeenHome', "true");
        let tapEnabled = false;
        let dragEnabled = false;
        let toBack = true;
        let rect = {
          x : 0,
          y : 0,
          width :  this.platform.width(),
          height: this.platform.height()
        };
        cordova.plugins.camerapreview.startCamera(rect, "rear", tapEnabled, dragEnabled,toBack);
        location.reload(true);
      }
      else{
        this.nav.setRoot(CameraViewPage);
      }
  }
}
