import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EnterpriseApiService } from '@services/enterprise-api.service'
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
var moment = require('moment');
@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {


  page: number = 1;
  itemsPerPage: number = 8;
  totalCount: number;
  ticketData: any;
  showTicketModal: boolean;

  visitorsList: any;
  searchDatas: any;
  attachments: any;
  totalRecords: any;

  initValues = {
    title: 'OnePager Report',
    formDetails: [
      // {
      //   label: 'Mobile Number',
      //   controlName: 'mobileNumber',
      //   type: 'input'
      // },
      {
        // label: 'Waba Number',
        // controlName: 'waba_no',
        // type: 'input'
        label: 'One Pager',
        controlName: 'info',
        type: 'select',
        list:[
          {
            key: 'Equity',
            value: 'Equity'
          },
          {
            key: 'Hybrid',
            value: 'Hybrid'
          },
          {
            key: 'Debt',
            value: 'Debt'
          },
        
        ]
      },
      // {
      //   label: 'Name',
      //   controlName: 'userName',
      //   type: 'input'
      // }
    ],
    header: ['SNo', "Created Date","Mobile Number","Profile Name","ARN Number","Product Info","Branch","Product Type","File name"], // table headers
  }
  customListDatas: {};
  appointmentRating: any;
  totalAppointment: any;
  totalVisitors: any;

  constructor(
    private enterpriseService: EnterpriseApiService,
    private toasterService: ToasterService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.getAppointmentConversationList()
  }

  async getAppointmentConversationList(searchData?) {
    const params = {
      currentPage: this.page || 1,
      perPage: this.itemsPerPage || 10,
      isApplyFilter: false,
      isCSVDownload: true,
      ...searchData
    }

    console.log('params', params);
    if (!params.fromDate && !params.toDate && !params.waba_no) {
      params.fromDate = moment().format("YYYY-MM-DD"),
      params.toDate = moment().format("YYYY-MM-DD")
    }

    const visitors: any = await this.enterpriseService.getConversationList(params);

    console.log('Visitors', visitors)

    const appiyoError = visitors?.Error;
    const apiErrorCode = visitors.ProcessVariables?.errorCode;
    const errorMessage = visitors.ProcessVariables?.errorMessage;

    if (appiyoError == '0' && apiErrorCode == "200") {

      const processVariables = visitors['ProcessVariables']
      this.itemsPerPage = processVariables['perPage'];
      let totalPages = processVariables['totalPages'];
      this.totalCount = Number(this.itemsPerPage) * Number(totalPages);
      this.totalRecords = processVariables?.totalItems;
      this.totalVisitors = processVariables?.totalCount;
      this.totalAppointment = processVariables?.totalAppointment;
      this.appointmentRating = processVariables?.appointmentRating;
      // this.visitorsList = processVariables['appointmentConversionList'] || [];
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
                "product_info":"onepager",
                "product_type":"Multi Cap Badhat Yojana - PDF",
                "branch": "Equity",
                "url" : "MMMF_Product_Deck_July_2022.pdf | One_pager_MMMF_Flexi_cap_July_2022.pdf"
             },
             {
          "SNo": "2",
                "arn_number" : "Corporate_Deck",
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
                "product_info":"onepager",
                "product_type":"Large Cap Pragati Yojana-PDF",
                "branch": "Equity",
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
                "product_info":"onepager",
                "product_type":"Equity Savings Yojana",
                "branch": "Hybrid",
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
                "product_info":"onepager",
                "product_type":"Focused Equity Yojana-PDF",
                "branch": "Equity",
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
                "product_info":"onepager",
                "product_type":"Equity Savings Yojana",
                "branch": "Hybrid",
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
                "product_info":"onepager",
                "product_type":"Equity Savings Yojana",
                "branch": "Hybrid",
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
                "product_info":"onepager",
                "product_type":"-",
                "branch": "Debt",
                "url" : "-"
             },
         {
          "SNo": "8",
                "arn_number" : "arn-123456",
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
                "product_info":"onepager",
                "product_type":"-",
                "branch": "Debt",
                "url" : "-"
             }
      ];

      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        totalRecords: this.totalRecords,
        totalVisitors: this.totalVisitors,
        totalAppointment: this.totalAppointment,
        appointmentRating: this.appointmentRating,
        conversion : true,
        appointment : false,
        data: this.visitorsList,
        // keys: ['SNo', "createdDate", "createdTime", 'mobileNumber', "waba_no", "isVisitorORBookedUser"],  // To get the data from key
        keys: ['SNo', "created_at", 'mobile_number','profile_name', 'arn_number', "product_info","branch","product_type","corporate_deck_file_name"],  // To get the data from key
      }

    } else {
      this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'Appointment conversion list' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
    }
  }


  async onDownloadCsv(event) {

    var params;
    if (!event.fromDate && !event.toDate) {
      params = {
        fromDate: moment().format("YYYY-MM-DD"),
        toDate: moment().format("YYYY-MM-DD"),
        isApplyFilter: false,
        isCSVDownload: true,
        ...event
      }
    }
    else {
      params = {

        isApplyFilter: false,
        isCSVDownload: true,
        ...event
      }
      
    }

    console.log('params', params);

    const visitors: any = await this.enterpriseService.conversationCsvDownload(params);

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
    this.getAppointmentConversationList(this.searchDatas)
  }


  applyAndClear(event?) {
    //this.isApplyClicked = true;
    this.searchDatas = event.searchDatas;
    this.page = event.pageIndex;
    this.getAppointmentConversationList(this.searchDatas)
  }

}
