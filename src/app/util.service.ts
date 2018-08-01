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

    const distinctData = this.getDistinctData(unverifiedDataArray);

    const nonExistentData = distinctData.filter(value => -1 === validDataArray.indexOf(value));

    return nonExistentData;
  }

  getProjectNames(projects: any[]): any[] {

    const projectsNames = [];

    projects.map((p) => {

      projectsNames.push(p.name);

    });

    return projectsNames;
  }


}
