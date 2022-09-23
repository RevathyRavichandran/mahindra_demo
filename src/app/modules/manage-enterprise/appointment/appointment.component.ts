import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CorporateDeckService } from '@services/corporate-deck.service';
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
  patientList: any = [];
  regionList: any = [];
  branchList: any = [];
  deptList: any = [];
  searchDatas: any;
  attachments: any;
  totalRecords: any;

  initValues = {
    title: 'Corporate Deck',
    formDetails: [
      {
        label: 'ARN Number',
        controlName: 'arn_number',
        type: 'select',
        list:[
          {
            key: 'Corporate_Deck',
            value: 'Corporate_Deck'
          },
          {
            key: 'mk123',
            value: 'mk123'
          }
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
    ],
    header: ['SNo', "Created Date", 'Mobile Number',"ARN Number", "Profile Name","File Name","File Download"], // table headers
  }
  customListDatas: {};

  constructor(
    private enterpriseService: CorporateDeckService,
    private toasterService: ToasterService,
    private utilityService: UtilityService
  ) {
    // this.getAppointmentPatientList();
  }

  ngOnInit(): void {    
   
    this.getAppointmentList();    
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
      // this.corporateCount = 80000;
      this.totalRecords = processVariables?.count;
      this.visitorsList = processVariables.output_data;

      for(var i=0; i<processVariables.output_data.length; i++) {
        this.visitorsList[i].SNo=i+1;
        this.visitorsList[i].file_download='Yes';
      }
     
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        // corporateCount: this.corporateCount,
        totalRecords: this.totalRecords,
        data: this.visitorsList,
        appointment : true,
        keys: ['SNo', "created_at", 'mobile_number', 'arn_number', "profile_name","url","file_download"],  // To get the data from key
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
