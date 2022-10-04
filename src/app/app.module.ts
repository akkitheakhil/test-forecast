import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HighchartsChartModule } from 'highcharts-angular';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { HighchartComponent } from './highchart/highchart.component';
import { NavigatorComponent } from './navigator/navigator.component';

@NgModule({
  declarations: [AppComponent, ChartjsComponent, HighchartComponent, NavigatorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    HighchartsChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
