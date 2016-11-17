import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable'
import { CameraViewPage } from '../main/cameraView'

declare var firebase: any;
@Component({
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit{
  userEmail:string;
  userPassword:string;
  auth:Observable<any>;
  constructor(private userService:UserService,private nav:NavController) {
    console.log(firebase.auth().currentUser);
  }
  ngOnInit(){
    this.userEmail="";
    this.userPassword="";
  }
  login(){
    this.userService.loginUser(this.userEmail,this.userPassword);
    if(firebase.auth().currentUser){
      console.log("good");
      this.nav.setRoot(CameraViewPage);
    }
    else{
      console.log("bad")
    }
  }
  logout(){
    console.log("gets to logout")
    this.userService.logout();
  }
}
