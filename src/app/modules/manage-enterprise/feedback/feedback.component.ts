import { Component, OnInit} from '@angular/core';
import { EnterpriseApiService } from '@services/enterprise-api.service'
import { ToasterService } from '@services/toaster.service';
import { DatePipe } from '@angular/common'
import { FormGroup, FormControl } from '@angular/forms';
import { DateRangeService } from '@services/date-range.service';
var moment = require('moment');

import { DaterangepickerComponent } from 'ng2-daterangepicker';
import { UtilityService } from '@services/utility.service';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  page: number = 1;
  itemsPerPage: number = 8;
  totalCount: number;
  searchFromDate: any;
  searchToDate: any;
  
  feedbackList: any;
  searchDatas: any;
  
  attachments: any;
  totalRecords: any;
  initValues = {
    title: 'Market Updates',
    formDetails: [
      {
        label: 'ARN Number',
        controlName: 'arn',
        type: 'select',
        list:[
          {
            key: 'arn-345678909876543',
            value: 'arn-345678909876543'
          },
          {
            key: 'arn-909090',
            value: 'arn-909090'
          }
        ]
      },
      {
        label: 'Market Updates',
        controlName: 'mu',
        type: 'select',
        list:[
          {
            key: 'Aaj ka Bazaar',
            value: 'Aaj ka Bazaar'
          },
          {
            key: 'Fund manager videos',
            value: 'Fund manager videos'
          },
          {
            key: 'Monthly market snapshot',
            value: 'Monthly market snapshot'
          },
          {
            key: 'Monthly samvaad',
            value: 'Monthly samvaad'
          },
          {
            key: 'Debt market update',
            value: 'Debt market update'
          },
          {
            key: 'Weekly market snapshot',
            value: 'Weekly market snapshot'
          },
          {
            key: 'Market update video',
            value: 'Market update video'
          }
        ]
      },
      {
        label: 'File Name',
        controlName: 'file',
        type: 'select',
        list:[
          {
            key: 'MMMF_Flexi_cap_July_2022.pdf',
            value: 'MMMF_Flexi_cap_July_2022.pdf'
          },
          {
            key: 'MMMF_Product_July_2022.pdf',
            value: 'MMMF_Product_July_2022.pdf'
          }
        ]
      },
   
    ],
    header: ['SNo', "Created Date","Mobile Number","ARN Number","Profile Name","Market Updates","File Name","File Download"], 
  }

  customListDatas = {};
  feedbackValue: boolean;
  greatCount: any;
  goodCount: any;
  okCount: any;
  badCount: any;

  constructor(
    private enterpriseService: EnterpriseApiService,
    private toasterService: ToasterService,
    private dateService: DateRangeService,
    private utilityService: UtilityService
  ) {}


  ngOnInit(): void {

    this.getFeedBackList()
  }

  async getFeedBackList(data?) {
    const params = {
      currentPage: this.page || 1,
      perPage: this.itemsPerPage || 10,
      isCSVDownload: true,
      ...data
    }

    console.log('params', params)
    const feedback: any = await this.enterpriseService.getFeedbackList(params);

    console.log('feedback', feedback)
    const appiyoError = feedback?.Error;
    const apiErrorCode = feedback.ProcessVariables?.errorCode;
    const errorMessage = feedback.ProcessVariables?.errorMessage;
    
    if (appiyoError == '0' && apiErrorCode == "200") {
     
      const processVariables = feedback['ProcessVariables']
      this.attachments= processVariables?.attachment

      this.itemsPerPage = processVariables['perPage'];
      let totalPages = processVariables['totalPages'];

      this.totalCount = processVariables?.totalCount;
      this.feedbackList = [
        
        {
          "SNo": "1",
                "arn_number" : "arn-909090",
                "created_at" : "2022-09-15T11:47:28Z",
                "digital_factsheet" : "-",
                "id" : "913",
                "latest_product_info" : "Product_Deck | One_Pagers",
                "market_updates" : "url",
                "marketing_material" : "Product_Info | Product_Info",
                "mobile_number" : "+918055191660",
                "one_pager" : "Equity",
                "product_notes" : "-",
                "profile_name" : "lalit maharshi",
                "Corporate Deck_File": "MMMF_Flexi_cap_July_2022.pdf",
                "updated_at" : "2022-09-15T11:54:55Z",
                "update":"Aaj ka Bazaar",
                "file_download":"YES/NO",
                "url" : "MMMF_Product_Deck_July_2022.pdf"
             },
             {
          "SNo": "2",
                "arn_number" : "arn-23456",
                "created_at" : "2022-09-15T11:23:23Z",
                "digital_factsheet" : "-",
                "id" : "912",
                "latest_product_info" : "-",
                "market_updates" : "url",
                "marketing_material" : "-",
                "mobile_number" : "+919025347318",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "update":"Fund manager videos",
                "Corporate Deck_File": "MMMF_Flexi_cap_July_2022.pdf",
                "updated_at" : "2022-09-15T11:32:57Z",
                "file_download":"YES/NO",
                "url" : "-"
             },
             {
          "SNo": "3",
                "arn_number" : "-",
                "created_at" : "2022-09-14T16:27:55Z",
                "digital_factsheet" : "-",
                "id" : "911",
                "latest_product_info" : "-",
                "market_updates" : "url",
                "marketing_material" : "-",
                "mobile_number" : "+918226096969",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "Corporate Deck_File": "MMMF_Flexi_cap_July_2022.pdf",
                "updated_at" : "2022-09-14T16:27:55Z",
                "update":"Monthly samvaad",
                "file_download":"YES/NO",
                "url" : "-"
             },
             {
          "SNo": "4",
                "arn_number" : "151515",
                "created_at" : "2022-09-13T14:24:02Z",
                "digital_factsheet" : "-",
                "id" : "910",
                "latest_product_info" : "One_Pagers",
                "market_updates" : "url",
                "marketing_material" : "Product_Info",
                "mobile_number" : "+919836233352",
                "one_pager" : "Equity",
                "product_notes" : "-",
                "profile_name" : "Amit Teckchandani",
                "Corporate Deck_File": "MMMF_Product_July_2022.pdf",
                "updated_at" : "2022-09-13T14:25:27Z",
                "update":"Monthly samvaad",
                "url" : "MMMF_Kar_Bachat__Yojana_July_2022.pdf",
                "file_download":"YES/NO",
             },
             {
          "SNo": "5",
                "arn_number" : "151515",
                "created_at" : "2022-09-13T14:06:40Z",
                "digital_factsheet" : "-",
                "id" : "909",
                "latest_product_info" : "One_Pagers",
                "market_updates" : "url",
                "marketing_material" : "Product_Info",
                "mobile_number" : "+919836233352",
                "one_pager" : "Equity",
                "product_notes" : "-",
                "profile_name" : "Amit Teckchandani",
                "Corporate Deck_File": "MMMF_Product_July_2022.pdf",
                "updated_at" : "2022-09-13T14:07:42Z",
                "update":"Weekly market snapshot",
                "url" : "MMMF_Unnati_Yojana_July_2022.pdf ",
                "file_download":"YES/NO",
             },
             {
          "SNo": "6",
                "arn_number" : "-",
                "created_at" : "2022-09-13T13:48:58Z",
                "digital_factsheet" : "-",
                "id" : "908",
                "latest_product_info" : "-",
                "market_updates" : "url",
                "marketing_material" : "-",
                "mobile_number" : "+919836233352",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "update":"Weekly market snapshot",
                "Corporate Deck_File": "MMMF_Product_Deck_July_2022.pdf",
                "updated_at" : "2022-09-13T13:48:58Z",
                "file_download":"YES/NO",
                "url" : "-"
             },
         {
          "SNo": "7",
                "arn_number" : "39164",
                "created_at" : "2022-09-15T17:01:15Z",
                "digital_factsheet" : "-",
                "id" : "914",
                "latest_product_info" : "-",
                "market_updates" : "url",
                "marketing_material" : "-",
                "mobile_number" : "+919768053120",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "update":"Market update video",
                "Corporate Deck_File": "MMMF_Flexi_cap_July_2022.pdf",
                "updated_at" : "2022-09-15T17:02:52Z",
                "file_download":"YES/NO",
                "url" : "-"
             },
         {
          "SNo": "8",
                "arn_number" : "arn-123456",
                "created_at" : "2022-09-16T10:22:24Z",
                "digital_factsheet" : "-",
                "id" : "916",
                "latest_product_info" : "-",
                "market_updates" : "url",
                "update":"Market update video",
                "marketing_material" : "-",
                "mobile_number" : "+919833667644",
                "one_pager" : "-",
                "product_notes" : "-",
                "profile_name" : "-",
                "Corporate Deck_File": "MMMF_Product_July_2022.pdf",
                "updated_at" : "2022-09-16T10:23:15Z",
                "file_download":"YES/NO",
                "url" : "-"
             }
      ];
      this.totalRecords = processVariables?.totalCount;
      this.feedbackValue = true;
      this.greatCount = processVariables.greatCount;
      this.goodCount = processVariables.goodCount;
      this.okCount = processVariables.okCount;
      this.badCount = processVariables.badCount;
      this.customListDatas = {
        feedbackValue : this.feedbackValue,
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        totalRecords: this.totalRecords,
        data: this.feedbackList,
        appointment : true,
        feedback: true,
        greatCount: params.rating == 'Great' || !params.rating ? this.greatCount : 0,
        goodCount : params.rating == 'Good' || !params.rating ? this.goodCount : 0,
        okCount : params.rating == 'Ok' || !params.rating ? this.okCount : 0,
        badCount : params.rating == 'Bad' || !params.rating ? this.badCount : 0,
        keys: ['SNo', "created_at",'mobile_number','arn_number','profile_name','update',"Corporate Deck_File",'file_download'],
        //Table header length should be equal to keys
      }
      console.log(this.customListDatas)
      console.log(this.customListDatas['keys'])
      console.log('values' + this.customListDatas['keys'].data)

    } else {
      this.toasterService.showError(feedback['ProcessVariables']?.errorMessage == undefined ? 'Feedback list' : feedback['ProcessVariables']?.errorMessage, 'Feedback')
    }
  }

  async onDownloadCsv(event) {
    var params;
    if (!event.fromDate && !event.toDate) {
      params = {
        fromDate: moment().format("YYYY-MM-DD"),
        toDate: moment().format("YYYY-MM-DD"),
        isCSVDownload: true,
        isApplyFilter: true,
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

    console.log('params', params)
    const feedback: any = await this.enterpriseService.feedbackCsvDownload(params);

    console.log('feedback', feedback)
    const appiyoError = feedback?.Error;
    const apiErrorCode = feedback.ProcessVariables?.errorCode;
    const errorMessage = feedback.ProcessVariables?.errorMessage;
    
    if (appiyoError == '0' && apiErrorCode == "200") {
     
      const processVariables = feedback['ProcessVariables']
      this.attachments= processVariables?.attachment
      this.utilityService.onDownloadCsv(this.attachments);
     

    } else {
      
      this.toasterService.showError(feedback['ProcessVariables']?.errorMessage == undefined ? 'Feedback download error' : feedback['ProcessVariables']?.errorMessage, 'Feedback')
    }
  }


  async pageChangeEvent(event) {
    this.page = event.pageIndex;
    this.searchDatas = event.searchDatas
    this.getFeedBackList(this.searchDatas)
  }



  applyAndClear(event) {
    this.page = event.pageIndex;
    this.searchDatas = event.searchDatas
   this.getFeedBackList(this.searchDatas)
   
  }




}
