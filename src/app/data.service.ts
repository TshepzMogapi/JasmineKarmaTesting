import { Injectable } from '@angular/core';

const Parse: any = require('parse');


@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor() {

    Parse.initialize('lLWbYKXLtCaEnvFFlzeAI3GDR1nFAgtRDnQrcbtQ',
      'MWOLwOVjJSTqwPlr0iuiEbdT2tF9EwGXJvrZEtVU');

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
          employee.name = results[i].attributes.name;

          employees.push(employee);

        }

    });

    return employees;

  }

  getProjects(): any {

    let project = {
      'id': null,
      'name': ''
    };

    const projects = [];

    const Projects = Parse.Object.extend('Project');

    const query = new Parse.Query(Projects);

    query.limit(1000).find().then((results) => {

      for (let i = 0; i < results.length; i++) {

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

  getSubProjects(): any[] {

    const SubProjects = Parse.Object.extend('SubProject');

    const subProjects = [];

    const query = new Parse.Query(SubProjects);

    query.limit(10000).find().then((results) => {

      for (let i = 0; i < results.length; i++) {

        subProjects.push({
          id: results[i].id,
          name: results[i].attributes.name
        });

      }

    });

    return subProjects;

  }

  getOverHeads(): any[] {

    let overHead = {
      'id': null,
      'name': ''
    };

    const oHeads = [];

    const OverHeads = Parse.Object.extend('Overhead');

    const query = new Parse.Query(OverHeads);

    query.include('company');

    query.find().then((results) => {

      for (let i = 0; i < results.length; i++) {

        overHead = {
          'id': null,
          'name': ''
        };

        overHead.id = results[i].id;
        overHead.name = results[i].attributes.name;

        oHeads.push(overHead);

      }

    });

    return oHeads;
  }

  getSubOverHeads(): any[] {


    const SubOverHeads = Parse.Object.extend('SubOverhead');

    const subOverHeads = [];

    const query = new Parse.Query(SubOverHeads);

    // query.include('overhead');

    query.limit(10000).find().then((results) => {

      for (let i = 0; i < results.length; i++) {


        subOverHeads.push({
          id: results[i].id,
          name: results[i].attributes.name
        });

      }

    });

    return subOverHeads;

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

  getNodes(): any[] {


    const nodes = [];

    const Nodes = Parse.Object.extend('NodeTime');

    const query = new Parse.Query(Nodes);

    query.descending('createdAt');

    query.limit(5);

    // query.include('company');



    //
    // query.find({
    //   success: (res) => {
    //
    //     for (let i = 0; i < res.length; i++) {
    //       // This does not require a network access.
    //
    //       console.log(res[i]);
    //
    //       nodes.push(res[i]);
    //     }
    //   },
    //   error: (error) => {
    //   // The request failed
    //     console.log('failed');
    // }
    // });


    query.find().then((results) => {

      console.log(results);

      })
      .catch(function(error) {
        // There was an error.

        console.log('error');

      });


    return nodes;

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
