import { Injectable } from '@angular/core';
import { Invoice } from '../model/invoice';
import InvoicesJson from 'import_invoice.json';
import DetensionJson from 'detension_invoice.json';
import ExportFreightJson from 'exportfreight_invoice.json';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceArr: Invoice[] = [];

  constructor() { }
  public getInvoices(type: any): Observable<Invoice[]> {
 
    if(type=="Import")
    {
      this.invoiceArr =InvoicesJson;
    }
    else if(type=="Detension")
    {
      this.invoiceArr =DetensionJson;
    }
    else if(type=="ExportFreight"){
      this.invoiceArr = ExportFreightJson;
    }
    else{
      this.invoiceArr=[];
    }
  
    return of(this.invoiceArr);
  }
  public getInvoice(id: number) {
    let selectedItem = this.invoiceArr.find(item => item.id === id);
    console.log(selectedItem);
    if (selectedItem) {
      console.log("ewq");
      return selectedItem;
    }

    return null;

  }

}
