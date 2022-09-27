import { Component, OnInit} from '@angular/core';
import { ProductInfoService } from '@services/product-info.service';
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
var moment = require('moment');
@Component({
  selector: 'app-all-tickets',
  templateUrl: './all-tickets.component.html',
  styleUrls: ['./all-tickets.component.css']
})
export class AllTicketsComponent implements OnInit {

  allTickets: Array<any> = [];
  page: number = 1;
  itemsPerPage: number = 8;
  totalCount: number;

  arnList: any = [];
  fileList: any = [];
  
  searchFromDate: any = '';
  searchToDate: any = '';
 
  searchDatas: any;
  attachments: any;
  totalRecords: any;
  initValues = {
    title: 'Product Information',
    formDetails: [
      {
        label: 'ARN Number',
        controlName: 'arn_number',
        type: 'select',
        list:this.arnList
      },
      {
        label: 'Product Information',
        controlName: 'folderName',
        type: 'select',
        list:[
          {
            "key" : "Product_Deck",
            "value" : "Product Deck"
         },
         {
            "key" : "Factsheet",
            "value" : "Monthly Factsheet"
         },
         {
            "key" : "One_Pagers",
            "value" : "One Pagers"
         },
         {
            "key" : "Product_Notes",
            "value" : "Product Notes"
         }
       
        ]
      },
      {
        label: 'File Name',
        controlName: 'url',
        type: 'select',
        list:this.fileList
      },
     
      // {
      //   label: 'Product Notes',
      //   controlName: 'notes',
      //   type: 'select',
      //   list:[
          
      //   ]
      // },
    ],
    header: ['SNo', "Date and Time", 'Mobile Number', "Profile Name","ARN Number", "Product Info","File Name"], // table headers
  }

  customListDatas= {}
  agentValue: boolean;

  constructor(
    private enterpriseService: ProductInfoService, 
    private toasterService: ToasterService, 
    private utilityService: UtilityService
  ) {}



  ngOnInit(): void {
    var payload = {ProcessVariables:{}}
    this.getLiveAgentData()
    this.enterpriseService.arnlist(payload).subscribe(res=>{
      this.arnList= res.ProcessVariables.output_data;
      this.initValues.formDetails[0].list=this.arnList;
    }) 
    this.enterpriseService.filelist(payload).subscribe(res=>{
      this.fileList= res.ProcessVariables.output_data;
      this.initValues.formDetails[2].list=this.fileList;
    }) 
  }

  async getLiveAgentData(searchData?) {
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
      this.totalRecords = processVariables?.totalCount;
      this.allTickets = processVariables.output_data;

      for(var i=0; i<processVariables.output_data?.length; i++) {
        this.allTickets[i].SNo=(this.itemsPerPage * (processVariables['current_page']-1)) + i+1;
        this.allTickets[i].created_at=this.allTickets[i].created_at.split(' ').join(' and ');
      }
     
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        // corporateCount: this.corporateCount,
        totalRecords: this.totalRecords,
        productInfoCount:processVariables['productInfoUserCount'],   //api needed
        productdeckCount:processVariables['output_data1'][2]?.count,  //api needed
        productMonthlycount:processVariables['output_data1'][0]?.count,
        productOnePagercount:processVariables['output_data1'][1]?.count,  //api needed
        productrPoductnotescount:processVariables['output_data1'][3]?.count,   //api needed
        data: this.allTickets,
        appointment : true,
        keys: ['SNo', "created_at", 'mobile_number','profile_name','arn_number','folder_name',"url"],
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
    this.page = event.pageIndex;
    this.searchDatas = event.searchDatas
    this.getLiveAgentData(this.searchDatas)
    
  }

  applyAndClear(event) {
    this.searchDatas = event.searchDatas;
    this.page = event.pageIndex;
    this.getLiveAgentData(this.searchDatas)
  }




}
