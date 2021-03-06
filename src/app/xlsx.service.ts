import { Injectable } from '@angular/core';


import { FilePickerDirective, ReadFile, ReadMode } from 'ngx-file-helpers';




import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class XLSXService {

  constructor() { }

  // todo return worksheet
  getWorkSheet(file: ReadFile, sheetName: string, sheetNumber: number): any {

    const workbook = XLSX.read(file.content,  {type: 'binary', cellDates: true});

    // todo use parameter sheetNumber below

    const first_sheet_name = workbook.SheetNames[sheetNumber];

    const  worksheet = workbook.Sheets[first_sheet_name];

    // todo modify above logic to get desired location

    return [worksheet, workbook];

  }

  getDataFromSheet(workSheet: any, headerNames: string[]): [any[], any[], any[], any[], any[], any[], any[]] {

    const range = XLSX.utils.decode_range(workSheet['!ref']);

    const r = range;

    const headers = ['project', 'employee', 'startDay'];

    const variables = {};

    for (let i = 0; i < headers.length; i++) {

      variables[headers[i] + 'Header'] = null;

    }


    const projectHeader = 'Project';

    const startDayHeader = 'WeekStart (Sunday)';

    const employeeHeader = 'Employee';

    const hoursHeader = 'Hours';

    const subProjectHeader = 'SubProject';

    const isOverHeadHeader = 'Overhead';

    const cell = {t: '?', v: 'NEW VALUE'};

    let dateRef = null;

    let projectRef = null;

    let employeeRef = null;

    let hoursRef = null;

    let subProjectRef = null;

    let isOverHeadRef = null;

    let isHeaderPresent = null;


    let dateColumnRef = null;

    let projectColumnRef = null;

    let employeeColumnRef = null;

    let hoursColumnRef = null;

    let subProjectColumnRef = null;

    let isOverHeadColumnRef = null;





    const dates = [];

    const employees = [];

    const projects = [];

    const hours = [];

    const isOverHead = [];

    const subProjects = [];


    let headerRowRef = null;

    const headerColumnRef = range.e.c;

    const recordsRowRef = [];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {

        /* find the cell object */

        const cellRef = XLSX.utils.encode_cell({c: C, r: R});

        if (workSheet[cellRef]) {

          if (dateRef && employeeRef
            && projectRef && hoursRef
            && isOverHeadRef && subProjectRef ) {

            isHeaderPresent = true;

          }

          if (workSheet[cellRef].v === startDayHeader) {

            headerRowRef = R;

            dateRef = cellRef;

            dateColumnRef = C;

          }

          if (workSheet[cellRef].v === employeeHeader) {

            employeeRef = cellRef;

            employeeColumnRef = C;

          }

          if (workSheet[cellRef].v === hoursHeader) {

            hoursRef = cellRef;

            hoursColumnRef = C;

          }

          if (workSheet[cellRef].v === projectHeader) {

            projectRef = cellRef;

            projectColumnRef = C;

          }

          if (workSheet[cellRef].v === subProjectHeader) {

            subProjectRef = cellRef;

            subProjectColumnRef = C;

          }

          if (workSheet[cellRef].v === isOverHeadHeader) {

            isOverHeadRef = cellRef;

            isOverHeadColumnRef = C;

          }

          if (isHeaderPresent) {

            if (C === dateColumnRef) {

              recordsRowRef.push(R);

              dates.push(workSheet[cellRef]);

            }

            if (C === employeeColumnRef) {

              employees.push(workSheet[cellRef].v);
            }

            if (C === projectColumnRef) {

              projects.push(workSheet[cellRef].v);

            }

            if (C === hoursColumnRef) {

              hours.push(workSheet[cellRef].v);

            }

            if (C === isOverHeadColumnRef) {

              isOverHead.push(workSheet[cellRef].v);

            }

            if (C === subProjectColumnRef) {

              subProjects.push(workSheet[cellRef].v);

            }

          }

        }

      }
    }
// todo modify below
    return [projects, employees, dates, hours, isOverHead, subProjects, [headerRowRef, range.e.c, recordsRowRef]];

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

  writeToWorkSheet() {
    console.log('writing stuff');

  }

  addSubProjectsToWorkSheet(file: ReadFile, sheetName: string, sheetNumber: number) {

    const workbook = XLSX.read(file.content,  {type: 'binary', cellDates: true});

    // todo use parameter sheetNumber below

    const first_sheet_name = workbook.SheetNames[sheetNumber];

    const  worksheet = workbook.Sheets[first_sheet_name];

    // todo modify above logic to get desired location

    return [worksheet, workbook];
  }

  getProjectData(workSheet: any) {


    const range = XLSX.utils.decode_range(workSheet['!ref']);

    const r = range;

    const cell = {t: '?', v: 'NEW VALUE'};

    let projectCodeRef = null;

    let projectNameRef = null;

    let projectManagerRef = null;

    let subProjectRef = null;

    let isHeaderPresent = null;

    let projectCodeColumnRef = null;

    let projectNameColumnRef = null;

    let projectManagerColumnRef = null;

    let subProjectsColumnRef = null;

    const codes = [];

    const managers = [];

    const projects = [];

    const subProjects = [];

    let headerRowRef = null;

    const headerColumnRef = range.e.c;

    const recordsRowRef = [];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {

        /* find the cell object */

        const cellRef = XLSX.utils.encode_cell({c: C, r: R});

        if (workSheet[cellRef]) {

          if (projectCodeRef && projectManagerRef
            && projectNameRef ) {

            isHeaderPresent = true;

          }

          if (workSheet[cellRef].v === 'Project Code') {

            headerRowRef = R;

            projectCodeRef = cellRef;

            projectCodeColumnRef = C;

          }

          if (workSheet[cellRef].v === 'Project Manager') {

            projectManagerRef = cellRef;

            projectManagerColumnRef = C;

          }


          if (workSheet[cellRef].v === 'Project Name') {

            projectNameRef = cellRef;

            projectNameColumnRef = C;

          }

          if (workSheet[cellRef].v === 'Sub Project Name (or stages of work)') {

            subProjectRef = cellRef;

            subProjectsColumnRef = C;

          }

          if (isHeaderPresent) {

            if (C === projectCodeColumnRef) {

              recordsRowRef.push(R);

              codes.push([workSheet[cellRef], C]);

            }

            if (C === projectManagerColumnRef) {

              managers.push([workSheet[cellRef].v, C]);
            }

            if (C === projectNameColumnRef) {

              projects.push([workSheet[cellRef].v, C]);

            }



          }

        }

      }
    }


    // todo modify below
    return [projects, managers, codes, subProjects, [headerRowRef, subProjectsColumnRef, recordsRowRef]];

  }



}
