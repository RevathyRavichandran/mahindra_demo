import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import { Color, Label } from "ng2-charts";
import { ToasterService } from '@services/toaster.service';
import { AnimatedDigitComponent } from '@shared/animated-digit/animated-digit.component';
import { DateRangeService } from '@services/date-range.service';


@Component({
  selector: 'app-chart-dashboard',
  templateUrl: './chart-dashboard.component.html',
  styleUrls: ['./chart-dashboard.component.css']
})
export class ChartDashboardComponent implements OnInit, AfterViewInit {


  nums: Array<number> = [25, 76, 48];

  @ViewChild("oneItem") oneItem: any;
  @ViewChildren("count") count: QueryList<any>;



  isShown: boolean = true;
  dateFilter: boolean = false;

  retailerStatus: {
    feedbackCount: any,
    ticketCount: any,
    visitorCount: any,
    conversionCount: any,
    overallCount: any
  };

  xAxis: Array<string> = [];
  yAxis: Array<ChartDataSets> = [];
  // weekData: Array<any> = [];
  // monthData: Array<any> = [];
  // yearData: Array<any> = [];

  weekActive: boolean;
  monthActive: boolean;
  yearActive: boolean;

  visitorActive: boolean;
  ticketsActive: boolean;
  feedbackActive: boolean;
  conversionActive: boolean;
  overallActive: boolean;

  public daterange: any = {};

  options: any;
  dateRangeValue: String = '';
  searchFromDate: any = '';
  searchToDate: any = '';

  message = 'Count';

  setMessage(e) {
    if (e.checked) this.message = 'Percentage';
    else this.message = 'Count';
    this.onWeek()
  }



  public lineChartLabels: Label[] = [

  ];
  public lineChartType: ChartType = "bar";
  public lineChartLegend = true;
  public lineChartPlugins = [];
  public lineChartData: ChartDataSets[] = [

  ];
  // public lineChartOptions: (ChartOptions & { annotation: any }) = {
  //   responsive: true,
  //   annotation: '',
  //   legend: {
  //   },

  // };
  
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    annotation: '',
    legend: {
      position: 'top' // place legend on the right side of chart
    },
    elements: {
      line: {
        tension: 0
      }
    },

    tooltips: {
      callbacks: {
          
          
      }
  },

    scales: {
      xAxes: [{
        stacked: true // this should be set to make the bars stacked
      }],
      yAxes: [{
        stacked: true // this also..
      }]
    }
  };

  public lineChartColors: Color[] = [];
  processVariables: any;
  xAxisType = '1';
  nameOfCounts = 'VISITORS'
  feedBackCount: number;
  bgColor: string[];
  label: string;

  
  constructor(
    private enterpriseApiService: DashboardService,
    private toasterService: ToasterService,
    private dateService: DateRangeService,
  ) {
    this.weekActive = true;
  }



  ngOnInit(): void {
    this.onOverAll();
    this.getRetailerStatus();
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
  }


  ngAfterViewInit() {
    
    // this.animateCount();
  }

  animateCount() {
    let _this = this;

    let single = this.oneItem.nativeElement.innerHTML;

    this.counterFunc(single, this.oneItem, 7000);

    this.count.forEach(item => {
      _this.counterFunc(item.nativeElement.innerHTML, item, 2000);
    });
  }

  counterFunc(end: number, element: any, duration: number) {
    let range, current: number, step, timer;

    range = end - 0;
    current = 0;
    step = Math.abs(Math.floor(duration / range));

    timer = setInterval(() => {
      current += 1;
      element.nativeElement.textContent = current;
      if (current == end) {
        clearInterval(timer);
      }
    }, step);
  }

  onWeek() {

    this.clear();
    this.dateFilter = false;

    
    if (this.lineChartData[0] && this.lineChartData[1] && this.lineChartData[2] && this.lineChartData[3]) {
      console.log('testsstststt')

      this.lineChartData[0]['data'] = [];
      this.lineChartData[1]['data'] = [];
      this.lineChartData[2]['data'] = [];
      this.lineChartData[3]['data'] = [];
    } else if (this.lineChartData[0]) {
      this.lineChartData[0]['data'] = [];
    }

    this.xAxisType = "1";
    if (this.conversionActive) {
      this.onConversion();
    } else if (this.feedbackActive) {
      this.onFeedback();
    } else if (this.ticketsActive) {
      this.onLiveAgent();
    } else if (this.overallActive) {
      this.onOverAll();
    } else {
      this.onBookAppointMent();
      
    }
    // this.getChartResults();
    this.weekActive = true;
    this.monthActive = false;
    this.yearActive = false;
    // this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF'];

  }

  onMonth() {

    this.clear();
    this.dateFilter = false;
    if (this.lineChartData[0] && this.lineChartData[1] && this.lineChartData[2] && this.lineChartData[3]) {

      this.lineChartData[0]['data'] = [];
      this.lineChartData[1]['data'] = [];
      this.lineChartData[2]['data'] = [];
      this.lineChartData[3]['data'] = [];
    } else if (this.lineChartData[0]) {
      this.lineChartData[0]['data'] = [];
    }
    this.xAxisType = "2";
    if (this.conversionActive) {
      this.onConversion();
    } else if (this.feedbackActive) {
      this.onFeedback();
    } else if (this.ticketsActive) {
      this.onLiveAgent();
    } else if (this.overallActive) {
      this.onOverAll();
    } else {
      this.onBookAppointMent();
      
    }
    // this.getChartResults();
    this.weekActive = false;
    this.monthActive = true;
    this.yearActive = false;
    // this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF','#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
  }

  onYear() {

    this.clear();
    this.dateFilter = false;

    if (this.lineChartData[0] && this.lineChartData[1] && this.lineChartData[2] && this.lineChartData[3]) {
      
      this.lineChartData[0]['data'] = [];
      this.lineChartData[1]['data'] = [];
      this.lineChartData[2]['data'] = [];
      this.lineChartData[3]['data'] = [];
    } else if (this.lineChartData[0]) {
      this.lineChartData[0]['data'] = [];
    }


    this.xAxisType = "3";
    if (this.conversionActive) {
      this.onConversion();
    } else if (this.feedbackActive) {
      this.onFeedback();
    } else if (this.ticketsActive) {
      this.onLiveAgent();
    } else if (this.overallActive) {
      this.onOverAll();
    } else {
      this.onBookAppointMent();
      
    }
    // this.getChartResults();
    this.weekActive = false;
    this.monthActive = false;
    this.yearActive = true;
    // this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3'];
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


  onBookAppointMent() {
    this.nameOfCounts = "CORPORATE_DECK"
    setTimeout(() => {

      this.getChartResults();
    }, 10);
    
    // if(this.message == 'Percentage') {
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Percentage: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
            
    //       }
    //   }
    // }

    // } else {
    //   console.log('tetststst', this.message, this.message == 'Count')
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Count: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            
    //       }
    //   }
    // }
    // }
    
    

    this.visitorActive = true;
    this.ticketsActive = false;
    this.feedbackActive = false;
    this.conversionActive = false;
    this.overallActive = false;
    this.lineChartType = "line";
    

    // this.label= 'My First Dataset',
    this.lineChartColors = [
      {
        borderColor: 'rgb(231,179,56)',
        backgroundColor: 'rgb(231,179,56,0.1)'
      },
    ];
    this.isShown = true;

  }

  onLiveAgent() {

    this.nameOfCounts = "PRODUCT_INFO";
    setTimeout(() => {
      this.lineChartOptions.elements.line.tension = 0;
      
      // this.lineChartOptions.legend.position='left'
      this.getproductInfo();
    }, 10);

    // if(this.message == 'Percentage') {
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Percentage: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
            
    //       }
    //   }
    // }

    // } else {
      
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Count: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            
    //       }
    //   }
    // }
    // }

    this.visitorActive = false;
    this.ticketsActive = true;
    this.feedbackActive = false;
    this.conversionActive = false;
    this.overallActive = false;
    if (this.xAxisType == '2') {
      this.lineChartType = "bar";
    } else {
      this.lineChartType = "line";
    }

    // this.label= 'My First Dataset',
    this.lineChartColors = [
      {
        borderColor: 'rgb(231,179,56)',
        backgroundColor: 'rgb(231,179,56,0.1)'
      },
    ]
    this.isShown = false;

  }

  onFeedback() {
    this.nameOfCounts = "MARKET_UPDATES";
    setTimeout(() => {
      this.lineChartOptions.elements.line.tension = 0;
      this.getFeedbackChartResults();
    }, 10);

    // if(this.message == 'Percentage') {
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Percentage: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
            
    //       }
    //   }
    // }

    // } else {
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Count: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            
    //       }
    //   }
    // }
    // }
    this.visitorActive = false;
    this.ticketsActive = false;
    this.feedbackActive = true;
    this.conversionActive = false;
    this.lineChartType = "bar";
    
    this.overallActive = false;
    // this.label= 'My First Dataset',

    this.lineChartColors = [
      {
        borderColor: 'rgb(17,175,18)',
        backgroundColor: 'rgb(17,175,18,0.3)'
      },
    ];
    this.isShown = true;
  }

  onConversion() {
    this.nameOfCounts = "DIGITAL_FACTSHEET"
    setTimeout(() => {
      this.lineChartOptions.elements.line.tension = 0;
      this.getDigital();
    }, 10);

    console.log('vajlsdjioeud', this.message)
    // if(this.message == 'Percentage') {
    //   console.log('tetststst', this.message)
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Percentage: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
            
    //       }
    //   }
    // }

    // } else {
    //   console.log('tetststst', this.message, this.message == 'Count')
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Count: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            
    //       }
    //   }
    // }
    // }
    this.visitorActive = false;
    this.ticketsActive = false;
    this.feedbackActive = false;
    this.conversionActive = true;
    this.lineChartType = "bar";
    
    this.overallActive = false;
    // this.label= 'My First Dataset',

    this.lineChartColors = [
      {
        borderColor: 'rgb(17,175,18)',
        backgroundColor: 'rgb(17,175,18,0.3)'
      },
    ];
    this.isShown = true;

  }

  onOverAll() {
    
    this.nameOfCounts = "OVERALL"
    setTimeout(() => {
      this.getOverall();
    }, 10);

    // if(this.message == 'Percentage') {
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Percentage: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
            
    //       }
    //   }
    // }

    // } else {
    //   this.lineChartOptions.tooltips = {
    //     callbacks: {
    //       label: function(tooltipItem, data) {
    //         return 'Graph Count: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
    //       }
    //   }
    // }
    // }

    this.visitorActive = false;
    this.ticketsActive = false;
    this.feedbackActive = false;
    this.conversionActive = false;
    this.overallActive = true;
    this.lineChartType = "doughnut";
    this.isShown = false;



  }

  async getChartResults() {
    // this.lineChartData.shift()

    try {
      const params = {
        "ProcessVariables": {
          xAxis: this.xAxisType,
          nameOfCounts: this.nameOfCounts,
          "fromDate": this.searchFromDate,
          "toDate": this.searchToDate
        }

      }

      


      this.enterpriseApiService.corporateDeckChart(params).subscribe(response => {
        console.log('getChart', response);

        const appiyoError = response?.Error;
        const apiErrorCode = response.ProcessVariables?.errorCode;
        const errorMessage = response.ProcessVariables?.errorMessage;

        this.processVariables = response?.ProcessVariables

        if (appiyoError == '0') {

          const graphCounts = this.processVariables.graphDateList;
          const year = this.processVariables.xAxis;
          const totalCount = this.processVariables.totalAverage;
          this.lineChartLabels = [];
          this.lineChartData = [{
            data: [],

            // label: totalCount 
            label: "Average Count  " + parseFloat(totalCount),
            
          }];

          let yAxis = [];
          let Percentag = [];
          let xAxis = [];
          
          graphCounts.forEach((graph) => {

            const graphDate = graph.graphDate;
              const split = graphDate.split('-');
              const output = `${split[2]}/${split[1]}`
              const Percentage = graph.graphPercentage + '%';
              if (split[2]) {
                this.lineChartLabels.push(output);
                xAxis.push(output);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  Percentag.push(Percentage);
                  yAxis.push(graph.graphPercentage); 
                }
                
              } else {
                xAxis.push(graph.graphDate);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  Percentag.push(Percentage);
                  yAxis.push(graph.graphPercentage);
                  
                }
              }
              
            this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
          })
          

          this.lineChartData[0]['data'] = yAxis.reverse();
          this.lineChartLabels = xAxis.reverse();

          

         

          console.log('this.lineChartLabels', this.lineChartOptions.tooltips) //xAxis
          console.log('this.lineChartData', this.lineChartData) //yAxis
          
        }
        
        
        else {
          if (errorMessage === undefined) {
            return;
          }
          this.toasterService.showError(errorMessage == undefined ? 'Chart error' : errorMessage, 'Dashboard Chart')
        }
      })



    } catch (err) {
      console.log("Error", err);
    }

  }


  async getFeedbackChartResults() {

    try {
      const params = {
        "ProcessVariables": {
          xAxis: this.xAxisType,
          nameOfCounts: this.nameOfCounts,
          "fromDate": this.searchFromDate,
          "toDate": this.searchToDate
        }

      }
      

      this.enterpriseApiService.marketUpdatesChart(params).subscribe(response => {
        console.log('getChart', response);

        const appiyoError = response?.Error;
        const apiErrorCode = response.ProcessVariables?.errorCode;
        const errorMessage = response.ProcessVariables?.errorMessage;

        this.processVariables = response?.ProcessVariables

        if (appiyoError == '0') {

          const graphCounts = this.processVariables.graphDateList;
          const year = this.processVariables.xAxis;
          const totalCount = this.processVariables.totalAverage;
          this.lineChartLabels = [];
          this.lineChartData = [{
            data: [],
            // label: totalCount 
            label: "Average Count  " + totalCount,
            
          }];
          let yAxis = []
          let xAxis = [];
          graphCounts.forEach((graph) => {

            const graphDate = graph.graphDate;
              const split = graphDate.split('-');
              const output = `${split[2]}/${split[1]}`
              if (split[2]) {
                this.lineChartLabels.push(output);
                xAxis.push(output);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  yAxis.push(graph.graphPercentage); 
                }
                
              } else {
                xAxis.push(graph.graphDate);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  yAxis.push(graph.graphPercentage); 
                }
              }
            this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
          })

          this.lineChartData[0]['data'] = yAxis.reverse();
          this.lineChartLabels = xAxis.reverse();

          
          console.log('this.lineChartData', this.lineChartData) //yAxis
        }
        else {
          if (errorMessage === undefined) {
            return;
          }
          this.toasterService.showError(errorMessage == undefined ? 'Chart error' : errorMessage, 'Dashboard Chart')
        }
      })



    } catch (err) {
      console.log("Error", err);
    }

  }


  async getproductInfo() {

    try {
      const params = {
        "ProcessVariables": {
          xAxis: this.xAxisType,
          nameOfCounts: this.nameOfCounts,
          "fromDate": this.searchFromDate,
          "toDate": this.searchToDate
        }

      }

      this.enterpriseApiService.productInfoChart(params).subscribe(response => {
        console.log('getChart', response);

        const appiyoError = response?.Error;
        const apiErrorCode = response.ProcessVariables?.errorCode;
        const errorMessage = response.ProcessVariables?.errorMessage;

        this.processVariables = response?.ProcessVariables

        if (appiyoError == '0') {

          const graphCounts = this.processVariables.graphDateList;
          const year = this.processVariables.xAxis;
          const totalCount = this.processVariables.totalAverage;
          this.lineChartLabels = [];
          this.lineChartData = [{
            data: [],
            // label: totalCount 
            label: "Average Count  " + totalCount
          }];
          let yAxis = []
          let xAxis = [];
          graphCounts.forEach((graph) => {

            const graphDate = graph.graphDate;
              const split = graphDate.split('-');
              const output = `${split[2]}/${split[1]}`
              if (split[2]) {
                this.lineChartLabels.push(output);
                xAxis.push(output);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  yAxis.push(graph.graphPercentage); 
                }
                
              } else {
                xAxis.push(graph.graphDate);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  yAxis.push(graph.graphPercentage); 
                }
              }
            this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
          })

          this.lineChartData[0]['data'] = yAxis.reverse();
          this.lineChartLabels = xAxis.reverse();

          console.log('this.lineChartLabels', this.lineChartLabels) //xAxis
          console.log('this.lineChartData', this.lineChartData) //yAxis
        }
        else {
          if (errorMessage === undefined) {
            return;
          }
          this.toasterService.showError(errorMessage == undefined ? 'Chart error' : errorMessage, 'Dashboard Chart')
        }
      })



    } catch (err) {
      console.log("Error", err);
    }

  }

  async getDigital() {
    // this.lineChartData.shift()

    try {
      const params = {
        "ProcessVariables": {
          xAxis: this.xAxisType,
          nameOfCounts: this.nameOfCounts,
          "fromDate": this.searchFromDate,
          "toDate": this.searchToDate
        }

      }
      

      this.enterpriseApiService.digitalChart(params).subscribe(response => {
        console.log('getChart', response);

        const appiyoError = response?.Error;
        const apiErrorCode = response.ProcessVariables?.errorCode;
        const errorMessage = response.ProcessVariables?.errorMessage;

        this.processVariables = response?.ProcessVariables

        if (appiyoError == '0') {

          const graphCounts = this.processVariables.graphDateList;
          const year = this.processVariables.xAxis;
          const totalCount = this.processVariables.totalAverage;
          this.lineChartLabels = [];
          this.lineChartData = [{
            data: [],
            // label: totalCount 
            label: "Average Count  " + totalCount,
            
          }];
          let yAxis = []
          let xAxis = [];
          graphCounts.forEach((graph) => {

            const graphDate = graph.graphDate;
              const split = graphDate.split('-');
              const output = `${split[2]}/${split[1]}`
              if (split[2]) {
                this.lineChartLabels.push(output);
                xAxis.push(output);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  yAxis.push(graph.graphPercentage); 
                }
                
              } else {
                xAxis.push(graph.graphDate);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  yAxis.push(graph.graphPercentage); 
                }
              }
            this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
          })

          this.lineChartData[0]['data'] = yAxis.reverse();
          this.lineChartLabels = xAxis.reverse();

          

          console.log('this.lineChartData', this.lineChartData) //yAxis
        }
        else {
          if (errorMessage === undefined) {
            return;
          }
          this.toasterService.showError(errorMessage == undefined ? 'Chart error' : errorMessage, 'Dashboard Chart')
        }
      })



    } catch (err) {
      console.log("Error", err);
    }

  }

  async getOverall() {
    // this.lineChartData = [{ data: [],
    // }];

    
    const params = {
      "ProcessVariables": {
        "xAxis": this.xAxisType
      }
    }


    this.enterpriseApiService.overallChart(params).subscribe(response => {
      console.log('getChart', response);

      const Error = response?.Error;
      const ErrorCode = response?.ErrorCode;
      const ErrorMessage = response?.ErrorMessage;

      this.processVariables = response?.ProcessVariables

      if (Error == '0') {

        // if(this.message == 'Percentage') {
        //   console.log('peewrywrey')
        //   this.lineChartOptions.tooltips = {
        //     callbacks: {
        //       label: (tooltipItem, data) => {
        //         return 'Graph Percentage: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
                
        //       }
        //   }
        // }
    
        // } else {
        //   this.lineChartOptions.tooltips = {
        //     callbacks: {
        //       label: (tooltipItem, data) => {
        //         console.log('ceiouowie', tooltipItem)
        //         return 'Graph Count: ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                
        //       }
        //   }
        // }
        // }

        const appointmentCount = this.processVariables.count_list[3];
        const appointmentPer = this.processVariables.graphDateList[3].graphPercentage;
        const visitorCount = this.processVariables.count_list[2];
        const visitorPer = this.processVariables.graphDateList[3].graphPercentage;
        const productCount = this.processVariables.count_list[1];
        const productPer = this.processVariables.graphDateList[3].graphPercentage;
        const digitalCount = this.processVariables.count_list[0];
        const digitalPer = this.processVariables.graphDateList[3].graphPercentage;

        const year = this.processVariables.xAxis;
        const graphCounts = [{
          "graphCount": appointmentCount,
          "graphDate": appointmentCount,
          "graphPercentage": appointmentPer
        },
        {
          "graphCount": visitorCount,
          "graphDate": visitorCount,
          "graphPercentage": visitorPer
        },
        {
          "graphCount": productCount,
          "graphDate": productCount,
          "graphPercentage": productPer
        },
        {
          "graphCount": digitalCount,
          "graphDate": digitalCount,
          "graphPercentage": digitalPer
        }]
        // this.lineChartLabels = [];
        // this.lineChartData = [{ data: [],
        //   label: 'Count' }];
        let yAxis = []
        let xAxis = [];

        graphCounts.forEach((graph) => {

          const graphDate = graph.graphDate;
              const split = graphDate.split('-');
              const output = `${split[2]}/${split[1]}`
              if (split[2]) {
                this.lineChartLabels.push(output);
                xAxis.push(output);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  yAxis.push(graph.graphPercentage); 
                }
                
              } else {
                xAxis.push(graph.graphDate);
                if(this.message == 'Count') {
                  yAxis.push(graph.graphCount);
                } else {
                  yAxis.push(graph.graphPercentage);
                  
                }
              }
          // this.bgColor =  ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF','#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
        })

        this.lineChartColors = [
          {
            borderColor: 'white',
            backgroundColor: ['rgb(242, 80, 34, 0.5)', 'rgb(127, 186, 0, 0.5)', 'rgb(0, 164, 239, 0.5)', 'rgb(255, 185, 0, 0.5)']
          },
        ];

        this.lineChartData[0]['data'] = yAxis.reverse();
        // this.lineChartData[0]['data'] = [appointmentCount, visitorCount]
        this.lineChartLabels = ["Corporate Deck", "Market Updates", "Product Info", "Digital Factsheet"]

        
        console.log('this.lineChartLabels', this.lineChartLabels) //xAxis
        console.log('this.lineChartData', this.lineChartData) //yAxis

        
      }
      else {
        if (ErrorMessage === undefined) {
          return;
        }
        this.toasterService.showError(ErrorMessage == undefined ? 'Chart error' : ErrorMessage, 'Dashboard Chart')
      }



    })


  }


  async getRetailerStatus() {

    var payload = {
      "ProcessVariables": {}
    }

    this.enterpriseApiService.countAPI(payload).subscribe(response => {
      console.log('getRetailerStatus', response);

      const appiyoError = response.Error;
      const apiErrorCode = response.ProcessVariables?.errorCode;
      const errorMessage = response.ProcessVariables?.errorMessage;

      if (appiyoError === '0') {
        const counts = response?.ProcessVariables
        // this.feedBackCount =   Number(counts?.feedbackCount)
        this.retailerStatus = {
          feedbackCount: parseInt(counts?.digitalFactSheetRating),
          ticketCount: parseInt(counts?.corporateRating),
          visitorCount: parseInt(counts?.marketUpdateRating),
          conversionCount: parseInt(counts?.productInfoRating),
          overallCount: 70
        };
      } else {
        if (errorMessage === undefined) {
          return;
        }
        this.toasterService.showError(errorMessage == undefined ? 'Count error' : errorMessage, 'Feedback Ticket Visitor Count Dashboard API')
      }
    })


  }

  async getOverallStack() {
    this.lineChartData = [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []

    }];
    const params = {
      "ProcessVariables": {
        "xAxis": this.xAxisType
      }
    }


    this.enterpriseApiService.overallChart(params).subscribe(response => {

      const appiyoError = response?.Error;
      const apiErrorCode = response.ProcessVariables?.errorCode;
      const errorMessage = response.ProcessVariables?.errorMessage;

      this.processVariables = response?.ProcessVariables

      if (appiyoError == '0') {

        const graphCounts = this.processVariables.graphDateList;
        const year = this.processVariables.xAxis;
        const totalCount = this.processVariables.totalAverage;
        this.lineChartLabels = [];

        let yAxisOk = [];
        let yAxisGood = [];
        let yAxisBad = [];
        let yAxisGreat = [];
        let xAxis = [];
        graphCounts.forEach((graph) => {
          xAxis.push(graph.graphDate);
          yAxisOk.push(graph.ProductInfo);
          yAxisGood.push(graph.MarketUpdates);
          yAxisBad.push(graph.DigitalFactsheet);
          yAxisGreat.push(graph.CorporateDeck);
          // this.bgColor =  ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF','#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
        })

        this.lineChartColors[0].backgroundColor = 'rgb(242, 80, 34, 0.5)';

        this.lineChartData = [{
          label: 'Corporate Deck',
          data: yAxisGreat.reverse(),
          backgroundColor: 'rgb(242, 80, 34, 0.5)',
          hoverBackgroundColor: 'rgb(242, 80, 34)'
        }, {
          label: 'Market Updates',
          data: yAxisGood.reverse(),
          backgroundColor: 'rgb(127, 186, 0, 0.5)',
          hoverBackgroundColor: 'rgb(127, 186, 0)'
        }, {
          label: 'Product Info',
          data: yAxisOk.reverse(),
          backgroundColor: 'rgb(0, 164, 239, 0.5)',
          hoverBackgroundColor: 'rgb(0, 164, 239)'
        }, {
          label: 'Digital Factsheet',
          data: yAxisBad.reverse(),
          backgroundColor: 'rgb(255, 185, 0, 0.5)',
          hoverBackgroundColor: 'rgb(255, 185, 0)'
        }];

        this.lineChartLabels = xAxis.reverse();

        console.log('this.barChartLabels', this.lineChartLabels) //xAxis
        console.log('this.barChartData', this.lineChartData) //yAxis
      }
      else {
        if (errorMessage === undefined) {
          return;
        }
        this.toasterService.showError(errorMessage == undefined ? 'Chart error' : errorMessage, 'Dashboard Chart')
      }
    })


  }

  clearDate() {
  
    this.searchFromDate = '';
    this.searchToDate = '';
    this.dateRangeValue = '';
    this.onWeek();
  }

  clear() {
  
    this.searchFromDate = '';
    this.searchToDate = '';
    this.dateRangeValue = '';
  }
  apply() {
    
    if (this.searchFromDate && this.searchToDate) {
      this.dateFilter = true;
  
      if (this.lineChartData[0] && this.lineChartData[1] && this.lineChartData[2] && this.lineChartData[3]) {

        this.lineChartData[0]['data'] = [];
        this.lineChartData[1]['data'] = [];
        this.lineChartData[2]['data'] = [];
        this.lineChartData[3]['data'] = [];
      } else if (this.lineChartData[0]) {
        this.lineChartData[0]['data'] = [];
      }
      if (this.conversionActive) {
        this.lineChartType = "line";
        this.getDigital();
      } else if (this.feedbackActive) {
        this.lineChartType = "line";
        this.getFeedbackChartResults();
      } else if (this.ticketsActive) {
        this.lineChartType = "line";
        this.getproductInfo();
      } else if (this.overallActive) {
        this.lineChartType = "doughnut";

        this.lineChartColors = [
          {
            borderColor: 'white',
            backgroundColor: ['rgb(242, 80, 34)', 'rgb(127, 186, 0)', 'rgb(0, 164, 239)', 'rgb(255, 185, 0)']
          },
        ];
        this.isShown = false;
        setTimeout(() => {
          this.getOverall();
        }, 1000);
      } else {
        this.lineChartType = "line";
        this.getChartResults();
      }

  } else {
    this.toasterService.showError('Please fill date', 'Dashboard Chart')
  }
}
}


