import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { Subscription } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexTooltip,
  ApexFill,
  ApexStates
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  fill: ApexFill;
  states: ApexStates;
  title: ApexTitleSubtitle;
  labels: string[];
  colors: string[];
};

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @ViewChild("chart4") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  processVariables: any;
  xAxisType = '1';
  @Input() xAxis: any;
  @Input() active: any;
  @Input() count: any;
  @Input() fromDate: any;
  @Input() toDate: any;

  lineChartLabels: string[];

  clickEventsubscription:Subscription;

  constructor(private enterpriseApiService: DashboardService,) {
    
    this.chartOptions = {
      series: [
        {
          name: "Graph count",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 650,
        stacked: true,
        dropShadow: {
          enabled: true,
          blur: 1,
          opacity: 0.25
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "60%"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2
      },
      title: {
        text: "Digital Factsheet Analysis"
      },
      labels: [],
      // xaxis: {
      //   categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014]
      // },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        shared: false,
        // y: {
        //   formatter: function(val) {
        //     return val + "K";
        //   }
        // }
      },
      colors: ['#62BA91'],
      fill: {
        type: "gradient",
        gradient: {
          gradientToColors: ["#9AEEC7"],
          stops: [0, 100],
          opacityFrom: 0.8,
          opacityTo: 0.7
        }
      },
      states: {
        hover: {
          filter: {
            type: "none"
          }
        }
      },
      legend: {
        position: "right",
        offsetY: 40
      }
    };
  }

  ngOnInit(): void {
    if(this.active == true) {    
      this.clickEventsubscription = this.enterpriseApiService.getClickEvent().subscribe(()=>{
        this.getChart();
      })      
    }
  }

  getChart() {
    
    // this.lineChartData = [{ data: [],
    // }];

    
    try {
      const params = {
        "ProcessVariables": {
          xAxis: this.xAxis,
          nameOfCounts: 'DIGITAL_FACTSHEET',
          "fromDate": this.fromDate,
          "toDate": this.toDate
        }

      }

      


      this.enterpriseApiService.digitalChart(params).subscribe(response => {

        
        console.log('getChart-test', response);

        const appiyoError = response?.Error;
        const apiErrorCode = response.ProcessVariables?.errorCode;
        const errorMessage = response.ProcessVariables?.errorMessage;

        this.processVariables = response?.ProcessVariables

        if (appiyoError == '0') {

          const graphCounts = this.processVariables.graphDateList;
          const year = this.processVariables.xAxis;
          const totalCount = this.processVariables.totalAverage;
          this.lineChartLabels = [];
          

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
                if(this.count == 'Count') {
                  this.chartOptions.series[0].name = 'Graph Count';
                  yAxis.push(parseInt(graph.graphCount));
                } else {
                  this.chartOptions.series[0].name = 'Graph Percentage';
                  Percentag.push(Percentage);
                  yAxis.push(parseInt(graph.graphPercentage)); 
                }
                
              } else {
                xAxis.push(graph.graphDate);
                if(this.count == 'Count') {
                  this.chartOptions.series[0].name = 'Graph Count';
                  yAxis.push(parseInt(graph.graphCount));
                } else {
                  this.chartOptions.series[0].name = 'Graph Percentage';
                  Percentag.push(Percentage);
                  yAxis.push(parseInt(graph.graphPercentage));
                  
                }
              }
              
            // this.bgColor = ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
          })
          

          this.lineChartLabels = xAxis.reverse();

          this.chartOptions.series[0].data = yAxis.reverse();
          this.chartOptions.labels = this.lineChartLabels;
         
        }
        
        
        else {
          if (errorMessage === undefined) {
            return;
          }
          // this.toasterService.showError(errorMessage == undefined ? 'Chart error' : errorMessage, 'Dashboard Chart')
        }
      })



    } catch (err) {
      console.log("Error", err);
    }


  }

}
