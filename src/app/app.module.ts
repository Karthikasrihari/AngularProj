import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { AntproviderModule } from '/Users/karthikasrihari/AngularProj/Antprovider.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceModule } from './invoice/invoice.module';
import { HeaderComponent } from './invoice/header/header.component';
import { MainComponent } from './main/main.component';
registerLocaleData(en);

@NgModule({
  declarations: [	
    AppComponent,
      MainComponent
   ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot([
    //   {path: 'invoice', component: InvoiceComponent},
     
    //   {path: '', redirectTo: '/invoice', pathMatch: 'full'},
    // ]),
    // InvoiceModule,
    AppRoutingModule,
   AntproviderModule,
   HttpClientModule,
   BrowserAnimationsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
