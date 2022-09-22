import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EnterpriseApiService } from '@services/enterprise-api.service'
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
var moment = require('moment');

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {


  page: number = 1;
  itemsPerPage: number = 8;
  totalCount: number;
  corporateCount : number;
  ticketData: any;
  showTicketModal: boolean;

  visitorsList: any;
  patientList: any = [];
  regionList: any = [];
  branchList: any = [];
  deptList: any = [];
  searchDatas: any;
  attachments: any;
  totalRecords: any;

  initValues = {
    title: 'Corporate Deck',
    formDetails: [
      {
        label: 'ARN Number',
        controlName: 'arn',
        type: 'select',
        list:[
          {
            key: 'Corporate_Deck',
            value: 'Corporate_Deck'
          },
          {
            key: 'arn-909090',
            value: 'arn-909090'
          }
        ]
      },
      {
        label: 'File Name',
        controlName: 'file',
        type: 'select',
        list:[
          {
            key: 'lalit maharshi',
            value: 'lalit maharshi'
          },
          {
            key: 'Amit Teckchandani',
            value: 'Amit Teckchandani'
          }
        ]
      },
    ],
    header: ['SNo', "Created Date", 'Mobile Number', "Profile Name","ARN Number",  "Corporate Deck_File"], // table headers
  }
  customListDatas: {};

  constructor(
    private enterpriseService: EnterpriseApiService,
    private toasterService: ToasterService,
    private utilityService: UtilityService 
  ) {
    // this.getAppointmentPatientList();
  }

  ngOnInit(): void {    
    
    this.getAppointmentList();    
  }

  async getAppointmentPatientList() {
    const params = {
    }

    console.log('params', params);

    const visitors: any = await this.enterpriseService.getAppointmentPatientId(params);

    console.log('Visitors', visitors)

    const appiyoError = visitors?.Error;
    if (appiyoError == '0') {

      const processVariables = visitors['ProcessVariables']
      
      this.regionList = processVariables['regionList'] || [];
      this.branchList = processVariables['branchList'] || [];
      this.deptList = processVariables['deptList'] || [];
      // console.log('test', this.patientList[0].label)
      // this.changeDetectorRef.detectChanges(); 

      
    } else {
      this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'patient id list error' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
    }
  }

  async getAppointmentList(searchData?) {
    const params = {
      currentPage: this.page || 1,
      perPage: this.itemsPerPage || 10,
      // isApplyFilter: false,
      isCSVDownload: true,
      ...searchData
    }

    
   
      
    console.log('params', params);

    const visitors: any = await this.enterpriseService.getAppointmentList(params);

    console.log('Visitors', visitors)

    const appiyoError = visitors?.Error;
    const apiErrorCode = visitors.ProcessVariables?.errorCode;
    const errorMessage = visitors.ProcessVariables?.errorMessage;

    if (appiyoError == '0' && apiErrorCode == "200") {
      const processVariables = visitors['ProcessVariables']
      this.itemsPerPage = processVariables['perPage'];
      let totalPages = processVariables['totalPages'];
      this.totalCount = Number(this.itemsPerPage) * Number(totalPages);
      // this.corporateCount = Number(this.itemsPerPage) * Number(totalPages);
      this.corporateCount = 80000;
      this.totalRecords = processVariables?.totalItems;
      this.visitorsList = [
        
        {
          "SNo": "1",
                "arn_number" : "arn-909090",
                "created_at" : "2022-09-15T11:47:28Z",
                "digital_factsheet" : "-",
                "id" : "913",
                "latest_product_info" : "Product_Deck | One_Pagers",
                "market_updates" : "-",
                "marketing_material" : "Product_Info | Product_Info",
                "mobile_number" : "+918055191660",
                "one_pager" : "Equity",
                "product_notes" : "-",
                "profile_name" : "lalit maharshi",
                "corporate_deck_file_name": "pdf",
                "updated_at" : "2022-09-15T11:54:55Z",
                "url" : "MMMF_Product_Deck_July_2022.pdf | One_pager_MMMF_Flexi_cap_July_2022.pdf"
             },
             {
          "SNo": "2",
                "arn_number" : "arn-123456789",
                "created_at" : "2022-09-15T11:23:23Z",
                "digital_factsheet" : "-",
                "id" : "912",
                "latest_product_info" : "-",
                "market_updates" : "-",
                "marketing_material" : "-",
                "mobile_number" : "+919025347318",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "corporate_deck_file_name": "pdf",
                "updated_at" : "2022-09-15T11:32:57Z",
                "url" : "-"
             },
             {
          "SNo": "3",
                "arn_number" : "-",
                "created_at" : "2022-09-14T16:27:55Z",
                "digital_factsheet" : "-",
                "id" : "911",
                "latest_product_info" : "-",
                "market_updates" : "-",
                "marketing_material" : "-",
                "mobile_number" : "+918226096969",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "corporate_deck_file_name": "pdf",
                "updated_at" : "2022-09-14T16:27:55Z",
                "url" : "-"
             },
             {
          "SNo": "4",
                "arn_number" : "151515",
                "created_at" : "2022-09-13T14:24:02Z",
                "digital_factsheet" : "-",
                "id" : "910",
                "latest_product_info" : "One_Pagers",
                "market_updates" : "-",
                "marketing_material" : "Product_Info",
                "mobile_number" : "+919836233352",
                "one_pager" : "Equity",
                "product_notes" : "-",
                "profile_name" : "Amit Teckchandani",
                "corporate_deck_file_name": "pdf",
                "updated_at" : "2022-09-13T14:25:27Z",
                "url" : "One_Pager_MMMF_Kar_Bachat__Yojana_July_2022.pdf"
             },
             {
          "SNo": "5",
                "arn_number" : "151515",
                "created_at" : "2022-09-13T14:06:40Z",
                "digital_factsheet" : "-",
                "id" : "909",
                "latest_product_info" : "One_Pagers",
                "market_updates" : "-",
                "marketing_material" : "Product_Info",
                "mobile_number" : "+919836233352",
                "one_pager" : "Equity",
                "product_notes" : "-",
                "profile_name" : "Amit Teckchandani",
                "corporate_deck_file_name": "pdf",
                "updated_at" : "2022-09-13T14:07:42Z",
                "url" : "One_pager_MMMF_Unnati_Yojana_July_2022.pdf | One_pager_MMMF_Flexi_cap_July_2022.pdf"
             },
             {
          "SNo": "6",
                "arn_number" : "-",
                "created_at" : "2022-09-13T13:48:58Z",
                "digital_factsheet" : "-",
                "id" : "908",
                "latest_product_info" : "-",
                "market_updates" : "-",
                "marketing_material" : "-",
                "mobile_number" : "+919836233352",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "corporate_deck_file_name": "pdf",
                "updated_at" : "2022-09-13T13:48:58Z",
                "url" : "-"
             },
         {
          "SNo": "7",
                "arn_number" : "39164",
                "created_at" : "2022-09-15T17:01:15Z",
                "digital_factsheet" : "-",
                "id" : "914",
                "latest_product_info" : "-",
                "market_updates" : "-",
                "marketing_material" : "-",
                "mobile_number" : "+919768053120",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "corporate_deck_file_name": "pdf",
                "updated_at" : "2022-09-15T17:02:52Z",
                "url" : "-"
             },
         {
          "SNo": "8",
                "arn_number" : "Hybrid",
                "created_at" : "2022-09-16T10:22:24Z",
                "digital_factsheet" : "-",
                "id" : "916",
                "latest_product_info" : "-",
                "market_updates" : "-",
                "marketing_material" : "-",
                "mobile_number" : "+919833667644",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "corporate_deck_file_name": "pdf",
                "updated_at" : "2022-09-16T10:23:15Z",
                "url" : "-"
             }
      ];
      
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        // corporateCount: this.corporateCount,
        totalRecords: this.totalRecords,
        data: this.visitorsList,
        appointment : true,
        keys: ['SNo', "created_at", 'mobile_number',  "profile_name",'arn_number',"corporate_deck_file_name"],  // To get the data from key
      }

    } else {
      this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'Appointment list error' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
    }
  }


  async onDownloadCsv(event) {
    var params;
    if (!event.fromDate && !event.toDate) {
      params = {
        fromDate: moment().format("YYYY-MM-DD"),
        toDate: moment().format("YYYY-MM-DD"),
        // isApplyFilter: false,
        isCSVDownload: true,
        ...event
      }
    }
    else {
      params = {

        // isApplyFilter: false,
        isCSVDownload: true,
        ...event
      }
      
    }

    console.log('params', params);

    const visitors: any = await this.enterpriseService.appointmentCsvDownload(params);

    console.log('Visitors', visitors)

    const appiyoError = visitors?.Error;
    const apiErrorCode = visitors.ProcessVariables?.errorCode;
    const errorMessage = visitors.ProcessVariables?.errorMessage;

    if (appiyoError == '0' && apiErrorCode == "200") {

      const processVariables = visitors['ProcessVariables']

      this.attachments = processVariables?.attachment;
      this.utilityService.onDownloadCsv(this.attachments);


    } else {
      this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'Download error' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
    }
  }




  async pageChangeEvent(event) {
    console.log(event)
    this.page = event.pageIndex;
    this.searchDatas = event.searchDatas
    this.getAppointmentList(this.searchDatas)
  }


  applyAndClear(event?) {
    //this.isApplyClicked = true;
    this.searchDatas = event.searchDatas;
    this.page = event.pageIndex;
    this.getAppointmentList(this.searchDatas)
  }


}
