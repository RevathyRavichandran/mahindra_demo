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
  
  arnList: any = [];
  fileList: any = [];

  attachments: any;
  totalRecords: any;
  initValues = {
    title: 'Market Updates',
    formDetails: [
      {
        label: 'ARN Number',
        controlName: 'arn_number',
        type: 'select',
        list:this.arnList
      },
      {
        label: 'Market Updates',
        controlName: 'folderName',
        type: 'select',
        list:[
          {
             "key" : "Aaj_Ka_Bazar",
             "value" : "Aaj Ka Bazar"
          },
          {
             "key" : "Fund_Manager_Videos",
             "value" : "Fund Manager Videos"
          },
          {
             "key" : "Weekly_Snapshot",
             "value" : "Weekly Snapshot"
          },
          {
             "key" : "Weekly_Debt_Market",
             "value" : "Weekly Debt Market"
          },
          {
             "key" : "Monthly_Snapshot",
             "value" : "Monthly Snapshot"
          },
          {
             "key" : "Monthy_Samvaad",
             "value" : "Monthy Samvaad"
          }
       ]
      },
      {
        label: 'File Name',
        controlName: 'url',
        type: 'select',
        list:this.fileList
      },
   
    ],
    header: ['SNo', "Date and Time","Mobile Number","Profile Name","ARN Number","Market Updates","File Name"], 
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
    var payload = {ProcessVariables:{} }
    this.getFeedBackList()
    this.enterpriseService.arnlist(payload).subscribe(res=>{
      this.arnList= res.ProcessVariables.output_data;
      this.initValues.formDetails[0].list=this.arnList;
    }) 
    this.enterpriseService.filelist(payload).subscribe(res=>{
      this.fileList= res.ProcessVariables.output_data;
      this.initValues.formDetails[2].list=this.fileList;
    }) 
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
    var payload = {ProcessVariables:params}
    this.enterpriseService.marketList(payload).subscribe(visitors => {
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
      this.totalRecords = processVariables?.totalCount;
      this.feedbackList = processVariables.output_data;

      for(var i=0; i<processVariables.output_data?.length; i++) {
        this.feedbackList[i].SNo=(this.itemsPerPage * (processVariables['current_page']-1)) + i+1;
        this.feedbackList[i].created_at=this.feedbackList[i].created_at.split(' ').join(' and ');
      }
     
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        // corporateCount: this.corporateCount,
        totalRecords: this.totalRecords,
        marketUpdateCount : processVariables['totalMarketUpdatsUserCount'], //api needed
        data: this.feedbackList,
        appointment : true,
        keys: ['SNo', "created_at",'mobile_number','profile_name','arn_number','folder_name',"url"],
      }

    } else {
      this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'Appointment list error' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
    }
    })
   
  }

  async onDownloadCsv(event) {
    var params;
    
      params = {

        // isApplyFilter: false,
        isCSVDownload: true,
        ...event
      }
     

    console.log('params', params);
    var payload = {ProcessVariables:params}
    this.enterpriseService.marketCSV(payload).subscribe(visitors => {
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
