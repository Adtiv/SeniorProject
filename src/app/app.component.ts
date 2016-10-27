import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage} from '../pages/user/home';
import { CameraViewPage } from '../pages/main/cameraView';


@Component({
  selector: 'my-app',
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  //rootPage = HomePage;
  rootPage;
  constructor(platform: Platform) {
  	console.log("RELOAD");
    platform.ready().then(() => { 
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(localStorage.getItem("hasBeenHome") == "true") {
        console.log("Tried to change rootPage to mainPage");
        this.rootPage = CameraViewPage;
        localStorage.setItem("hasBeenHome", "false");
      }
      else {
        this.rootPage = HomePage;
      }
      StatusBar.styleDefault();
    });
  }
}
