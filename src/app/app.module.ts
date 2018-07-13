import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FileHelpersModule } from 'ngx-file-helpers';

import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    FileHelpersModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
