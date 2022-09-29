// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { CorporateDeckService } from '@services/corporate-deck.service';
// import { FilterService } from '@services/filter.service';
// import { ToasterService } from '@services/toaster.service';
// import { UtilityService } from '@services/utility.service';
// var moment = require('moment');

// @Component({
//   selector: 'app-appointment',
//   templateUrl: './appointment.component.html',
//   styleUrls: ['./appointment.component.css']
// })
// export class AppointmentComponent implements OnInit {


//   page: number = 1;
//   itemsPerPage: number = 8;
//   totalCount: number;
//   corporateCount : number;
//   ticketData: any;
//   showTicketModal: boolean;

//   visitorsList: any;
//   arnList: any = [];
//   fileList: any = [];
//   branchList: any = [];
//   deptList: any = [];
//   searchDatas: any;
//   attachments: any;
//   totalRecords: any;

//   initValues = {
//     title: 'Corporate Deck',
//     formDetails: [
//       {
//         label: 'ARN Number',
//         controlName: 'arn_number',
//         type: 'select',
//         list:this.arnList,
//       },
//       {
//         label: 'File Name',
//         controlName: 'url',
//         type: 'select',
//         list:[
//           {
//             key: 'MMMF_Product_July_2022.pdf',
//             value: 'MMMF_Product_July_2022.pdf'
//           },
//           {
//             key: 'MMMF_Flexi_cap_July_2022.pdf',
//             value: 'MMMF_Flexi_cap_July_2022.pdf'
//           }
//         ]
//       },
//     ],
//     header: ['SNo', "Date and Time", 'Mobile Number',"Profile Name","ARN Number", "File Name"], // table headers
//   }
//   customListDatas: {};

//   constructor(
//     private enterpriseService: CorporateDeckService,
//     private toasterService: ToasterService,
//     private utilityService: UtilityService,
//     private filterService:FilterService
//   ) {
//     // this.getAppointmentPatientList();
//   }

//   ngOnInit(): void {    
//    var payload = {ProcessVariables:{}}
//     this.getAppointmentList(); 
//     this.filterService.arnlist(payload).subscribe(res=>{
//       this.arnList= res.ProcessVariables.output_data;
//       this.initValues.formDetails[0].list=this.arnList;
//     }) 
//     this.filterService.filelist(payload).subscribe(res=>{
//       this.fileList= res.ProcessVariables.output_data;
//       this.initValues.formDetails[1].list=this.fileList;
//     }) 
//   }

 
//   async getAppointmentList(searchData?) {
//     const params = {
//       current_page: this.page || 1,
//       per_page: this.itemsPerPage || 10,
//       // isApplyFilter: false,
//       isCSVDownload: true,
//       ...searchData
//     }

//     console.log('params', params);
//   var payload = {ProcessVariables:params}
//     this.enterpriseService.corporateList(payload).subscribe(visitors => {
//       console.log('Visitors', visitors)

//       const appiyoError = visitors?.Error;
//     const apiErrorCode = visitors.ProcessVariables?.errorCode;
//     const errorMessage = visitors.ProcessVariables?.errorMessage;

//     if (appiyoError == '0') {
//       const processVariables = visitors['ProcessVariables']
//       this.itemsPerPage = processVariables['per_page'];
//       let totalPages = processVariables['total_pages'];
//       this.totalCount = Number(this.itemsPerPage) * Number(totalPages);
//       // this.corporateCount = Number(this.itemsPerPage) * Number(totalPages);
//       // this.corporateCount = 80000;
//       this.totalRecords = processVariables?.totalCount;
//       this.visitorsList = processVariables.output_data;

//       for(var i=0; i<processVariables.output_data?.length; i++) {
//         this.visitorsList[i].SNo=(this.itemsPerPage * (processVariables['current_page']-1)) + i+1;
//         this.visitorsList[i].created_at=this.visitorsList[i].created_at.split(' ').join(' and ');
//       }
     
//       this.customListDatas = {
//         itemsPerPage: this.itemsPerPage,
//         perPage: this.page,
//         totalCount: this.totalCount,
//         CorporateDeckCount: processVariables['totalCorporateDeckCount'],  //api needed
//         // corporateCount: this.corporateCount,
//         totalRecords: this.totalRecords,
//         data: this.visitorsList,
//         appointment : true,
//         keys: ['SNo', "created_at", 'mobile_number',"profile_name", 'arn_number', "url"],  // To get the data from key
//       }

//     } else {
//       this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'Appointment list error' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
//     }
//     })
   
//   }


//   async onDownloadCsv(event) {
//     var params;
    
//       params = {

//         // isApplyFilter: false,
//         isCSVDownload: true,
//         ...event
//       }
     
//     console.log('params', params);
//     var payload = {ProcessVariables:params}
//     this.enterpriseService.corporateCSV(payload).subscribe(visitors => {
//       console.log('Visitors', visitors)

//     const appiyoError = visitors?.Error;
//     const apiErrorCode = visitors.ProcessVariables?.errorCode;
//     const errorMessage = visitors.ProcessVariables?.errorMessage;

//     if (appiyoError == '0') {

//       const processVariables = visitors['ProcessVariables']

//       this.attachments = processVariables?.attachment;
//       this.utilityService.onDownloadCsv(this.attachments);


//     } else {
//       this.toasterService.showError(visitors['ProcessVariables']?.errorMessage == undefined ? 'Download error' : visitors['ProcessVariables']?.errorMessage, 'Visitors')
//     }
//     })

   
//   }




//   async pageChangeEvent(event) {
//     console.log(event)
//     this.page = event.pageIndex;
//     this.searchDatas = event.searchDatas
//     this.getAppointmentList(this.searchDatas)
//   }


//   applyAndClear(event?) {
//     //this.isApplyClicked = true;
//     this.searchDatas = event.searchDatas;
//     this.page = event.pageIndex;
//     this.getAppointmentList(this.searchDatas)
//   }


// }


// copied from panasonic sample

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CorporateDeckService } from '@services/corporate-deck.service';
import { FilterService } from '@services/filter.service';
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
var moment = require('moment');

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {


  page: number = 1;
  itemsPerPage: number = 8;
  totalCount: number;
  corporateCount : number;
  ticketData: any;
  showTicketModal: boolean;

  visitorsList: any;
  arnList: any = [];
  fileList: any = [];
  branchList: any = [];
  deptList: any = [];
  searchDatas: any;
  attachments: any;
  totalRecords: any;
  totalconsent:any;

  initValues = {
    title: 'Consent Report',
    formDetails: [
      // {
      //   label: 'ARN Number',
      //   controlName: 'arn_number',
      //   type: 'select',
      //   list:this.arnList,
      // },
      {
        label: 'Your Consent',
        controlName: 'consent',
        type: 'select',
        list:[
          {
            key: 'Yes',
            value: 'Yes'
          },
          {
            key: 'No',
            value: 'No'
          }
        ]
      },
      {
        label: 'Data Privacy Policy',
        controlName: 'policy',
        type: 'select',
        list:[
          {
            key: 'Yes',
            value: 'Yes'
          },
          {
            key: 'No',
            value: 'No'
          }
        ]
      },
    ],
    header: ['SNo', "Date", 'Mobile Number',"Consent", "Data Privacy Policy"], // table headers
  }
  customListDatas: {};

  constructor(
    private enterpriseService: CorporateDeckService,
    private toasterService: ToasterService,
    private utilityService: UtilityService,
    private filterService:FilterService
  ) {
    // this.getAppointmentPatientList();
  }

  ngOnInit(): void {    
   var payload = {ProcessVariables:{}}
    this.getAppointmentList(); 
    // this.filterService.arnlist(payload).subscribe(res=>{
    //   this.arnList= res.ProcessVariables.output_data;
    //   this.initValues.formDetails[0].list=this.arnList;
    // }) 
    // this.filterService.filelist(payload).subscribe(res=>{
    //   this.fileList= res.ProcessVariables.output_data;
    //   this.initValues.formDetails[1].list=this.fileList;
    // }) 
  }

 
  async getAppointmentList(searchData?) {
    const params = {
      current_page: this.page || 1,
      per_page: this.itemsPerPage || 10,
      // isApplyFilter: false,
      isCSVDownload: true,
      ...searchData
    }

    console.log('params', params);
    this.enterpriseService.corporateList(params).subscribe(visitors => {
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
      this.totalRecords = 8;

      

      // this.totalRecords = processVariables?.count;
      // this.visitorsList = processVariables.output_data;

      this.visitorsList = [
        
        {
          "SNo": "1",
                "arn_number" : "arn-909090",
                "created_at" : "2022-09-15 11:47:28",
                "digital_factsheet" : "-",
                "id" : "913",
                "file_download":"YES/NO",
                "latest_product_info" : "Product_Deck | One_Pagers",
                "market_updates" : "-",
                "marketing_material" : "Product_Info | Product_Info",
                "mobile_number" : "+918055191660",
                "one_pager" : "Equity",
                "product_notes" : "-",
                "profile_name" : "lalit maharshi",
                "corporate_deck_file_name": "pdf",
                "updated_at" : "2022-09-15T11:54:55Z",
                "product_info":"prod_notes",
                "branch": "Equity",
                "Corporate Deck_File": "MMMF_Flexi_cap_July_2022.pdf",
                "product_type":"ELSS Kar Bachat Yojana - PDF",
                "consent_name":"Yes",
                "url" : "MMMF_Product_Deck_July_2022.pdf | One_pager_MMMF_Flexi_cap_July_2022.pdf"
             },
             {
          "SNo": "2",
                "arn_number" : "arn-1235465767653423",
                "created_at" : "2022-09-15 11:23:23",
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
                "product_info":"prod_notes",
                "branch": "Equity",
                "Corporate Deck_File": "MMMF_Product_July_2022.pdf",
                "product_type":"Mid Cap Unnati Yojana-PDF",
                "file_download":"YES/NO",
                "consent_name":"Yes",
                "url" : "-",
                
             },
             {
          "SNo": "3",
                "arn_number" : "-",
                "created_at" : "2022-09-14 16:27:55",
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
                "product_info":"prod_notes",
                "branch": "Equity",
                "file_download":"YES/NO",
                "Corporate Deck_File": "MMMF_Flexi_cap_July_2022.pdf",
                "product_type":"Large Cap Pragati Yojana-PDF",
                "url" : "-",
                "consent_name":"No",
                
             },
             {
          "SNo": "4",
                "arn_number" : "151515",
                "created_at" : "2022-09-13 14:24:02",
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
                "product_info":"prod_notes",
                "branch": "Hybrid",
                "product_type":"Equity Savings Yojana",
                "Corporate Deck_File": "MMMF_Product_July_2022.pdf",
                "file_download":"YES/NO",
                "consent_name":"Yes",
                "url" : "One_Pager_MMMF_Kar_Bachat__Yojana_July_2022.pdf"
             },
             {
          "SNo": "5",
                "arn_number" : "151515",
                "created_at" : "2022-09-13 14:06:40",
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
                "product_info":"prod_notes",
                "branch": "Hybrid",
                "product_type":"Equity Nivesh Yojana",
                "Corporate Deck_File": "MMMF_Product_July_2022.pdf",
                "file_download":"YES/NO",
                "consent_name":"No",
                "url" : "One_pager_MMMF_Unnati_Yojana_July_2022.pdf | One_pager_MMMF_Flexi_cap_July_2022.pdf"
             },
             {
          "SNo": "6",
                "arn_number" : "-",
                "created_at" : "2022-09-13 13:48:58",
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
                "product_info":"prod_notes",
                "branch": "Hybrid",
                "file_download":"YES/NO",
                "Corporate Deck_File": "MMMF_Product_July_2022.pdf",
                "product_type":"Equity Nivesh Yojana",
                "url" : "-",
                "consent_name":"No",
             },
         {
          "SNo": "7",
                "arn_number" : "39164",
                "created_at" : "2022-09-15 17:01:15",
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
                "product_info":"prod_notes",
                "branch": "Equity",
                "file_download":"YES/NO",
                "Corporate Deck_File": "MMMF_Flexi_cap_July_2022.pdf",
                "product_type":"ELSS Kar Bachat Yojana - PDF",
                "url" : "-",
                "consent_name":"Yes",
             },
         {
          "SNo": "8",
                "arn_number" : "arn-123456",
                "created_at" : "2022-09-16 10:22:24",
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
                "product_info":"Prod_notes",
                "product_type":"Equity Savings Yojana",
                "Corporate Deck_File": "MMMF_Flexi_cap_July_2022.pdf",
                "branch": "Hybrid",
                "file_download":"YES/NO",
                "url" : "-",
                "consent_name":"No",
             }
      ];

      

      // commented for time being, because SNO is hardcoded in the above json,if API comes uncomment this

      // for(var i=0; i<processVariables?.output_data?.length; i++) {
      //   this.visitorsList[i].SNo=i+1;
      //   this.visitorsList[i].file_download='Yes';
      // }
     
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        // corporateCount: this.corporateCount,
        totalRecords: this.totalRecords,
        totalconsent:5,
        data: this.visitorsList,
        appointment : true,
        keys: ['SNo', "created_at", 'mobile_number', "consent_name","consent_name"],  // To get the data from key
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

    this.enterpriseService.corporateCSV(params).subscribe(visitors => {
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
    this.getAppointmentList(this.searchDatas)
  }


  applyAndClear(event?) {
    //this.isApplyClicked = true;
    this.searchDatas = event.searchDatas;
    this.page = event.pageIndex;
    this.getAppointmentList(this.searchDatas)
  }


}
