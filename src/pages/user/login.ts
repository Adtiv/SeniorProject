import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit{
  userEmail:string;
  userPassword:string;
  constructor() {
  }
  ngOnInit(){
    this.userEmail="";
    this.userPassword="";
  }
  login(){
    
  }
}
