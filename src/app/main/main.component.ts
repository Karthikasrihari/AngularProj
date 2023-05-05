import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
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

  onProforma() {

    this.router.navigate(['invoice'], { queryParams: { type: 'Proforma Invoice' } });
  }
  onSales() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Sales Invoice' } });

  }
  onOverdue() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Overdue Invoice' } });

  }
  onRetainer() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Retainer Invoice' } });

  }
  onTimeSheet() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Timesheet Invoice' } });

  }
  onFinal() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Final Invoice' } });

  }
  onCommercial() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Commercial Invoice' } });

  }
  onRecurring() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Recurring Invoice' } });

  }
  onDigital() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Digital Invoice' } });

  }
  onE() {
    this.router.navigate(['invoice'], { queryParams: { type: 'E-Invoice' } });

  }
  onConsolidated() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Cosolidate Invoice' } });

  }

  onMixed() {
    this.router.navigate(['invoice'], { queryParams: { type: 'Mixed Invoice' } });

  }


}
