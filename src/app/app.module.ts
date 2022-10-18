import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgChartsModule } from 'ng2-charts';
import { ChartModule } from 'primeng/chart';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { HighchartComponent } from './highchart/highchart.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { PrimengComponent } from './primeng/primeng.component';
import { DialogComponent } from './util/dialog/dialog.component';
import { ShiftIncrementValueDirective } from './shift-increment-value.directive';
@NgModule({
  declarations: [
    AppComponent,
    ChartjsComponent,
    HighchartComponent,
    NavigatorComponent,
    PrimengComponent,
    DialogComponent,
    ShiftIncrementValueDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    HighchartsChartModule,
    ChartModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
