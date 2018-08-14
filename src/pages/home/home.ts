import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { config } from '../../config.module';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    firebase.initializeApp(config);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  nav(x){
    if(x == 'a'){
      this.navCtrl.push("AudiosPage");
    }
    
    if(x == 'p'){
      this.navCtrl.push('PicturesPage');
    } 

    if(x == 'v'){
      this.navCtrl.push('VideoPage');
    } 
  }

}
