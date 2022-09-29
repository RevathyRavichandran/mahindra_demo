import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OnePagerService } from '@services/one-pager.service'
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
var moment = require('moment');
@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {


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
  totalFeedback:any;

  initValues = {
   
   
      title: 'Feedback Report',
      formDetails: [
        {
          label: 'Service',
          controlName: 'Service',
          type: 'select',
          list:[
            {
              key: 'Products & offer',
              value: 'Products & offer'
            },
            {
              key: 'After Sales',
              value: 'After Sales'
            },
            {
              key: 'Online Chef Classess',
              value: 'Online Chef Classes'
            }
          ]
        },
        {
          label: 'Language',
          controlName: 'language',
          type: 'select',
          list:[
            {
              key: 'English',
              value: 'English'
            },
            {
              key: 'Arabic',
              value: 'Arabic'
            },
            
          ]
        },
        {
          label: 'Product',
          controlName: 'products',
          type: 'select',
          list:[
            {
              key: 'LED TV',
              value: 'LED TV'
            },
            {
              key: 'Air Conditioner',
              value: 'Air Conditioner'
            },
            {
              key: 'Washing Machine',
              value: 'Washing Machine'
            },
            {
              key: 'Refrigerator',
              value: 'Refrigerator'
            },
            {
              key: 'Microwave Oven',
              value: 'Microwave Oven'
            },
            {
              key:  'Camera',
              value:'Camera'
            },
            {
              key: 'Audio System',
              value: 'Audio System'
            },
            {
              key: 'Beauty Care Products',
              value: 'Beauty Care Products'
            },
            {
              key:  'Air Purifier',
              value:'Air Purifier'
            },
            {
              key:  'Water Purifier',
              value:'Water Purifier'
            },
            {
              key:  'Vacuum Cleaner',
              value:'Vacuum Cleaner'
            },
            {
              key:  'Iron',
              value:'Iron'
            },
            {
              key:  'Miraie',
              value:'Miraie'
            },
            {
              key:  'Chest Freezer',
              value:'Chest Freezer'
            },
            {
              key:  'Video Conf Cameras',
              value:'Video Conf Cameras'
            },
            {
              key:  'Bulk Purchase Enquiry',
              value:'Bulk Purchase Enquiry'
            },
          ]
        },
        {
          label: 'Opinion for Chatbot',
          controlName: 'language',
          type: 'select',
          list:[
            {
              key: 'Happy',
              value: 'Happy'
            },
            {
              key: 'Neutral',
              value: 'Neutral'
            },
            {
              key: 'Sad',
              value: 'Sad'
            },
            
          ]
        },
    ],
  
    // header: ['SNo',"Date","Mobile Number",'Product/Service',"Language", "Product Category","Pincode","Name","State","City","Opinion for Chatbot","Concern in Conversation","Feedback","Product/Offers","Callback","Feedback State","User Email"],
    header: ['SNo',"Date","Mobile Number","Language",'Service', 'Product',"Feedback"], 
  }
  customListDatas: {};
  appointmentRating: any;
  totalAppointment: any;
  totalVisitors: any;

  constructor(
    private enterpriseService: OnePagerService,
    private toasterService: ToasterService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    var payload = {ProcessVariables:{} }
    this.getAppointmentConversationList()
    // this.enterpriseService.arnlist(payload).subscribe(res=>{
    //   this.arnList= res.ProcessVariables.output_data;
    //   this.initValues.formDetails[0].list=this.arnList;
    // }) 
    // this.enterpriseService.filelist(payload).subscribe(res=>{
    //   this.fileList= res.ProcessVariables.output_data;
    //   this.initValues.formDetails[3].list=this.fileList;
    // }) 
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
    this.enterpriseService.onepagerList(payload).subscribe(visitors => {
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
                "product":"LED TV",
                "sub_cat":"Product Catalogue",
                "service":"products and offer",
                "language":"English",
                "feedback":"Happy",
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
                "url" : "-",
                "language":"English",
                "feedback":"Neutral",
                "product":"Washing Machine",
                "service":"products and offer",
                "sub_cat":"Book Online Product Demo",
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
                "language":"English",
                "feedback":"Sad",
                "product":"Refrigerator",
                "service":"products and offer",
                "sub_cat":"Know Current Offers",
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
                "url" : "One_Pager_MMMF_Kar_Bachat__Yojana_July_2022.pdf",
                "product":"Microwave Oven",
                "language":"English",
                "feedback":"Happy",
                "service":"products and offer",
                "sub_cat":"Microwave Recipes",
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
                "product":"Camera",
                "language":"English",
                "feedback":"Sad",
                "sub_cat":"Buy a Product",
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
                "product":"Beauty Care Products",
                "Corporate Deck_File": "MMMF_Product_July_2022.pdf",
                "product_type":"Equity Nivesh Yojana",
                "url" : "-",
                "language":"English",
                "feedback":"Neutral",
                "sub_cat":"Locate Store Near You"
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
                "product":"Vacuum Cleaner",
                "Corporate Deck_File": "MMMF_Flexi_cap_July_2022.pdf",
                "product_type":"ELSS Kar Bachat Yojana - PDF",
                "url" : "-",
                "language":"English",
                "feedback":"Happy",
                "service":"products and offer",
                "sub_cat":"Know Current Offers"
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
                "product":"Miraie",
                "file_download":"YES/NO",
                "url" : "-",
                "language":"English",
                "feedback":"Sad",
                "service":"products and offer",
                "sub_cat":"Buy a Product"
             }
      ];
      for(var i=0; i<processVariables?.output_data?.length; i++) {
        this.visitorsList[i].SNo=(this.itemsPerPage * (processVariables['current_page']-1)) + i+1;
        this.visitorsList[i].created_at=this.visitorsList[i].created_at.split(' ').join('  ');
      }
      
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        totalRecords: this.totalRecords,
        totalVisitors: this.totalVisitors,
        totalAppointment: this.totalAppointment,
        appointmentRating: this.appointmentRating,
        total_equity_user_count: processVariables['output_data2'][1]?.count,
        total_hybrid_user_count: processVariables['output_data2'][2]?.count,
        total_debt_user_count: processVariables['output_data2'][0]?.count,
        onePager: processVariables['output_data1'][0]?.count, //api needed
        conversion : true,
        appointment : false,
        data: this.visitorsList,
        totalFeedback:5,
        // keys: ['SNo', "createdDate", "createdTime", 'mobileNumber', "waba_no", "isVisitorORBookedUser"],  // To get the data from key
        keys: ['SNo',"created_at",  'mobile_number', 'language','service','product','feedback'],
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
    this.enterpriseService.onepagerCSV(payload).subscribe(visitors => {
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
