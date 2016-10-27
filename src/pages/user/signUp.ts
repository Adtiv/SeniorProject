import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from './user.service';

@Component({
  templateUrl: 'signUp.html'
})
export class SignUpPage implements OnInit{
  signUpEmail:string;
  signUpPassword:string;
  users;
  constructor(private userService:UserService) {
  }
  ngOnInit(){
  	this.signUpEmail="";
  	this.signUpPassword="";
    this.users=this.userService.users;
  }
  signUp(){
    this.userService.createUser(this.signUpEmail,this.signUpPassword);
  }
}
