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

    const projects = [];

    const Projects = Parse.Object.extend('Project');

    const query = new Parse.Query(Projects);

    query.find().then((results) => {

      for (let i = 0; i < results.length; i++) {

        project = {
          'id': null,
          'name': ''
        };

        project.id = results[i].id;
        project.name = results[i].attributes.Name;

        projects.push(project);

      }

    });

    return projects;



  }



}
