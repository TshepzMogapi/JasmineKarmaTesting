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

    const kids = [];

    const Kids = Parse.Object.extend('Employee');

    const query = new Parse.Query(Kids);

    query.select('Name');
    query.find({
      success: function(results) {

        for (let i = 0; i < results.length; i++) {
          console.log(results[i]);
          kids.push(results[i]);
        }
      },
      error: function(error) {

        console.log(error);

      }
    });


    return kids;

  }
}
