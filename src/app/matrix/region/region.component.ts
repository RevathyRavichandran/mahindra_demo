import { Component, OnInit, ViewChild } from '@angular/core';
import { MetricService } from '@services/metrics.service';
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
  
  facility: boolean = false;

  constructor(
    private enterpriseService: MetricService,
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
    const params = {
      "ProcessVariables": {
          "fromDate" : "",
          "selectedFolderName" : "",
            "selectedSubFolder" : "",
            "selectedUsecase" : "",
            "toDate" : ""
      }
    }

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

    this.enterpriseService.metricsList(params).subscribe(regionData => {

      console.log('region Data', regionData);

    const appiyoError = regionData?.Error;
    const apiErrorCode = regionData.ProcessVariables?.errorCode;
    const errorMessage = regionData.ProcessVariables?.errorMessage;

    if (appiyoError == '0') {
      const regionResponse = regionData['ProcessVariables'];
      console.log('response', regionResponse);
      const metricType = regionResponse.metricType;
      // this.regionCount = regionResponse.totalMetricCount;
      if (regionResponse.selectedSubFolder != '') {
        this.physicianSource = regionResponse.metricList;
        this.physicianCount = regionResponse.metricList.reduce((accumulator, value) => {
          return accumulator + parseInt(value.metricCount);
        }, 0);
        // this.physicianCount = regionResponse.totalMetricCount;
      } else if (regionResponse.selectedFolder != '') {
        this.departmentSource = regionResponse.metricList;
        this.physicianSource = '';
        this.departmentCount = regionResponse.metricList.reduce((accumulator, value) => {
          return accumulator + parseInt(value.metricCount);
        }, 0)
       } else if(regionResponse.selectedUsecase != '') {
        this.facility=true;
        this.facilitysource = regionResponse.metricList;
        this.departmentSource = '';
        this.physicianSource = '';
        this.facilityCount = regionResponse.metricList.reduce((accumulator, value) => {
          return accumulator + parseInt(value.metricCount);
        }, 0);
      } else if (regionResponse.selectedUsecase == '') {
        this.regionSoruce = regionResponse.metricList;
        this.departmentSource = '';
        this.physicianSource = '';
        this.regionCount = regionResponse.metricList.reduce((accumulator, value) => {
          return accumulator + parseInt(value.metricCount);
        }, 0);
        // this.regionCount = regionResponse.totalMetricCount;
      }
    } else {
      this.toasterService.showError(
        regionData['ProcessVariables']?.errorMessage == undefined ? 'Metric Region Wise List' : regionData['ProcessVariables']?.errorMessage,
        'Tickets'
      );
    }

    })

    
  }

  getDateFilter() {
    if (this.fromInput.value && this.toInput.value) {
      const params = {
        "ProcessVariables": {
          "fromDate" : this.fromInput.value ? moment(this.fromInput.value).format("YYYY-MM-DD") : '',
          "selectedFolder" : "",
            "selectedSubFolder" : "",
            "selectedUsecase" : "",
            "toDate" : this.toInput.value ? moment(this.toInput.value).format("YYYY-MM-DD") : '',
      }
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
    // this.regionName  = regionName;

    this.selectedActive = true;
    this.regionId = regionId;
    const params = {
      "ProcessVariables": {
          "fromDate" : this.fromInput.value ? moment(this.fromInput.value).format("YYYY-MM-DD") : '',
          "selectedFolder" : "",
            "selectedSubFolder" : "",
            "selectedUsecase" : this.regionId,
            "toDate" : this.toInput.value ? moment(this.toInput.value).format("YYYY-MM-DD") : '',
      }
    }
    if(regionId == 'Market_Updates' || regionId == 'Product_Info') {
      this.getRegionData(params);
    } else {
      this.facilitysource=[];
      this.facilityCount=0;
      this.departmentSource=[];
    }
    // this.getRegionData(params);
  }

  getHospital(facilityId) {
    
    this.facilityId = facilityId;
    const params = {
      "ProcessVariables": {
          "fromDate" : this.fromInput.value ? moment(this.fromInput.value).format("YYYY-MM-DD") : '',
          "selectedFolder" : this.facilityId,
            "selectedSubFolder" : "",
            "selectedUsecase" : this.regionId,
            "toDate" : this.toInput.value ? moment(this.toInput.value).format("YYYY-MM-DD") : '',
      }
    }
    if(facilityId == 'One_Pagers' || facilityId == 'Product_Notes') {
      this.getRegionData(params);
    } else {
      this.departmentSource=[]
    }
    // this.getRegionData(params);
  }

  getPhysician(pasicianId) {
    
    this.physicianId = pasicianId;
    const params = {
      "ProcessVariables": {
          "fromDate" : this.fromInput.value ? moment(this.fromInput.value).format("YYYY-MM-DD") : '',
          "selectedFolder" : this.facilityId,
            "selectedSubFolder" : this.physicianId,
            "selectedUsecase" : this.regionId,
            "toDate" : this.toInput.value ? moment(this.toInput.value).format("YYYY-MM-DD") : '',
      }
    }
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
