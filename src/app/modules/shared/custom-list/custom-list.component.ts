import { Component, OnInit, Output, ViewChild, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateRangeService } from '@services/date-range.service';
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import { MarketUpdateService } from '@services/market-update.service';
import { ProductInfoService } from '@services/product-info.service';
import { OnePagerService } from '@services/one-pager.service';
import { ProductNotesService } from '@services/product-notes.service'


@Component({
  selector: 'app-custom-list',
  templateUrl: './custom-list.component.html',
  styleUrls: ['./custom-list.component.css']
})
export class CustomListComponent implements OnInit, OnChanges {

  pageSize = 8;
  pageSizes = [3, 5, 8, 10, 15, 20, 25, 30];

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

  // variables for user count

  deckCount: any;
  marketUpdate: any;
  productInfo: any;
  productDeck: any;
  monthlyFactsheet: any;
  total_product_info_user_count: any;
  onePager: any;
  total_product_notes_user_count: any;
  total_equity_user_count: any;
  total_hybrid_user_count: any;
  total_debt_user_count: any;
  total_digital_user_count: any;
  productOnePagercount: any;
  productrPoductnotescount: any;

  total: any;

  itemper: any;

  lUsers: any[] = [
    { id: 1, Name: '3', select: false},
    { id: 2, Name: '5', select: false},
    { id: 3, Name: '8', select: true},
    { id: 4, Name: '10', select: false},
    { id: 5, Name: '15', select: false },
    { id: 6, Name: '20', select: false},
    { id: 7, Name: '25', select: false },
    { id: 8, Name: '30', select: false}
  ];
  curUser: any = this.lUsers[2]; // first will be selected by default by browser


  @Input() set initValues(value: any) {
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
    this.productOnePagercount = value?.productOnePagercount;
    this.productrPoductnotescount = value?.productrPoductnotescount == 0 ? '0' : value?.productrPoductnotescount;
    

    // this for user counts

    this.total = value?.total;

    this.deckCount = value?.CorporateDeckCount;
    this.marketUpdate = value?.marketUpdateCount;
    this.productInfo = value?.productInfoCount;
    this.productDeck = value?.productdeckCount;
    this.monthlyFactsheet = value?.productMonthlycount;
    this.onePager = value?.onePager;
    this.total_product_info_user_count = value?.total_product_info_user_count;
    this.total_product_notes_user_count = value?.total_product_notes_user_count;
    this.total_equity_user_count = value?.total_equity_user_count;
    this.total_hybrid_user_count = value?.total_hybrid_user_count;
    this.total_debt_user_count = value?.total_debt_user_count;
    this.total_digital_user_count=value?.digitalUser;
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
    public productInform: ProductInfoService,
    public onePagers: OnePagerService,
    public productNote: ProductNotesService,
    public market: MarketUpdateService,
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

    if(this.title == 'Market Updates') {
      this.searchForm.get("folderName")?.valueChanges.subscribe(folder => {
        var payload1 = {ProcessVariables:{
          folder_name: folder
        }}
        this.market.filelist(payload1).subscribe(res=>{
          this.formDetails[2].list= res.ProcessVariables.output_data;
        }) 
        console.log('market',folder)
      })
    } else if(this.title == 'Product Information') {
      this.searchForm.get("folderName")?.valueChanges.subscribe(folder => {
        var payload1 = {ProcessVariables:{
          folder_name: folder
        }}
        this.productInform.filelist(payload1).subscribe(res=>{
          this.formDetails[2].list= res.ProcessVariables.output_data;
        })
      })
    } else if(this.title == 'One Pagers') {
      this.searchForm.get("subFolder")?.valueChanges.subscribe(folder => {
        var payload1 = {ProcessVariables:{
          subFolder: folder
        }}
        this.onePagers.filelist(payload1).subscribe(res=>{
          this.formDetails[2].list= res.ProcessVariables.output_data;
        })
      })
    } else if(this.title == 'Product Notes') {
      this.searchForm.get("subFolder")?.valueChanges.subscribe(folder => {
        var payload1 = {ProcessVariables:{
          subFolder: folder
        }}
        this.productNote.filelist(payload1).subscribe(res=>{
          this.formDetails[2].list= res.ProcessVariables.output_data;
        })
      })
    }
    
    
    if(this.title == 'One Pagers' || this.title == 'Product Notes') {
      this.searchForm.get("folderName")?.valueChanges.subscribe(x => {
        if(x=='One Pagers') {
          this.formDetails[2].list= [
            {
              key: 'Equity',
              value: 'Equity'
            },
            {
              key: 'Hybrid',
              value: 'Hybrid'
            },
            {
              key: 'Debt',
              value: 'Debt'
            },
          
          ]
        } else if (x=='Product Notes') {
          this.formDetails[2].list= [
            {
              key: 'Equity',
              value: 'Equity'
            },
            {
              key: 'Hybrid',
              value: 'Hybrid'
            },
          
          ]
        }
        else if (x=='' || x==null) {
        
          this.searchForm.controls['info1'].setValue("");
          this.searchForm.controls['type_prod'].setValue("");
          this.formDetails[2].list= [];
          this.formDetails[3].list= [];
        }
        
     })
    }
    
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

  setNewUser(name: any): void {
    this.itemper = name;
    this.apply();
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

  handlePageSizeChange(event) {
    this.apply();
  }
  apply() {
    console.log('test apply')
    const formValue = this.searchForm.getRawValue();
    const isHaveValues = Object.keys(formValue).some((key) => {
      return (!!(formValue[key]) || !!this.dateRangeValue)
    })
    if (!isHaveValues && !this.itemper) {
      this.clear()
      return;
    }
    this.isApplyClicked = true;

    this.searchDatas = {
      from_date: this.searchFromDate,
      to_date: this.searchToDate,
      isApplyFilter: true,
      per_page: parseInt(this.itemper),
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
      pageIndex: this.page,
      per_page: this.pageSize
    }
    this.pagination.emit(paginationDatas)

  }

}
