import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { InvoiceService } from './services/invoice.service'
import { Invoice } from './model/invoice';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export const IPARAMS = {
  irn: 'irn',
  ackNo: 'ackNo',
  ackDate: 'ackDate',

  shippername: 'shippername',
  shipperaddr: 'shipperaddr',
  invoiceNo: 'invoiceNo',
  datePicker: 'datePicker',
  billOfLoadingNumber: 'billOfLoadingNumber',
  consignment: 'consignment',
  invoiceNumber: 'invoiceNumber',
  panNo: 'panNo',
  jobno: 'jobno',
  buyerReference: 'buyerReference',
  billingparty: 'billingparty',
  buyer: 'buyer',
  container: 'container',
  salesman: 'salesman',
  weight: 'weight',
  commodity: 'commodity',
  dispatchMethod: 'dispatchMethod',
  goodsOrigin: 'goodsOrigin',
  finalDest: 'finalDest',
  vessel: 'vessel',
  sbno: 'sbno',
  exrate: 'exrate',
  stuffing: 'stuffing',
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
  status: 'status',


  sno: 'sno',
  particulars: 'particulars',
  saccode: 'saccode',
  gst: 'gst',
  qty: 'qty',
  rate: 'rate',
  amount: 'amount',
  cgstp: 'cgstp',
  cgsta: 'cgsta',
  sgstp: 'sgstp',
  sgsta: 'sgsta',
  igstp: 'igstp',
  igsta: 'igsta',
  total: 'total',


  sac: 'sac',
  amountt: 'amountt',
  cgstt: 'cgstt',
  ctRate: 'ctRate',
  stRate: 'stRate',
  itRate: 'itRate',
  sgstt: 'sgstt',
  igstt: 'igstt',
  gsttotal: 'gsttotal',

  grandTotal: 'grandTotal',


  beneficiaryName: 'beneficiaryName',
  beneficiaryBank: 'beneficiaryBank',
  beneficiaryBranch: 'beneficiaryBranch',
  beneficiaryAccount: 'beneficiaryAccount',
  beneficiaryIfsc: 'beneficiaryIfsc',
  beneficiaryPan: 'beneficiaryPan',

}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent implements OnInit {
  @Input() type?: string;
  @Input() id?: number;

  public getScreenWidth: any;
  public getScreenHeight: any;
  tabs = [1, 2, 3];
  invoiceList: Invoice[] = [];

  title = 'AngularProj';
  isVisible = false;
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

  testPipe = "number:'0.2-2'";

  invoiceForm!: FormGroup;
  radioValue = "PDF";
  viewOptions = [
    { label: 'PDF View', value: 'pdf', icon: 'file-pdf' },
    { label: 'TAB View', value: 'tab', icon: 'folder-view' }
  ];
  selectedIndex = 0;
  constructor(private changeDetector: ChangeDetectorRef, private fb: FormBuilder, private modal: NzModalService, private route: ActivatedRoute, private router: Router, private location: Location, private _invoiceService: InvoiceService) { }
  onBack(): void {
    this.location.back();
    console.log('onBack');
  }

  onChangeStatus(index: number) {
    console.log("value "+index);
    // this.radioValue = $event;
    // console.log($event);
  }
  ngOnInit() {
    this.isVisible = true;
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get('type')!;
      this.id = parseInt(params.get('id')!);
      console.log("get value " + this.type);
      console.log("id value " + this.id);
    });


    this.invoiceForm = new FormGroup({
      [this.iPARAMS.irn]: new FormControl(''),
      [this.iPARAMS.ackNo]: new FormControl(''),
      [this.iPARAMS.ackDate]: new FormControl(''),
      [this.iPARAMS.shippername]: new FormControl(''),
      [this.iPARAMS.shipperaddr]: new FormControl(''),
      [this.iPARAMS.invoiceNo]: new FormControl(''),
      [this.iPARAMS.datePicker]: new FormControl(''),
      [this.iPARAMS.billOfLoadingNumber]: new FormControl(''),
      [this.iPARAMS.consignment]: new FormControl(''),
      [this.iPARAMS.invoiceNumber]: new FormControl(''),
      [this.iPARAMS.panNo]: new FormControl(''),
      [this.iPARAMS.container]: new FormControl(''),
      [this.iPARAMS.salesman]: new FormControl(''),
      [this.iPARAMS.commodity]: new FormControl(''),
      [this.iPARAMS.weight]: new FormControl(''),
      [this.iPARAMS.jobno]: new FormControl(''),
      [this.iPARAMS.buyerReference]: new FormControl(''),
      [this.iPARAMS.billingparty]: new FormControl(''),
      [this.iPARAMS.buyer]: new FormControl(''),
      [this.iPARAMS.dispatchMethod]: new FormControl(''),
      [this.iPARAMS.goodsOrigin]: new FormControl(''),
      [this.iPARAMS.finalDest]: new FormControl(''),
      [this.iPARAMS.vessel]: new FormControl(''),
      [this.iPARAMS.sbno]: new FormControl(''),
      [this.iPARAMS.stuffing]: new FormControl(''),
      [this.iPARAMS.exrate]: new FormControl(''),
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
      [this.iPARAMS.amountt]: new FormControl(''),
      [this.iPARAMS.cgstt]: new FormControl(''),
      [this.iPARAMS.sgstt]: new FormControl(''),
      [this.iPARAMS.igstt]: new FormControl(''),
      [this.iPARAMS.gsttotal]: new FormControl(''),
      [this.iPARAMS.grandTotal]: new FormControl(''),
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
      [this.iPARAMS.beneficiaryName]: new FormControl(''),
      [this.iPARAMS.beneficiaryBank]: new FormControl(''),
      [this.iPARAMS.beneficiaryBranch]: new FormControl(''),
      [this.iPARAMS.beneficiaryAccount]: new FormControl(''),
      [this.iPARAMS.beneficiaryIfsc]: new FormControl(''),
      [this.iPARAMS.beneficiaryPan]: new FormControl(''),
      [this.iPARAMS.bankDetails]: new FormControl(''),
      [this.iPARAMS.sac]: new FormControl(''),
      [this.iPARAMS.ctRate]: new FormControl(''),
      [this.iPARAMS.stRate]: new FormControl(''),
      [this.iPARAMS.itRate]: new FormControl(''),
      [this.iPARAMS.status]: new FormControl(''),
      products: this.fb.array([
        // this.fb.group({
        //   [this.iPARAMS.sno]: new FormControl(''),
        //   [this.iPARAMS.particulars]: new FormControl(''),
        //   [this.iPARAMS.saccode]:new FormControl(''),
        //   [this.iPARAMS.gst]: new FormControl(''),
        //   [this.iPARAMS.qty]: new FormControl(''),
        //   [this.iPARAMS.rate]: new FormControl(''),
        //   [this.iPARAMS.amount]: new FormControl(''),
        //   [this.iPARAMS.cgstp]: new FormControl(''),
        //   [this.iPARAMS.cgsta]: new FormControl(''),
        //   [this.iPARAMS.sgstp]: new FormControl(''),
        //   [this.iPARAMS.sgsta]: new FormControl(''),
        //   [this.iPARAMS.igstp]: new FormControl(''),
        //   [this.iPARAMS.igsta]: new FormControl(''),
        //   [this.iPARAMS.total]: new FormControl(''),

        // })
      ]),
      discountCharges: this.fb.array([this.createItem()])
    })

    this._invoiceService.getInvoices(this.type).subscribe({
      next: (res) => {
        console.log(res);
        this.invoiceList = res;
      }, error: () => { }, complete: () => {
        console.log("completed");
        this.setData();
      }
    })

  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }
  createItem() {
    return this.fb.group({
      discount: "",
      amount: ""

    });
  }
  removeRow(index: number) {
    console.log(index);
    (<FormArray>this.invoiceForm.get("discountCharges")).removeAt(index);
  }
  addItem(): void {
    this.discountcharge().push(this.createItem());

  }

  setData() {

    let selectedItem = this.invoiceList.find(item => item.id === this.id! + 1);

    console.log("particular value " + selectedItem?.to.name);
    // this.invoiceForm.setValue({
    //   // [this.iPARAMS.irn]: this.invoiceList[0].irn,
    // })

    this.invoiceForm.controls['irn'].patchValue(selectedItem?.irn);
    this.invoiceForm.controls['ackNo'].patchValue(selectedItem?.ackNo);
    this.invoiceForm.controls['ackDate'].patchValue(selectedItem?.ackDate);
    this.invoiceForm.controls['shippername'].patchValue(selectedItem?.to.name);
    this.invoiceForm.controls['shipperaddr'].patchValue(selectedItem?.to.addr);
    this.invoiceForm.controls['invoiceNo'].patchValue(selectedItem?.invoiceNo);
    this.invoiceForm.controls['datePicker'].patchValue(selectedItem?.invoiceDate);
    this.invoiceForm.controls['jobno'].patchValue(selectedItem?.jobNo);
    this.invoiceForm.controls['consignment'].patchValue(selectedItem?.consign);
    this.invoiceForm.controls['billOfLoadingNumber'].patchValue(selectedItem?.billNo);
    this.invoiceForm.controls['container'].patchValue(selectedItem?.container);
    this.invoiceForm.controls['salesman'].patchValue(selectedItem?.salesman);
    this.invoiceForm.controls['commodity'].patchValue(selectedItem?.commodity);
    this.invoiceForm.controls['weight'].patchValue(selectedItem?.packWeig);
    this.invoiceForm.controls['sbno'].patchValue(selectedItem?.sbNo);
    this.invoiceForm.controls['vessel'].patchValue(selectedItem?.vessel);
    this.invoiceForm.controls['exrate'].patchValue(selectedItem?.exRate);
    this.invoiceForm.controls['stuffing'].patchValue(selectedItem?.stuffPlace);
    this.invoiceForm.controls['beneficiaryBank'].patchValue(selectedItem?.beneficiary);
    this.invoiceForm.controls['placeIssue'].patchValue("Chennai");
    this.invoiceForm.controls['date1'].patchValue(selectedItem?.ackDate);
    this.invoiceForm.controls['status'].patchValue(selectedItem?.status);

    selectedItem?.products.map((products: any) => {
      const productForm = this.fb.group({
        [this.iPARAMS.sno]: products.sNo,
        [this.iPARAMS.particulars]: products.particulars,
        [this.iPARAMS.saccode]: products.sacCode,
        [this.iPARAMS.gst]: products.gst,
        [this.iPARAMS.qty]: products.quantity,
        [this.iPARAMS.rate]: (Math.round(products.rate * 100) / 100).toFixed(2),
        [this.iPARAMS.amount]: products.amount,
        [this.iPARAMS.cgstp]: products.cgstp,
        [this.iPARAMS.cgsta]: products.cgst,
        [this.iPARAMS.sgstp]: products.sgstp,
        [this.iPARAMS.sgsta]: products.sgst,
        [this.iPARAMS.igstp]: products.igstp,
        [this.iPARAMS.igsta]: products.igst,
        [this.iPARAMS.total]: (Math.round(products.totalp * 100) / 100).toFixed(2),
      });
      console.log("form " + productForm);
      this.userProducts().push(productForm);
    });
    this.invoiceForm.controls['amountt'].patchValue((Math.round(selectedItem!.taxV * 100) / 100).toFixed(2));
    this.invoiceForm.controls['cgstt'].patchValue((Math.round(selectedItem!.ctAmount * 100) / 100).toFixed(2));
    this.invoiceForm.controls['sac'].patchValue(selectedItem?.sac);
    this.invoiceForm.controls['ctRate'].patchValue(selectedItem?.ctRate);
    this.invoiceForm.controls['stRate'].patchValue(selectedItem?.stRate);
    this.invoiceForm.controls['itRate'].patchValue(selectedItem?.itRate);
    this.invoiceForm.controls['sgstt'].patchValue((Math.round(selectedItem!.stAmount * 100) / 100).toFixed(2));
    this.invoiceForm.controls['igstt'].patchValue((Math.round(selectedItem!.itAmount * 100) / 100).toFixed(2));
    this.invoiceForm.controls['grandTotal'].patchValue(selectedItem?.subTotal);
    this.invoiceForm.controls['gsttotal'].patchValue(selectedItem?.taxAmounnt);
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  userProducts(): FormArray {
    return this.invoiceForm
      .get('products') as FormArray;
  }
  discountcharge(): FormArray {
    return this.invoiceForm
      .get('discountCharges') as FormArray;
  }
  newProduct(): FormGroup {
    return this.fb.group({
      [this.iPARAMS.sno]: "",
      [this.iPARAMS.particulars]: "",
      [this.iPARAMS.saccode]: "",
      [this.iPARAMS.gst]: "",
      [this.iPARAMS.qty]: "",
      [this.iPARAMS.rate]: "",
      [this.iPARAMS.amount]: "",
      [this.iPARAMS.cgstp]: "",
      [this.iPARAMS.cgsta]: "",
      [this.iPARAMS.sgstp]: "",
      [this.iPARAMS.sgsta]: "",
      [this.iPARAMS.igstp]: "",
      [this.iPARAMS.igsta]: "",
      [this.iPARAMS.total]: "",
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
  amountCalculation() {

    this.invoiceForm.get("userProducts")?.valueChanges.subscribe(res => {
      let sum = 0;
      res.forEach((x: { iPARAMS: { amount: string | number; }; }) => {
        sum += (+x.iPARAMS.amount);

      })
      console.log("Total Amount" + sum);
    })


  }
  submitForm() {


    // console.log(this.invoiceForm.value);

    console.log("val " + this.invoiceForm)
  }
}

