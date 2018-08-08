import { Injectable } from '@angular/core';

const Parse: any = require('parse');


@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor() {


    Parse.initialize('lLWbYKXLtCaEnvFFlzeAI3GDR1nFAgtRDnQrcbtQ', 'MWOLwOVjJSTqwPlr0iuiEbdT2tF9EwGXJvrZEtVU');

    Parse.serverURL = 'https://parseapi.back4app.com/';

  }


  getEmployees(): any[] {

    let employee = {
      'id': null,
      'name': ''
    };

    const employees = [];

    const Employees = Parse.Object.extend('Employee');

    const query = new Parse.Query(Employees);

    query.find().then((results) => {

        for (let i = 0; i < results.length; i++) {

          employee = {
            'id': null,
            'name': ''
          };

          employee.id = results[i].id;
          employee.name = results[i].attributes.Name;

          employees.push(employee);

        }

    });

    return employees;



  }

  getProjects(): any[] {

    let project = {
      'id': null,
      'name': ''
    };

    let projects = [];

    const Projects = Parse.Object.extend('Project');

    const query = new Parse.Query(Projects);

    query.find().then((results) => {

      for (let i = 0; i < results.length; i++) {

        // console.log(results[i].attributes.name);

        project = {
          'id': null,
          'name': ''
        };

        project.id = results[i].id;
        project.name = results[i].attributes.name;

        projects.push(project);

      }

    });

    return projects;

  }

  getProjectNames(projects: any[]): any[] {

    const projectsNames = [];

    projects.map((p) => {

      projectsNames.push(p.name);

    });

    return projectsNames;
  }

  getEmployeeNames(): any[] {

    const employeeNames = [];

    this.getEmployees().map((e) => {
      employeeNames.push(e.name);
    });
    return employeeNames;
  }

  updateTimes(): void {

    const Time = Parse.Object.extend('Time');

    const timeRecord = new Time();


    timeRecord.set('projectId', 1023);
    timeRecord.set('hours', 5);
    timeRecord.set('weekStart', '2017Nov08');

  timeRecord.save(null, {
      success: function(tR) {
        // Now let's update it with some new data. In this case, only cheatMode and score
        // will get sent to the cloud. playerName hasn't changed.

        alert('Time saved succesfully');

      }
    });


    console.log('Update Database');
  }



}
