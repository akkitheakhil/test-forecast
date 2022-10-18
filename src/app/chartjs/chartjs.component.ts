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
import * as ChartJSdragDataPlugin from 'chartjs-plugin-dragdata';
import zoomPlugin from 'chartjs-plugin-zoom';
import { DataService } from '../services/data.service';
import { CorsairPlugin } from '../util/custom-plugin';
import { externalTooltipHandler } from '../util/custom-tooltip';

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

  chart!: any;
  aggregatedData: any;

  public lineChartOptions: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const today = new Date();
    this.aggregatedData = this.dataService.getDataForChart('ALS');

    const chartCtx = this.canvas.nativeElement;
    Chart.register([
      annotationPlugin,
      zoomPlugin,
      ChartJSdragDataPlugin,
      CorsairPlugin,
    ]);

    this.chart = new Chart(chartCtx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Original',
            custom: {
              tooltipLabel: 'Total Deliveries',
            },
            data: this.aggregatedData.map((agg: { y: number }) => ({
              ...agg,
              y: agg.y,
            })),
            fill: false,
            tension: 0,
            borderWidth: 2,
            pointHitRadius: 25, // for improved touch support
            // dragData: false // prohibit dragging this dataset
            // same as returning `false` in the onDragStart callback
            // for this datsets index position
          },
        ],
      },
      options: {
        responsive: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            type: 'timeseries',
            time: {
              minUnit: 'day',
              isoWeekday: true,
            },
            ticks: {
              maxRotation: 14,
              minRotation: 14,
            },
          },
          y: {
            max: Math.max(...this.aggregatedData.map((o: any) => o.y)) + 300,
            min: Math.min(...this.aggregatedData.map((o: any) => o.y)) - 300,
          },
        },
        plugins: {
          zoom: {
            limits: {
              x: {
                min: this.aggregatedData[0].x,
                max: this.aggregatedData[this.aggregatedData.length - 1].x,
              },
              y: {
                min:
                  Math.min(...this.aggregatedData.map((o: any) => o.y)) - 300,
                max:
                  Math.max(...this.aggregatedData.map((o: any) => o.y)) + 300,
              },
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
              onZoomComplete: ({ chart }: any) => {},
            },
            pan: {
              enabled: true,
              mode: 'x',
            },
          },
          dragData: {
            round: 0,
            onDragStart: (e: MouseEvent, datasetIndex: number) => {
              this.chart.data.datasets[0].label = 'Adjusted';
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
          tooltip: {
            enabled: false,
            intersect: false,
            mode: 'index',
            external: externalTooltipHandler,
          },
          corsair: {
            horizontal: false,
            vertical: true,
            color: '#575654',
            dash: [5, 5],
            width: 2,
          },
          annotation: {
            annotations: {
              box1: {
                type: 'box',
                xMax: '2022-10-13',
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
              },
            },
          },
        },
      },
    });
  }

  createOriginalData() {
    if (this.chart.data.datasets.length > 1) {
      return;
    }

    this.chart.data.datasets[0].label = 'Adjusted';
    this.chart.data.datasets.push({
      animation: false,
      label: 'Original',
      data: this.aggregatedData.map((agg: { y: number }) => ({
        ...agg,
        y: agg.y,
      })),
      custom: {
        tooltipLabel: 'Total Deliveries',
      },
      fill: false,
      tension: 0,
      borderWidth: 1,
      pointHitRadius: 25, // for improved touch support
      borderDash: [10, 10],
      dragData: false,
    });
    this.chart.update();
  }
}
