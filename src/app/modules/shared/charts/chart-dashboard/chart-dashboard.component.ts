import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { EnterpriseApiService } from '@services/enterprise-api.service';
import { DateRangeService } from '@services/date-range.service';
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import { Color, Label } from "ng2-charts";
import { ToasterService } from '@services/toaster.service';
import { AnimatedDigitComponent } from '@shared/animated-digit/animated-digit.component';


@Component({
  selector: 'app-chart-dashboard',
  templateUrl: './chart-dashboard.component.html',
  styleUrls: ['./chart-dashboard.component.css']
})
export class ChartDashboardComponent implements OnInit, AfterViewInit {


  nums: Array<number> = [25, 76, 48];

  @ViewChild("oneItem") oneItem: any;
  @ViewChildren("count") count: QueryList<any>;



  isShown: boolean = true ; 

  retailerStatus : {
    feedbackCount: any,
    ticketCount: any,
    visitorCount: any,
    conversionCount : any
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
  
  public daterange: any = {};

  options: any;
  dateRangeValue: String = '';
  searchFromDate: any = '';
  searchToDate: any = '';


 
  public lineChartLabels: Label[] = [];
  public lineChartType: ChartType = 'bar';
  
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
  public lineChartOptions: (ChartOptions & { annotation?: any }) = {
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
      scales: {
         xAxes: [{
            stacked: true,
            // display: false,
             // this should be set to make the bars stacked
        
         }],
         yAxes: [{
            stacked: true ,
           // this also..
         }],
       
      },
  
    
      // lineChartType: ChartType = "bar";
      //   data: {
      //     labels: ['One', 'Two', 'Three', 'Four'],
      //     datasets: [{
      //       label: 'Data',
      //       data: [5, 8, 24, 14],
      //       backgroundColor: 'rgb(124, 124, 255)'
      //     }]
      //   },
      //   options: {
      //     plugins: {
      //       datalabels: {
      //         align: 'left',
      //         rotation: -90,
      //         offset: 50,
      //         font: {
      //           weight: 'bold'
      //         },
      //         formatter: (v, ctx) => ctx.chart.data.labels[ctx.dataIndex]
      //       }
      //     },
      //     scales: {
      //       x: {
      //         ticks: {
      //           display: false
      //         }
      //       }
      //     }
      //   }
      
     
        
  };

  public lineChartColors: Color[] = [];
  processVariables: any;
  xAxisType = '1';
  nameOfCounts = 'VISITORS'
  feedBackCount: number;
  bgColor: string[];
  label: string;


  constructor(
    private enterpriseApiService: EnterpriseApiService,
    private dateService: DateRangeService,
    private toasterService: ToasterService, 
  ) {
    this.weekActive = true;
  }


  
  ngOnInit(): void {
    this.onBookAppointMent();
    this.getRetailerStatus();
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
     if (this.lineChartData[0] && this.lineChartData[1] && this.lineChartData[2] && this.lineChartData[3]) {
      this.lineChartData[0].data = [];
      this.lineChartData[1].data = [];
      this.lineChartData[2].data = [];
      this.lineChartData[3].data = [];
      this.lineChartData.splice(1, this.lineChartData.length-1);
    } else if (this.lineChartData[0]) {
      this.lineChartData[0]['data'] = [];
    } 
    this.xAxisType = "1";
    if(this.conversionActive){
      this.getConversionChartResults();
    } else if (this.feedbackActive) {
      this.getFeedbackChartResults();
    } 
    else if (this.ticketsActive) {
      this.getLive();
    }else {
      this.getChartResults();
    }
    // this.getChartResults();
    this.weekActive = true;
    this.monthActive = false;
    this.yearActive = false;
    // this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF'];

  }
  
  onMonth() {
    if (this.lineChartData[0] && this.lineChartData[1] && this.lineChartData[2] && this.lineChartData[3]) {
      this.lineChartData[0].data = [];
      this.lineChartData[1].data = [];
      this.lineChartData[2].data = [];
      this.lineChartData[3].data = [];
      this.lineChartData.splice(1, this.lineChartData.length-1);
    } else if (this.lineChartData[0]) {
      this.lineChartData[0]['data'] = [];
    } 
    this.xAxisType = "2";
    if(this.conversionActive){
      this.getConversionChartResults();
    } else if (this.feedbackActive) {
      this.getFeedbackChartResults();
    } 
    else if (this.ticketsActive) {
      this.getLive();
    }else {
      this.getChartResults();
    }
    // this.getChartResults();
    this.weekActive = false;
    this.monthActive = true;
    this.yearActive = false;
    // this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF','#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
  }

  onYear() {
    if (this.lineChartData[0] && this.lineChartData[1] && this.lineChartData[2] && this.lineChartData[3]) {
      this.lineChartData[0].data = [];
      this.lineChartData[1].data = [];
      this.lineChartData[2].data = [];
      this.lineChartData[3].data = [];
      this.lineChartData.splice(1, this.lineChartData.length-1);
    } else if (this.lineChartData[0]) {
      this.lineChartData[0]['data'] = [];
    } 
    this.xAxisType = "3";
    if(this.conversionActive){
      this.getConversionChartResults();
    } else if (this.feedbackActive) {
      this.getFeedbackChartResults();
    } 
    else if (this.ticketsActive) {
      this.getLive();
    }else {
      this.getChartResults();
    }
    // this.getChartResults();
    this.weekActive = false;
    this.monthActive = false;
    this.yearActive = true;
    // this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3'];
  }

  onBookAppointMent() {
    this.nameOfCounts = "BOOK_APPOINTMENT"
    setTimeout(() => {
      this.getChartResults();
    }, 10);
    this.visitorActive = true;
    this.ticketsActive = false;
    this.feedbackActive = false;
    this.conversionActive = false;
    this.lineChartType = "line"; 
    // this.label= 'My First Dataset',
    this.lineChartColors = [
      {
      borderColor: '#EF7D2B ',
      // backgroundColor:  '#F4C696',
      backgroundColor:  'rgb(239,125,43,0.3)',
      // tension: 0.1
      },
    ];
    this.isShown = true;
    
  }

  onLiveAgent() {
    
    this.nameOfCounts = "LIVE_AGENT";
    setTimeout(() => {
      this.getLive();
      

    }, 10);
    
    this.visitorActive = false;
    this.ticketsActive = true;
    this.feedbackActive = false;
    this.conversionActive = false;
    this.lineChartType = "pie"; 
    
  //   const option = {
  //     scales: {
  //       x: {
  //         display: false
  //       },
  //       // y: {
  //       //   display: false
  //       // }
  //     }
  //   };
  // // console.log("option")
 
 
   
  //   options: option
  
  
    this.lineChartColors = [
      {
        borderColor: '#11af12',
        backgroundColor:  [ 'rgba(54, 162, 235, 0.9)','','rgba(255, 205, 86, 0.8','rgba(75, 192, 192, 0.8)','rgba(255, 99, 132, 0.8','#6f42c1','#ffc107','#007bff','#3c1414','#8acfc2','#d1a438','#17a2b8','#556b2f','rgba(255, 205, 86, 0.8)','rgba(75, 192, 192, 0.8)','#ea816a','#d75947','']
      },
    ];
    // this.lineChartColors = [
    //   {
    //     borderColor: '#ba002a',
    //   backgroundColor: this.bgColor
    
    //   },
    // ]
   
    
    this.isShown = false;
    
  }

  onFeedback() {
    this.nameOfCounts = "FEEDBACK"
    this.lineChartType = "bar";
    setTimeout(() => {
      this.getFeedbackChartResults();
    }, 10);
    
    this.visitorActive = false;
    this.ticketsActive = false;
    this.feedbackActive = true;
    this.conversionActive = false;
   
    
    this.lineChartColors = [
      {        
        backgroundColor:  'rgba(54, 162, 235, 0.8)'
      },
    ];
    this.isShown = false;    
  }
  
  onConversion(){
    this.nameOfCounts = "VISITOR"
    setTimeout(() => {
      this.getConversionChartResults();
    }, 10);
    
    this.visitorActive = false;
    this.ticketsActive = false;
    this.feedbackActive = false;
    this.conversionActive = true;
    this.lineChartType = "pie"; 
    this.lineChartColors = [
      {
        borderColor: '#11af12',
        backgroundColor:  [ '#FFEC00','#52D726','#6aa84f']
      },
    ];
    this.isShown = false;
    
  }

  async getChartResults() {
    // this.lineChartData.shift()
    this.lineChartOptions={
      scales:{
        xAxes:[{
          display:true,
      }]
      },
      elements: {
        line: {
          tension: 0
        }
       },
    }
    this.lineChartData = [{ data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
  
}];
    
    try {
      const params = {
        xAxis: this.xAxisType,
        nameOfCounts: this.nameOfCounts
      }
      let response = {};
      if(this.xAxisType == '1'){
        response = {
          "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
          "Error" : "0",
          "ErrorCode" : "",
          "ErrorMessage" : "",
          "ProcessId" : "47a8532c4dc811ecb55f0022480d6e6c",
          "ProcessInstanceId" : "764527583b1811ed98d10242ac110002",
          "ProcessName" : "VPS Healthcare Chart API",
          "ProcessVariables" : {
             "count2" : "29",
             "domain" : "",
             "errorCode" : "200",
             "errorMessage" : "Chart",
             "errorStatus" : "S",
             "getGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND rating = '1' AND `created_at` like '2022-09-17 __:__:__' ",
             "getGraphQuery2" : "",
             "graphCount" : 29,
             "graphDateList" : [
                {
                  
                   "graphCount" : 19,
                   "graphDate" : "2022-09-23"
                },
                {
                   "graphCount" : 49,
                   "graphDate" : "2022-09-22"
                },
                {
                   "graphCount" : 48,
                   "graphDate" : "2022-09-21"
                },
                {
                   "graphCount" : 44,
                   "graphDate" : "2022-09-20"
                },
                {
                   "graphCount" : 46,
                   "graphDate" : "2022-09-19"
                },
                {
                   "graphCount" : 36,
                   "graphDate" : "2022-09-18"
                },
                {
                   "graphCount" : 29,
                   "graphDate" : "2022-09-17"
                }
             ],
             "graphDateListCount" : 7,
             "graphLoop" : 7,
             "graphLoopStop" : true,
             "greatCount" : 0,
             "greatQuery" : "",
             "language" : "",
             "nameOfCounts" : "FEEDBACK",
             "test" : "",
             "testValue" : "",
             "totalAverage" : "38.00",
             "totalCoun2" : "271",
             "totalCount" : "",
             "xAxis" : "1"
          },
          "Status" : "Execution Completed",
          "WorkflowId" : "628dbe44d8299cd2b49dd678",
          "currentCorrelationId" : "281475477335059",
          "customizedLogId" : "",
          "endedOn" : "2022-09-23T08:19:36.994414",
          "isWaitingForEvent" : false,
          "nodeBPMNId" : "2",
          "processId" : "47a8532c4dc811ecb55f0022480d6e6c",
          "processName" : "VPS Healthcare Chart API",
          "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
          "repoName" : "VPS Health_v1",
          "rootCorrelationId" : "281475477335059",
          "startedOn" : "2022-09-23T08:19:36.785502"
       };
      }
     else if(this.xAxisType == '2'){
      response = {
        "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "Error" : "0",
        "ErrorCode" : "",
        "ErrorMessage" : "",
        "ProcessId" : "47a8532c4dc811ecb55f0022480d6e6c",
        "ProcessInstanceId" : "764527583b1811ed98d10242ac110002",
        "ProcessName" : "VPS Healthcare Chart API",
        "ProcessVariables" : {
           "count2" : "29",
           "domain" : "",
           "errorCode" : "200",
           "errorMessage" : "Chart",
           "errorStatus" : "S",
           "getGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND rating = '1' AND `created_at` like '2022-09-17 __:__:__' ",
           "getGraphQuery2" : "",
           "graphCount" : 29,
           "graphDateList" : [
            {
               "graphCount" : 15,
               "graphDate" : "2022-09-28"
            },
            {
               "graphCount" : 16,
               "graphDate" : "2022-09-27"
            },
            {
               "graphCount" : 17,
               "graphDate" : "2022-09-26"
            },
            {
               "graphCount" : 27,
               "graphDate" : "2022-09-25"
            },
            {
               "graphCount" : 14,
               "graphDate" : "2022-09-24"
            },
            {
               "graphCount" : 2,
               "graphDate" : "2022-09-23"
            },
            {
               "graphCount" : 8,
               "graphDate" : "2022-09-22"
            },
            {
               "graphCount" : 16,
               "graphDate" : "2022-09-21"
            },
            {
               "graphCount" : 15,
               "graphDate" : "2022-09-20"
            },
            {
               "graphCount" : 14,
               "graphDate" : "2022-09-19"
            },
            {
               "graphCount" : 45,
               "graphDate" : "2022-09-18"
            },
            {
               "graphCount" : 18,
               "graphDate" : "2022-09-17"
            },
            {
               "graphCount" : 27,
               "graphDate" : "2022-09-16"
            },
            {
               "graphCount" : 10,
               "graphDate" : "2022-09-15"
            },
            {
               "graphCount" : 13,
               "graphDate" : "2022-09-14"
            },
            {
               "graphCount" : 20,
               "graphDate" : "2022-09-13"
            },
            {
               "graphCount" : 18,
               "graphDate" : "2022-09-12"
            },
            {
               "graphCount" : 17,
               "graphDate" : "2022-09-11"
            },
            {
               "graphCount" : 14,
               "graphDate" : "2022-09-10"
            },
            {
               "graphCount" : 22,
               "graphDate" : "2022-09-09"
            },
            {
               "graphCount" : 23,
               "graphDate" : "2022-09-08"
            },
            {
               "graphCount" : 19,
               "graphDate" : "2022-09-07"
            },
            {
               "graphCount" : 15,
               "graphDate" : "2022-09-06"
            },
            {
               "graphCount" : 10,
               "graphDate" : "2022-09-05"
            },
            {
               "graphCount" : 11,
               "graphDate" : "2022-09-04"
            },
            {
               "graphCount" : 8,
               "graphDate" : "2022-09-03"
            },
            {
               "graphCount" : 17,
               "graphDate" : "2022-09-02"
            },
            {
               "graphCount" : 13,
               "graphDate" : "2022-09-01"
            },
            {
               "graphCount" : 12,
               "graphDate" : "2022-08-31"
            },
            {
               "graphCount" : 10,
               "graphDate" : "2022-08-30"
            }
         ],
           "graphDateListCount" : 7,
           "graphLoop" : 7,
           "graphLoopStop" : true,
           "greatCount" : 0,
           "greatQuery" : "",
           "language" : "",
           "nameOfCounts" : "FEEDBACK",
           "test" : "",
           "testValue" : "",
           "totalAverage" : "38.00",
           "totalCoun2" : "271",
           "totalCount" : "",
           "xAxis" : "1"
        },
        "Status" : "Execution Completed",
        "WorkflowId" : "628dbe44d8299cd2b49dd678",
        "currentCorrelationId" : "281475477335059",
        "customizedLogId" : "",
        "endedOn" : "2022-09-23T08:19:36.994414",
        "isWaitingForEvent" : false,
        "nodeBPMNId" : "2",
        "processId" : "47a8532c4dc811ecb55f0022480d6e6c",
        "processName" : "VPS Healthcare Chart API",
        "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "repoName" : "VPS Health_v1",
        "rootCorrelationId" : "281475477335059",
        "startedOn" : "2022-09-23T08:19:36.785502"
     };
     }
     else if(this.xAxisType == '3'){
      response = {
        "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "Error" : "0",
        "ErrorCode" : "",
        "ErrorMessage" : "",
        "ProcessId" : "47a8532c4dc811ecb55f0022480d6e6c",
        "ProcessInstanceId" : "764527583b1811ed98d10242ac110002",
        "ProcessName" : "VPS Healthcare Chart API",
        "ProcessVariables" : {
           "count2" : "29",
           "domain" : "",
           "errorCode" : "200",
           "errorMessage" : "Chart",
           "errorStatus" : "S",
           "getGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND rating = '1' AND `created_at` like '2022-09-17 __:__:__' ",
           "getGraphQuery2" : "",
           "graphCount" : 29,
           "graphDateList" : [
            {
               "graphCount" : 10,
               "graphDate" : "September"
            },
            {
               "graphCount" : 12,
               "graphDate" : "August"
            },
            {
               "graphCount" : 19,
               "graphDate" : "July"
            },
            {
               "graphCount" : 20,
               "graphDate" : "June"
            },
            {
               "graphCount" : 13,
               "graphDate" : "May"
            },
            {
               "graphCount" : 18,
               "graphDate" : "April"
            },
            {
               "graphCount" : 10,
               "graphDate" : "March"
            },
            {
               "graphCount" : 5,
               "graphDate" : "February"
            },
            {
               "graphCount" : 17,
               "graphDate" : "January"
            },
            {
               "graphCount" : 20,
               "graphDate" : "December"
            },
            {
               "graphCount" : 19,
               "graphDate" : "November"
            },
            {
               "graphCount" : 16,
               "graphDate" : "October"
            }
         ],
   
           "graphDateListCount" : 7,
           "graphLoop" : 7,
           "graphLoopStop" : true,
           "greatCount" : 0,
           "greatQuery" : "",
           "language" : "",
           "nameOfCounts" : "FEEDBACK",
           "test" : "",
           "testValue" : "",
           "totalAverage" : "38.00",
           "totalCoun2" : "271",
           "totalCount" : "",
           "xAxis" : "1"
        },
        "Status" : "Execution Completed",
        "WorkflowId" : "628dbe44d8299cd2b49dd678",
        "currentCorrelationId" : "281475477335059",
        "customizedLogId" : "",
        "endedOn" : "2022-09-23T08:19:36.994414",
        "isWaitingForEvent" : false,
        "nodeBPMNId" : "2",
        "processId" : "47a8532c4dc811ecb55f0022480d6e6c",
        "processName" : "VPS Healthcare Chart API",
        "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "repoName" : "VPS Health_v1",
        "rootCorrelationId" : "281475477335059",
        "startedOn" : "2022-09-23T08:19:36.785502"
     };
     }
      console.log('getChart', response);

      const appiyoError = response['Error'];
      const apiErrorCode = response['ProcessVariables']['errorCode'];
      const errorMessage = response['ProcessVariables']['errorMessage'];

      this.processVariables = response['ProcessVariables']
     
      if (appiyoError == '0' && apiErrorCode == "200") {
  
        const graphCounts = this.processVariables.graphDateList;
        const year = this.processVariables.xAxis;
        const totalCount = this.processVariables.totalAverage;
        this.lineChartLabels = [];
        this.lineChartData = [{ data: [],
          // label: totalCount 
          label : "Average Consent  " + parseInt(totalCount)
        }];
        let yAxis = []
        let xAxis = [];
        graphCounts.forEach((graph) => {

          if (this.xAxisType == "3"){
            // const graphDate = graph.graphDate;
            // const split = graphDate.split('-');
            // const output = `${split[2]}/${split[1]}`
            // this.lineChartLabels.push(output);
             xAxis.push(graph.graphDate);
             console.log(xAxis)
            yAxis.push(graph.graphCount);
          }else{
            const graphDate = graph.graphDate;
            const split = graphDate.split('-');
            const output = `${split[2]}/${split[1]}`
            this.lineChartLabels.push(output);
            xAxis.push(output);
            yAxis.push(graph.graphCount);
          }
          this.bgColor =  ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF','#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
        })
        
        this.lineChartData[0]['data'] = yAxis.reverse();
        this.lineChartLabels= xAxis.reverse();

        console.log('this.lineChartLabels', this.lineChartLabels) //xAxis
        console.log('this.lineChartData', this.lineChartData) //yAxis
      }
      else {
        if (errorMessage === undefined) {
          return;
        }
        this.toasterService.showError(errorMessage == undefined ? 'Chart error' : errorMessage, 'Dashboard Chart')
      }
    } catch (err) {
      console.log("Error", err);
    }

  }

  async getLive() {
    // this.lineChartData.shift()
    
    this.lineChartOptions={
      scales:{
        xAxes:[{
          display:false,
      }]
      }
    }
    this.lineChartData = [{ data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
     
  
}];
    // if (this.lineChartData[0] && this.lineChartData[1] && this.lineChartData[2] && this.lineChartData[3]) {
    //   this.lineChartData[0].data = [];
    //   this.lineChartData[1].data = [];
    //   this.lineChartData[2].data = [];
    //   this.lineChartData[3].data = [];
    //   this.lineChartData.splice(1, this.lineChartData.length-1);
    // } else if (this.lineChartData[0]) {
    //   this.lineChartData[0]['data'] = [];
    // } 
    
    
    try {
      const params = {
        xAxis: this.xAxisType,
        nameOfCounts: this.nameOfCounts
      }
      
      const response: any = {
        "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "Error" : "0",
        "ErrorCode" : "",
        "ErrorMessage" : "",
        "ProcessId" : "47a8532c4dc811ecb55f0022480d6e6c",
        "ProcessInstanceId" : "764527583b1811ed98d10242ac110002",
        "ProcessName" : "VPS Healthcare Chart API",
        "ProcessVariables" : {
           "count2" : "29",
           "domain" : "",
           "errorCode" : "200",
           "errorMessage" : "Chart",
           "errorStatus" : "S",
           "getGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND rating = '1' AND `created_at` like '2022-09-17 __:__:__' ",
           "getGraphQuery2" : "",
           "graphCount" : 29,
           "graphDateList": [
            {
              //  "bad" : 1,
              //  "good" : 3,
              "LEDTV": 5,
              "AirConditioner": 6,
              "WashingMachine": 5,
              "Refrigerator": 7,
              "MicrowaveOven": 8,
              "Camera": 5,
              "AudioSystem": 4,
              "BeautyCareProducts": 8,
              "AirPurifier": 7,
              "WaterPurifier": 9,
              "VacuumCleaner": 8,
              "Iron": 5,
              "Miraie": 4,
              "ChestFreezer": 3,
              "VideoConfCameras": 6,
              "BulkPurchaseEnquiry": 9,
              "graphCount": 19,
              "graphDate": "2022-09-23",
              //  "great" : 14,
              //  "ok" : 1
            },      
          ],
           "graphDateListCount" : 7,
           "graphLoop" : 7,
           "graphLoopStop" : true,
           "greatCount" : 0,
           "greatQuery" : "",
           "language" : "",
           "nameOfCounts" : "FEEDBACK",
           "test" : "",
           "testValue" : "",
           "totalAverage" : "38.00",
           "totalCoun2" : "271",
           "totalCount" : "",
           "xAxis" : "1"
        },
        "Status" : "Execution Completed",
        "WorkflowId" : "628dbe44d8299cd2b49dd678",
        "currentCorrelationId" : "281475477335059",
        "customizedLogId" : "",
        "endedOn" : "2022-09-23T08:19:36.994414",
        "isWaitingForEvent" : false,
        "nodeBPMNId" : "2",
        "processId" : "47a8532c4dc811ecb55f0022480d6e6c",
        "processName" : "VPS Healthcare Chart API",
        "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "repoName" : "VPS Health_v1",
        "rootCorrelationId" : "281475477335059",
        "startedOn" : "2022-09-23T08:19:36.785502"
     };

     console.log('getChart', response);

     const Error = response?.Error;
     const ErrorCode = response?.ErrorCode;
     const ErrorMessage = response?.ErrorMessage;

     this.processVariables = response?.ProcessVariables.graphDateList[0];
    
     if (Error == '0' ) {
 
       const LEDTV = this.processVariables.LEDTV;
       const AirConditioner = this.processVariables.AirConditioner;
       const WashingMachine = this.processVariables.WashingMachine;
       const Refrigerator = this.processVariables.Refrigerator;
       const MicrowaveOven = this.processVariables.MicrowaveOven;
       const Camera = this.processVariables.Camera;
       const AudioSystem = this.processVariables.AudioSystem;
       const BeautyCareProducts = this.processVariables.BeautyCareProducts;
       const AirPurifier = this.processVariables.AirPurifier;
       const WaterPurifier = this.processVariables.WaterPurifier;
       const VacuumCleaner = this.processVariables.VacuumCleaner;
       const Iron = this.processVariables.Iron;
       const Miraie = this.processVariables.Miraie;
       const ChestFreezer = this.processVariables.ChestFreezer;
       const VideoConfCameras = this.processVariables.VideoConfCameras;
       const BulkPurchaseEnquiry = this.processVariables.BulkPurchaseEnquiry;
       
       const year = this.processVariables.xAxis;
       const graphCounts = [{
        "graphCount" : LEDTV,
         "graphDate" : LEDTV
       },
     {
       "graphCount" : AirConditioner,
        "graphDate" : AirConditioner,
     },
     {
       "graphCount" : WashingMachine,
        "graphDate" : WashingMachine,
     },
     {
      "graphCount" : Refrigerator,
       "graphDate" : Refrigerator,
    },
    {
      "graphCount" : MicrowaveOven,
       "graphDate" : MicrowaveOven,
    },
    {
      "graphCount" : Camera,
       "graphDate" : Camera,
    },
    {
      "graphCount" : AudioSystem,
       "graphDate" : AudioSystem,
    },
    {
      "graphCount" : BeautyCareProducts,
       "graphDate" : BeautyCareProducts,
    },
    {
      "graphCount" : AirPurifier,
       "graphDate" : AirPurifier,
    },
    {
      "graphCount" : WaterPurifier,
       "graphDate" : WaterPurifier,
    },
    {
      "graphCount" : VacuumCleaner,
       "graphDate" : VacuumCleaner,
    },
    {
      "graphCount" : Iron,
       "graphDate" : Iron,
    },
    
    {
      "graphCount" : Miraie,
       "graphDate" : Miraie,
    },
    {
      "graphCount" : ChestFreezer,
       "graphDate" : ChestFreezer,
    },
    {
      "graphCount" : VideoConfCameras,
       "graphDate" : VideoConfCameras,
    },
    {
      "graphCount" : BulkPurchaseEnquiry,
       "graphDate" : BulkPurchaseEnquiry,
    },
  ]
    
       // this.lineChartLabels = [];
       // this.lineChartData = [{ data: [],
       //   label: 'Count' }];
       let yAxis = []
       let xAxis = [];
       graphCounts.forEach((graph) => {

         if (year == "3"){
           // const graphDate = graph.graphDate;
           // const split = graphDate.split('-');
           // const output = `${split[2]}/${split[1]}`
           // this.lineChartLabels.push(output);
            xAxis.push(graph.graphDate);
           yAxis.push(graph.graphCount);
         }else{
           const output = graph.graphDate;
           // const split = graphDate.split('-');
           // const output = `${split[2]}/${split[1]}`
           this.lineChartLabels.push(output);
           xAxis.push("");
           yAxis.push(graph.graphCount);
         }

         // this.bgColor =  ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF','#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
       })
      
       this.lineChartData[0]['data'] = yAxis.reverse();
       // this.lineChartData[0]['data'] = [appointmentCount, visitorCount]
       this.lineChartLabels= ["LED TV","Air COnditioner","Washing Machine","Refrigerator","Microwave Oven","Camera","Audio System","Beauty Products","Air Purifier","Water Purifier","Iron","Mirae","Chest Freezer","Video Conf Cameras","Bulk Enquiry"]

       console.log('this.lineChartLabels', this.lineChartLabels) //xAxis
       console.log('this.lineChartData', this.lineChartData) //yAxis
     }
     else {
       if (ErrorMessage === undefined) {
         return;
       }
       this.toasterService.showError(ErrorMessage == undefined ? 'Chart error' : ErrorMessage, 'Dashboard Chart')
     }
   } catch (err) {
     console.log("Error", err);
   }
  }

  async getFeedbackChartResults() {
    this.lineChartOptions={
      scales:{
        
      
      xAxes: [{
        stacked: true,
        // display: false,
         // this should be set to make the bars stacked
         display:true,
     }],
     yAxes: [{
        stacked: true ,
       // this also..
     }],
    }
    }
    this.lineChartData = [{ data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
  
}];
    // this.lineChartData.shift()
    // this.lineChartColors.shift()
    // this.lineChartLabels.shift()
    try {
      const params = {
        xAxis: this.xAxisType,
        nameOfCounts: this.nameOfCounts
      }
      let response={};
      if(this.xAxisType =='1'){
        response = {
          "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
          "Error" : "0",
          "ErrorCode" : "",
          "ErrorMessage" : "",
          "ProcessId" : "116b2bfcdb4611ec84290022480d6e6c",
          "ProcessInstanceId" : "b24337863b1811ed81c00242ac110002",
          "ProcessName" : "Feedback chart API",
          "ProcessVariables" : {
             "aTemp" : {
                "bad" : 1,
                "good" : 4,
                "graphCount" : 34,
                "great" : 29,
                "ok" : 0
             },
             "badGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17' and rating ='4'",
             "count" : 7,
             "count2" : "",
             "domain" : "",
             "errorCode" : "200",
             "errorMessage" : "",
             "errorStatus" : "",
             "getGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17' and rating ='1'",
             "getGraphQuery2" : "",
             "goodGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17' and rating ='2'",
             "graphCount" : 0,
             "graphDateList" : [
                {
                   "bad" : 1,
                   "good" : 3,
                   "graphCount" : 19,
                   "graphDate" : "2022-09-23",
                   "great" : 14,
                   "ok" : 1
                },
                {
                   "bad" : 1,
                   "good" : 23,
                   "graphCount" : 81,
                   "graphDate" : "2022-09-22",
                   "great" : 49,
                   "ok" : 8
                },
                {
                   "bad" : 2,
                   "good" : 7,
                   "graphCount" : 64,
                   "graphDate" : "2022-09-21",
                   "great" : 48,
                   "ok" : 7
                },
                {
                   "bad" : 3,
                   "good" : 10,
                   "graphCount" : 59,
                   "graphDate" : "2022-09-20",
                   "great" : 44,
                   "ok" : 2
                },
                {
                   "bad" : 1,
                   "good" : 7,
                   "graphCount" : 57,
                   "graphDate" : "2022-09-19",
                   "great" : 46,
                   "ok" : 3
                },
                {
                   "bad" : 2,
                   "good" : 9,
                   "graphCount" : 51,
                   "graphDate" : "2022-09-18",
                   "great" : 36,
                   "ok" : 4
                },
                {
                   "bad" : 1,
                   "good" : 4,
                   "graphCount" : 34,
                   "graphDate" : "2022-09-17",
                   "great" : 29,
                   "ok" : 0
                }
             ],
           
             "graphDateListCount" : 7,
             "graphDateListTemp" : {
                "graphDate" : "2022-09-17"
             },
             "graphLoop" : 0,
             "graphLoopStop" : false,
             "language" : "",
             "nameOfCounts" : "FEEDBACK",
             "okGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17' and rating ='3'",
             "sum" : 1482,
             "test" : "",
             "totalAverage" : "211.00",
             "totalCount" : "",
             "totalCount2" : "",
             "totalGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17'",
             "xAxis" : "1"
          },
          "Status" : "Execution Completed",
          "WorkflowId" : "628dbe44d8299cd2b49dd678",
          "currentCorrelationId" : "281475477335203",
          "customizedLogId" : "",
          "endedOn" : "2022-09-23T08:21:18.553026",
          "isWaitingForEvent" : false,
          "nodeBPMNId" : "4",
          "processId" : "116b2bfcdb4611ec84290022480d6e6c",
          "processName" : "Feedback chart API",
          "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
          "repoName" : "VPS Health_v1",
          "rootCorrelationId" : "281475477335203",
          "startedOn" : "2022-09-23T08:21:17.436170"
       }
      }
       else if(this.xAxisType == '2'){
        response = {
          "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
          "Error" : "0",
          "ErrorCode" : "",
          "ErrorMessage" : "",
          "ProcessId" : "116b2bfcdb4611ec84290022480d6e6c",
          "ProcessInstanceId" : "b24337863b1811ed81c00242ac110002",
          "ProcessName" : "Feedback chart API",
          "ProcessVariables" : {
             "aTemp" : {
                "bad" : 1,
                "good" : 4,
                "graphCount" : 34,
                "great" : 29,
                "ok" : 0
             },
             "badGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17' and rating ='4'",
             "count" : 7,
             "count2" : "",
             "domain" : "",
             "errorCode" : "200",
             "errorMessage" : "",
             "errorStatus" : "",
             "getGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17' and rating ='1'",
             "getGraphQuery2" : "",
             "goodGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17' and rating ='2'",
             "graphCount" : 0,
             "graphDateList" : [
              {
                 "bad" : 1,
                 "good" : 3,
                 "graphCount" : 19,
                 "graphDate" : "2022-10-28",
                 "great" : 14,
                 "ok" : 1
              },
              {
                 "bad" : 1,
                 "good" : 23,
                 "graphCount" : 81,
                 "graphDate" : "2022-10-27",
                 "great" : 49,
                 "ok" : 8
              },
              {
                 "bad" : 2,
                 "good" : 7,
                 "graphCount" : 64,
                 "graphDate" : "2022-10-26",
                 "great" : 48,
                 "ok" : 7
              },
              {
                 "bad" : 3,
                 "good" : 10,
                 "graphCount" : 59,
                 "graphDate" : "2022-10-25",
                 "great" : 44,
                 "ok" : 2
              },
              {
                 "bad" : 1,
                 "good" : 7,
                 "graphCount" : 57,
                 "graphDate" : "2022-10-24",
                 "great" : 46,
                 "ok" : 3
              },
              {
                 "bad" : 2,
                 "good" : 9,
                 "graphCount" : 51,
                 "graphDate" : "2022-10-23",
                 "great" : 36,
                 "ok" : 4
              },
              {
                 "bad" : 1,
                 "good" : 4,
                 "graphCount" : 34,
                 "graphDate" : "2022-10-22",
                 "great" : 29,
                 "ok" : 0
              },
        {
                 "bad" : 1,
                 "good" : 3,
                 "graphCount" : 19,
                 "graphDate" : "2022-10-21",
                 "great" : 14,
                 "ok" : 1
              },
              {
                 "bad" : 1,
                 "good" : 23,
                 "graphCount" : 81,
                 "graphDate" : "2022-10-20",
                 "great" : 49,
                 "ok" : 8
              },
              {
                 "bad" : 2,
                 "good" : 7,
                 "graphCount" : 64,
                 "graphDate" : "2022-10-19",
                 "great" : 48,
                 "ok" : 7
              },
              {
                 "bad" : 3,
                 "good" : 10,
                 "graphCount" : 59,
                 "graphDate" : "2022-10-18",
                 "great" : 44,
                 "ok" : 2
              },
              {
                 "bad" : 1,
                 "good" : 7,
                 "graphCount" : 57,
                 "graphDate" : "2022-10-17",
                 "great" : 46,
                 "ok" : 3
              },
              {
                 "bad" : 2,
                 "good" : 9,
                 "graphCount" : 51,
                 "graphDate" : "2022-10-16",
                 "great" : 36,
                 "ok" : 4
              },
              {
                 "bad" : 1,
                 "good" : 4,
                 "graphCount" : 34,
                 "graphDate" : "2022-10-15",
                 "great" : 29,
                 "ok" : 0
              },
        {
                 "bad" : 1,
                 "good" : 3,
                 "graphCount" : 19,
                 "graphDate" : "2022-10-14",
                 "great" : 14,
                 "ok" : 1
              },
              {
                 "bad" : 1,
                 "good" : 23,
                 "graphCount" : 81,
                 "graphDate" : "2022-10-13",
                 "great" : 49,
                 "ok" : 8
              },
              {
                 "bad" : 2,
                 "good" : 7,
                 "graphCount" : 64,
                 "graphDate" : "2022-10-12",
                 "great" : 48,
                 "ok" : 7
              },
              {
                 "bad" : 3,
                 "good" : 10,
                 "graphCount" : 59,
                 "graphDate" : "2022-10-11",
                 "great" : 44,
                 "ok" : 2
              },
              {
                 "bad" : 1,
                 "good" : 7,
                 "graphCount" : 57,
                 "graphDate" : "2022-10-10",
                 "great" : 46,
                 "ok" : 3
              },
              {
                 "bad" : 2,
                 "good" : 9,
                 "graphCount" : 51,
                 "graphDate" : "2022-10-09",
                 "great" : 36,
                 "ok" : 4
              },
              {
                 "bad" : 1,
                 "good" : 4,
                 "graphCount" : 34,
                 "graphDate" : "2022-10-08",
                 "great" : 29,
                 "ok" : 0
              },        {
                 "bad" : 1,
                 "good" : 3,
                 "graphCount" : 19,
                 "graphDate" : "2022-10-07",
                 "great" : 14,
                 "ok" : 1
              },
              {
                 "bad" : 1,
                 "good" : 23,
                 "graphCount" : 81,
                 "graphDate" : "2022-10-06",
                 "great" : 49,
                 "ok" : 8
              },
              {
                 "bad" : 2,
                 "good" : 7,
                 "graphCount" : 64,
                 "graphDate" : "2022-10-05",
                 "great" : 48,
                 "ok" : 7
              },
              {
                 "bad" : 3,
                 "good" : 10,
                 "graphCount" : 59,
                 "graphDate" : "2022-10-04",
                 "great" : 44,
                 "ok" : 2
              },
              {
                 "bad" : 1,
                 "good" : 7,
                 "graphCount" : 57,
                 "graphDate" : "2022-10-03",
                 "great" : 46,
                 "ok" : 3
              },
              {
                 "bad" : 2,
                 "good" : 9,
                 "graphCount" : 51,
                 "graphDate" : "2022-10-02",
                 "great" : 36,
                 "ok" : 4
              },
              {
                 "bad" : 1,
                 "good" : 4,
                 "graphCount" : 34,
                 "graphDate" : "2022-10-01",
                 "great" : 29,
                 "ok" : 0
              },
  		{
                 "bad" : 2,
                 "good" : 9,
                 "graphCount" : 51,
                 "graphDate" : "2022-09-31",
                 "great" : 36,
                 "ok" : 4
              },
              {
                 "bad" : 1,
                 "good" : 4,
                 "graphCount" : 34,
                 "graphDate" : "2022-09-30",
                 "great" : 29,
                 "ok" : 0
              },     
           ],
           
             "graphDateListCount" : 7,
             "graphDateListTemp" : {
                "graphDate" : "2022-09-17"
             },
             "graphLoop" : 0,
             "graphLoopStop" : false,
             "language" : "",
             "nameOfCounts" : "FEEDBACK",
             "okGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17' and rating ='3'",
             "sum" : 1482,
             "test" : "",
             "totalAverage" : "211.00",
             "totalCount" : "",
             "totalCount2" : "",
             "totalGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND cast(created_at as date)='2022-09-17'",
             "xAxis" : "1"
          },
          "Status" : "Execution Completed",
          "WorkflowId" : "628dbe44d8299cd2b49dd678",
          "currentCorrelationId" : "281475477335203",
          "customizedLogId" : "",
          "endedOn" : "2022-09-23T08:21:18.553026",
          "isWaitingForEvent" : false,
          "nodeBPMNId" : "4",
          "processId" : "116b2bfcdb4611ec84290022480d6e6c",
          "processName" : "Feedback chart API",
          "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
          "repoName" : "VPS Health_v1",
          "rootCorrelationId" : "281475477335203",
          "startedOn" : "2022-09-23T08:21:17.436170"
       }
       
      }
      else if(this.xAxisType == '3'){
        response = {
          "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
          "Error" : "0",
          "ErrorCode" : "",
          "ErrorMessage" : "",
          "ProcessId" : "47a8532c4dc811ecb55f0022480d6e6c",
          "ProcessInstanceId" : "764527583b1811ed98d10242ac110002",
          "ProcessName" : "VPS Healthcare Chart API",
          "ProcessVariables" : {
             "count2" : "29",
             "domain" : "",
             "errorCode" : "200",
             "errorMessage" : "Chart",
             "errorStatus" : "S",
             "getGraphQuery" : "SELECT COUNT(id) AS count FROM vps_feedback WHERE is_active = 1 AND rating = '1' AND `created_at` like '2022-09-17 __:__:__' ",
             "getGraphQuery2" : "",
             "graphCount" : 29,
             "graphDateList" : [
              
              {
                 "bad" : 2,
                 "good" : 9,
                 "graphCount" : 51,
               "graphDate" : "September",
                 "great" : 36,
                 "ok" : 4
              },
              {
                 "bad" : 1,
                 "good" : 4,
                 "graphCount" : 34,
                "graphDate" : "August",
                 "great" : 29,
                 "ok" : 0
              },
        {
                 "bad" : 1,
                 "good" : 3,
                 "graphCount" : 19,
                   "graphDate" : "July",
                 "great" : 14,
                 "ok" : 1
              },
              {
                 "bad" : 1,
                 "good" : 23,
                 "graphCount" : 81,
                  "graphDate" : "June",
                 "great" : 49,
                 "ok" : 8
              },
              {
                 "bad" : 2,
                 "good" : 7,
                 "graphCount" : 64,
                "graphDate" : "May",
                 "great" : 48,
                 "ok" : 7
              },
              {
                 "bad" : 3,
                 "good" : 10,
                 "graphCount" : 59,
                "graphDate" : "April",
                 "great" : 44,
                 "ok" : 2
              },
              {
                 "bad" : 1,
                 "good" : 7,
                 "graphCount" : 57,
            "graphDate" : "March",
                 "great" : 46,
                 "ok" : 3
              },
              {
                 "bad" : 2,
                 "good" : 9,
                 "graphCount" : 51,
                   "graphDate" : "February",
                 "great" : 36,
                 "ok" : 4
              },
              {
                 "bad" : 1,
                 "good" : 4,
                 "graphCount" : 34,
                  "graphDate" : "January",
                 "great" : 29,
                 "ok" : 0
              },
        {
                 "bad" : 1,
                 "good" : 3,
                 "graphCount" : 19,
               "graphDate" : "December",
                 "great" : 14,
                 "ok" : 1
              },
              {
                 "bad" : 1,
                 "good" : 23,
                 "graphCount" : 81,
                 "graphDate" : "November",
                 "great" : 49,
                 "ok" : 8
              },
              {
                 "bad" : 2,
                 "good" : 7,
                 "graphCount" : 64,
                "graphDate" : "October",
                 "great" : 48,
                 "ok" : 7
              },
             
          
           
           ],
     
             "graphDateListCount" : 7,
             "graphLoop" : 7,
             "graphLoopStop" : true,
             "greatCount" : 0,
             "greatQuery" : "",
             "language" : "",
             "nameOfCounts" : "FEEDBACK",
             "test" : "",
             "testValue" : "",
             "totalAverage" : "38.00",
             "totalCoun2" : "271",
             "totalCount" : "",
             "xAxis" : "1"
          },
          "Status" : "Execution Completed",
          "WorkflowId" : "628dbe44d8299cd2b49dd678",
          "currentCorrelationId" : "281475477335059",
          "customizedLogId" : "",
          "endedOn" : "2022-09-23T08:19:36.994414",
          "isWaitingForEvent" : false,
          "nodeBPMNId" : "2",
          "processId" : "47a8532c4dc811ecb55f0022480d6e6c",
          "processName" : "VPS Healthcare Chart API",
          "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
          "repoName" : "VPS Health_v1",
          "rootCorrelationId" : "281475477335059",
          "startedOn" : "2022-09-23T08:19:36.785502"
       };
      }
     
     console.log('getChart', response);

      const appiyoError = response['Error'];
      const apiErrorCode = response['ProcessVariables']['errorCode'];
      const errorMessage = response['ProcessVariables']['errorMessage'];

      this.processVariables = response['ProcessVariables']
     
      if (appiyoError == '0' && apiErrorCode == "200") {
  
        const graphCounts = this.processVariables.graphDateList;
        const year = this.processVariables.xAxis;
        const totalCount = this.processVariables.totalAverage;
        this.lineChartLabels = [];
        this.lineChartData = [{ data: [],
          // label: totalCount 
          label : "Average Count  " + parseInt(totalCount)
        }];
        let yAxisOk = [];
        let yAxisGood = [];
        let yAxisBad = [];
        let yAxisGreat = [];
        let xAxis = [];
        graphCounts.forEach((graph) => {

          if (this.xAxisType == "3"){
            // const graphDate = graph.graphDate;
            // const split = graphDate.split('-');
            // const output = `${split[2]}/${split[1]}`
            // this.lineChartLabels.push(output);
             xAxis.push(graph.graphDate);
             yAxisOk.push(graph.ok);
             yAxisGood.push(graph.good);
            // yAxisBad.push(graph.bad);
            yAxisGreat.push(graph.great);
          }else{
            const graphDate = graph.graphDate;
            const split = graphDate.split('-');
            const output = `${split[2]}/${split[1]}`
            this.lineChartLabels.push(output);
            xAxis.push(output);
            yAxisOk.push(graph.ok);
            yAxisGood.push(graph.good);
            // yAxisBad.push(graph.bad);
            yAxisGreat.push(graph.great);
          }
          // this.bgColor =  ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF','#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
        })

        this.lineChartData = [{
          label: 'Products&Offer',
          data: yAxisGreat.reverse(),
          backgroundColor: 'rgba(54, 162, 235, 0.9)',
          hoverBackgroundColor: 'rgba(54, 162, 235, 0.7)'
         }, {
          label: 'After Sales',
          data: yAxisGood.reverse(),
          backgroundColor: 'rgba(255, 205, 86, 0.8)',
          hoverBackgroundColor: 'rgba(255, 205, 86, 0.7)'
       }, {
            label: 'Online Chef Classes',
            data: yAxisOk.reverse(),
            // backgroundColor: 'rgba(75, 192, 192, 0.8)',
            backgroundColor:'#28a745',
            hoverBackgroundColor: 'rgba(75, 192, 192, 0.7)'
        }, 
        // {
      //     label: 'Bad',
      //     data: yAxisBad.reverse(),
      //     backgroundColor: 'rgba(255, 99, 132, 0.8)',
      //     hoverBackgroundColor: 'rgba(255, 99, 132, 0.7)'
      //  }
    ];
        
        this.lineChartLabels= xAxis.reverse();

        console.log('this.barChartLabels', this.lineChartLabels) //xAxis
        console.log('this.barChartData', this.lineChartData) //yAxis
      }
      else {
        if (errorMessage === undefined) {
          return;
        }
        this.toasterService.showError(errorMessage == undefined ? 'Chart error' : errorMessage, 'Dashboard Chart')
      }
    } catch (err) {
      console.log("Error", err);
    }

  }


  async getConversionChartResults() {
    // if (this.lineChartData[0] && this.lineChartData[1] && this.lineChartData[2] && this.lineChartData[3]) {
    //   this.lineChartData[0].data = [];
    //   this.lineChartData[1].data = [];
    //   this.lineChartData[2].data = [];
    //   this.lineChartData[3].data = [];
    //   this.lineChartData.splice(1, this.lineChartData.length-1);
    // } else if (this.lineChartData[0]) {
    //   this.lineChartData[0]['data'] = [];
    // }  
    this.lineChartOptions={
      scales:{
        xAxes:[{
          display:false,
      }]
      }
    }
    this.lineChartData = [{ data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
  
}];
    try {
      const params = {
        xAxis: this.xAxisType,
        // nameOfCounts: this.nameOfCounts
      }
      const response: any = {
        "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "Error" : "0",
        "ErrorCode" : "",
        "ErrorMessage" : "",
        "ProcessId" : "186630e867a411ecb8da0022480d6e6c",
        "ProcessInstanceId" : "ed302b6a3b1811ed94f70242ac110002",
        "ProcessName" : "VPS Healthcare Chart Appointment Conversion API",
        "ProcessVariables" : {
           "appointmentBookingCount" : 1513,
           "appointmentBookingQuery" : "SELECT COUNT(id) as appointment_booking_count FROM vps_appointment_booking_report WHERE is_active = 1 AND cast(created_at as date) BETWEEN '2022-09-16' AND '2022-09-23' ",
           "appointmentRating" : 87,
           "countQuery" : "",
           "endDate" : "2022-09-23",
           "startDate" : "2022-09-16",
           "totalCount" : 0,
           "visitorCount" : 1728,
           "visitorCount2" : 0,
           "feedbackCount": 1300,
           "visitorQuery" : "SELECT COUNT(id) as visitor_count FROM vps_user_monitor WHERE is_active = 1 AND cast(created_at as date) BETWEEN '2022-09-16' AND '2022-09-23' ",
           "visitorTotalQuery" : "",
           "xAxis" : "1"
        },
        "Status" : "Execution Completed",
        "WorkflowId" : "628dbe44d8299cd2b49dd678",
        "currentCorrelationId" : "281475477335287",
        "customizedLogId" : "",
        "endedOn" : "2022-09-23T08:22:56.460213",
        "isWaitingForEvent" : false,
        "nodeBPMNId" : "5",
        "processId" : "186630e867a411ecb8da0022480d6e6c",
        "processName" : "VPS Healthcare Chart Appointment Conversion API",
        "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "repoName" : "VPS Health_v1",
        "rootCorrelationId" : "281475477335287",
        "startedOn" : "2022-09-23T08:22:56.296623"
     }
     ;
      console.log('getChart', response);

      const Error = response?.Error;
      const ErrorCode = response?.ErrorCode;
      const ErrorMessage = response?.ErrorMessage;

      this.processVariables = response?.ProcessVariables
     
      if (Error == '0' ) {
  
        const appointmentCount = this.processVariables.appointmentBookingCount;
        const visitorCount = this.processVariables.visitorCount;
        const feedbackCount = this.processVariables.feedbackCount;

        const year = this.processVariables.xAxis;
        const graphCounts = [{
         "graphCount" : visitorCount,
          "graphDate" : visitorCount
        },
      {
        "graphCount" : appointmentCount,
         "graphDate" : appointmentCount,
      },
      {
        "graphCount" : feedbackCount,
         "graphDate" : feedbackCount,
      }]
        // this.lineChartLabels = [];
        // this.lineChartData = [{ data: [],
        //   label: 'Count' }];
        let yAxis = []
        let xAxis = [];
        graphCounts.forEach((graph) => {

          if (year == "3"){
            // const graphDate = graph.graphDate;
            // const split = graphDate.split('-');
            // const output = `${split[2]}/${split[1]}`
            // this.lineChartLabels.push(output);
             xAxis.push(graph.graphDate);
            yAxis.push(graph.graphCount);
          }else{
            const output = graph.graphDate;
            // const split = graphDate.split('-');
            // const output = `${split[2]}/${split[1]}`
            this.lineChartLabels.push(output);
            xAxis.push(output);
            yAxis.push(graph.graphCount);
          }
          // this.bgColor =  ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF','#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
        })
        
        this.lineChartData[0]['data'] = yAxis.reverse();
        // this.lineChartData[0]['data'] = [appointmentCount, visitorCount]
        this.lineChartLabels= ["Happy", "Neutral", "Sad"]

        console.log('this.lineChartLabels', this.lineChartLabels) //xAxis
        console.log('this.lineChartData', this.lineChartData) //yAxis
      }
      else {
        if (ErrorMessage === undefined) {
          return;
        }
        this.toasterService.showError(ErrorMessage == undefined ? 'Chart error' : ErrorMessage, 'Dashboard Chart')
      }
    } catch (err) {
      console.log("Error", err);
    }

  }

  
  async getRetailerStatus() {
    const response: any ={
        "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "Error" : "0",
        "ErrorCode" : "",
        "ErrorMessage" : "",
        "ProcessId" : "93d5b544519911ecb58f0022480d6e6c",
        "ProcessInstanceId" : "01d4562a3b1b11edbe9e0242ac110002",
        "ProcessName" : "VPS Count API",
        "ProcessVariables" : {
           "appointmentCount" : 68,
           "appointmentQuery" : "SELECT COUNT(id) AS appointment_count FROM vps_appointment_booking_report WHERE is_active = 1",
           "appointmentRating" : 47,
           "ccDate" : "",
           "errorCode" : "200",
           "errorMessage" : "Count Response",
           "errorStatus" : "S",
           "feedbackCount" : 39,
           "liveAgentCount" : 30,
           "test1" : "",
           "totalAppointment" : 77364,
           "totalVisitor" : 164223,
           "visitorQuery" : "SELECT COUNT(id) AS visitor_count FROM vps_user_monitor WHERE is_active = 1"
        },
        "Status" : "Execution Completed",
        "WorkflowId" : "628dbe44d8299cd2b49dd676",
        "currentCorrelationId" : "281475477336294",
        "customizedLogId" : "",
        "endedOn" : "2022-09-23T08:37:50.093934",
        "isWaitingForEvent" : false,
        "nodeBPMNId" : "2",
        "processId" : "93d5b544519911ecb58f0022480d6e6c",
        "processName" : "VPS Count API",
        "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
        "repoName" : "VPS Health_v1",
        "rootCorrelationId" : "281475477336294",
        "startedOn" : "2022-09-23T08:37:49.920538"
     };
    console.log('getRetailerStatus', response);

    const appiyoError = response.Error;
    const apiErrorCode = response.ProcessVariables?.errorCode;
    const errorMessage = response.ProcessVariables?.errorMessage;

    if (appiyoError === '0' && apiErrorCode == '200') {
      const counts = response?.ProcessVariables   
      // this.feedBackCount =   Number(counts?.feedbackCount)
      this.retailerStatus = {
        feedbackCount: counts?.feedbackCount,
        ticketCount: counts?.appointmentCount,
        visitorCount: counts?.liveAgentCount,
        conversionCount : counts?.appointmentRating
      };
    } else {
      if(errorMessage === undefined){
        return;
      }
      this.toasterService.showError(errorMessage == undefined ? 'Count error' : errorMessage, 'Feedback Ticket Visitor Count Dashboard API')
    }
  }

  apply(){

  }
  clear(){

  }

}


