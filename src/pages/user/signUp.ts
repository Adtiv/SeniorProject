import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from './user.service';
import { LoadingController,AlertController } from 'ionic-angular';
import { CameraViewPage } from '../main/cameraView'

@Component({
  templateUrl: 'signUp.html'
})
export class SignUpPage implements OnInit{
  signUpEmail:string;
  signUpPassword:string;
  users;
  constructor(private nav:NavController,private userService:UserService,private loading:LoadingController,private alert:AlertController) {
  }
  ngOnInit(){
  	this.signUpEmail="";
  	this.signUpPassword="";
    this.users=this.userService.users;
  }
  signUp(){
    var self = this;
    let loading = this.loading.create({
      content:"Signing Up.."
    })
    loading.present();
    this.userService.createUser(this.signUpEmail,this.signUpPassword).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
          loading.dismiss();
          let prompt = self.alert.create({
                title:error,
                buttons:["Cancel"]
          })
          prompt.present()
          // ...
        }).then(user=>{
            loading.dismiss()
            if(user!=null){
              self.userService.af.database.object('users/'+user.uid).set({email:this.signUpEmail})
              let prompt = self.alert.create({
                  title:"Success! new account created",
                  buttons:["Ok"]
              })
              loading.onDidDismiss(() => {
                prompt.present()
                self.nav.setRoot(CameraViewPage)
              });
            }
        });
  }
}
