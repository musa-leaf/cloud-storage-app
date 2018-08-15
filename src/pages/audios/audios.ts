import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController, LoadingController } from 'ionic-angular';
import { MediaCapture, MediaFile , CaptureError} from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import firebase from 'firebase';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';

@IonicPage()
@Component({
  selector: 'page-audios',
  templateUrl: 'audios.html',
})
export class AudiosPage {

  audios = [];
  db : any;
  fileName : any;
  fileUri: any;
  fileType: any;
  downloadUrl : any;
  fileSize : any;

  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private mediaCapture: MediaCapture,
    private file : File,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private streamingMedia : StreamingMedia
    ){

      this.db = firebase.database().ref('/files/audios/');
      this.loadData();
      
   
    }

  loadData(){
    
    this.db.on('value', (snapshot) => {
      this.audios = []; 
      snapshot.forEach(snap => {
        this.audios.push(snap.val());
        return false;
      });
      this.audios.reverse();
    });
  }

  record(){
     
    this.mediaCapture.captureAudio().then(
        (mediaFile : MediaFile[]) => {
            this.fileUri = mediaFile[0].fullPath;
            this.fileName = this.fileUri.substring(this.fileUri.lastIndexOf('/') + 1, this.fileUri.length);
            this.fileType = mediaFile[0].type;
            this.fileSize = mediaFile[0].size / 1000;
            console.log(mediaFile[0]);
            this.presentConfirm();
        },
        (err: CaptureError) => console.error(err)
    );
    console.log(this.audios);
    
  }

  convertandUpload(){

    let loading = this.loadingCtrl.create({
      content: 'Uploading file, please wait...'
    });
  
    loading.present();

    var directory: string = this.fileUri.substring(0, this.fileUri.lastIndexOf('/')+1);
    directory = directory.split('%20').join(' ');

    this.fileName = this.fileName.split('%20').join(' ');
        
        console.log('About to read buffer');
        let seperatedName = this.fileName.split('.');
        let extension = '';
        if (seperatedName.length > 1) {
          extension = '.' + seperatedName[1];
        }

    return this.file.readAsArrayBuffer(directory, this.fileName).then((buffer: ArrayBuffer) => {
    
    
    let blob = new Blob([buffer], { type: this.fileType });

    const storageRef = firebase.storage().ref('files/audios/' + new Date().getTime() + extension);
    
    return storageRef.put(blob).then(
        (snapshot:any) => {
            console.log(snapshot.Q);
            storageRef.getDownloadURL().then((url) => {
                this.downloadUrl = url;
                this.db.push({downloadUrl: url, fileName : this.fileName, size : this.fileSize}); //upload url to url db
                loading.dismiss();
                this.loadData();
                return this.downloadUrl;
            });
        })
    }).catch(err => {
        console.log(err);
    });
    
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'sync cloud',
      message: 'Do you want to save this file to the cloud?',
      buttons: [
        {
          text: 'Discard',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: () => {
            console.log("save clicked");
            this.convertandUpload();
          }
        }
      ]
    });
    alert.present();
  }

  play(url){
    let options: StreamingVideoOptions = {
    
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      
    };
    
    this.streamingMedia.playAudio(url, options);
  }
}
