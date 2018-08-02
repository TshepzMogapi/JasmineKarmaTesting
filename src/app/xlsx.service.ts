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

  // todo return worksheet
  getWorkSheet(file: ReadFile, sheetName: string, sheetNumber: number): any {

    const workbook = XLSX.read(file.content,  {type: 'binary', cellDates: true});

    // todo use parameter sheetNumber below

    const first_sheet_name = workbook.SheetNames[sheetNumber];

    const  worksheet = workbook.Sheets[first_sheet_name];

    // todo modify above logic to get desired location

    return [worksheet, workbook];

  }

  getDataFromSheet(workSheet: any): [any[], any[], any[], any[], any[]] {

    const range = XLSX.utils.decode_range(workSheet['!ref']);

    const r = range;

    const cell = {t: '?', v: 'NEW VALUE'};

    let dateRef = null;

    let projectRef = null;

    let employeeRef = null;

    let hoursRef = null;

    let isHeaderPresent = null;

    let dateColumnRef = null;

    let projectColumnRef = null;

    let employeeColumnRef = null;

    let hoursColumnRef = null;

    const dates = [];

    const employees = [];

    const projects = [];

    const hours = [];

    let headerRowRef = null;

    const headerColumnRef = range.e.c;

    const recordsRowRef = [];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {

        /* find the cell object */

        const cellRef = XLSX.utils.encode_cell({c: C, r: R});

        if (workSheet[cellRef]) {

          if (dateRef && employeeRef
            && projectRef && hoursRef) {

            isHeaderPresent = true;
          }

          if (workSheet[cellRef].v === 'date') {

            headerRowRef = R;

            dateRef = cellRef;

            dateColumnRef = C;

          }

          if (workSheet[cellRef].v === 'employee') {

            employeeRef = cellRef;

            employeeColumnRef = C;

          }

          if (workSheet[cellRef].v === 'hours') {

            hoursRef = cellRef;

            hoursColumnRef = C;

          }

          if (workSheet[cellRef].v === 'project') {

            projectRef = cellRef;

            projectColumnRef = C;

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


          }

        }

      }
    }



    // todo modify below
    return [projects, employees, dates, hours, [headerRowRef, range.e.c, recordsRowRef]];

}

  // classifyRecords()

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

}
