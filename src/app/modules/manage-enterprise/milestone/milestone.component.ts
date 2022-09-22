import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EnterpriseApiService } from '@services/enterprise-api.service'
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
        label: 'URL',
        controlName: 'mu',
        type: 'select',
        list:[
          {
            key: 'MMMF_Product_Deck_July_2022.pdf | One_pager_MMMF_Flexi_cap_July_2022.pdf',
            value: 'MMMF_Product_Deck_July_2022.pdf | One_pager_MMMF_Flexi_cap_July_2022.pdf'
          }
        ]
      },
      // {
      //   label: 'One Pager',
      //   controlName: 'one',
      //   type: 'select',
      //   list:[
         
      //   ]
      // },
      // {
      //   label: 'Digital Factsheet',
      //   controlName: 'one',
      //   type: 'select',
      //   list:[
         
      //   ]
      // },
    ],
    // header: ['SNo', "Created Date", 'Mobile Number', "URL",  "One Pager", "Digital Factsheet"]
    header: ['SNo', "Created Date", "Mobile Number","Profile Name",'ARN Number', "URL"], 
  }
  customListDatas= {};
  

  constructor(
    private enterpriseService: EnterpriseApiService, 
    private toasterService: ToasterService, 
    private datePipe: DatePipe,
    private dateService: DateRangeService,
    private utilityService: UtilityService
  ) {}


  ngOnInit(): void {
     this.getMilestoneList()
  }

  async getMilestoneList(searchData?) {

    const params = {
      currentPage: this.page || 1,
      perPage: this.itemsPerPage || 10,
      isApplyFilter: false,
      isCSVDownload: true,
      ...searchData
    }

    console.log('params', params);

    const milestone: any = await this.enterpriseService.getMilestoneList(params);

    console.log('Milestone', milestone)

    const appiyoError = milestone?.Error;
    const apiErrorCode = milestone.ProcessVariables?.errorCode;
    const errorMessage = milestone.ProcessVariables?.errorMessage;
    

    if (appiyoError == '0' && apiErrorCode == "200") {
      
      const processVariables = milestone['ProcessVariables'];
      this.itemsPerPage = processVariables['perPage'];
      let totalPages = processVariables['totalPages'];
      this.totalCount = Number(this.itemsPerPage) * Number(totalPages);
      // this.milestoneList = [
        
      //   {
      //     "SNo": "1",
      //           "arn_number" : "arn-909090",
      //           "created_at" : "2022-09-15T11:47:28Z",
      //           "digital_factsheet" : "-",
      //           "id" : "913",
      //           "latest_product_info" : "Product_Deck | One_Pagers",
      //           "market_updates" : "-",
      //           "marketing_material" : "Product_Info | Product_Info",
      //           "mobile_number" : "+918055191660",
      //           "one_pager" : "Equity",
      //           "product_notes" : "-",
      //           "profile_name" : "lalit maharshi",
      //           "updated_at" : "2022-09-15T11:54:55Z",
      //           "url" : "MMMF_Product_Deck_July_2022.pdf | One_pager_MMMF_Flexi_cap_July_2022.pdf"
      //        },
      //        {
      //     "SNo": "2",
      //           "arn_number" : "Corporate_Deck",
      //           "created_at" : "2022-09-15T11:23:23Z",
      //           "digital_factsheet" : "-",
      //           "id" : "912",
      //           "latest_product_info" : "-",
      //           "market_updates" : "-",
      //           "marketing_material" : "-",
      //           "mobile_number" : "+919025347318",
      //           "one_pager" : "-",
      //           "product_notes" : "-",
      //           "profile_name" : "-",
      //           "updated_at" : "2022-09-15T11:32:57Z",
      //           "url" : "-"
      //        },
      //        {
      //     "SNo": "3",
      //           "arn_number" : "-",
      //           "created_at" : "2022-09-14T16:27:55Z",
      //           "digital_factsheet" : "-",
      //           "id" : "911",
      //           "latest_product_info" : "-",
      //           "market_updates" : "-",
      //           "marketing_material" : "-",
      //           "mobile_number" : "+918226096969",
      //           "one_pager" : "-",
      //           "product_notes" : "-",
      //           "profile_name" : "-",
      //           "updated_at" : "2022-09-14T16:27:55Z",
      //           "url" : "-"
      //        },
      //        {
      //     "SNo": "4",
      //           "arn_number" : "151515",
      //           "created_at" : "2022-09-13T14:24:02Z",
      //           "digital_factsheet" : "-",
      //           "id" : "910",
      //           "latest_product_info" : "One_Pagers",
      //           "market_updates" : "-",
      //           "marketing_material" : "Product_Info",
      //           "mobile_number" : "+919836233352",
      //           "one_pager" : "Equity",
      //           "product_notes" : "-",
      //           "profile_name" : "Amit Teckchandani",
      //           "updated_at" : "2022-09-13T14:25:27Z",
      //           "url" : "One_Pager_MMMF_Kar_Bachat__Yojana_July_2022.pdf"
      //        },
      //        {
      //     "SNo": "5",
      //           "arn_number" : "151515",
      //           "created_at" : "2022-09-13T14:06:40Z",
      //           "digital_factsheet" : "-",
      //           "id" : "909",
      //           "latest_product_info" : "One_Pagers",
      //           "market_updates" : "-",
      //           "marketing_material" : "Product_Info",
      //           "mobile_number" : "+919836233352",
      //           "one_pager" : "Equity",
      //           "product_notes" : "-",
      //           "profile_name" : "Amit Teckchandani",
      //           "updated_at" : "2022-09-13T14:07:42Z",
      //           "url" : "One_pager_MMMF_Unnati_Yojana_July_2022.pdf | One_pager_MMMF_Flexi_cap_July_2022.pdf"
      //        },
      //        {
      //     "SNo": "6",
      //           "arn_number" : "-",
      //           "created_at" : "2022-09-13T13:48:58Z",
      //           "digital_factsheet" : "-",
      //           "id" : "908",
      //           "latest_product_info" : "-",
      //           "market_updates" : "-",
      //           "marketing_material" : "-",
      //           "mobile_number" : "+919836233352",
      //           "one_pager" : "-",
      //           "product_notes" : "-",
      //           "profile_name" : "-",
      //           "updated_at" : "2022-09-13T13:48:58Z",
      //           "url" : "-"
      //        },
      //    {
      //     "SNo": "7",
      //           "arn_number" : "39164",
      //           "created_at" : "2022-09-15T17:01:15Z",
      //           "digital_factsheet" : "-",
      //           "id" : "914",
      //           "latest_product_info" : "-",
      //           "market_updates" : "-",
      //           "marketing_material" : "-",
      //           "mobile_number" : "+919768053120",
      //           "one_pager" : "-",
      //           "product_notes" : "-",
      //           "profile_name" : "-",
      //           "updated_at" : "2022-09-15T17:02:52Z",
      //           "url" : "-"
      //        },
      //    {
      //     "SNo": "8",
      //           "arn_number" : "Hybrid",
      //           "created_at" : "2022-09-16T10:22:24Z",
      //           "digital_factsheet" : "-",
      //           "id" : "916",
      //           "latest_product_info" : "-",
      //           "market_updates" : "-",
      //           "marketing_material" : "-",
      //           "mobile_number" : "+919833667644",
      //           "one_pager" : "-",
      //           "product_notes" : "-",
      //           "profile_name" : "-",
      //           "updated_at" : "2022-09-16T10:23:15Z",
      //           "url" : "-"
      //        }
      // ];
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
      this.totalRecords = processVariables?.totalItems;
      
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        totalRecords: this.totalRecords,
        data: this.visitorsList,
        appointment : true,
        keys: ['SNo', "created_at", 'mobile_number','profile_name','arn_number', 'url'],
        //Table header length should be equal to keys
      }

      
    } else {
     
      this.toasterService.showError(milestone['ProcessVariables']?.errorMessage == undefined ? 'Milestone list error' : milestone['ProcessVariables']?.errorMessage, 'Milestone')
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

    const milestone: any = await this.enterpriseService.milestoneCsvDownload(params);

    console.log('Milestone', milestone)

    const appiyoError = milestone?.Error;
    const apiErrorCode = milestone.ProcessVariables?.errorCode;
    const errorMessage = milestone.ProcessVariables?.errorMessage;
    

    if (appiyoError == '0' && apiErrorCode == "200") {
      
      const processVariables = milestone['ProcessVariables'];
      this.attachments = processVariables?.attachment
      this.utilityService.onDownloadCsv(this.attachments);

      
    } else {
     
      this.toasterService.showError(milestone['ProcessVariables']?.errorMessage == undefined ? 'Milestone download error' : milestone['ProcessVariables']?.errorMessage, 'Milestone')
    }
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
