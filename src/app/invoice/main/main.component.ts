import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';

// import * as fs from 'node:fs';
import pdf from 'pdf-parse';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  size: NzButtonSize = 'large';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onImport() {

    this.router.navigate(['invoiceList'], { queryParams: { type: 'Import' } });
  }
  onDetension() {
    this.router.navigate(['invoiceList'], { queryParams: { type: 'Detension' } });

  }
  onExportfreight() {
    this.router.navigate(['invoiceList'], { queryParams: { type: 'ExportFreight' } });

  }
  onDamage() {
    this.router.navigate(['invoiceList'], { queryParams: { type: 'Demage' } });

  }
  readPdf() {
    // const fs = require('fs');
    // const pdf = require('pdf-parse');

    // let dataBuffer =JSON.parse( fs.readFileSync('ExportFreight_Invoice.pdf', "utf-8"));
  

    var fs = require('fs');
      fs.readFile('ExportFreight_Invoice.pdf',
      { encoding: 'utf8', flag: 'r' },
      function (err: any, data: any) {
          if (err)
              console.log(err);
          else
              console.log(data);
      });

  //   pdf(dataBuffer).then(function (data: any) {
  //     // use data

  //     // number of pages
  //     console.log(data.numpages);
  //     // number of rendered pages
  //     console.log(data.numrender);
  //     // PDF info
  //     console.log(data.info);
  //     // PDF metadata
  //     console.log(data.metadata);
  //     // PDF.js version
  //     // check https://mozilla.github.io/pdf.js/getting_started/
  //     console.log(data.version);
  //     // PDF text
  //     console.log(data.text);
  //   })
  //     .catch(function (error: any) {
  //       // handle exceptions
  //       console.log(error);
  //     })
  // }

    }
}
