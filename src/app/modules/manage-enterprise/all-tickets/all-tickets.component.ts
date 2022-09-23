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
        label: 'Product Information',
        controlName: 'info',
        type: 'select',
        list:[
          {
            key: 'Product Deck',
            value: 'Product Deck '
          },
          {
            key: 'Monthly Factsheet',
            value: 'Monthly Factsheet'
          },
       
        ]
      },
      {
        label: 'File Name',
        controlName: 'file',
        type: 'select',
        list:[
          {
            key: 'MMMF_Product_July_2022.pdf',
            value: 'MMMF_Product_July_2022.pdf'
          },
          {
            key: 'MMMF_Flexi_cap_July_2022.pdf',
            value: 'MMMF_Flexi_cap_July_2022.pdf'
          }
        ]
      },
     
      // {
      //   label: 'Product Notes',
      //   controlName: 'notes',
      //   type: 'select',
      //   list:[
          
      //   ]
      // },
    ],
    header: ['SNo', "Created Date", 'Mobile Number', "ARN Number", "Profile Name","Product Info","File Name","File Download"], // table headers
  }

  customListDatas= {}
  agentValue: boolean;

  constructor(
    private enterpriseService: ProductInfoService, 
    private toasterService: ToasterService, 
    private utilityService: UtilityService
  ) {}



  ngOnInit(): void {
    this.getLiveAgentData()
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
    this.enterpriseService.productList(params).subscribe(visitors => {
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
      this.allTickets = processVariables.output_data;

      for(var i=0; i<processVariables.output_data.length; i++) {
        this.allTickets[i].SNo=i+1;
        this.allTickets[i].file_download='Yes';
      }
     
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        // corporateCount: this.corporateCount,
        totalRecords: this.totalRecords,
        data: this.allTickets,
        appointment : true,
        keys: ['SNo', "created_at",'mobile_number','arn_number','profile_name','folder_name',"url",'file_download'],
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

    this.enterpriseService.productCSV(params).subscribe(visitors => {
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
