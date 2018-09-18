import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, AlertController } from 'ionic-angular';
import { MediaCapture, MediaFile , CaptureError} from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-pictures',
  templateUrl: 'pictures.html',
})
export class PicturesPage {

  pictures = [];
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
    public loadingCtrl: LoadingController
    ){

      this.db = firebase.database().ref('/files/images/');
      this.loadData();
      
   
    }

    loadData(){
    
      this.db.on('value', (snapshot) => {
        this.pictures = []; 
        snapshot.forEach(snap => {
          this.pictures.push(snap.val());
          return false;
        });
        this.pictures.reverse();
      });
      console.log(this.pictures);
      
    }

    takePicture(){
     
      this.mediaCapture.captureImage().then(
          (mediaFile : MediaFile[]) => {
              this.fileUri = mediaFile[0].fullPath;
              this.fileName = this.fileUri.substring(this.fileUri.lastIndexOf('/') + 1, this.fileUri.length);
              this.fileType = mediaFile[0].type;
              this.fileSize = mediaFile[0].size / 1000;
              this.presentConfirm();
          },
          (err: CaptureError) => console.error(err)
      );
    }

    convertandUpload(){

      let loading = this.loadingCtrl.create({
        content: 'Uploading file, Please wait...'
      });
    
      loading.present();
    
      var directory: string = this.fileUri.substring(0, this.fileUri.lastIndexOf('/')+1);
      directory = directory.split('%20').join(' ');
  
      this.fileName = this.fileName.split('%20').join(' ');
          
          let seperatedName = this.fileName.split('.');
          let extension = '';
          if (seperatedName.length > 1) {
            extension = '.' + seperatedName[1];
          }
  
      return this.file.readAsArrayBuffer(directory, this.fileName).then((buffer: ArrayBuffer) => {

      
      let blob = new Blob([buffer], { type: this.fileType });
  
      const storageRef = firebase.storage().ref('files/images/' + new Date().getTime() + extension);
      
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

}
