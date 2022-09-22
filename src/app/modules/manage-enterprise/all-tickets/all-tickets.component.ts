import { Component, OnInit} from '@angular/core';
import { EnterpriseApiService } from '@services/enterprise-api.service';
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
    private enterpriseService: EnterpriseApiService, 
    private toasterService: ToasterService, 
    private utilityService: UtilityService
  ) {}



  ngOnInit(): void {
    this.getLiveAgentData()
  }

  async getLiveAgentData(searchData?) {
    const params = {
      currentPage: this.page || 1,
      perPage: this.itemsPerPage || 10,
      isApplyFilter: false,
      isCSVDownload: true,
      ...searchData
    }

    console.log('params', params)

    const ticketsData: any = await this.enterpriseService.getLiveAgentList(params);

    console.log('Tickets Data', ticketsData)

    const appiyoError = ticketsData?.Error;
    const apiErrorCode = ticketsData.ProcessVariables?.errorCode;
    const errorMessage = ticketsData.ProcessVariables?.errorMessage;
    

    if (appiyoError == '0' && apiErrorCode == "200") {
      const processVariables = ticketsData['ProcessVariables']
      
      this.itemsPerPage = processVariables['perPage'];
      let totalPages = processVariables['totalPages'];
      this.totalCount = Number(this.itemsPerPage) * Number(totalPages);
      this.allTickets = [
        
         
        {
          "SNo": "1",
                "arn_number" : "arn-909090",
                "created_at" : "2022-09-15T11:47:28Z",
                "digital_factsheet" : "-",
                "id" : "913",
                "latest_product_info" : "Product_Deck ",
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
                "latest_product_info" : "Monthly Factsheet",
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
                "latest_product_info" : "Monthly Factsheet",
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
                "latest_product_info" : "Monthly Factsheet",
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
                "latest_product_info" : "Product_Deck ",
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
                "latest_product_info" : "Product_Deck ",
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
                "latest_product_info" : "Product_Deck ",
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
      this.totalRecords = processVariables?.totalItems;
      
      this.customListDatas = {
        agentValue : true,
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        totalRecords: this.totalRecords,
        data: this.allTickets,
        appointment : true,
        keys: ['SNo', "created_at", 'mobile_number','arn_number',"profile_name", 'latest_product_info','Corporate Deck_File','file_download'],
      }    
  } else {
      
      this.toasterService.showError(ticketsData['ProcessVariables']?.errorMessage == undefined ? 'Live agent list' : ticketsData['ProcessVariables']?.errorMessage, 'Tickets')
    }
  }

  async onDownloadCsv(event){
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
    const ticketsData: any = await this.enterpriseService.liveAgentCsvDownload(params);
    console.log('Tickets Data', ticketsData)

    const appiyoError = ticketsData?.Error;
    const apiErrorCode = ticketsData.ProcessVariables?.errorCode;
    const errorMessage = ticketsData.ProcessVariables?.errorMessage;

    if (appiyoError == '0' && apiErrorCode == "200") {
      const processVariables = ticketsData['ProcessVariables']
      this.attachments= processVariables?.attachment;
      this.utilityService.onDownloadCsv(this.attachments);
      
  } else {
      this.toasterService.showError(ticketsData['ProcessVariables']?.errorMessage == undefined ? 'Download error' : ticketsData['ProcessVariables']?.errorMessage, 'Tickets')
    }  
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
