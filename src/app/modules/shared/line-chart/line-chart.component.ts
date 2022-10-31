import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { Subscription } from 'rxjs';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  labels: string[];
};

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @ViewChild("chart3") chart: ChartComponent;
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
    
   }

  ngOnInit(): void {
    if(this.active == true) {
      this.clickEventsubscription=    this.enterpriseApiService.getClickEvent().subscribe(()=>{
        this.getChart();
      })
    }
    this.chartOptions = {
      series: [
        {
          name: "Graph Count",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      stroke: {
        width: 7,
        curve: "smooth"
      },
      labels: [],
      // xaxis: {
      //   type: "datetime",
      //   categories: [
      //     "1/11/2000",
      //     "2/11/2000",
      //     "3/11/2000",
      //     "4/11/2000",
      //     "5/11/2000",
      //     "6/11/2000",
      //     "7/11/2000",
      //     "8/11/2000",
      //     "9/11/2000",
      //     "10/11/2000",
      //     "11/11/2000",
      //     "12/11/2000",
      //     "1/11/2001",
      //     "2/11/2001",
      //     "3/11/2001",
      //     "4/11/2001",
      //     "5/11/2001",
      //     "6/11/2001"
      //   ]
      // },
      title: {
        text: "Product Info Analysis",
        align: "left",
        style: {
          fontSize: "16px",
          color: "#666"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#FDD835"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 4,
        colors: ["#FFA41B"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      yaxis: {
        // min: -10,
        // max: 40,
        // title: {
        //   text: "Count Value"
        // }
      }
    };
  }

  getChart() {
    
    // this.lineChartData = [{ data: [],
    // }];

    
    try {
      const params = {
        "ProcessVariables": {
          xAxis: this.xAxis,
          nameOfCounts: 'PRODUCT_INFO',
          "fromDate": this.fromDate,
          "toDate": this.toDate
        }

      }

      


      this.enterpriseApiService.productInfoChart(params).subscribe(response => {

        
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
