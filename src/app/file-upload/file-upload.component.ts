import {Component, OnInit, ViewChild} from '@angular/core';
import { FilePickerDirective, ReadFile, ReadMode } from 'ngx-file-helpers';

import * as XLSX from 'xlsx';

const { read, write, utils } = XLSX;

import {DataService} from '../data.service';

import * as _ from 'underscore';

import {XLSXService} from '../xlsx.service';
import {UtilService} from '../util.service';

import {moment} from 'ngx-bootstrap/chronos/test/chain';

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

    const arr = [1, 2, 3];


    console.log(arr.indexOf(2));

    this.employees = this.dataService.getEmployees();

    this.projects = this.dataService.getProjects();

  }

  onReadStart(fileCount: number) {
    this.status = `Reading ${fileCount} file(s)...`;

  }


  onFilePicked(file: ReadFile) {

    this.picked = file;

    const wb = this.excelService.getWorkSheet(file, 'TimeNode', 0);

    const worksheet = wb[0];

    let range = XLSX.utils.decode_range(worksheet['!ref']);

    const excelData = this.excelService.getDataFromSheet(worksheet);

    const distinctProjects = this.utilService.getDistinctData(excelData[0]);

    const distinctEmployees = this.utilService.getDistinctData(excelData[1]);

    const projectNames = this.utilService.getProjectNames(this.projects);

    const employeeNames = this.utilService.getProjectNames(this.employees);

    const invalidProjects = this.utilService.getNonExistentData(projectNames, distinctProjects);

    const invalidEmployees = this.utilService.getNonExistentData(employeeNames, distinctEmployees);

    const worksheetRange = excelData[3];

    console.log(excelData[3]);
    //
    // excelData[2].map(ty => {
    //   console.log(moment(ty.v, moment.ISO_8601, true).isValid());
    // });

    const newRange = {
      s: {c: range.s.c, r: range.s.r},
      e: {c: range.e.c + 1, r: range.e.r}
    };

    worksheet['!ref'] = XLSX.utils.encode_range(newRange);

    range = XLSX.utils.decode_range(worksheet['!ref']);

    const cellRef = XLSX.utils.encode_cell({c: worksheetRange[1] + 1, r: worksheetRange[0]});

    // console.log(cellRef);

    const address = XLSX.utils.decode_cell(cellRef);

    // XLSX.writeFile(wb[1], 'TimeSheet-Test.xlsx');

    let i = 0;

    (excelData[4][2]).map(d => {


      // if -1 is valid
      const errorCellRef = XLSX.utils.encode_cell({c: worksheetRange[1] + 1, r: excelData[4][2][i]});

      let errorText = '';

      // const cell = {t: '?', v: 'Invalid record'};

      if (invalidProjects.indexOf(excelData[0][i]) !== -1) {
        errorText += ' Invalid Project Name ';
      }

      if (invalidEmployees.indexOf(excelData[0][i]) !== -1) {
        errorText += ' Invalid Employee Name ';
      }

      if (!moment(excelData[2][i].v, moment.ISO_8601, true).isValid()) {
        errorText += ' Invalid Date ';
      }


      if (isNaN(excelData[3][i])) {
        errorText += ' Invalid Hours ';
      }

      if (errorText.length > 0) {

        const cell = {t: '?', v: errorText};

        worksheet[errorCellRef] = cell;


      }


      // if (invalidProjects.indexOf(excelData[0][i]) !== -1
      //   || invalidEmployees.indexOf(excelData[1][i]) !== -1
      //   || !moment(excelData[2][i].v, moment.ISO_8601, true).isValid()
      //   || isNaN(excelData[3][i])) {
      //
      //
      //   worksheet[errorCellRef] = cell;
      //
      //   console.log('valid');
      //
      // } else {
      //
      //   console.log('Invalid');
      //
      //   console.log( isNaN(excelData[3][i]));
      //
      // }

      i++;

    });

    XLSX.writeFile(wb[1], 'TimeSheet-Test.xlsx');

    // this.nErrors = invalidData.length;


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



  addSubProjects(file: ReadFile) {

    const wb = this.excelService.getWorkSheet(file, 'TimeNode', 2);

    const worksheet = wb[0];

    // let range = XLSX.utils.decode_range(worksheet['!ref']);

    const excelData = this.excelService.getDataFromSheet(worksheet);


    console.log((excelData[0]));


  }




}
