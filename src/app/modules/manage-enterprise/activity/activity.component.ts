import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProductNotesService } from '@services/product-notes.service'
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
var moment = require('moment');

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  page: number = 1;
  itemsPerPage: number = 8;
  totalCount: number;
  ticketData: any;
  showTicketModal: boolean;

  arnList: any = [];
  fileList: any = [];
  
  visitorsList: any;
  searchDatas: any;
  attachments: any;
  totalRecords: any;

  initValues = {
    title: 'Product Notes',
    formDetails: [
      {
        label: 'ARN Number',
        controlName: 'arn_number',
        type: 'select',
        list:this.arnList
      },
      
      {
        label: 'Fund Type',
        controlName: 'subFolder',
        type: 'select',
        list:[
          {
            key: 'Equity',
            value: 'Equity'
          },
          {
            key: 'Hybrid',
            value: 'Hybrid'
          }
        
        ]
      },
      {
        label: 'Fund',
        controlName: 'type_prod',
        type: 'select',
        list:[]
      },
      
      {
        label: 'File Name',
        controlName: 'url',
        type: 'select',
        list:this.fileList
      },
      // {
      //   label: 'Name',
      //   controlName: 'userName',
      //   type: 'input'
      // }
    ],
    header: ['SNo', "Date and Time","Mobile Number","Profile Name","ARN Number","Product Info","Branch","Product Type","File name"], // table headers
  }
  customListDatas: {};
  appointmentRating: any;
  totalAppointment: any;
  totalVisitors: any;

  constructor(
    private enterpriseService: ProductNotesService,
    private toasterService: ToasterService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    var payload = {ProcessVariables:{} }
    this.getAppointmentConversationList()
    this.enterpriseService.arnlist(payload).subscribe(res=>{
      this.arnList= res.ProcessVariables.output_data;
      this.initValues.formDetails[0].list=this.arnList;
    }) 
    this.enterpriseService.filelist(payload).subscribe(res=>{
      this.fileList= res.ProcessVariables.output_data;
      this.initValues.formDetails[3].list=this.fileList;
    }) 
  }

  async getAppointmentConversationList(searchData?) {
    const params = {
      current_page: this.page || 1,
      per_page: this.itemsPerPage || 10,
      // isApplyFilter: false,
      isCSVDownload: true,
      ...searchData
    }

    console.log('params', params);
    var payload = {ProcessVariables:params}
    this.enterpriseService.productList(payload).subscribe(visitors => {
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
      this.visitorsList = processVariables.output_data;

      for(var i=0; i<processVariables?.output_data?.length; i++) {
        this.visitorsList[i].SNo=(this.itemsPerPage * (processVariables['current_page']-1)) + i+1;
        this.visitorsList[i].created_at=this.visitorsList[i].created_at.split(' ').join(' and ');
      }
      
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        totalRecords: this.totalRecords,
        totalVisitors: this.totalVisitors,
        totalAppointment: this.totalAppointment,
        appointmentRating: this.appointmentRating,
        total_product_notes_user_count: processVariables['output_data1'][0]?.count,
        total_equity_user_count: processVariables['output_data2'][0]?.count,
        total_hybrid_user_count: processVariables['output_data2'][1]?.count,
        conversion : true,
        appointment : false,
        data: this.visitorsList,
        // keys: ['SNo', "createdDate", "createdTime", 'mobileNumber', "waba_no", "isVisitorORBookedUser"],  // To get the data from key
        keys: ['SNo', "created_at", 'mobile_number','name','arn_number',  "folder_name","subfolder","product_type","url"],  // To get the data from key
      }

    } else {
      // this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'Appointment conversion list' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
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
    this.enterpriseService.productCSV(payload).subscribe(visitors => {
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
    this.getAppointmentConversationList(this.searchDatas)
  }


  applyAndClear(event?) {
    //this.isApplyClicked = true;
    this.searchDatas = event.searchDatas;
    this.page = event.pageIndex;
    this.getAppointmentConversationList(this.searchDatas)
  }

}
