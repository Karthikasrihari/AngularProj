import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularProj';

  date = null;
  date1 = null;
  dateDepart = null;
  size: NzButtonSize = 'small';

  dispatchMethod = null;
  goodsOrigin = null;
  finalDest = null;
  loadPort = null;
  paid = null;
  currency = null;


  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

}
