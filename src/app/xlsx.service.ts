import { Injectable } from '@angular/core';


import { FilePickerDirective, ReadFile, ReadMode } from 'ngx-file-helpers';


import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class XLSXService {

  employees = [];
  projects = [];

  constructor() { }

  getData(file: ReadFile) {

    // this.picked = file;

    const workbook = XLSX.read(file.content,  {type: 'binary'});

    const first_sheet_name = workbook.SheetNames[0];

    const  worksheet = workbook.Sheets[first_sheet_name];


    const a = Object.values(worksheet);

    const dateHeaderIndex = this.findKeywordIndex('date', worksheet);

    const projectHeaderIndex = this.findKeywordIndex('project', worksheet);

    const employeeHeaderIndex = this.findKeywordIndex('employee', worksheet);

    console.log(employeeHeaderIndex);

    const dates = this.findColumnData(dateHeaderIndex, worksheet);

    const projects = this.findColumnData(projectHeaderIndex, worksheet);

    // const employeeNames = this.findColumnData(employeeHeaderIndex, worksheet);


    // this.dataService.updateTimes();

  }

  findKeywordIndex(keyWord: string, worksheet: object): number {

    const i = Object.values(worksheet).findIndex(w => w.v === keyWord);

    return i;

  }


  findColumnData(topIndex: number, worksheet: object): any[] {

    const columnData = [];

    for (let j = topIndex + 3; j <= (Object.values(worksheet).length); j += 3) {

      columnData.push((Object.values(worksheet)[j].v));

    }

    return columnData;

  }

  writeToFile() {
    console.log('writing stuff');
  }

}
