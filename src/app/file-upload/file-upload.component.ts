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

  nErrors = null;

  displayData = [];

  @ViewChild(FilePickerDirective)  private filePicker;

  constructor(private dataService: DataService,
              private excelService: XLSXService,
              private utilService: UtilService) { }

  ngOnInit() {

    const headers = ['project', 'employee'];

    const a = {};

    a['Variable'] = null;

    console.log(a);






    // for (let i = 0; i < 2; i++) {
    //
    //   console.log( eval(' alphabet' + i)  );
    //   this['ref' + i] = 'test';
    // }




    this.employees = this.dataService.getEmployees();

    this.projects = this.dataService.getProjects();

    // this.projects.map((p) => {
    //
    //   console.log(p);
    //
    // });

  }

  onReadStart(fileCount: number) {
    this.status = `Reading ${fileCount} file(s)...`;

  }


  onFilePicked(file: ReadFile) {

    this.picked = file;

    const wb = this.excelService.getWorkSheet(file, 'TimeNode', 0);

    const worksheet = wb[0];

    let range = XLSX.utils.decode_range(worksheet['!ref']);

    const excelData = this.excelService.getDataFromSheet(worksheet, ['test']);

    const distinctProjects = this.utilService.getDistinctData(excelData[0]);

    console.log(excelData[0]);

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

      i++;

    });

    // XLSX.writeFile(wb[1], 'TimeSheet-Test.xlsx');

    // this.nErrors = invalidData.length;


    // todo modify below for updating
    // this.dataService.updateTimes();

  }

  onReadEnd(fileCount: number) {
    this.status = `Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    this.filePicker.reset();

    console.log(this.projects);

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

    // const workBook = wb[1];

    const workBook  = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, worksheet, 'ImportData');

    // const new workSheet =

    const range = XLSX.utils.decode_range(worksheet['!ref']);

    const newRange = {
      s: {c: range.s.c, r: range.s.r},

      e: {c: range.e.c, r: 800}
    };

    worksheet['!ref'] = XLSX.utils.encode_range(newRange);


    const excelData = this.excelService.getProjectData(worksheet);


    // excelData[2].map((p) => {
    //
    //   console.log(p.w);
    //
    // })


    // const cellRef = XLSX.utils.encode_cell({c: excelData[4][1], r: 1});




    const stages = ['1. Design / Pre-construction', '2. Cosntruction / Contract',
      '3 Post PC / Close Out', 'Additional Work / Variations', 'Disbursements'];




    let pCodeRow = 41;

    const partialCodes = excelData[2].slice(37);

    partialCodes.map((c) => {


      for (let j = 0; j < stages.length; j++) {

        const projectCodeCellRef = XLSX.utils.encode_cell({c: 0, r: pCodeRow});

        // console.log(projectCodeCellRef);

        const projectCodeCell = {t: '?', v: c[0].v};

        worksheet[projectCodeCellRef] = projectCodeCell;

        pCodeRow++;

      }

    });




    let newRow = 41;

    excelData[0].slice(37).map((d) => {

      for (let j = 0; j < stages.length; j++) {

        const subProjectCellRef = XLSX.utils.encode_cell({c: excelData[4][1], r: newRow});

        const subProjectCell = {t: '?', v: stages[j]};

        worksheet[subProjectCellRef] = subProjectCell;

        newRow++;

      }


    });



    let pRow = 41;

    excelData[0].slice(37).map((p) => {

      for (let j = 0; j < stages.length; j++) {

        const projectCellRef = XLSX.utils.encode_cell({c: 1, r: pRow});

        console.log(p[0]);

        const projectCell = {t: '?', v: p[0]};

        worksheet[projectCellRef] = projectCell;

        pRow++;

      }


    });

    XLSX.writeFile(workBook, 'TimeSheet-Test.xlsx');
    //





    // console.log((excelData));


  }




}
