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
  mobile: any = [];
  branchList: any = [];
  deptList: any = [];
  searchDatas: any;
  attachments: any;
  totalRecords: any;

  initValues = {
    title: 'Corporate Deck',
    formDetails: [
      {
        label: 'Mobile Number',
        controlName: 'mobile_number',
        type: 'select',
        list:this.mobile
      },
      {
        label: 'ARN',
        controlName: 'arn_number',
        type: 'select',
        list:this.arnList,
      },
      {
        label: 'File Name',
        controlName: 'url',
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
    header: ['S.No:', "Date & Time", 'Mobile No',"Profile Name","ARN", "File Name"], // table headers
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
    this.filterService.arnlist(payload).subscribe(res=>{
      this.arnList= res.ProcessVariables.output_data;
      this.initValues.formDetails[1].list=this.arnList;
    }) 
    this.filterService.filelist(payload).subscribe(res=>{
      this.fileList= res.ProcessVariables.output_data;
      this.initValues.formDetails[2].list=this.fileList;
    }) 
    this.filterService.mobileList(payload).subscribe(res=>{
      this.mobile= res.ProcessVariables.output_data;
      this.initValues.formDetails[0].list=this.mobile;
    }) 
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
  var payload = {ProcessVariables:params}
    this.enterpriseService.corporateList(payload).subscribe(visitors => {
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
        
      }
     
      this.customListDatas = {
        itemsPerPage: this.itemsPerPage,
        perPage: this.page,
        totalCount: this.totalCount,
        total: processVariables['count'],
        CorporateDeckCount: processVariables['count'],  //api needed
        // corporateCount: this.corporateCount,
        totalRecords: this.totalRecords,
        data: this.visitorsList,
        appointment : true,
        keys: ['SNo', "created_at", 'mobile_number',"profile_name", 'arn_number', "url"],  // To get the data from key
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
    this.enterpriseService.corporateCSV(payload).subscribe(visitors => {
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
