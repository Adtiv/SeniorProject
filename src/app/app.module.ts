import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
//import { CameraPreview } from 'ionic-native';
import { MyApp } from './app.component';
import { HomePage } from '../pages/user/home';
import { SignUpPage } from '../pages/user/signUp';
import { LoginPage } from '../pages/user/login';
import { UserService } from '../pages/user/user.service';
import { MainService } from '../pages/main/main.service';
import { CameraViewPage } from '../pages/main/cameraView';
import { DrawMessagePage } from '../pages/main/drawMessage';
import { AngularFireModule } from 'angularfire2';
import { MapToIterable } from '../pages/main/mapToIterable.pipe'

export const firebaseConfig = {
    apiKey: "AIzaSyDjxzurguIw3nIhrANP_CRr81o9uwT_q2o",
    authDomain: "seniorprojectadcg.firebaseapp.com",
    databaseURL: "https://seniorprojectadcg.firebaseio.com",
    storageBucket: "seniorprojectadcg.appspot.com"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignUpPage,
    CameraViewPage,
    DrawMessagePage,
    MapToIterable
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignUpPage,
    CameraViewPage,
    DrawMessagePage
  ],
  providers: [UserService, MainService]
})
export class AppModule {}
