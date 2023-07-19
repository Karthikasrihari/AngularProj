import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';
import { MainComponent } from './invoice/main/main.component';
import { InvoiceListComponent } from './invoice/invoiceList/invoiceList.component';



const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'/main'},
  { path: 'main', component: MainComponent },
  { path: 'invoiceList', component: InvoiceListComponent },
  { path: 'invoice', component: InvoiceComponent },


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
