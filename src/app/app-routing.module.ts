import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { HighchartComponent } from './highchart/highchart.component';
import { NavigatorComponent } from './navigator/navigator.component';

const routes: Routes = [
  {
    path: 'chart-js',
    component: ChartjsComponent,
  },
  {
    path: 'highchart',
    component: HighchartComponent,
  },
  {
    path: '',
    component: NavigatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
