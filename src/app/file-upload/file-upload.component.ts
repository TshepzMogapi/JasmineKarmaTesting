import {Component, OnInit, ViewChild} from '@angular/core';
import { FilePickerDirective, ReadFile, ReadMode } from 'ngx-file-helpers';

import * as XLSX from 'xlsx';
import {DataService} from '../data.service';
const Parse: any = require('parse');



@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  public readMode = ReadMode.binaryString;
  public picked: ReadFile;
  public status: string;
  public accepted = false;

  employees = [];

  @ViewChild(FilePickerDirective)  private filePicker;

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.employees = this.dataService.getEmployees();

    // console.log(this.employees);

  }

  onReadStart(fileCount: number) {
    this.status = `Reading ${fileCount} file(s)...`;
  }

  onFilePicked(file: ReadFile) {

    this.picked = file;

    const workbook = XLSX.read(file.content,  {type: 'binary'});

    const first_sheet_name = workbook.SheetNames[0];

    const  worksheet = workbook.Sheets[first_sheet_name];


    const a = Object.values(worksheet);

    // console.log(worksheet['!ref']);
    // console.log(worksheet['!rows']);

    // console.log('employee');

    // console.log(Object.values(worksheet).findIndex(w => w.v === 'keyWord'));
    // console.log(this.findKeywordIndex('employee', worksheet));

    // console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === 'E105D')));
    //
    // console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === 'E556855')));
    //
    // console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === 'YBHB566555')));

    console.log('date');
    console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === 'date')));

    console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === '2018NOV25')));
    console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === '2018FEB28')));
    console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === '2017MAR24')));
    console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === '2016JUN21')));
    // console.log(Object.values(worksheet).findIndex(w => w.v === 'date'));
    //
    // console.log('project');
    // console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === 'project')));
    // console.log(Object.values(worksheet).indexOf(a.find((t) => t.v === 'FP456')));

    //
    // Object.values(worksheet).map((w) => {
    //   console.log(w);
    //
    // });

    // console.log(worksheet);


  }

  onReadEnd(fileCount: number) {
    this.status = `Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    this.filePicker.reset();
  }

  findKeywordIndex(keyWord: string, worksheet: object): number {

    const i = Object.values(worksheet).findIndex(w => w.v === keyWord);

    return i;

  }




}
