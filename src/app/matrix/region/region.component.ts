import { Component, OnInit, ViewChild } from '@angular/core';
import { EnterpriseApiService } from '@services/enterprise-api.service';
import { ToasterService } from '@services/toaster.service';
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import { DateRangeService } from '@services/date-range.service';
import { MatInput } from '@angular/material/input';
var moment = require('moment');

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css'],
})
export class RegionComponent implements OnInit {


  market_updates: boolean = false;
  product_info: boolean = false;
  one_pagers: boolean = false;
  product_notes: boolean = false;
  equity: boolean = false;
  hybrid: boolean = false;
  debt: boolean = false;
  // country : any;
  displayedColumns: string[] = ['Country'];
  // datasource = this.country;
  facilitysource: any;
  facilityColumns: string[] = ['hospital'];
  departmentColumns: string[] = ['department'];
  physicianColumns: string[] = ['physician'];
  departmentSource: any;
  physicianSource: any;
  itemsPerPage: any;
  regionSoruce: any;
  regionName: any;
  regionId: any;
  facilityId: any;
  physicianId: any;
  regionCount: any;
  physicianCount: any;
  departmentCount: any;
  facilityCount: any;
  options: any;
  page: Number;
  isApplyClicked: boolean;
  searchDatas: any = {};
  dateRangeValue: String = '';
  public daterange: any = {};
  searchFromDate: any = '';
  searchToDate: any = '';

  fromDate: any = '';
  toDate: any = '';
  maxDate = new Date();

  @ViewChild('fromInput', {
    read: MatInput,
  })
  fromInput: MatInput;

  @ViewChild('toInput', {
    read: MatInput,
  })
  toInput: MatInput;

  selectedActive: Boolean;
  @ViewChild(DaterangepickerComponent)
  private picker: DaterangepickerComponent;
  selectedFacility='';
  selectedProduct='';
  selectedInfoOne='';
  selectedInfoNotes='';
  selectedEquity='';
  selectedHybrid='';
  selectedDebt='';

  constructor(
    private enterpriseService: EnterpriseApiService,
    private dateService: DateRangeService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.options = {
      autoUpdateInput: false,
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: true,
      startDate: this.dateService.getWhichDay(6),
      endDate: this.dateService.getWhichDay(0),
      //minDate: this.dateService.getLastTweleveMonthDate(),
      maxDate: new Date(),
      ranges: {
        Today: [this.dateService.getWhichDay(0)],
        Yesterday: [
          this.dateService.getWhichDay(1),
          this.dateService.getWhichDay(1),
        ],
        'Last 7 Days': [this.dateService.getWhichDay(6)],
        'Last 30 Days': [this.dateService.getWhichDay(29)],
        // 'This Month': [moment().startOf('month'), moment().endOf('month')],
        // 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
    };
    const params = {};

    this.getRegionData(params);
  }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
    console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // use passed valuable to update state
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;

    const startDate = this.dateService.getTicketDateFormat(value.start['_d']);
    const endDate = this.dateService.getTicketDateFormat(value.end['_d']);

    this.searchFromDate = startDate;

    this.searchToDate = endDate;

    this.dateRangeValue = `${this.searchFromDate} - ${this.searchToDate}`;
  }

  async getRegionData(params) {
    // const params = {

    // }

    console.log('params', params);

    const regionData: any = {
      "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
      "Error" : "0",
      "ErrorCode" : "",
      "ErrorMessage" : "",
      "ProcessId" : "e94189a8327c11ed8c9f0022480d6e6c",
      "ProcessInstanceId" : "f9d98e2c3d9a11eda1490242ac110002",
      "ProcessName" : "Metric Page",
      "ProcessVariables" : {
         "fromDate" : "",
         "metricList" : [
            {
               "metricCount" : 63,
               "metricName" : "Corporate Deck"
            },
            {
               "metricCount" : 24,
               "metricName" : "Market Updates"
            },
            {
               "metricCount" : 73,
               "metricName" : "Product Info"
            },
            {
               "metricCount" : 45,
               "metricName" : "Digital Factsheet"
            }
         ],
         "query" : "select distinct region_name as name, count(id) as count from    vps_appointment_booking_report where is_active = 1    and     (region_name in ((select english_region_name from vps_region where is_active=1))     or region_name in ((select arabic_region_name from vps_region where is_active=1)))     group by region_name",
         "selectedDepartment" : "",
         "selectedFacility" : "",
         "selectedRegion" : "",
         "toDate" : ""
      },
      "Status" : "Execution Completed",
      "WorkflowId" : "628dbe44d8299cd2b49dd679",
      "currentCorrelationId" : "281475477573466",
      "customizedLogId" : "",
      "endedOn" : "2022-09-26T12:58:54.591894",
      "isWaitingForEvent" : false,
      "nodeBPMNId" : "2",
      "processId" : "e94189a8327c11ed8c9f0022480d6e6c",
      "processName" : "Metric Page",
      "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
      "repoName" : "VPS Health_v1",
      "rootCorrelationId" : "281475477573466",
      "startedOn" : "2022-09-26T12:58:54.439772"
   }

    console.log('region Data', regionData);

    const appiyoError = regionData?.Error;
    const apiErrorCode = regionData.ProcessVariables?.errorCode;
    const errorMessage = regionData.ProcessVariables?.errorMessage;

    if (appiyoError == '0') {
      const regionResponse = regionData['ProcessVariables'];
      console.log('response', regionResponse, this.selectedEquity);
      const metricType = regionResponse.metricType;
      // this.regionCount = regionResponse.totalMetricCount;
      if (this.selectedEquity != '') {
        console.log('tettetetet')
        this.physicianSource = [{
            metricCount: 6,
            metricName: 'ELSS Kar Bachat Yojana - PDF'
          },
          {
            metricCount: 2,
            metricName: 'Multi Cap Badhat Yojana - PDF'
          },
          {
              metricCount: 3,
              metricName: 'Mid Cap Unnati Yojana-PDF'
            },
            {
              metricCount: 8,
              metricName: 'Rural and Consumption-PDF'
            },
            {
              metricCount: 15,
              metricName: 'Large Cap Pragati Yojana-PDF'
            },
            {
              metricCount: 7,
              metricName: 'Top 250 Nivesh Yojanac-PDF'
            },
            {
              metricCount: 10,
              metricName: 'Focused Equity Yojana-PDF'
            },
            {
              metricCount: 20,
              metricName: 'Flexi Cap Yojana-PDF'
            }];
        this.physicianCount = this.physicianSource.reduce((accumulator, value) => {
          return accumulator + value.metricCount;
        }, 0);
        // this.physicianCount = regionResponse.totalMetricCount;
      }else if (this.selectedHybrid != '') {
        this.physicianSource = [{
          metricCount: 8,
          metricName: 'Equity Savings Yojana'
        },
        {
          metricCount: 20,
          metricName: 'Equity Nivesh Yojana'
        },
        {
          metricCount: 12,
          metricName: 'Arbitrage Yojana'
        },
        {
          metricCount: 10,
          metricName: 'Balancing Benefit Yojana'
        },];
        this.physicianCount = this.physicianSource.reduce((accumulator, value) => {
          return accumulator + value.metricCount;
        }, 0);
        // this.physicianCount = regionResponse.totalMetricCount;
      }else if (this.selectedDebt != '') {
        this.physicianSource = [{
          metricCount: 10,
          metricName: 'Liquid Fund'
        },
        {
          metricCount: 3,
          metricName: 'Low Duration Fund'
        },
        {
          metricCount: 4,
          metricName: 'Dynamic Bond Yojana'
        },
        {
          metricCount: 15,
          metricName: 'Ultra Short Term Fund'
        },
        {
          metricCount: 33,
          metricName: 'Short Term Fund'
        },];
        this.physicianCount = this.physicianSource.reduce((accumulator, value) => {
          return accumulator + value.metricCount;
        }, 0);
        // this.physicianCount = regionResponse.totalMetricCount;
      } else if (this.selectedInfoOne != '' && this.selectedInfoNotes=='') {
        console.log('test')
            this.departmentSource = [{
              "metricCount" : 63,
              "metricName" : "Equity"
          },
          {
              "metricCount" : 24,
              "metricName" : "Hybrid"
          },
          {
              "metricCount" : 73,
              "metricName" : "Debt"
          }];
            this.physicianSource = '';
            this.departmentCount = this.departmentSource.reduce((accumulator, value) => {
              return accumulator + value.metricCount;
            }, 0);
        // this.departmentCount = regionResponse.totalMetricCount;
      } else if (this.selectedInfoNotes != '') {
        this.departmentSource = [{
          "metricCount" : 63,
          "metricName" : "Equity"
      },
      {
          "metricCount" : 24,
          "metricName" : "Hybrid"
      }];
        this.physicianSource = '';
        this.departmentCount = this.departmentSource.reduce((accumulator, value) => {
          return accumulator + value.metricCount;
        }, 0);
    // this.departmentCount = regionResponse.totalMetricCount;
      } else if (this.selectedFacility != ''  && this.selectedInfoOne == '' && this.selectedInfoNotes == '') {
        this.facilitysource = [{
          "metricCount" : 63,
          "metricName" : "Aaj Ka Bazar"
       },
       {
          "metricCount" : 24,
          "metricName" : "Fund Manager Videos"
       },
       {
          "metricCount" : 73,
          "metricName" : "Weekly Snapshot"
       },
       {
          "metricCount" : 15,
          "metricName" : "Weekly Debt Market"
       },
       {
          "metricCount" : 20,
          "metricName" : "Monthly Snapshot"
       },
       {
          "metricCount" : 15,
          "metricName" : "Monthy Samvaad"
       }];
        this.departmentSource = '';
        this.physicianSource = '';
        this.facilityCount = this.facilitysource.reduce((accumulator, value) => {
          return accumulator + value.metricCount;
        }, 0);
        // this.facilityCount = regionResponse.totalMetricCount;
      } else if (this.selectedProduct != '' && this.selectedInfoOne == '' && this.selectedInfoNotes == '') {
        this.facilitysource = [{
          "metricCount" : 63,
          "metricName" : "Product Deck"
       },
       {
          "metricCount" : 24,
          "metricName" : "Monthly Factsheet"
       },
       {
          "metricCount" : 73,
          "metricName" : "One pagers"
       },
       {
          "metricCount" : 15,
          "metricName" : "Product Notes"
       }];
        this.departmentSource = '';
        this.physicianSource = '';
        this.facilityCount = this.facilitysource.reduce((accumulator, value) => {
          return accumulator + value.metricCount;
        }, 0);
        // this.facilityCount = regionResponse.totalMetricCount;
      } else if (regionResponse.selectedRegion == '') {
        this.regionSoruce = regionResponse.metricList;
        this.departmentSource = '';
        this.physicianSource = '';
        this.regionCount = regionResponse.metricList.reduce((accumulator, value) => {
          return accumulator + value.metricCount;
        }, 0);
        // this.regionCount = regionResponse.totalMetricCount;
      }
    } else {
      this.toasterService.showError(
        regionData['ProcessVariables']?.errorMessage == undefined ? 'Metric Region Wise List' : regionData['ProcessVariables']?.errorMessage,
        'Tickets'
      );
    }
  }

  getDateFilter() {
    if (this.fromInput.value && this.toInput.value) {
      const params = {
        from_date: moment(this.fromInput.value).format("YYYY-MM-DD"),
        to_date: moment(this.toInput.value).format("YYYY-MM-DD")
      };
      this.facilitysource = '';
      this.getRegionData(params);
      this.toasterService.showSuccess('Date filters applied successfully', 'Success');
    } else {
      this.toasterService.showError(
        'Please fill date fields to apply filter',
        'Error'
      );
    }
  }

  clearDate() {
    this.fromInput.value = '';
    this.toInput.value = '';
    this.toasterService.showSuccess('Date inputs cleared successfully', 'Success');
    const params = {
      from_date: this.fromInput.value,
      to_date: this.toInput.value,
    };
    this.facilitysource = '';
    this.getRegionData(params);
  }

  getFacility(regionId) {
    if(regionId == 'Market Updates') {
      this.selectedFacility='Market Updates'
      this.selectedInfoOne='';
      this.selectedInfoNotes='';
      this.selectedProduct='';
      this.market_updates=true;
      this.selectedProduct=''
      this.product_info=false;
      this.one_pagers=false;
      this.product_notes=false;
    } else if(regionId == 'Product Info') {
      this.selectedFacility='';
      this.selectedInfoOne='';
      this.selectedInfoNotes='';
      this.selectedProduct='Product'
      this.market_updates=false;
      this.product_info=true;
      this.one_pagers=false;
      this.product_notes=false;
    } else {
      this.selectedFacility=''
      this.selectedProduct=''
      this.market_updates=false;
      this.product_info=false;
      this.one_pagers=false;
      this.product_notes=false;
    }
    // this.regionName  = regionName;
    this.selectedActive = true;
    this.regionId = regionId;
    const params = {
      selectedRegion: this.regionId,
      from_date: this.fromInput.value ? moment(this.fromInput.value).format("YYYY-MM-DD") : '',
      to_date: this.toInput.value ? moment(this.toInput.value).format("YYYY-MM-DD") : '',
    };
    this.getRegionData(params);
  }

  getHospital(facilityId) {
    
    if(facilityId == 'One pagers') {
      this.selectedDebt='';
      this.selectedHybrid='';
      this.selectedEquity='';
      this.selectedInfoOne='One Pagers'
      this.selectedInfoNotes=''
      this.one_pagers=true;
      this.product_notes=false;
    } else if(facilityId == 'Product Notes') {
      this.selectedDebt='';
      this.selectedHybrid='';
      this.selectedEquity='';
      this.selectedInfoOne='';
      this.selectedInfoNotes='Product'
      this.one_pagers=false;
      this.product_notes=true;
    } else {
      this.selectedDebt='';
      this.selectedHybrid='';
      this.selectedEquity='';
      this.selectedFacility=''
      this.selectedProduct='';
      this.selectedInfoOne='';
      this.selectedInfoNotes='';
      this.one_pagers=false;
      this.product_notes=false;
    }
    this.facilityId = facilityId;
    const params = {
      selectedRegion: this.regionId,
      selectedFacility: this.facilityId,
      from_date: this.fromInput.value ? moment(this.fromInput.value).format("YYYY-MM-DD") : '',
      to_date: this.toInput.value ? moment(this.toInput.value).format("YYYY-MM-DD") : '',
    };
    this.getRegionData(params);
  }

  getPhysician(pasicianId) {
    console.log(pasicianId)
    if(pasicianId == 'Equity') {
      this.selectedEquity='Equity';
      this.selectedHybrid=''
      this.selectedDebt=''
      this.equity=true;
      this.hybrid=false;
      this.debt=false;
    } else if(pasicianId == 'Hybrid') {
      this.selectedHybrid='Hybrid';
      this.selectedDebt='';
      this.selectedEquity=''
      this.equity=false;
      this.hybrid=true;
      this.debt=false;
    } else if(pasicianId == 'Debt') {
      this.selectedDebt='Debt';
      this.selectedEquity='';
      this.selectedHybrid=''
      this.equity=false;
      this.hybrid=false;
      this.debt=true;
    } else {
      this.selectedDebt='';
      this.selectedHybrid='';
      this.selectedEquity='';
      this.equity=false;
      this.hybrid=false;
      this.debt=false;
    }
    this.physicianId = pasicianId;
    const params = {
      metricType: 'PHYSICIAN',
      selectedRegion: this.regionId,
      selectedFacility: this.facilityId,
      selectedDepartment: this.physicianId,
      from_date: this.fromInput.value ? moment(this.fromInput.value).format("YYYY-MM-DD") : '',
      to_date: this.toInput.value ? moment(this.toInput.value).format("YYYY-MM-DD") : '',
    };
    this.getRegionData(params);
  }
}

// export interface counrty {
//   no: number;
//   country: string;

// }

// interface facility{
//   no: number;
//   hospital : string;
// }

// interface department{
//   no: number;
//   department : string;
// }

// const ELEMENT_DATA: counrty[] = [
//   {no: 1, country: 'Dubai'},
//   {no: 2, country: 'Sharjah'},
//   {no: 3, country: 'Al Alim'},
//   {no: 4, country: 'Abhudhabi'},

// ];

// const Facility_DATA: facility[] = [
//   {no: 1, hospital: 'hospital 1'},
//   {no: 2, hospital: 'hospital 2'},
//   {no: 3, hospital: 'hospital 3'},
//   {no: 4, hospital: 'hospital 4'},
//   {no: 4, hospital: 'hospital 4'},
//   {no: 4, hospital: 'hospital 4'},
//   {no: 4, hospital: 'hospital 4'},
//   {no: 4, hospital: 'hospital 4'},
//   {no: 4, hospital: 'hospital 4'},
//   {no: 4, hospital: 'hospital 4'},
// ]

// const Department_Data: department[] = [
//   {no: 1, department: 'Dubai'},
//   {no: 2, department: 'Sharjah'},
//   {no: 3, department: 'Al Alim'},
//   {no: 4, department: 'Abhudhabi'},

// ];
