import {Component, OnInit, ViewChild} from '@angular/core';
import { FilePickerDirective, ReadFile, ReadMode } from 'ngx-file-helpers';

import * as XLSX from 'xlsx';

const { read, write, utils } = XLSX;

import {DataService} from '../data.service';

import * as _ from 'underscore';

import {XLSXService} from '../xlsx.service';
import {UtilService} from '../util.service';

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

  nErrors = null;

  displayData = [];

  @ViewChild(FilePickerDirective)  private filePicker;

  constructor(private dataService: DataService,
              private excelService: XLSXService,
              private utilService: UtilService) { }

  ngOnInit() {

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

    // const ws = this.excelService.getWorkSheet(file, 'TimeNode')

    const range = XLSX.utils.decode_range(worksheet['!ref']);


    const cell = {t: '?', v: 'NEW VALUE'};


    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // console.log(jsonData);

    let dateRef = null;

    let projectRef = null;

    let employeeRef = null;

    let isHeaderPresent = null;

    let dateColumnRef = null;

    let projectColumnRef = null;

    let employeeColumnRef = null;

    const dates = [];

    const employees = [];

    const projects = [];

    let headerRowRef = null;

    const headerColumnRef = range.e.c;

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        /* find the cell object */

        const cellRef = XLSX.utils.encode_cell({c: C, r: R});

        if (worksheet[cellRef]) {

          if (dateRef && employeeRef && projectRef) {

            isHeaderPresent = true;
          }

          if (worksheet[cellRef].v === 'date') {

            headerRowRef = R;

            dateRef = cellRef;

            dateColumnRef = C;

          }

          if (worksheet[cellRef].v === 'employee') {

            employeeRef = cellRef;

            employeeColumnRef = C;

          }

          if (worksheet[cellRef].v === 'project') {

            projectRef = cellRef;

            projectColumnRef = C;

          }

          if (isHeaderPresent) {


            if (C === dateColumnRef) {

              dates.push(worksheet[cellRef].v);

            }

            if (C === employeeColumnRef) {
              employees.push(worksheet[cellRef].v);
            }

            if (C === projectColumnRef) {

             projects.push(worksheet[cellRef].v);

            }
          }



        }


        // if(!worksheet[cellref]) continue; // if cell doesn't exist, move on
        // var cell = worksheet[cellref];

        /* if the cell is a text cell with the old string, change it */
        // if(!(cell.t == 's' || cell.t == 'str')) continue; // skip if cell is not text
        // if(cell.v === oldtext) cell.v = newtext; // change the cell value
      }
    }

    // console.log(projects);
    //
    // // console.log('Date ref = ' + dateRef + ' Project Ref = ' +  projectRef + ' Employee Ref = ' + employeeRef);
    //
    // console.log('Header Row Ref  ' + headerRowRef + '   Header Column Ref  ' + headerColumnRef);


    // let isHeaderPresent = null;

    // let dateIndex = null;
    //
    // let projectIndex = null;
    //
    // let employeeIndex = null;
    //
    // const dates = [];
    //
    // const employees = [];
    //
    // const projects = [];
    //
    //
    // jsonData.map((d) => {
    //
    //   if (dateIndex && employeeIndex && projectIndex) {
    //     isHeaderPresent = true;
    //   }
    //
    //   if (_.invert(d)['date']) {
    //
    //     dateIndex =  _.invert(d)['date'];
    //
    //
    //
    //   }
    //
    //   if (_.invert(d)['employee']) {
    //
    //     employeeIndex = _.invert(d)['employee'];
    //
    //
    //
    //   }
    //
    //   if (_.invert(d)['project']) {
    //
    //     projectIndex = _.invert(d)['project'];
    //
    //
    //
    //   }
    //
    //
    //
    //   if (isHeaderPresent) {
    //
    //     employees.push(d[employeeIndex]);
    //
    //     projects.push(d[projectIndex]);
    //
    //
    //   }
    //
    //
    // });
    //
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

    // console.log(range);
    //
    // console.log(projectIndex);
    // console.log(employeeIndex);
    // console.log(dateIndex);



    // console.log(dateHeaderIndex + '\t' + projectHeaderIndex + '\t' + employeeHeaderIndex +  '\ttestIndex is at ' + testIndex);

    const data = [
      {'name': 'John', 'city': 'Seattle'},
      {'name': 'Mike', 'city': 'Los Angeles'},
      {'name': 'Zach', 'city': 'New York'}
    ];
    //
    const sheet = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, sheet, 'Timesheet');
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

    const wb = this.excelService.getWorkSheet(file, 'TimeNode', 0);

    const worksheet = wb[0];


    let range = XLSX.utils.decode_range(worksheet['!ref']);

    console.log(range);

    const excelData = this.excelService.getDataFromSheet(worksheet);

    // todo get Projects, Dates , Hours , Employees
    const distinctData = this.utilService.getDistinctData(excelData[0]);

    const projectNames = this.utilService.getProjectNames(this.projects);

    const invalidData = this.utilService.getNonExistentData(projectNames, distinctData);

    const worksheetRange = excelData[3];

    // console.log(worksheetRange);

    const cell = {t: '?', v: 'NEW VALUE'};

    const cellRef = XLSX.utils.encode_cell({c: worksheetRange[1] + 1, r: worksheetRange[0]});

    // console.log(cellRef);

    const address = XLSX.utils.decode_cell(cellRef);

    worksheet[cellRef] = cell;

    // console.log(address);

    // worksheetRange.map(r => {
    //   console.log(r);
    // });

    const newRange = {
      s: {c: range.s.c, r: range.s.r},
      e: {c: range.e.c + 1, r: range.e.r}
    };

    console.log(range);

    // console.log(newRange);

    worksheet['!ref'] = XLSX.utils.encode_range(newRange);

    range = XLSX.utils.decode_range(worksheet['!ref']);

    // console.log(XLSX.utils.);

    worksheet[cellRef].v = 'Error Error';

    // XLSX.utils.(wb[1], worksheet, 'TimeSheet-Updated');

    XLSX.writeFile(wb[1], 'TimeSheet-Test.xlsx');



    //
    // const updatedWorkSheetRange = worksheetRange.e.c += 1;

    // console.log(worksheetRange);
    /* update range */
    // worksheet['!ref'] = XLSX.utils.encode_range(range);

    this.nErrors = invalidData.length;


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
