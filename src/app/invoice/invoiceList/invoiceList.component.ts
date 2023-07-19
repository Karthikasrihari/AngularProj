import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InvoiceService } from '../services/invoice.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Invoice } from '../model/invoice';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { NzButtonSize } from 'ng-zorro-antd/button';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Margins, PageSize, StyleDictionary } from 'pdfmake/interfaces';
import { ToWords } from 'to-words';
import { IconUtils } from '../utils/IconUtils';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import csvJson from 'download_csv.json';
import { Csvfile } from '../model/csv';
import { Observable } from 'rxjs';
import { FileUploadServiceService } from '../services/FileUploadService.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
interface ItemData {
  id: number;
  invoiceNo: string;
  buyer: string;
  status: string;
  amount: number;
  owing: number;
  date: string;

}
export const M_PARAMS = {
  toEmails: 'toEmails',
  subject: 'subject',
  content: 'content',

}
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    }
  }
});
interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Invoice> | null;

  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-invoiceList',
  templateUrl: './invoiceList.component.html',
  styleUrls: ['./invoiceList.component.css']
})

export class InvoiceListComponent implements OnInit {

  validateForm!: FormGroup;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
  previewSign = '';

  imageInfos?: Observable<any>;

  isVisible = false;
  isConfirmLoading = false;
  searchKey = "";
  public validators = [IconUtils.validateEmail];
  public errorMessages = { invalidEmail: 'Not a valid email address' };
  csvData: Csvfile[] = [];
  public get config() {
    return IconUtils.getMailBodyEditorConfig();
  }
  @Input() type?: string;
  stampName = "";
  stampDate = "";
  signName = "";
  signDate = "";
  invoiceList: Invoice[] = [];
  current = 1;

  listOfData: readonly ItemData[] = [];
  data: ItemData[] = [];
  size: NzButtonSize = 'small';
  numberToWords = require('number-to-words');
  color: string | undefined;
  checked = false;
  isLoading = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();
  visible: boolean = false;
  visibleSend: boolean = false;

  M_PARAMS = M_PARAMS;
  mailForm!: FormGroup;
  isShowMail = false;
  constructor(private uploadService: FileUploadServiceService, public msg: NzMessageService, private fb: FormBuilder, private modal: NzModalService, private route: ActivatedRoute, private router: Router, private location: Location, private _invoiceService: InvoiceService) { }

  onSearch(): void {
    console.log("enter value " + this.searchKey);
    if (this.searchKey !== null) {
      this.listOfData = this.data.filter((item: ItemData) => { return item.invoiceNo.includes(this.searchKey); });
      console.log(this.listOfData);

    }
    else {
      console.log("in else" + this.searchKey);
      this.listOfData = this.listOfData;
    }

  }
  allFilter() {

    this.listOfData = this.data;
  }
  draftFilter() {

    this.listOfData = this.data.filter((item: ItemData) => item.status == "DRAFT");
  }
  invoiceFilter() {

  }
  paidFilter() {

    this.listOfData = this.data.filter((item: ItemData) => item.status == 'PAID');
  }
  partiallyFilter() {

    this.listOfData = this.data.filter((item: ItemData) => item.status == "PARTIALLY PAID");
  }

  showMail() {
    this.isShowMail = true;
  }
  onCancelMail(): void {
    this.isShowMail = false;
  }
  onSendMail(): void {
    this.isShowMail = false;
  }
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {

    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {

    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;

    if (this.setOfCheckedId.size == 1) {
      this.visible = true;
      this.visibleSend = false;
    }
    else if (this.setOfCheckedId.size >= 1) {
      this.visible = false;

      this.visibleSend = true;
    }
    else {
      this.visible = false;

      this.visibleSend = false;
    }

  }
  edit() {
    const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.id));
    this.editInvoice(requestData[0].id);
  }
  open() {
    const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.id));
    this.openInvoice(requestData[0].id);
  }
  download() {
    const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.id));
    this.downloadInvoice(requestData[0].id);
  }
  onBack(): void {
    this.listOfData = [];
    this.location.back();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      companyName: [null, [Validators.required]],
      registerNumber: [null, [Validators.required]],
      signName: [null, [Validators.required]],
      signDate: [null, [Validators.required]],

    }
    )

    this.imageInfos = this.uploadService.getFiles();
    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get('type')!;
    });

    this._invoiceService.getInvoices(this.type).subscribe({
      next: (res) => {
        console.log(res);
        this.invoiceList = res;

      }, error: () => { }, complete: () => {
        console.log("completed");
        this.setData();
      }

    })
    this.mailForm = this.fb.group({
      [M_PARAMS.toEmails]: [null, [Validators.required]],
      [M_PARAMS.subject]: [null, [Validators.required]],
      [M_PARAMS.content]: [null, [Validators.required]],
    });
  }
  setData() {

    // const data = [];

    for (let i = 0; i < this.invoiceList.length; i++) {
      this.data.push({
        id: i,
        invoiceNo: this.invoiceList[i].invoiceNo,
        buyer: this.invoiceList[i].consign,
        status: this.invoiceList[i].status,
        amount: this.invoiceList[i].subTotal,
        owing: 0.00,
        date: this.invoiceList[i].invoiceDate,

      });
    }
    this.listOfData = [...this.data];

  }

  editInvoice(item: any): void {

    this.router.navigate(['invoice'], { queryParams: { type: this.type, id: item } });
  }
  async openInvoice(id: any) {
    let selectedItem = this.getSelectedValue(id);
    const documentDefinition = this.getDocumentDefinition(selectedItem);
    pdfMake.createPdf(await documentDefinition).open();
  }
  async downloadInvoice(id: any) {
    let selectedItem = this.getSelectedValue(id);
    const documentDefinition = this.getDocumentDefinition(selectedItem);
    pdfMake.createPdf(await documentDefinition).download(`${this.type}_Invoice.pdf`, function () {
      console.log('pdf is done');
    });


  }
  async printInvoice(id: any) {

    console.log("print option")
    let selectedItem = this.getSelectedValue(id);
    const documentDefinition = this.getDocumentDefinition(selectedItem);
    pdfMake.createPdf(await documentDefinition).print();
  }



  getSelectedValue(id: any) {

    this._invoiceService.getInvoices(this.type).subscribe({
      next: (res) => {
        console.log(res);
        this.invoiceList = res;
      }, error: () => { }, complete: () => {
        console.log("completed");
        // this.setData();
      }
    })
    return this.invoiceList.find(item => item.id === id + 1);

  }

  async getDocumentDefinition(selectedItem: any) {

    return {

      pageSize: "A4" as PageSize,
      pageMargins: [15, 30, 30, 15] as Margins,
      watermark: { text: 'invoice', color: 'grey', opacity: 0.3, bold: false, italics: false },
      content: [

        {
          style: "tableExample",
          table: {
            widths: ["auto", "auto", "auto", "*"],
            body: [

              ["IRN", ":", selectedItem.irn, { rowSpan: 3, qr: "Invoice" + ', Type of Invoice : ' + this.type, fit: 70, alignment: 'right' }],
              ["Ack No.", ":", selectedItem.ackNo, ''],
              ["Ack Date", ":", selectedItem.ackDate, ''],


            ],

          },


          layout: "noBorders",
        },

        {
          style: "tableExample",

          table: {
            widths: ["*", "*"],
            body: [
              [
                {
                  columns: [
                    {
                      image: await this.getBase64ImageFromURL("../assets/images/ic_logo.png"),
                      width: 150,
                    },

                    [
                      {
                        text: "E-Ship Global Logistics - Mumbai",
                        style: "name",
                      },
                      {
                        text: "8TH, 804, Filix Condominium,Opp.Asian Paints, ",
                        style: "title",
                      },
                      {
                        text: "L.B.S.MargBhandup West, Mumbai City",
                        style: "title",
                      },
                      {
                        text: "GSTIN/UIN: 27AADFE0403G1Z2S",
                        style: "title",
                      },
                      {
                        text: "State Name : Maharashtra, Code : 27",
                        style: "title",
                      },

                    ],
                  ],

                  colSpan: 2,
                },
                {},
              ],

              [

                [

                  {

                    text: "To",
                  },
                  {
                    bold: true,
                    text: selectedItem.to.name,
                  },

                  {

                    text: selectedItem.to.addr,
                  },

                ],

                [
                  {
                    text: "Invoice No : " + selectedItem.invoiceNo,
                  },
                  {
                    text: "Invoice Date : " + selectedItem.invoiceDate,
                  },
                  {
                    text: "Job No. : " + selectedItem.jobNo,
                  },
                ],
              ],

              [
                {
                  columns: [
                    [
                      {
                        text: "CHARGES FOR CONSIGNMENT OF : " + selectedItem.consign,
                      },
                      {
                        text: "BILL OF LADING NO : " + selectedItem.billNo,
                      },
                      {
                        text: "INVOICE NO : " + selectedItem.invoiceNo,
                      },
                      {
                        text: "PAN NO : " + selectedItem.pan,
                      },
                      {
                        text: "CONTAINER : " + selectedItem.container,
                      },
                      {
                        text: "SALESMAN : " + selectedItem.salesman,
                      },
                    ],

                    [
                      {
                        text: "COMMODITY : " + selectedItem.commodity,
                      },
                      {
                        text: "PKT / WT : " + selectedItem.packWeig,
                      },
                      {
                        text: "SB. No. : " + selectedItem.sbNo,
                      },
                      {
                        text: "VESSEL : " + selectedItem.vessel,
                      },
                      {
                        text: "EX-RATE. : " + selectedItem.exrate,
                      },
                      {
                        text: "PLACE OF STUFFING : " + selectedItem.stuffPlace,
                      },
                    ],
                  ],
                  border: [1, 0, 1, 0],
                  colSpan: 2,
                },
                {
                },
              ],

              [
                {
                  columns: [

                    this.getProductDetails(selectedItem),
                  ],

                  colSpan: 2,
                },
                {},
              ],

              [
                {
                  columns: [
                    {
                      style: "tableExample",

                      table: {
                        widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],

                        body: [
                          [
                            {
                              text: "SAC Code",
                              style: "tableHeader",
                              alignment: "center",
                              rowSpan: 2,
                            },
                            {
                              text: "AMOUNT",
                              style: "tableHeader",
                              alignment: "center",
                              rowSpan: 2,
                            },
                            {
                              text: "CGST",
                              style: "tableHeader",
                              colSpan: 2,
                              alignment: "center",
                            },
                            {},
                            {
                              text: "SGST",
                              style: "tableHeader",
                              colSpan: 2,
                              alignment: "center",
                            },
                            {},
                            {
                              text: "IGST",
                              style: "tableHeader",
                              colSpan: 2,
                              alignment: "center",
                            },
                            {},
                            {
                              text: "TOTAL TAX AMOUNT",
                              style: "tableHeader",
                              alignment: "center",
                              rowSpan: 2,
                            },
                          ],
                          [
                            {},
                            {},
                            {
                              text: "%",
                              style: "tableHeader",
                              alignment: "center",
                            },
                            {
                              text: "AMOUNT",
                              style: "tableHeader",
                              alignment: "center",
                            },
                            {
                              text: "%",
                              style: "tableHeader",
                              alignment: "center",
                            },
                            {
                              text: "AMOUNT",
                              style: "tableHeader",
                              alignment: "center",
                            },
                            {
                              text: "%",
                              style: "tableHeader",
                              alignment: "center",
                            },
                            {
                              text: "AMOUNT",
                              style: "tableHeader",
                              alignment: "center",
                            },
                            {},
                          ],
                          [
                            { text: selectedItem.sac },
                            { text: selectedItem.taxV },
                            { text: selectedItem.ctRate },
                            { text: selectedItem.ctAmount },
                            { text: selectedItem.stRate },
                            { text: selectedItem.stAmount },
                            { text: selectedItem.itRate },
                            { text: selectedItem.itAmount },
                            { text: selectedItem.taxAmounnt },
                          ],
                          [
                            { text: "Total", bold: true, alignment: 'right', },
                            { text: selectedItem.taxV, bold: true },
                            { text: "" },
                            { text: selectedItem.ctAmount, bold: true },
                            { text: "" },
                            { text: selectedItem.stAmount, bold: true },
                            { text: "" },
                            { text: selectedItem.itAmount, bold: true },
                            { text: selectedItem.taxAmounnt, bold: true },
                          ],
                          [
                            {
                              colSpan: 9, bold: true,
                              fontSize: 8,
                              text: "Tax Amount (in words) :" + toWords.convert(selectedItem.taxAmounnt),
                            }, '', '', '', '', '', '', '', '',
                          ],
                        ],
                      },
                    },
                  ],

                  colSpan: 2,
                },
                {},
              ],

              [
                {
                  columns: [
                    [
                      {
                        text:
                          "Bank Details for NEFT / RTGS :",
                        margin: [0, 10],
                        decoration: 'underline',
                      },
                      {
                        text:
                          "Beneficiary Name : " +
                          selectedItem.beneficiary.name,
                      },
                      {
                        text: "Bank Name : " + selectedItem.beneficiary.bank,
                      },
                      {
                        text: "Branch : " + selectedItem.beneficiary.branch,
                      },
                      {
                        text: "A/c.No : " + selectedItem.beneficiary.account,
                      },
                      {
                        text: "IFSC : " + selectedItem.beneficiary.ifsc,
                      },
                      {
                        text: "PAN NO. : " + selectedItem.beneficiary.pan,
                      },
                    ],

                    [
                      {
                        text: "NOTES : : ",
                      },
                      {
                        text: "This bill shall presumed to be correct unless otherwise clarification/correction, if any, is sought/intimated to us within Ten(10) days of its presentation.Payment to be made by Crossed Cheque / Demand Draft / Pay Order only, in favour of E-SHIP GLOBAL LOGISTICS ,Payable at Chennai",
                      },
                      {
                        text: "E-Ship Global Logistics - Mumbai",
                        style: "signStyle",
                      },
                      {
                        text: "(AUTHORISED SIGNATORY)",
                        style: "signStyle",
                      },
                    ],
                  ],

                  colSpan: 2,
                },
                {},
              ],
              [
                {
                  columns: [
                    [
                      {
                        text:
                          "Registered off address :",
                      },
                      {
                        text: "Branches :",
                      },
                      {
                        text: "Our Liability is restricted to chennai Jurisdiction and Standard Trading Conditions of the Federation of the Freight forwarders Association in indiaR",
                      },

                    ],
                  ],

                  colSpan: 2,
                },
                {},
              ],
            ],
          },
        },
      ],
      info: {
        title: `${this.type}_Invoice.pdf`,
        author: `${this.type}_Invoice.pdf`,
        subject: 'Invoices',
        keywords: 'Invoices, Online Invoices',
      },
      styles: {
        header: {
          fontSize: 8,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        signStyle:
        {
          margin: [20, 20, 20, 20],
        },
        subheader: {
          fontSize: 8,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          fontSize: 8,
          margin: [0, 0, 0, 0],
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: "black",
          fillColor: "#eeeeee",
        },
        name: {
          fontSize: 8,
          bold: true,
          margin: [150, 0, 0, 0],
        },
        title: {
          fontSize: 8,
          bold: false,

          margin: [150, 0, 0, 0],
        },
      } as StyleDictionary,
    };

  }
  listOfColumns: ColumnItem[] = [

    {
      name: 'Invoice Date',
      sortOrder: null,
      sortFn: (a: Invoice, b: Invoice) => new Date(a.invoiceDate).valueOf() - new Date(b.invoiceDate).valueOf(),
      sortDirections: ['ascend', 'descend', null],

    }

  ];

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  getProductDetails(selectedItem: any) {
    let amount = selectedItem.subTotal;

    let words = toWords.convert(amount);
    return {
      table: {
        widths: [
          "auto",
          "*",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
        ],
        body: [
          [
            {
              text: "S.no",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
            },
            {
              text: "particulars",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
            },
            {
              text: "SAC Code",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
            },
            {
              text: "GST %",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
            },
            {
              text: "QTY",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
            },
            {
              text: "RATE",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
            },
            {
              text: "AMOUNT",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
            },
            {
              text: "CGST",
              style: "tableHeader",
              colSpan: 2,
              alignment: "center",
            },
            {},
            {
              text: "SGST",
              style: "tableHeader",
              colSpan: 2,
              alignment: "center",
            },
            {},
            {
              text: "IGST",
              style: "tableHeader",
              colSpan: 2,
              alignment: "center",
            },
            {},
            {
              text: "TOTAL AMOUNT",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
            },
          ],
          [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {
              text: "%",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "AMOUNT",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "%",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "AMOUNT",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "%",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "AMOUNT",
              style: "tableHeader",
              alignment: "center",
            },
            {},
          ],
          ...selectedItem.products.map((products: any) => {
            return [
              { text: products.sNo },
              { text: products.particulars },
              { text: products.sacCode },
              { text: products.gst },
              { text: products.quantity },
              { text: products.rate },
              { text: products.amount },
              { text: products.cgstp },
              { text: products.cgst },
              { text: products.sgstp },
              { text: products.sgst },
              { text: products.igstp },
              { text: products.igst },
              { text: products.totalp },
            ];
          }),
          [
            {},
            {
              text: 'Sub Total', bold: true,
              fontSize: 8,
            },
            {},
            {},
            {},
            {},
            { text: selectedItem.taxV, bold: true },
            { colSpan: 2, text: selectedItem.ctAmount, bold: true }, '',
            { colSpan: 2, text: selectedItem.stAmount, bold: true }, '',
            { colSpan: 2, text: selectedItem.itAmount, bold: true }, '',
            {},
          ],
          [
            {},
            {
              colSpan: 12, bold: true,
              fontSize: 10, text: 'Grand Total'
            }, '', '', '', '', '', '', '', '', '', '', '',
            { text: selectedItem.subTotal, bold: true, fontSize: 10 },
          ],
          [
            {
              colSpan: 14, bold: true,
              fontSize: 8,
              text: words,
            }, '', '', '', '', '', '', '', '', '', '', '', '', '',
          ],
        ],
      },


    }
  }

  downloadCsv() {
    this.csvData = csvJson;
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Invoice',
      useBom: true,
      noDownload: false,
      headers: ["LNO,Inv. # for Line", "Order Number", "Product Code", "Classification Lookup Code", "Tariff", "Invoice Qty", "UQ", "Customs Qty", "Cust. UQ", "Price", "Volume", "UQ", "Goods Description", "Attribute", "Custom Text 1", "Net Weight", "Net Wgt. UQ", "ORG", "Bond", "Adjustment Dollar Percent", "Suppress Quarantine Container Link"
      ],
      useHeader: false,
      nullToEmptyString: true,
    };
    new AngularCsv(this.csvData, 'Invoice', options);
  }


  companyStamp() {
    this.isVisible = true;
  }


  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
    this.preview = '';
    this.previewSign = '';
  }

  handleCancel(): void {
    this.preview = '';
    this.previewSign = '';
    this.isVisible = false;
  }


  selectFile(event: any): void {
    this.message = '';
    this.preview = '';

    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  selectSign(event: any): void {
    this.message = '';
    this.previewSign = '';

    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.previewSign = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previewSign = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }
  submitForm() {


    // console.log(this.invoiceForm.value);


  }

  displayName() {

    // console.log("typed name "+value);
    this.stampName = this.validateForm.get("signName")?.value;
  }
  displayDate() {
    this.stampDate = this.validateForm.get("signDate")?.value;
  }
}



