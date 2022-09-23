import { Component, OnInit} from '@angular/core';
import { MarketUpdateService } from '@services/market-update.service'
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
    header: ['SNo', "Created Date","Mobile Number","Profile Name","ARN Number","Market Updates","File Name","File Download"], 
  }

  customListDatas = {};
  feedbackValue: boolean;
  greatCount: any;
  goodCount: any;
  okCount: any;
  badCount: any;

  constructor(
    private enterpriseService: MarketUpdateService,
    private toasterService: ToasterService,
    private dateService: DateRangeService,
    private utilityService: UtilityService
  ) {}


  ngOnInit(): void {

    this.getFeedBackList()
  }

  async getFeedBackList(searchData?) {
    const params = {
      current_page: this.page || 1,
      per_page: this.itemsPerPage || 10,
      // isApplyFilter: false,
      isCSVDownload: true,
      ...searchData
    }

    console.log('params', params);
    this.enterpriseService.marketList(params).subscribe(visitors => {
      console.log('Visitors', visitors)

      const appiyoError = visitors?.Error;
    const apiErrorCode = visitors.ProcessVariables?.errorCode;
    const errorMessage = visitors.ProcessVariables?.errorMessage;

    if (appiyoError == '0') {
      const processVariables = visitors['ProcessVariables']
      this.itemsPerPage = processVariables['per_page'];
      let totalPages = processVariables['total_pages'];
      this.totalCount = Number(this.itemsPerPage) * Number(totalPages);
      // this.corporateCount = Number(this.itemsPerPage) * Number(totalPages);
      // this.corporateCount = 80000;
      this.totalRecords = processVariables?.count;
      this.feedbackList = processVariables.output_data;

      for(var i=0; i<processVariables.output_data.length; i++) {
        this.feedbackList[i].SNo=i+1;
        this.feedbackList[i].file_download='Yes';
      }
     
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        // corporateCount: this.corporateCount,
        totalRecords: this.totalRecords,
        marketUpdateCount : 5, //api needed
        data: this.feedbackList,
        appointment : true,
        keys: ['SNo', "created_at",'mobile_number','profile_name','arn_number','folder_name',"url",'file_download'],
      }

    } else {
      this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'Appointment list error' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
    }
    })
   
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

    this.enterpriseService.marketCSV(params).subscribe(visitors => {
      console.log('Visitors', visitors)

    const appiyoError = visitors?.Error;
    const apiErrorCode = visitors.ProcessVariables?.errorCode;
    const errorMessage = visitors.ProcessVariables?.errorMessage;

    if (appiyoError == '0') {

      const processVariables = visitors['ProcessVariables']

      this.attachments = processVariables?.attachment;
      this.utilityService.onDownloadCsv(this.attachments);


    } else {
      this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'Download error' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
    }
    })

   
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
