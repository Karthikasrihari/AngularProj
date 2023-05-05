import { Component, Input, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
// import { ProductModel } from './product.model';
import countryJson from '../country.json';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
interface COUNTRY {
  country_name: string;
}
export const IPARAMS = {
  shipper: 'shipper',
  invoiceNo: 'invoiceNo',
  datePicker: 'datePicker',
  billOfLoadingNumber: 'billOfLoadingNumber',
  jobno: 'jobno',
  buyerReference: 'buyerReference',
  billingparty: 'billingparty',
  buyer: 'buyer',
  dispatchMethod: 'dispatchMethod',
  goodsOrigin: 'goodsOrigin',
  finalDest: 'finalDest',
  vessel: 'vessel',
  voyageNo: 'voyageNo',
  loadPort: 'loadPort',
  dateDepart: 'dateDepart',
  paymentMethod: 'paymentMethod',
  port: 'port',
  destination: 'destination',
  taxPercent: 'taxPercent',
  taxName: 'taxName',
  policyNo: 'policyNo',
  creditNo: 'creditNo',
  additionalInfo: 'additionalInfo',
  addCharge: 'addCharge',
  discountValue: 'discountValue',
  paid: 'paid',
  place: 'place',
  currency: 'currency',
  placeIssue: 'placeIssue',
  date1: 'date1',
  sigCompany: 'sigCompany',
  firstName: 'firstName',
  lastName: 'lastName',
  signature: 'signature',
  bankDetails: 'bankDetails',

  productCode: 'productCode',
  description: 'description',
  HSCode: 'HSCode',
  unitQuantity: 0,
  unitType: 'HSCode',
  price: 0,
  amount: 0,
}
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent implements OnInit {
  @Input()
  type?: string;
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

  iPARAMS = IPARAMS;

  invoiceForm!: FormGroup;
  listOfCountry: COUNTRY[] = countryJson;

  constructor(private fb: FormBuilder, private modal: NzModalService, private route: ActivatedRoute, private router: Router, private location: Location) { }
  onBack(): void {
    this.location.back();
    console.log('onBack');
  }
  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get('type')!;
      console.log("get value " + this.type);
    });

    this.invoiceForm = new FormGroup({
      [this.iPARAMS.shipper]: new FormControl(''),
      [this.iPARAMS.invoiceNo]: new FormControl(''),
      [this.iPARAMS.datePicker]: new FormControl(''),
      [this.iPARAMS.billOfLoadingNumber]: new FormControl(''),
      [this.iPARAMS.jobno]: new FormControl(''),
      [this.iPARAMS.buyerReference]: new FormControl(''),
      [this.iPARAMS.billingparty]: new FormControl(''),
      [this.iPARAMS.buyer]: new FormControl(''),
      [this.iPARAMS.dispatchMethod]: new FormControl(''),
      [this.iPARAMS.goodsOrigin]: new FormControl(''),
      [this.iPARAMS.finalDest]: new FormControl(''),
      [this.iPARAMS.vessel]: new FormControl(''),
      [this.iPARAMS.voyageNo]: new FormControl(''),
      [this.iPARAMS.loadPort]: new FormControl(''),
      [this.iPARAMS.dateDepart]: new FormControl(''),
      [this.iPARAMS.paymentMethod]: new FormControl(''),
      [this.iPARAMS.port]: new FormControl(''),
      [this.iPARAMS.destination]: new FormControl(''),
      [this.iPARAMS.policyNo]: new FormControl(''),
      [this.iPARAMS.creditNo]: new FormControl(''),
      [this.iPARAMS.additionalInfo]: new FormControl(''),
      [this.iPARAMS.taxPercent]: new FormControl(''),
      [this.iPARAMS.taxName]: new FormControl(''),
      [this.iPARAMS.addCharge]: new FormControl(''),
      [this.iPARAMS.discountValue]: new FormControl(''),
      [this.iPARAMS.paid]: new FormControl(''),
      [this.iPARAMS.place]: new FormControl(''),
      [this.iPARAMS.currency]: new FormControl(''),
      [this.iPARAMS.placeIssue]: new FormControl(''),
      [this.iPARAMS.date1]: new FormControl(''),
      [this.iPARAMS.sigCompany]: new FormControl(''),
      [this.iPARAMS.firstName]: new FormControl(''),
      [this.iPARAMS.lastName]: new FormControl(''),
      [this.iPARAMS.signature]: new FormControl(''),
      [this.iPARAMS.bankDetails]: new FormControl(''),
      products: this.fb.array([
        this.fb.group({
          [this.iPARAMS.productCode]: "",
          [this.iPARAMS.description]: "",
          [this.iPARAMS.HSCode]: "",
          [this.iPARAMS.unitQuantity]: 0,
          [this.iPARAMS.unitType]: "",
          [this.iPARAMS.price]: 0,
          [this.iPARAMS.amount]: 0,
        })
      ])
    })

  }


  userProducts(): FormArray {
    return this.invoiceForm
      .get('products') as FormArray;
  }

  newProduct(): FormGroup {
    return this.fb.group({
      [this.iPARAMS.productCode]: "",
      [this.iPARAMS.description]: "",
      [this.iPARAMS.HSCode]: "",
      [this.iPARAMS.unitQuantity]: 0,
      [this.iPARAMS.unitType]: "",
      [this.iPARAMS.price]: 0,
      [this.iPARAMS.amount]: 0,
    });
  }


  addProducts() {
    this.userProducts().push(this.newProduct());
  }

  removeProducts(proIndex: number) {

    this.modal.confirm({
      nzTitle: 'Are you sure to delete?',
      nzContent: '<b style="color: red;">The selected row will be deleted.</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.userProducts().removeAt(proIndex),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });

  }

  submitForm() {
    // console.log(this.invoiceForm.get(this.iPARAMS.invoiceNo)?.value);
    console.log(this.invoiceForm.value);
  }
}

