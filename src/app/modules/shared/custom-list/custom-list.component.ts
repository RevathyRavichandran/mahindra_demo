// import { Component, OnInit, Output, ViewChild, EventEmitter, Input, OnChanges } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
// import { DateRangeService } from '@services/date-range.service';
// import { ToasterService } from '@services/toaster.service';
// import { UtilityService } from '@services/utility.service';
// import { DaterangepickerComponent } from 'ng2-daterangepicker';


// @Component({
//   selector: 'app-custom-list',
//   templateUrl: './custom-list.component.html',
//   styleUrls: ['./custom-list.component.css']
// })
// export class CustomListComponent implements OnInit, OnChanges {

//   pageSize = 8;
//   pageSizes = [3, 5, 8, 10, 15, 20, 25, 30];

//   searchForm: FormGroup
//   searchFromDate: any = '';
//   searchToDate: any = '';
//   @ViewChild(DaterangepickerComponent)
//   private picker: DaterangepickerComponent;
//   // roleType: string;
//   formDetails: any;
//   tableDetails: any = {};
//   isShow: boolean = false;
//   dataArr: any;
//   totalRecords: any;
//   title: any;
//   totalCount: Number;
//   isNoRecord: boolean = true;
//   appointmentRating: any;
//   totalAppointment: any;
//   totalVisitors: any;
//   conversion: boolean ;
//   feedBackValue: boolean;
//   agentValue: boolean;
//   appointment: boolean;
//   feedback : boolean;
//   greatCount: any;
//   goodCount: any;
//   okCount: any;
//   badCount: any;

//   // variables for user count

//   deckCount: any;
//   marketUpdate: any;
//   productInfo: any;
//   productDeck: any;
//   monthlyFactsheet: any;
//   total_product_info_user_count: any;
//   onePager: any;
//   total_product_notes_user_count: any;
//   total_equity_user_count: any;
//   total_hybrid_user_count: any;
//   total_debt_user_count: any;
//   total_digital_user_count: any;
//   productOnePagercount: any;
//   productrPoductnotescount: any;

//   @Input() set initValues(value: any) {
//     console.log('value', value)
//     if (!value) {
//       return;
//     }
//     this.title = value?.title
//     this.tableDetails['header'] = value?.header;
//     const form = value?.formDetails
//     this.searchForm = new FormGroup({});
//     form.map((el) => {
//       this.searchForm.addControl(el['controlName'], new FormControl(''))
//     })


//     this.formDetails = value?.formDetails;
//     this.isShow = true;
//   }


//   @Input() set data(value: any) {
//     console.log('value', value)
//     if (!value) {
//       return;
//     }
//     const data = value?.data;
//     this.isNoRecord = (!data || data.length == 0) ? true : false;
//     this.itemsPerPage = Number(value?.itemsPerPage),
//       this.page = Number(value?.perPage)
//     this.totalCount = Number(value?.totalCount);
//     this.tableDetails['keys'] = value?.keys;
//     const headers = this.tableDetails['header'] ;
//     const keys = this.tableDetails['keys']
//     if ( headers && keys && (headers?.length !== keys?.length)) {
//       console.log('this.tableDetails', this.tableDetails)
//       this.toasterService.showInfo('Table Column Count', "Mistatch")
//       this.isNoRecord = true;
//       return;
//     }
//     this.totalRecords = value?.totalRecords;
//     this.totalVisitors = value?.totalVisitors;
//     this.totalAppointment = value?.totalAppointment;
//     this.appointmentRating = value?.appointmentRating;
//     this.conversion = value?.conversion;
//     this.appointment = value?.appointment;
//     this.feedback = value?.feedback;
//     this.greatCount = value?.greatCount;
//     this.goodCount = value?.goodCount;
//     this.okCount = value?.okCount;
//     this.badCount = value?.badCount;   
//     this.dataArr = value?.data;
//     this.feedBackValue = value?.feedbackValue;
//     this.agentValue = value?.agentValue;
//     this.productOnePagercount = value?.productOnePagercount;
//     this.productrPoductnotescount = value?.productrPoductnotescount;
    

//     // this for user counts

//     this.deckCount = value?.CorporateDeckCount;
//     this.marketUpdate = value?.marketUpdateCount;
//     this.productInfo = value?.productInfoCount;
//     this.productDeck = value?.productdeckCount;
//     this.monthlyFactsheet = value?.productMonthlycount;
//     this.onePager = value?.onePager;
//     this.total_product_info_user_count = value?.total_product_info_user_count;
//     this.total_product_notes_user_count = value?.total_product_notes_user_count;
//     this.total_equity_user_count = value?.total_equity_user_count;
//     this.total_hybrid_user_count = value?.total_hybrid_user_count;
//     this.total_debt_user_count = value?.total_debt_user_count;
//     this.total_digital_user_count=value?.digitalUser;
//   }

//   @Output() download = new EventEmitter();
//   @Output() applyAndClear = new EventEmitter();
//   @Output() pagination = new EventEmitter();


//   public daterange: any = {};

//   options: any;
//   itemsPerPage: Number;
//   page: Number;
//   isApplyClicked: boolean;
//   searchDatas: any = {};
//   dateRangeValue: String = '';

//   constructor(private dateService: DateRangeService,
//     private utilityService: UtilityService,
//     private toasterService: ToasterService) {
//     // this.roleType = localStorage.getItem('roleType')
//   }

//   ngOnInit(): void {
//     this.options = {
//       autoUpdateInput: false,
//       locale: { format: 'YYYY-MM-DD', },
//       alwaysShowCalendars: true,
//       startDate: this.dateService.getWhichDay(6),
//       endDate: this.dateService.getWhichDay(0),
//       //minDate: this.dateService.getLastTweleveMonthDate(),
//       maxDate: new Date(),
//       ranges: {
//         'Today': [this.dateService.getWhichDay(0)],
//         'Yesterday': [this.dateService.getWhichDay(1), this.dateService.getWhichDay(1)],
//         'Last 7 Days': [this.dateService.getWhichDay(6)],
//         'Last 30 Days': [this.dateService.getWhichDay(29)],
//         // 'This Month': [moment().startOf('month'), moment().endOf('month')],
//         // 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//       }
//     };
//     if(this.title == 'One Pagers' || this.title == 'Product Notes') {
//       this.searchForm.get("folderName")?.valueChanges.subscribe(x => {
//         console.log('firstname value changed')
//         if(x=='One Pagers') {
//           this.formDetails[2].list= [
//             {
//               key: 'Equity',
//               value: 'Equity'
//             },
//             {
//               key: 'Hybrid',
//               value: 'Hybrid'
//             },
//             {
//               key: 'Debt',
//               value: 'Debt'
//             },
          
//           ]
//         } else if (x=='Product Notes') {
//           this.formDetails[2].list= [
//             {
//               key: 'Equity',
//               value: 'Equity'
//             },
//             {
//               key: 'Hybrid',
//               value: 'Hybrid'
//             },
          
//           ]
//         }
//         else if (x=='' || x==null) {
        
//           this.searchForm.controls['info1'].setValue("");
//           this.searchForm.controls['type_prod'].setValue("");
//           this.formDetails[2].list= [];
//           this.formDetails[3].list= [];
//         }
        
//         console.log(x, this.formDetails[2])
//      })
//      this.searchForm.get("subFolder")?.valueChanges.subscribe(x => {
//       console.log('firstname value changed')
//       if(x=='Equity') {
//         this.formDetails[2].list= [
         
//           {
//             key: 'ELSS Kar Bachat Yojana - PDF',
//             value: 'ELSS Kar Bachat Yojana - PDF'
//           },
//           {
//             key: 'Multi Cap Badhat Yojana - PDF',
//             value: 'Multi Cap Badhat Yojana - PDF'
//           },
//           {
//               key: 'Mid Cap Unnati Yojana-PDF',
//               value: 'Mid Cap Unnati Yojana-PDF'
//             },
//             {
//               key: 'Rural and Consumption-PDF',
//               value: 'Rural and Consumption-PDF'
//             },
//             {
//               key: 'Large Cap Pragati Yojana-PDF',
//               value: 'Large Cap Pragati Yojana-PDF'
//             },
//             {
//               key: 'Top 250 Nivesh Yojanac-PDF',
//               value: 'Top 250 Nivesh Yojanac-PDF'
//             },
//             {
//               key: 'Focused Equity Yojana-PDF',
//               value: 'Focused Equity Yojana-PDF'
//             },
//             {
//               key: 'Flexi Cap Yojana-PDF',
//               value: 'Flexi Cap Yojana-PDF'
//             }
        
//         ]
//       } 
//       else if (x=='Hybrid') {
//         this.formDetails[2].list= [
//           {
//                   key: 'Balancing benefit yojana',
//                   value: 'Balancing benefit yojana'
//                 },
//                 {
//                   key: 'Equity Nivesh Yojana',
//                   value: 'Equity Nivesh Yojana'
//                 },
//                 {
//                   key: 'Arbitrage Yojana',
//                   value: 'Arbitrage Yojana'
//                 },
//                 {
//                   key: 'Balancing benefit yojana',
//                   value: 'Balancing benefit yojana'
//                 },
        
//         ]
//       }
//       else if (x=='Debt') {
//         this.formDetails[2].list= [
//           {
//                   key: 'Liquid Fund',
//                   value: 'Liquid Fund'
//                 },
//                 {
//                   key: 'Low Duration Fund',
//                   value: 'Low Duration Fund'
//                 },
//                 {
//                   key: 'Dynamic Bond Yojana',
//                   value: 'Dynamic Bond Yojana'
//                 },
//                 {
//                   key: 'Ultra Short Term Fund',
//                   value: 'Ultra Short Term Fund'
//                 },
//                 {
//                   key: 'Short Term Fund',
//                   value: 'Short Term Fund'
//                 },
        
//         ]
//       }
//       else if (x=='' || x==null) {
//         this.searchForm.controls['type_prod'].setValue("");
//         this.formDetails[3].list= [];
//       }
      
//       console.log(x, this.formDetails[3])
//    })
//     }
    
//   }

//   ngOnChanges() {
    
//   }

//   public selectedDate(value: any, datepicker?: any) {
//     // this is the date  selected
//     console.log(value);

//     // any object can be passed to the selected event and it will be passed back here
//     datepicker.start = value.start;
//     datepicker.end = value.end;

//     // use passed valuable to update state
//     this.daterange.start = value.start;
//     this.daterange.end = value.end;
//     this.daterange.label = value.label;


//     const startDate = this.dateService.getTicketDateFormat(value.start['_d']);
//     const endDate = this.dateService.getTicketDateFormat(value.end['_d']);

//     this.searchFromDate = startDate;

//     this.searchToDate = endDate;

//     this.dateRangeValue = `${this.searchFromDate} - ${this.searchToDate}`
//   }

//   clearDate() {
//     this.searchFromDate = '';
//     this.searchToDate = '';
//     this.dateRangeValue = '';
//   }


//   onDownload() {
//     const formValue = this.searchForm.getRawValue()
//     this.download.emit(this.searchDatas)
//   }

//   clear() {
//     if (!this.isApplyClicked) {
//       return;
//     }
//     this.isApplyClicked = false;
//     this.searchForm.reset()
//     this.searchFromDate = '';
//     this.searchToDate = '';
//     this.dateRangeValue = '';

//     this.picker.datePicker.setStartDate(this.dateService.getWhichDay(6));
//     this.picker.datePicker.setEndDate(this.dateService.getWhichDay(0));
//     this.page = 1;
//     this.searchDatas = {}
//     const filterClearedDatas = {
//       searchDatas: this.searchDatas,
//       pageIndex: 1
//     }

//     this.applyAndClear.emit(filterClearedDatas)
//   }

//   handlePageSizeChange(event) {
//     console.log('test', event)
//     this.apply();
//   }
//   apply() {
//     console.log('test apply')
//     const formValue = this.searchForm.getRawValue();
//     const isHaveValues = Object.keys(formValue).some((key) => {
//       return (!!(formValue[key]) || !!this.dateRangeValue)
//     })
//     if (!isHaveValues) {
//       this.clear()
//       return;
//     }
//     this.isApplyClicked = true;

//     this.searchDatas = {
//       from_date: this.searchFromDate,
//       to_date: this.searchToDate,
//       isApplyFilter: true,
//       per_page: this.pageSize,
//       ...formValue,
//     }

//     // if(this.title != 'Feedback'){
//     //   this.searchDatas['isApplyFilter'] = true
//     // }

//     const filterAppliedDatas = {
//       searchDatas: this.searchDatas,
//       pageIndex: 1
//     }
//     this.applyAndClear.emit(filterAppliedDatas)
//   }

//   pageChangeEvent(event) {
//     this.page = Number(event);
//     const paginationDatas = {
//       searchDatas: this.searchDatas,
//       pageIndex: this.page,
//       per_page: this.pageSize
//     }
//     this.pagination.emit(paginationDatas)

//   }

// }



// copied

import { Component, OnInit, Output, ViewChild, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateRangeService } from '@services/date-range.service';
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
import { DaterangepickerComponent } from 'ng2-daterangepicker';


@Component({
  selector: 'app-custom-list',
  templateUrl: './custom-list.component.html',
  styleUrls: ['./custom-list.component.css']
})
export class CustomListComponent implements OnInit, OnChanges {

  searchForm: FormGroup
  searchFromDate: any = '';
  searchToDate: any = '';
  @ViewChild(DaterangepickerComponent)
  private picker: DaterangepickerComponent;
  // roleType: string;
  formDetails: any;
  tableDetails: any = {};
  isShow: boolean = false;
  dataArr: any;
  totalRecords: any;
  title: any;
  totalCount: Number;
  isNoRecord: boolean = true;
  appointmentRating: any;
  totalAppointment: any;
  totalVisitors: any;
  conversion: boolean ;
  feedBackValue: boolean;
  agentValue: boolean;
  appointment: boolean;
  feedback : boolean;
  greatCount: any;
  goodCount: any;
  okCount: any;
  badCount: any;
  totalconsent= "";
  totalService="";
  totalProdOffer="";
  totalProdCat="";
  totalFeedback="";

  @Input() set initValues(value: any) {
    console.log('value', value)
    if (!value) {
      return;
    }
    this.title = value?.title
    this.tableDetails['header'] = value?.header;
    const form = value?.formDetails
    this.searchForm = new FormGroup({});
    form.map((el) => {
      this.searchForm.addControl(el['controlName'], new FormControl(''))
    })


    this.formDetails = value?.formDetails;
    this.isShow = true;
  }


  @Input() set data(value: any) {
    console.log('value', value)
    if (!value) {
      return;
    }
    const data = value?.data;
    this.isNoRecord = (!data || data.length == 0) ? true : false;
    this.itemsPerPage = Number(value?.itemsPerPage),
      this.page = Number(value?.perPage)
    this.totalCount = Number(value?.totalCount);
    this.tableDetails['keys'] = value?.keys;
    const headers = this.tableDetails['header'] ;
    const keys = this.tableDetails['keys']
    if ( headers && keys && (headers?.length !== keys?.length)) {
      console.log('this.tableDetails', this.tableDetails)
      this.toasterService.showInfo('Table Column Count', "Mistatch")
      this.isNoRecord = true;
      return;
    }
    this.totalRecords = value?.totalRecords;
    this.totalVisitors = value?.totalVisitors;
    this.totalAppointment = value?.totalAppointment;
    this.appointmentRating = value?.appointmentRating;
    this.conversion = value?.conversion;
    this.appointment = value?.appointment;
    this.feedback = value?.feedback;
    this.greatCount = value?.greatCount;
    this.goodCount = value?.goodCount;
    this.okCount = value?.okCount;
    this.badCount = value?.badCount;   
    this.dataArr = value?.data;
    this.feedBackValue = value?.feedbackValue;
    this.agentValue = value?.agentValue;

    // hardcoded

    this.totalconsent = value?.totalconsent;
    this.totalService = value?.totalService;
    this.totalProdOffer=value?.totalProdOffer;
    this.totalProdCat=value?.totalProdCat; 
    this.totalFeedback =value?.totalFeedback;
  }

  @Output() download = new EventEmitter();
  @Output() applyAndClear = new EventEmitter();
  @Output() pagination = new EventEmitter();


  public daterange: any = {};

  options: any;
  itemsPerPage: Number;
  page: Number;
  isApplyClicked: boolean;
  searchDatas: any = {};
  dateRangeValue: String = '';

  constructor(private dateService: DateRangeService,
    private utilityService: UtilityService,
    private toasterService: ToasterService) {
    // this.roleType = localStorage.getItem('roleType')
  }

  ngOnInit(): void {
    this.options = {
      autoUpdateInput: false,
      locale: { format: 'YYYY-MM-DD', },
      alwaysShowCalendars: true,
      startDate: this.dateService.getWhichDay(6),
      endDate: this.dateService.getWhichDay(0),
      //minDate: this.dateService.getLastTweleveMonthDate(),
      maxDate: new Date(),
      ranges: {
        'Today': [this.dateService.getWhichDay(0)],
        'Yesterday': [this.dateService.getWhichDay(1), this.dateService.getWhichDay(1)],
        'Last 7 Days': [this.dateService.getWhichDay(6)],
        'Last 30 Days': [this.dateService.getWhichDay(29)],
        // 'This Month': [moment().startOf('month'), moment().endOf('month')],
        // 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    };
    this.searchForm.get("products")?.valueChanges.subscribe(x => {
      console.log('firstname value changed')
      if(x=='LED TV') {
        this.formDetails[2].list= [
          {
            key: 'Get Product Catalogue',
            value: 'Get Product Catalogue'
          },
          {
            key: 'Know Current Offers',
            value: 'Know Current Offers'
          },
          {
            key: 'Locate Store Near You',
            value: 'DLocate Store Near Youebt'
          },
          {
            key: 'Buy a Product',
            value: 'Buy a Product'
          },
          {
            key: 'Book Online Product Demo',
            value: 'Book Online Product Demo'
          },
        
        ]
      } else if (x=='Air Conditioner' ) {
        this.formDetails[2].list= [
          {
            key: 'Product Catalogue',
            value: 'Product Catalogue'
          },
          {
            key: 'Know Current Offers',
            value: 'Know Current Offers'
          },
          {
            key: 'Locate Store Near You',
            value: 'Locate Store Near You'
          },
          {
            key: 'Buy a Product',
            value: 'Buy a Product'
          },
          {
            key: 'Book Online Product Demo',
            value: 'Book Online Product Demo'
          },
          {
            key: 'nanaoeX - Know more',
            value: 'nanaoeX - Know more'
          },
        
        ]
      }
      else if (x=='Washing Machine' || x=='Refrigerator' ) {
        this.formDetails[2].list= [
          {
            key: 'Product Catalogue',
            value: 'Product Catalogue'
          },
          {
            key: 'Know Current Offers',
            value: 'Know Current Offers'
          },
          {
            key: 'Locate Store Near You',
            value: 'Locate Store Near You'
          },
          {
            key: 'Buy a Product',
            value: 'Buy a Product'
          },
          {
            key: 'Book Online Product Demo',
            value: 'Book Online Product Demo'
          },
         
        
        ]
      }
      else if (x=='Microwave Oven') {
        this.formDetails[2].list= [
          {
            key: 'Product Catalogue',
            value: 'Product Catalogue'
          },
          {
            key: 'Know Current Offers',
            value: 'Know Current Offers'
          },
          {
            key: 'Locate Store Near You',
            value: 'Locate Store Near You'
          },
          {
            key: 'Buy a Product',
            value: 'Buy a Product'
          },
          {
            key: 'Book Online Product Demo',
            value: 'Book Online Product Demo'
          },
          {
            key: 'Cookery Classes',
            value: 'Cookery Classes'
          },
          {
            key: 'Microwave Recipes',
            value: 'Microwave Recipes'
          },
        
        ]
      }
      else if (x=='Camera') {
        this.formDetails[2].list= [
          {
            key: 'Product Catalogue',
            value: 'Product Catalogue'
          },
          {
            key: 'Know Current Offers',
            value: 'Know Current Offers'
          },
          {
            key: 'Locate Store Near You',
            value: 'Locate Store Near You'
          },
          {
            key: 'Buy a Product',
            value: 'Buy a Product'
          },
        
        
        ]
      }
      else if (x=='Camera') {
        this.formDetails[2].list= [
          {
            key: 'Product Catalogue',
            value: 'Product Catalogue'
          },
          {
            key: 'Know Current Offers',
            value: 'Know Current Offers'
          },
          {
            key: 'Locate Store Near You',
            value: 'Locate Store Near You'
          },
          {
            key: 'Buy a Product',
            value: 'Buy a Product'
          },
        ]
      }
      else if (x=='Audio System') {
        this.formDetails[2].list= [
          {
            key: 'Product brouchure',
            value: 'Product brouchure'
          },
          {
            key: 'Know Current Offers',
            value: 'Know Current Offers'
          },
          {
            key: 'Locate Store Near You',
            value: 'Locate Store Near You'
          },
          {
            key: 'Buy a Product',
            value: 'Buy a Product'
          },
        ]
      }
      else if (x=='Beauty Care Products' || x=='Air Purifier' || x=='Water Purifier' || x=='Vacuum Cleaner' || x=='Iron') {
        this.formDetails[2].list= [
          {
            key: 'Product Catalogue',
            value: 'Product Catalogue'
          },
          {
            key: 'Know Current Offers',
            value: 'Know Current Offers'
          },
          {
            key: 'Locate Store Near You',
            value: 'Locate Store Near You'
          },
          {
            key: 'Buy a Product',
            value: 'Buy a Product'
          },
        ]
      }
      else if (x=='Miraie') {
        this.formDetails[2].list= [
          {
            key: 'Product Catalogue',
            value: 'Product Catalogue'
          },
          {
            key: 'Download Miraie App',
            value: 'Download Miraie Apps'
          },
          {
            key: 'Know more about Miraie',
            value: 'Know more about Miraie'
          },
          {
            key: 'Book Online Product Demo',
            value: 'Book Online Product Demo'
          },
        
        
        ]
      }
      else if (x=='Chest Freezer') {
        this.formDetails[2].list= [
          {
            key: 'Product brouchure',
            value: 'Product brouchure'
          },
          {
            key: 'Know Current Offers',
            value: 'Know Current Offers'
          },
          {
            key: 'Locate Store Near You',
            value: 'Locate Store Near You'
          },
        
        ]
      }
      else if (x=='Video Conf Cameras') {
        this.formDetails[2].list= [
          {
            key: 'Get Product Catalogue',
            value: 'Get Product Catalogue'
          },
          {
            key: 'Buy a Product',
            value: 'Buy a Product'
          },
          {
            key: 'Online Demo',
            value: 'Online Demo'
          },
        
        ]
      }
      else if (x=='' || x==null) {
      
        this.searchForm.controls['subs'].setValue("");
        // this.searchForm.controls['type_prod'].setValue("");
        this.formDetails[2].list= [];
        // this.formDetails[3].list= [];
      }
      
      console.log(x, this.formDetails[2])
   })
//    this.searchForm.get("info1")?.valueChanges.subscribe(x => {
//     console.log('firstname value changed')
//     if(x=='Equity') {
//       this.formDetails[3].list= [
       
//         {
//           key: 'ELSS Kar Bachat Yojana - PDF',
//           value: 'ELSS Kar Bachat Yojana - PDF'
//         },
//         {
//           key: 'Multi Cap Badhat Yojana - PDF',
//           value: 'Multi Cap Badhat Yojana - PDF'
//         },
//         {
//             key: 'Mid Cap Unnati Yojana-PDF',
//             value: 'Mid Cap Unnati Yojana-PDF'
//           },
//           {
//             key: 'Rural and Consumption-PDF',
//             value: 'Rural and Consumption-PDF'
//           },
//           {
//             key: 'Large Cap Pragati Yojana-PDF',
//             value: 'Large Cap Pragati Yojana-PDF'
//           },
//           {
//             key: 'Top 250 Nivesh Yojanac-PDF',
//             value: 'Top 250 Nivesh Yojanac-PDF'
//           },
//           {
//             key: 'Focused Equity Yojana-PDF',
//             value: 'Focused Equity Yojana-PDF'
//           },
//           {
//             key: 'Flexi Cap Yojana-PDF',
//             value: 'Flexi Cap Yojana-PDF'
//           }
      
//       ]
//     } 
//     else if (x=='Hybrid') {
//       this.formDetails[3].list= [
//         {
//                 key: 'Balancing benefit yojana',
//                 value: 'Balancing benefit yojana'
//               },
//               {
//                 key: 'Equity Nivesh Yojana',
//                 value: 'Equity Nivesh Yojana'
//               },
//               {
//                 key: 'Arbitrage Yojana',
//                 value: 'Arbitrage Yojana'
//               },
//               {
//                 key: 'Balancing benefit yojana',
//                 value: 'Balancing benefit yojana'
//               },
      
//       ]
//     }
//     else if (x=='Debt') {
//       this.formDetails[3].list= [
//         {
//                 key: 'Liquid Fund',
//                 value: 'Liquid Fund'
//               },
//               {
//                 key: 'Low Duration Fund',
//                 value: 'Low Duration Fund'
//               },
//               {
//                 key: 'Dynamic Bond Yojana',
//                 value: 'Dynamic Bond Yojana'
//               },
//               {
//                 key: 'Ultra Short Term Fund',
//                 value: 'Ultra Short Term Fund'
//               },
//               {
//                 key: 'Short Term Fund',
//                 value: 'Short Term Fund'
//               },
      
//       ]
//     }
//     else if (x=='' || x==null) {
//       this.searchForm.controls['type_prod'].setValue("");
//       this.formDetails[3].list= [];
//     }
    
//     console.log(x, this.formDetails[3])
//  })
  }

  ngOnChanges() {
    
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

    this.dateRangeValue = `${this.searchFromDate} - ${this.searchToDate}`
  }

  clearDate() {
    this.searchFromDate = '';
    this.searchToDate = '';
    this.dateRangeValue = '';
  }


  onDownload() {
    const formValue = this.searchForm.getRawValue()
    this.download.emit(this.searchDatas)
  }

  clear() {
    if (!this.isApplyClicked) {
      return;
    }
    this.isApplyClicked = false;
    this.searchForm.reset()
    this.searchFromDate = '';
    this.searchToDate = '';
    this.dateRangeValue = '';

    this.picker.datePicker.setStartDate(this.dateService.getWhichDay(6));
    this.picker.datePicker.setEndDate(this.dateService.getWhichDay(0));
    this.page = 1;
    this.searchDatas = {}
    const filterClearedDatas = {
      searchDatas: this.searchDatas,
      pageIndex: 1
    }

    this.applyAndClear.emit(filterClearedDatas)
  }

  apply() {
    const formValue = this.searchForm.getRawValue();
    const isHaveValues = Object.keys(formValue).some((key) => {
      return (!!(formValue[key]) || !!this.dateRangeValue)
    })
    if (!isHaveValues) {
      this.clear()
      return;
    }
    this.isApplyClicked = true;

    this.searchDatas = {
      fromDate: this.searchFromDate,
      toDate: this.searchToDate,
      isApplyFilter: true,
      ...formValue,
    }

    // if(this.title != 'Feedback'){
    //   this.searchDatas['isApplyFilter'] = true
    // }

    const filterAppliedDatas = {
      searchDatas: this.searchDatas,
      pageIndex: 1
    }
    this.applyAndClear.emit(filterAppliedDatas)
  }

  pageChangeEvent(event) {
    this.page = Number(event);
    const paginationDatas = {
      searchDatas: this.searchDatas,
      pageIndex: this.page
    }
    this.pagination.emit(paginationDatas)

  }

}

