import { Component, Input, OnInit, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts'
import { DashboardService } from '@services/dashboard.service';
import { Subscription } from 'rxjs';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexPlotOptions,
  ApexStates,
  ApexTheme,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: any;
  stroke: ApexStroke;
  states: ApexStates;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
};


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  processVariables: any;
  xAxisType = '1';
  @Input() xAxis: any;
  @Input() active: any;

  message = 'Count';
  lineChartLabels: string[];

  clickEventsubscription:Subscription;
  
  setMessage(e) {
    if (e.checked) this.message = 'Percentage';
    else this.message = 'Count';
    this.getChart()
  }
  constructor(private enterpriseApiService: DashboardService,) { 
    
    this.chartOptions = {
      series: [],
      chart: {
        width: 380,
        type: "donut",
        dropShadow: {
          enabled: true,
          color: "#111",
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2
        }
      },
      stroke: {
        width: 0
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true
              }
            }
          }
        }
      },
      labels: ["Corporate Deck", "Market Updates", "Product Info", "Digital Factsheet"],
      dataLabels: {
        dropShadow: {
          blur: 3,
          opacity: 0.8
        }
      },
      fill: {
        type: "gradient",
        opacity: 1,
        // pattern: {
        //   enabled: true,
        //   style: [
        //     "verticalLines",
        //     "squares",
        //     "horizontalLines",
        //     "circles",
        //     "slantedLines"
        //   ]
        // }
      },
      states: {
        hover: {
          filter: {
            type: "none"
          }
        }
      },
      theme: {
        palette: "palette2"
      },
      title: {
        text: "Overall Doughnut Chart Analysis"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
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

    
    const params = {
      "ProcessVariables": {
        "xAxis": this.xAxis
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

        const appointmentCount = this.processVariables.count_list[0];
        const appointmentPer = this.processVariables.graphDateList[0].graphPercentage;
        const visitorCount = this.processVariables.count_list[1];
        const visitorPer = this.processVariables.graphDateList[1].graphPercentage;
        const productCount = this.processVariables.count_list[2];
        const productPer = this.processVariables.graphDateList[2].graphPercentage;
        const digitalCount = this.processVariables.count_list[3];
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
                xAxis.push(output);
                if(this.message == 'Count') {
                  yAxis.push(parseInt(graph.graphCount));
                } else {
                  yAxis.push(graph.graphPercentage); 
                }
                
              } else {
                xAxis.push(graph.graphDate);
                if(this.message == 'Count') {
                  yAxis.push(parseInt(graph.graphCount));
                } else {
                  yAxis.push(graph.graphPercentage);
                  
                }
              }
          // this.bgColor =  ['#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF','#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF', '#FFE5A8', '#CAADFF', '#FFD1A3', '#9CFCFC', '#D7D7DF', '#FFE0E6', '#A3D9FF'];
        })

        
        // this.lineChartData[0]['data'] = [appointmentCount, visitorCount]
        

        this.chartOptions.series = yAxis;
        

        
      }
      else {
        if (ErrorMessage === undefined) {
          return;
        }
        // this.toasterService.showError(ErrorMessage == undefined ? 'Chart error' : ErrorMessage, 'Dashboard Chart')
      }



    })


  }

}

