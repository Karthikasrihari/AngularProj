import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { map, filter, scan } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  isCollapsed = false;
  title = 'AngularProj';
  blankUrl = '';
  currentUrl: string | undefined;
  checkoutUrls = '/invoice?type';

  constructor(private router: Router) {
    router.events.pipe(filter((e: any) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.currentUrl = e.url;
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100)
      });

  }
  isCheckoutRoute() {
    if (!this.currentUrl) {
      return false;
    }
    const index = this.currentUrl.indexOf(this.checkoutUrls);
    // console.log("index value " + index);
    if (index >= 0) {
      return true;
    } else {
      return false;
    }
  }
  ngOnInit() {

  }
}
