import { NgModule } from '@angular/core';
import { AntproviderModule } from '/Users/karthikasrihari/AngularProj/Antprovider.module';


import { InvoiceComponent } from './invoice.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  imports: [AntproviderModule,],
  declarations: [InvoiceComponent, HeaderComponent],
  exports: [InvoiceComponent],
  providers: [],
})
export class InvoiceModule { }
