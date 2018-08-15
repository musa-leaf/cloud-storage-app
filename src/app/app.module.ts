import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MediaCapture } from '@ionic-native/media-capture';
import { MyApp } from './app.component';
import { File } from '@ionic-native/file';
import firebase from 'firebase';
import { config } from '../config.module';
import { VideoPlayer } from "@ionic-native/video-player";
import { StreamingMedia } from "@ionic-native/streaming-media";

firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    File,
    StatusBar,
    SplashScreen,
    MediaCapture,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VideoPlayer,
    StreamingMedia
  ]
})
export class AppModule {}
