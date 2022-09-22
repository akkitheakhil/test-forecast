import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import * as chart from 'chartjs-plugin-dragdata';
import zoomPlugin from 'chartjs-plugin-zoom';

const DATA = [
  {
    x: '2021-11-06 23:39:30',
    y: 21000,
  },
  {
    x: '2021-11-07 01:00:28',
    y: 26000,
  },
  {
    x: '2021-11-08 09:00:28',
    y: 35000,
  },
  {
    x: '2021-11-09 09:00:28',
    y: 30000,
  },
  {
    x: '2021-11-10 09:00:28',
    y: 28000,
  },
  {
    x: '2021-11-11 09:00:28',
    y: 42000,
  },
];

@Component({
  selector: 'app-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.scss'],
})
export class ChartjsComponent implements OnInit, AfterViewInit {
  public lineChartData: Array<any> | undefined;
  currentView = 'day';
  historyData = [];
  @ViewChild('canvas')
  canvas!: ElementRef;

  chart!: Chart;

  public lineChartOptions: any;

  date_list = [
    '2021-11-06 23:39:30',
    '2021-11-07 01:00:28',
    '2021-11-08 09:00:28',
    '2021-11-09 09:00:28',
    '2021-11-10 09:00:28',
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    console.log(this.canvas.nativeElement);
    const chartCtx = this.canvas.nativeElement;
    Chart.register([annotationPlugin, zoomPlugin, chart]);
    this.chart = new Chart(chartCtx, {
      type: 'line',
      data: {
        labels: this.date_list,
        datasets: [
          {
            data: [2000, 3000, 5000, 2100, 4500],
            fill: false,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 25, // for improved touch support
            // dragData: false // prohibit dragging this dataset
            // same as returning `false` in the onDragStart callback
            // for this datsets index position
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'timeseries',
            min: '2021-11-05 00:00:00',
            max: '2021-11-10 00:00:00',
            time: {
              minUnit: 'day',
            },
            ticks: {
              maxRotation: 14,
              minRotation: 14,
            },
          },
          y: {
            min: 1000,
            max: 7000,
          },
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
              onZoomComplete: ({ chart }: any) => {},
            },
            pan: {
              enabled: true,
              mode: 'x',
            },
          },
        },
      },
    });
  }

  createOriginalData() {}
}
