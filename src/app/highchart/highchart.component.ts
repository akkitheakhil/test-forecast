import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import IndicatorZigzag from 'highcharts/indicators/zigzag';
import Draggable from 'highcharts/modules/draggable-points';
import { DataService } from '../services/data.service';

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);
Draggable(Highcharts);

@Component({
  selector: 'app-highchart',
  templateUrl: './highchart.component.html',
  styleUrls: ['./highchart.component.scss'],
})
export class HighchartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  data: any[] = [];
  aggregatedData: any[] = [];
  copyControlsValues = {
    copy: [],
    paste: [],
  };

  ngOnInit() {
    this.aggregatedData = this.dataService.getDataForChart('ALS');

    const maxDragValue =
      Math.max(...this.aggregatedData.map((o: any) => o.y)) + 300;
    const minDragValue =
      Math.min(...this.aggregatedData.map((o: any) => o.y)) - 300;

    this.chartOptions?.series?.push({
      type: 'line',
      name: 'Original',
      data: this.aggregatedData.map((agg: { y: number }) => ({
        ...agg,
        y: agg.y,
      })),
      visible: true,
      pointInterval: 1000 * 3600 * 24,
      dashStyle: 'LongDash',
      dragDrop: {
        draggableY: false,
      },
    });
    this.chartOptions?.series?.push({
      type: 'line',
      name: 'Adjusted',
      data: this.aggregatedData.map((agg: { y: number }) => ({
        ...agg,
        y: agg.y,
      })),
      visible: true,
      pointInterval: 1000 * 3600 * 24,
    });

    if (this.chartOptions?.plotOptions?.series?.dragDrop) {
      this.chartOptions.plotOptions.series.dragDrop.dragMaxY = maxDragValue;
      this.chartOptions.plotOptions.series.dragDrop.dragMinY = minDragValue;
    }
    this.updateFlag = true;
  }

  chartOptions: Highcharts.Options = {
    chart: {
      renderTo: 'chart-container',
      plotBorderWidth: 1,
      animation: false,
      width: 900,
      height: 800,
    },
    plotOptions: {
      series: {
        dragDrop: {
          draggableY: true,
          dragPrecisionY: 0,
          dragSensitivity: 10,
          dragMaxY: 2000,
          dragMinY: 300,
        },
        events: {
          click: ($event) => this.getSelectedPoint($event),
        },
      },
      zigzag: {
        allowPointSelect: true,
      },
    },
    tooltip: {
      valueDecimals: 0,
    },
    mapNavigation: {
      enabled: true,
      enableMouseWheelZoom: true,
    },
    navigator: {
      xAxis: {
        tickInterval: 1000 * 3600 * 24,
      },
    },
    yAxis: {
      allowDecimals: false,
      opposite: false,
      tickInterval: 100,
      endOnTick: true,
    },
    xAxis: {
      minRange: 86400000,
    },
    series: [],
    rangeSelector: {
      enabled: false,
    },
  };

  constructor(private dataService: DataService) {}

  getSelectedPoint(event: any) {
    console.log(event);
  }
}
