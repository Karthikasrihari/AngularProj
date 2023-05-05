import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';
import { MainComponent } from './main/main.component';


// const routes: Routes = [];


const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'/main'},
  {path:'main',component:MainComponent},
  
  {path: 'invoice', component: InvoiceComponent }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
