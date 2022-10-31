import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { Subscription } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};


@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})

export class AreaChartComponent implements OnInit {
  @ViewChild("chart1") chart: ChartComponent;
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
          name: "Graph Count",
          data: []
        }
      ],
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "Corporate Deck Analysis",
        align: "left"
      },
      subtitle: {
        text: "Price Movements",
        align: "left"
      },
      labels: [],
      xaxis: {
        // type: "datetime"
      },
      yaxis: {
        opposite: false
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }


  ngOnInit(): void {
    if (this.active == true) {
      this.clickEventsubscription =    this.enterpriseApiService.getClickEvent().subscribe(()=>{
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
          nameOfCounts: 'CORPORATE_DECK',
          "fromDate": this.fromDate,
          "toDate": this.toDate
        }

      }

      


      this.enterpriseApiService.corporateDeckChart(params).subscribe(response => {

        
        console.log('getChart-test', response, this.count);

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
