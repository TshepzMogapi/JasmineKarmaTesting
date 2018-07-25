import {Component, OnInit, ViewChild} from '@angular/core';
import { FilePickerDirective, ReadFile, ReadMode } from 'ngx-file-helpers';

import * as XLSX from 'xlsx';
import {DataService} from '../data.service';



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
  projects = [];

  @ViewChild(FilePickerDirective)  private filePicker;

  constructor(private dataService: DataService) { }

  ngOnInit() {

    const array1 = [1, 2, 3];

    const array2 = [2, 3, 4, 5];


    console.log(array1.filter(value => -1 === array2.indexOf(value)));

    this.employees = this.dataService.getEmployees();

    this.projects = this.dataService.getProjects();

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

    const dateHeaderIndex = this.findKeywordIndex('date', worksheet);

    const projectHeaderIndex = this.findKeywordIndex('project', worksheet);

    const employeeHeaderIndex = this.findKeywordIndex('employee', worksheet);

    const dates = this.findColumnData(dateHeaderIndex, worksheet);

    const projects = this.findColumnData(projectHeaderIndex, worksheet);

    const distinctProjects = this.getDistinctData(projects);

    // const array1 = [1, 2, 3];
    //
    // const array2 = [2, 3, 4, 5];
    //
    //

    const projectsNames = [];


    this.projects.map((p) => {
      projectsNames.push(p.name);
    });

    console.log(distinctProjects.filter(value => -1 === projectsNames.indexOf(value)));
    //
    //
    //
    // const employeeNames: any[] = this.findColumnData(employeeHeaderIndex, worksheet);

    // distinctProjects.filter(value => -1 !== this.projects.indexOf(value));

    // console.log(this.projects.filter(value => -1 !== distinctProjects.indexOf(value)));

    // todo modify below for updating
    // this.dataService.updateTimes();

  }

  onReadEnd(fileCount: number) {
    this.status = `Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    this.filePicker.reset();

    // console.log(this.projects);
  }

  findKeywordIndex(keyWord: string, worksheet: object): number {

    const i = Object.values(worksheet).findIndex(w => w.v === keyWord);

    return i;

  }


  findColumnData(topIndex: number, worksheet: object): any[] {

    const columnData = [];

    for (let j = topIndex + 3; j <= (Object.values(worksheet).length); j += 3) {

      if ((Object.values(worksheet)[j])) {
        columnData.push((Object.values(worksheet)[j]).v);
      }

    }

    return columnData;

  }


  getDistinctData(originalData: any[]): any[] {

    let uniqueData = [];

    uniqueData = Array.from(new Set(originalData));

    return uniqueData;
  }




}
