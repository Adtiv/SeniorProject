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
    public imageList: FirebaseListObservable<any>;
    public fb: Observable<any>;
    public storageRef: any;
    public firebaseRef: any;
    public geoFire:any;
    public userRadius:Map;
    public messageLocationsInRadius:Map;
    public distanceFromUser:Map;
    constructor(private af:AngularFire,private platform:Platform){
        this.userRadius=new Map();
        this.messageLocationsInRadius=new Map()
        this.distanceFromUser=new Map()
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
      var newPic =  this.storageRef.child('cameraPreview_'+Date.now());
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
          }).catch((error) => {
            console.log('Error getting location', error);
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
              radius: .05 //10 meters
            })
            geoQuery.on("key_moved", function(key, location, distance) {
              console.log(key + " moved" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
              //self.updateQuery(key)
              var center = [geoposition.coords.latitude, geoposition.coords.longitude];
            });
            var currPosition = [geoposition.coords.latitude, geoposition.coords.longitude];
            self.recalculateDistance(currPosition)
          } else {
            console.log("Creating");
            geoQuery = geoFire.query({
              center: [geoposition.coords.latitude, geoposition.coords.longitude],
              radius: .05 //10 meters
            });
            console.log(geoQuery.radius())
            geoQuery.on("key_entered", function(key, location, distance) {
              console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
              var center = [geoposition.coords.latitude, geoposition.coords.longitude];
              self.addToQuery(key,location,self.haversineDistance(center,location))
              console.log("DISTANCE "+distance);
              console.log("Haversine: "+ self.haversineDistance(center,location))
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
    recalculateDistance(currentPosition){
           console.log("currPos  " +currentPosition)
           console.log(this.userRadius.keyValues())
           var messages = this.userRadius.keyValues()
           for(var x in this.userRadius.keyValues()) {
              //var messageLocation:any = [this.userRadius.item(messages[x].key).location.lat,this.userRadius.item(messages[x].key).location.long]
              console.log(this.userRadius.item(messages[x].key).location)
              console.log("messageLoc: "+this.haversineDistance(currentPosition,this.userRadius.item(messages[x].key).location));
              var newDistance = {"downloadURL":this.userRadius.item(messages[x].key).downloadURL,"location":this.userRadius.item(messages[x].key).location,"distance":this.haversineDistance(currentPosition,this.userRadius.item(messages[x].key).location),"isLeft":this.userRadius.item(messages[x].key).isLeft,"isBottom":this.userRadius.item(messages[x].key).isBottom}
              this.userRadius.update(messages[x].key,newDistance)
           }
    }
    addToQuery(key,location,distance){
      //console.log("gets here"+key+value);
              //var mapService : UserRadiusMapService;
      var self = this;
      var imgRef = firebase.database().ref('images/'+key)
      var downloadURL
      var isLeft:boolean;
      var isBottom:boolean
      imgRef.once("value").then(function(snapshot){
        downloadURL = snapshot.child("downloadURL").val();
        var randl = Math.random();
        var randb = Math.random();
        if(randl>.5){
          isLeft=true
        }
        else{
          isLeft=false
        }
        if(randb>.5){
          isBottom=true
        }
        else{
          isBottom=false
        }
        self.userRadius.add(key,{"downloadURL":downloadURL,"location":location,"distance":distance,"isLeft":isLeft,"isBottom":isBottom});
        //self.messageLocationsInRadius.add(key,location)
        //self.distanceFromUser.add(key,distance)
        console.log("userRad" +self.userRadius.item(key))
      })
    }
    removeFromQuery(key){
      this.userRadius.remove(key);
    }
    haversineDistance(coords1, coords2) {
      function toRad(x) {
        return x * Math.PI / 180;
      }

      var lon1 = coords1[0];
      var lat1 = coords1[1];

      var lon2 = coords2[0];
      var lat2 = coords2[1];

      var R = 6371; // km

      var x1 = lat2 - lat1;
      var dLat = toRad(x1);
      var x2 = lon2 - lon1;
      var dLon = toRad(x2)
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;

      return d;
    }
}
