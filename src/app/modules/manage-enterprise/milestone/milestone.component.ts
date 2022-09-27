import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DigitalService } from '@services/digital.service'
import { ToasterService } from '@services/toaster.service';
import { DatePipe } from '@angular/common'
import { FormGroup, FormControl } from '@angular/forms';
import { DateRangeService } from '@services/date-range.service'
var moment = require('moment');
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import { UtilityService } from '@services/utility.service';
//import { constant } from '../../../../storage/constant'
@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.css']
})
export class MilestoneComponent implements OnInit {

  page: number = 1;
  itemsPerPage: number = 8;
  totalCount: number;

  arnList: any = [];
  fileList: any = [];
  
  searchFromDate: any;
  searchToDate: any;
  milestoneList: any;
  searchDatas: any;
  visitorsList:any;
  attachments: any;
  totalRecords: any;

  initValues = {
    title: 'Digital Factsheet',
    formDetails: [
      {
      label: 'ARN Number',
      controlName: 'arn_number',
      type: 'select',
      list:this.arnList
    },
      {
        label: 'File Name',
        controlName: 'url',
        type: 'select',
        list:this.fileList
      },
    ],
    // header: ['SNo', "Created Date", 'Mobile Number', "URL",  "One Pager", "Digital Factsheet"]
    header: ['SNo', "Date and Time", "Mobile Number","Profile Name", 'ARN Number',"File Name"], 
  }
  customListDatas= {};
  

  constructor(
    private enterpriseService: DigitalService, 
    private toasterService: ToasterService, 
    private datePipe: DatePipe,
    private dateService: DateRangeService,
    private utilityService: UtilityService
  ) {}


  ngOnInit(): void {
    var payload = {ProcessVariables:{}}
     this.getMilestoneList()
     this.enterpriseService.arnlist(payload).subscribe(res=>{
      this.arnList= res.ProcessVariables.output_data;
      this.initValues.formDetails[0].list=this.arnList;
    }) 
    this.enterpriseService.filelist(payload).subscribe(res=>{
      this.fileList= res.ProcessVariables.output_data;
      this.initValues.formDetails[1].list=this.fileList;
    }) 
  }

  async getMilestoneList(searchData?) {


    const params = {
      current_page: this.page || 1,
      per_page: this.itemsPerPage || 10,
      // isApplyFilter: false,
      isCSVDownload: true,
      ...searchData
    }

    console.log('params', params);
    var payload = {ProcessVariables:params}
    this.enterpriseService.digitalList(payload).subscribe(visitors => {
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
      this.visitorsList = processVariables.output_data;

      for(var i=0; i<processVariables.output_data?.length; i++) {
        this.visitorsList[i].SNo=(this.itemsPerPage * (processVariables['current_page']-1)) + i+1;
        this.visitorsList[i].created_at=this.visitorsList[i].created_at.split(' ').join(' and ');
      }
    
      
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        totalRecords: this.totalRecords,
        data: this.visitorsList,
        appointment : true,
        digitalUser: processVariables['totalDigitalFactsheetUserCount'],
        keys: ['SNo', "created_at", 'mobile_number', 'profile_name','arn_number','url'],
        //Table header length should be equal to keys
      }

      
    } else {
     
      // this.toasterService.showError(milestone['ProcessVariables']?.errorMessage == undefined ? 'Milestone list error' : milestone['ProcessVariables']?.errorMessage, 'Milestone')
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
    this.enterpriseService.digitalCSV(payload).subscribe(visitors => {
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
    console.log(event)
    this.page = event.pageIndex;
    this.searchDatas = event.searchDatas
    this.getMilestoneList(this.searchDatas)
  }


  applyAndClear(event) {
    this.searchDatas = event.searchDatas;
    this.page = event.pageIndex;
    this.getMilestoneList(this.searchDatas)
   
  }


}
