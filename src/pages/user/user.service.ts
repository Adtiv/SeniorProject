import {Injectable,OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable,FirebaseAuth} from 'angularfire2';
declare var firebase: any;

@Injectable()
export class UserService implements OnInit{
    uid: string;
    
    //user: FirebaseObjectObservable<any[]>;
    users: FirebaseListObservable<any[]>;
    public auth:any;
    constructor(private af:AngularFire){
        this.auth=firebase.auth();
        console.log("here")
        this.users=this.af.database.list('users/');
        this.users.subscribe((user)=>console.log(user));
        console.log(this.users);
    }
    ngOnInit(){
    }
    createUser(email, password){
        console.log(email + password);
        this.auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
          // ...
        }).then(user=>{
            console.log(user);
            this.af.database.object('users/'+user.uid).set({email:email})
        })
    }
    logout(){
        this.auth().signOut().then(function() {
          // Sign-out successful.
        }, function(error) {
          // An error happened.
        });
    }
    loginUser(email, password){
        this.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        }).then(user=>{
            console.log(user)
        });
    }
}
