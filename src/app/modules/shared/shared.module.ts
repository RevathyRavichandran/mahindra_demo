import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { ChartDashboardComponent } from './charts/chart-dashboard/chart-dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomListComponent } from './custom-list/custom-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Daterangepicker } from 'ng2-daterangepicker';
import { AnimatedDigitComponent } from './animated-digit/animated-digit.component';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { RadialChartComponent } from './radial-chart/radial-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { ColumnChartComponent } from './column-chart/column-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';


@NgModule({
  declarations: [
    MenuBarComponent,
    AlertModalComponent,
    ChartDashboardComponent,
    CustomInputComponent,
    InfoModalComponent,
    CustomSelectComponent,
    PageNotFoundComponent,
    ConfirmModalComponent,
    CustomListComponent,
    AnimatedDigitComponent,
    PieChartComponent,
    RadialChartComponent,
    AreaChartComponent,
    ColumnChartComponent,
    LineChartComponent,
    BarChartComponent
    ],
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxPaginationModule,
    Daterangepicker,
    MatSlideToggleModule,
    NgApexchartsModule
  ],
  exports: [
    MenuBarComponent,
    AlertModalComponent,
    // ChartDashboardComponent,
    CustomInputComponent,
    InfoModalComponent,
    CustomSelectComponent,
    PageNotFoundComponent,
    ConfirmModalComponent,
    CustomListComponent
  ]
})
export class SharedModule { }
