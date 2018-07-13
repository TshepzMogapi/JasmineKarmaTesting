import {Component, OnInit, ViewChild} from '@angular/core';
import { FilePickerDirective, ReadFile, ReadMode } from 'ngx-file-helpers';

import * as XLSX from 'xlsx';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  public readMode = ReadMode.dataURL;
  public picked: ReadFile;
  public status: string;

  @ViewChild(FilePickerDirective)  private filePicker;

  ngOnInit() {}

  onReadStart(fileCount: number) {
    this.status = `Reading ${fileCount} file(s)...`;
  }

  onFilePicked(file: ReadFile) {


    this.picked = file;

    const wb = XLSX.readFile(this.picked.name);

    const workbook = XLSX.read(file.content,  {type: 'base64'});

    const first_sheet_name = workbook.SheetNames[0];
    //

    //
     const  worksheet = workbook.Sheets[first_sheet_name];
    // console.log(JSON.stringify(worksheet.A1.v));

     //
    // const jsonData = XLSX.utils;
    //


    // console.log(jsonData);
    //
    // const desired_cell = worksheet[address_of_cell];
    //
    // const a = XLSX.utils.decode_cell(desired_cell);
    //
    //
    // const desired_value = (desired_cell ? desired_cell.v : undefined);
    //
    //
    // this.handleFile(this.picked.name);




  }

  onReadEnd(fileCount: number) {
    this.status = `Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    this.filePicker.reset();
  }

  handleFile(e) {

    const rABS = true;

    const files = e.target.files, f = files[0];
    const reader = new FileReader();

    reader.onload = (ev => {

      let data = e.target.result;

      if (!rABS) {
        data = new Uint8Array(data);

        const workbook = XLSX.read(data, {type: rABS ? 'array' : 'array'});
      }

    });


    if (rABS) {
      reader.readAsBinaryString(f);
    } else {
      reader.readAsArrayBuffer(f);
    }


  }

  // handleFile(e) {
  //
  //   const rABS = true;
  //
  //   const files = e.target.files, f = files[0];
  //   const reader = new FileReader();
  //
  //   reader.onload = (ev => {
  //
  //     let data = e.target.result;
  //
  //     if (!rABS) {
  //       data = new Uint8Array(data);
  //
  //       const workbook = XLSX.read(data, {type: rABS ? 'array' : 'array'});
  //     }
  //
  //   });
  //
  //
  //   if (rABS) {
  //     reader.readAsBinaryString(f);
  //   } else {
  //     reader.readAsArrayBuffer(f);
  //   }
  //
  //
  // }

}
