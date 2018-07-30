import {Component, OnInit, ViewChild} from '@angular/core';
import { FilePickerDirective, ReadFile, ReadMode } from 'ngx-file-helpers';

import * as XLSX from 'xlsx';

const { read, write, utils } = XLSX;

import {DataService} from '../data.service';
import * as _ from 'underscore';


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

  displayProjects = [];
  displayEmployees = [];


  displayData = [];

  @ViewChild(FilePickerDirective)  private filePicker;

  constructor(private dataService: DataService) { }

  ngOnInit() {

    const array1 = [1, 2, 3];

    const array2 = [2, 3, 4, 5];


    console.log(array1.includes(2));

    this.employees = this.dataService.getEmployees();

    this.projects = this.dataService.getProjects();



  }

  onReadStart(fileCount: number) {
    this.status = `Reading ${fileCount} file(s)...`;

  }

  testAfterFilePicked(file: ReadFile) {

    const workbook = XLSX.read(file.content,  {type: 'binary'});

    const first_sheet_name = workbook.SheetNames[0];

    const  worksheet = workbook.Sheets[first_sheet_name];

    const range = XLSX.utils.decode_range(worksheet['!ref']);

    console.log(range);

    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    let isHeaderPresent = null;

    let dateIndex = null;

    let projectIndex = null;

    let employeeIndex = null;

    const dates = [];

    const employees = [];

    const projects = [];


    jsonData.map((d) => {


      if (dateIndex && employeeIndex && projectIndex) {
        isHeaderPresent = true;
      }

      if (_.invert(d)['date']) {

        dateIndex =  _.invert(d)['date'];

      }

      if (_.invert(d)['employee']) {

        employeeIndex = _.invert(d)['employee'];

      }

      if (_.invert(d)['project']) {

        projectIndex = _.invert(d)['project'];

      }



      if (isHeaderPresent) {

        employees.push(d[employeeIndex]);

        projects.push(d[projectIndex]);


      }


    });

    const distinctProjects = this.getDistinctData(projects);

    const distinctEmployees = this.getDistinctData(employees);


    // console.log(Object.values(jsonData));
      // .findIndex(w => w.v === 'date')

    // jsonData.

    // jsonData[5].__EMPTY_5

    const a = Object.values(worksheet);

    const dateHeaderIndex = this.findKeywordIndex('date', worksheet);

    const projectHeaderIndex = this.findKeywordIndex('project', worksheet);

    const employeeHeaderIndex = this.findKeywordIndex('employee', worksheet);

    const testIndex = this.findKeywordIndex('2018NOV25', worksheet);

    console.log(dateHeaderIndex + '\t' + projectHeaderIndex + '\t' + employeeHeaderIndex +  '\ttestIndex is at ' + testIndex);

    const data = [
      {'name': 'John', 'city': 'Seattle'},
      {'name': 'Mike', 'city': 'Los Angeles'},
      {'name': 'Zach', 'city': 'New York'}
    ];
    //
    // const sheet = XLSX.utils.json_to_sheet(data);
    //
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, sheet, 'Timesheet');
    //
    // XLSX.writeFile(wb, 'TimeSheet-Test.xlsx');


    // const table = XLSX.readFile('mytable.xlsx');
    //
    // // Use first sheet
    // const sheet = table.Sheets[table.SheetNames[0]];
    //
    //
    // // Option 1: If you have numeric row and column indexes
    // sheet[XLSX.utils.encode_cell({r: 1 /* 2 */, c: 2 /* C */})] = {t: 's' /* type: string */, v: 'abc123' /* value */};
    //
    // // Option 2: If you have a cell coordinate like 'C2' or 'D15'
    //
    // sheet['C2'] = {t: 's' /* type: string */, v: 'abc123' /* value */};
    //
    // XLSX.writeFile(table, 'result.xlsx');


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

    const employees = this.findColumnData(employeeHeaderIndex, worksheet);



    const distinctProjects = this.getDistinctData(projects);

    const distinctEmployees = this.getDistinctData(employees);

    const array1 = [1, 2, 3];

    const array2 = [2, 3, 4, 5];


    //

    const projectsNames = [];

    const employeeNames = [];


    this.projects.map((p) => {
      projectsNames.push(p.name);
    });

    this.employees.map((e) => {
      employeeNames.push(e.name);
    });


    const invalidProjects = distinctProjects.filter(value => -1 === projectsNames.indexOf(value));

    const invalidEmployees = distinctEmployees.filter(value => -1 === employeeNames.indexOf(value));

    projects.map((p) => {

      // todo verify the check is valid for diff conditions not one/other separate ifs

      if (invalidProjects.includes(p)) {


        this.displayProjects.push(
          {
            'name': p,
            'isValid' : false
          }
        );

        // this.displayEmployees

      } else {

        this.displayProjects.push(
          {
            'name': p,
            'isValid' : true
          }
        );
      }

    });

    employees.map((e) => {


      if (invalidEmployees.includes(e)) {


        this.displayEmployees.push(
          {
            'name': e,
            'isValid' : false
          }
        );

        // this.displayEmployees

      } else {

        this.displayEmployees.push(
          {
            'name': e,
            'isValid' : true
          }
        );
      }




    });

    for (let u = 0; u < this.displayProjects.length; u++) {
      this.displayData.push(
        {
          'project': this.displayProjects[u],
          'employee': this.displayEmployees[u],
          'isValid':  (this.displayProjects[u].isValid && this.displayEmployees[u].isValid)
        }
      );


      // console.log(this.displayProjects[u].isValid || this.displayEmployees[u].isValid);

      console.log('Project ' + this.displayProjects[u].name  + ' is ' + this.displayProjects[u].isValid
        + '\t\t\t\t\t\t\t\t\t\t\t\tName  ' + this.displayEmployees[u].name  + ' is ' + this.displayEmployees[u].isValid);

    }



    // this.displayData = {
    //   'projects': this.displayProjects,
    //   'employees': this.displayEmployees
    // };

    // console.log(this.displayData.projects);


    // todo modify below for updating
    // this.dataService.updateTimes();

  }

  onReadEnd(fileCount: number) {
    this.status = `Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    this.filePicker.reset();

  }

  findKeywordIndex(keyWord: string, worksheet: object): number {

    const i = Object.values(worksheet).findIndex(w => w.v === keyWord);

    return i;

  }

  // findIndex(jsonData: any, '')


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
