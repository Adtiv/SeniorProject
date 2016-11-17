import {Injectable,OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable,FirebaseAuth} from 'angularfire2';
import {Platform} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import { Geolocation,Geoposition } from 'ionic-native';
import { Map } from './map'

declare var firebase : any;
declare var GeoFire: any;
declare var GeoPosition:any;
//declare var userRadius:Map;
//declare var window: any;

@Injectable()
export class MainService implements OnInit{
    public cameraViewPicture: string;
    public cameraPicture: string;
    public imageList: FirebaseListObservable<any>;
    public fb: Observable<any>;
    public storageRef: any;
    public firebaseRef: any;
    public geoFire:any;
    public userRadius:Map;
    constructor(private af:AngularFire,private platform:Platform){
        this.userRadius=new Map();
        this.firebaseRef = firebase.database().ref('images');
        this.geoFire = new GeoFire(this.firebaseRef);
        this.imageList=this.af.database.list('images');
        this.storageRef = firebase.storage().ref('pics');
    }
    ngOnInit(){
    }
    uploadImageInfo(uploadInfo){
        this.imageList.push({downloadURL:uploadInfo.downloadURL});
    }
    uploadToFirebase(base64Image){
      var newPic =  this.storageRef.child('drawMessage_'+Date.now());
      var location;
      newPic.putString(base64Image, 'base64',{type:"image/png"})
        .then((savedPicture) => {
          Geolocation.getCurrentPosition().then((pos) => {
           // resp.coords.latitude
           // resp.coords.longitude
            console.log(this.geoFire);
            console.log("*** Updating locations ***");
            location=[pos.coords.latitude,pos.coords.longitude];
            var key = this.imageList.push({downloadURL:savedPicture.downloadURL,latitude:pos.coords.latitude,longitude:pos.coords.longitude}).key;
            this.geoFire = new GeoFire(firebase.database().ref('geoFire'));
            this.geoFire.set(key, location);
            return true;

          }).catch((error) => {
            console.log('Error getting location', error);
            return false;

          });
      });
    }
    watchAndQueryLocation(){
      var geoFire = new GeoFire(firebase.database().ref('geoFire'));
      var geoQuery;
      let watch = Geolocation.watchPosition();
      var self = this;
      watch.subscribe((data) => {
        if ((data as Geoposition).coords != undefined) {
          var geoposition = (data as Geoposition);
          if (typeof geoQuery !== "undefined") {
            console.log("Updating");

            geoQuery.updateCriteria({
              center: [geoposition.coords.latitude, geoposition.coords.longitude],
              radius: .01 //10 meters
            })
          } else {
            console.log("Creating");
            geoQuery = geoFire.query({
              center: [geoposition.coords.latitude, geoposition.coords.longitude],
              radius: .01 //10 meters
            });
            console.log(geoQuery.radius())
            geoQuery.on("key_entered", function(key, location, distance) {
              console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
              self.addToQuery(key)
            });
            geoQuery.on("key_exited", function(key, location, distance) {
              console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
              self.removeFromQuery(key)
            });
          }
        } else {
          var positionError = (data as PositionError);
          console.log('Error ' + positionError.code + ': ' + positionError.message);
        }
      })
    }
    addToQuery(key){
      //console.log("gets here"+key+value);
              //var mapService : UserRadiusMapService;
      var self = this;
      console.log("gets to queryFunction")
      var imgRef = firebase.database().ref('images/'+key)
      var downloadURL
      imgRef.once("value").then(function(snapshot){
        downloadURL = snapshot.child("downloadURL").val();
        self.userRadius.Add(key,downloadURL);
        console.log("userRad" +self.userRadius.Item(key))
      })
    }
    removeFromQuery(key){
      //console.log("gets here"+key+value);
              //var mapService : UserRadiusMapService;
      this.userRadius.Remove(key);
    }
}
