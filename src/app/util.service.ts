import { Injectable } from '@angular/core';

import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private dataService: DataService) { }

  getDistinctData(originalData: any[]): any[] {

    let uniqueData = [];

    uniqueData = Array.from(new Set(originalData));

    return uniqueData;
  }


  // non existent
  getNonExistentData(validDataArray: any[], unverifiedDataArray: any[]): any[] {

    // let employees = [];
    // let projects = [];
    //
    // employees = this.dataService.getEmployees();
    // projects = this.dataService.getProjects();
    //
    // const distinctProjects = this.getDistinctData(projects);
    // const distinctEmployees = this.getDistinctData(employees);


    const distinctData = this.getDistinctData(validDataArray);

    const nonExistentData = distinctData.filter(value => -1 === unverifiedDataArray.indexOf(value));

    return nonExistentData;
  }

  //
  // const invalidProjects = distinctProjects.filter(value => -1 === projectsNames.indexOf(value));
  //
  // const invalidEmployees = distinctEmployees.filter(value => -1 === employeeNames.indexOf(value));


}
