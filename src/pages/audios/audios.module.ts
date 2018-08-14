import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AudiosPage } from './audios';

@NgModule({
  declarations: [
    AudiosPage,
  ],
  imports: [
    IonicPageModule.forChild(AudiosPage),
  ],
})
export class AudiosPageModule {}
