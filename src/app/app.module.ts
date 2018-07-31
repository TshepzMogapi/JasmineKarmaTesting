import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { FileHelpersModule } from 'ngx-file-helpers';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';



import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DataService } from './data.service';
import { XLSXService } from './xlsx.service';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    FileHelpersModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot()
  ],
  providers: [DataService, XLSXService],
  bootstrap: [AppComponent]
})
export class AppModule { }
