import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-plugin-dragdata';
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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public lineChartData: Array<any> | undefined;
  currentView = 'day';
  historyData = [];

  public lineChartOptions: any;

  date_list = [
    '11-02-2021',
    '14-03-2021',
    '15-04-2021',
    '11-05-2022',
    '11-06-2021',
    '11-07-2021',
  ];
  value_list = [10000, 20000, 30000, 25000, 30000, 50000, 60000];
  start_date = new Date(this.date_list[0]);
  end_date = new Date(this.date_list[this.date_list.length - 1]);

  public lineChartLabels: Array<any> = this.date_list;
  range_min = new Date(this.date_list[0]); //start date

  range_max = new Date(this.date_list[this.date_list.length - 1]); //end date

  ngOnInit(): void {
    this.range_min.setDate(this.range_min.getDate() - 10);
    this.range_max.setDate(this.range_max.getDate() + 10);

    Chart.register([annotationPlugin, zoomPlugin]);
    this.lineChartOptions = {
      type: 'line',
      animation: true,
      responsive: false,
      title: {
        display: true,
        fontSize: 30,
        text: '',
      },
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
          type: 'linear',
          min: 10000,
          max: 70000,
          ticks: {
            beginAtZero: true,
            callback: function (label: number) {
              return label / 1000 + 'k';
            },
          },
        },
      },
      dragData: true,
      dragDataRound: 30,
      plugins: {
        dragData: {
          round: 1,
          showTooltip: true,
          dragX: false,
          onDragStart: (
            e: MouseEvent,
            datasetIndex: number,
            index: number,
            value: any
          ) => {
            return datasetIndex === 0 ? true : false;
          },
          onDrag: (
            e: { target: { style: { cursor: string } } },
            _datasetIndex: any,
            _index: any,
            _value: any
          ) => {
            e.target.style.cursor = 'grabbing';
            // console.log(e, datasetIndex, index, value);
          },
          onDragEnd: (
            e: { target: { style: { cursor: string } } },
            datasetIndex: any,
            index: any,
            value: any
          ) => {
            e.target.style.cursor = 'default';

            this.createOriginalData();
          },
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x',
            threshold: 10,
            rangeMin: {
              x: this.range_min,
            },
            rangeMax: {
              x: this.range_max,
            },
            onZoomComplete: ({ chart }: any) => {},
          },
          pan: {
            enabled: true,
            mode: 'x',
            rangeMin: {
              x: this.range_min,
            },
            rangeMax: {
              x: this.range_max,
            },
          },
        },
      },
    };

    this.lineChartData = [
      {
        label: 'Lines',
        data: DATA,
        pointHitRadius: 30,
        pointRadius: 4,
        fill: false,
        drag: false,
      },
    ];
  }

  createOriginalData() {}
}
