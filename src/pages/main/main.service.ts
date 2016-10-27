import {Injectable,OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable,FirebaseAuth} from 'angularfire2';
import {Platform} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
declare var firebase : any;


//declare var window: any;

@Injectable()
export class MainService implements OnInit{
    public cameraViewPicture: string;
    public imageList: FirebaseListObservable<any>;
    public fb: Observable<any>;
    public storageRef: any;
    constructor(private af:AngularFire,private platform:Platform){
        this.imageList=this.af.database.list('images');
        this.storageRef = firebase.storage().ref('pics');
    }
    ngOnInit(){
    }
    uploadImageInfo(uploadInfo){
        this.imageList.push({downloadURL:uploadInfo.downloadURL});
    }
    uploadToFirebase(_imagePath){
      /*
    console.log(_imagePath);
    console.log(this.storageRef);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', _imagePath, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      console.log("before if:");
      console.log("status"+this.response);
      if (this.status == 200) {
        var myBlob = this.response;
        console.log("TO STORAGEREF")
        // myBlob is now the blob that the object URL pointed to.
            this.storageRef.child('image1.png').put(myBlob).then((savedPicture) => {
              console.log("DL URL Before function: "+savedPicture.downloadURL);
              this.uploadImageInfo(savedPicture);
            });  
      }
    };
    xhr.send();
    */
  }
}
