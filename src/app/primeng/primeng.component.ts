import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChartData, ChartOptions, Plugin } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { addDays, subDays } from 'date-fns';
import { UIChart } from 'primeng/chart';
import { DataService } from '../services/data.service';
import { CorsairPlugin } from '../util/custom-plugin';
import { externalTooltipHandler } from '../util/custom-tooltip';
import { DialogComponent } from '../util/dialog/dialog.component';

@Component({
  selector: 'app-primeng',
  templateUrl: './primeng.component.html',
  styleUrls: ['./primeng.component.scss'],
})
export class PrimengComponent implements OnInit {
  multiAxisData!: ChartData;
  multiAxisOptions!: ChartOptions;
  aggregatedData: any;
  plugin: Plugin[] = [CorsairPlugin, annotationPlugin, zoomPlugin];
  allHubs: string[] = [];
  hub = 'ALS';

  @ViewChild('chart') chart!: UIChart;

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.allHubs = this.dataService.getAllHubs();
    this.hub = 'ALS';
    this.aggregatedData = this.dataService.getDataForChart(this.hub);
    this.createNewGraph();
  }

  createNewGraph() {
    const today = new Date().toISOString().split('T')[0];
    this.multiAxisData = {
      datasets: [
        {
          label: 'Original',
          data: this.aggregatedData.map((agg: { y: number }) => ({
            ...agg,
            y: agg.y,
          })),
          custom: {
            tooltipLabel: 'Total Deliveries',
            canAdjust: true,
          },
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderWidth: 2,
          tension: 0,
          pointBorderColor: 'rgb(75, 192, 192)', // blue point border
          pointBackgroundColor: 'white', // wite point fill
          pointBorderWidth: 2, // point border width
          pointHoverBorderWidth: 8,
          pointHoverBorderColor: 'rgba(75, 192, 192, .45)',
          pointHoverBackgroundColor: 'rgb(75, 192, 192)',
          pointHoverRadius: 5,
        },
      ],
    };

    this.multiAxisOptions = {
      interaction: {
        intersect: false,
        mode: 'index',
      },
      responsive: false,
      scales: {
        x: {
          type: 'timeseries',
          time: {
            minUnit: 'day',
            displayFormats: {
              day: 'MMM d',
            },
            isoWeekday: true,
          },
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 14,
            minRotation: 14,
          },
        },

        y: {
          ticks: {
            precision: 0,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        zoom: {
          limits: {
            x: {
              min: Number(subDays(this.aggregatedData[0].x, 1)),
              max: Number(
                addDays(
                  this.aggregatedData[this.aggregatedData.length - 1].x,
                  1
                )
              ),
            },
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x',
          },
          pan: {
            enabled: true,
            mode: 'x',
            onPanStart: (ctx: any) => {
              ctx.chart.canvas.style.cursor = 'grabbing';
              const tooltipEl = ctx.chart.canvas.parentNode.querySelector(
                '.custom-chart-tooltip'
              );
              if (!tooltipEl) {
                return;
              }

              const labelEl = ctx.chart.canvas.parentNode.querySelector(
                '.custom-label-annotation'
              );
              if (!labelEl) {
                return;
              }

              tooltipEl.style.display = 'none';
              labelEl.style.display = 'none';
              return true;
            },
            onPanComplete: (ctx: any) => {
              ctx.chart.canvas.style.cursor = 'default';
              const tooltipEl = ctx.chart.canvas.parentNode.querySelector(
                '.custom-chart-tooltip'
              );

              if (!tooltipEl) {
                return;
              }

              const labelEl = ctx.chart.canvas.parentNode.querySelector(
                '.custom-label-annotation'
              );
              if (!labelEl) {
                return;
              }

              tooltipEl.style.display = 'block';
              labelEl.style.display = 'block';
            },
          },
        },
        dragData: {
          round: 0,
          onDragStart: (e: MouseEvent, datasetIndex: number) => {
            this.multiAxisData.datasets[0].label = 'Adjusted';
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

        annotation: {
          clip: false,
          annotations: {
            box1: {
              type: 'box',
              xMax: today,
              backgroundColor: 'rgba(241, 240, 239, .45)',
              drawTime: 'beforeDatasetsDraw',
              borderColor: 'white',
            },
          },
        },
        corsair: {
          horizontal: false,
          vertical: true,
          color: '#575654',
          dash: [4, 2],
          width: 3,
        },
      },
      onClick: (evt: any, el: any, chart: any) => {
        if (!chart.data.datasets[el[0].datasetIndex].custom.canAdjust) {
          return;
        }

        const index = el[0].index;
        const value =
          chart.data.datasets[el[0].datasetIndex].data[el[0].index].y;

        const tooltipEl = chart.canvas.parentNode.querySelector(
          '.custom-chart-tooltip'
        );

        if (!tooltipEl) {
          return;
        }

        tooltipEl.style.display = 'none';

        const dialogRef = this.dialog.open(DialogComponent, {
          width: '250px',
          backdropClass: 'custom-backdrop',
          position: {
            top: evt.native.clientY - 20 + 'px',
            left: evt.native.clientX + 20 + 'px',
          },
          data: {
            label: 'Demands (Deliveries)',
            value: Number(value),
            id: index,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          tooltipEl.style.display = 'block';
          chart.data.datasets[el[0].datasetIndex].data[el[0].index].y =
            result?.value || value;
          chart.update();
        });
      },
    };
  }

  onNewHubSelected() {
    this.aggregatedData = this.dataService.getDataForChart(this.hub);
    this.createNewGraph();
  }

  createOriginalData() {
    if (this.multiAxisData.datasets.length > 1) {
      return;
    }

    this.multiAxisData.datasets[0].label = 'Adjusted';
    this.multiAxisData.datasets.push({
      animation: false,
      label: 'Original',
      data: this.aggregatedData.map((agg: { y: number }) => ({
        ...agg,
        y: agg.y,
      })),
      custom: {
        tooltipLabel: 'Total Deliveries',
        canAdjust: false,
      },
      fill: false,
      tension: 0,
      borderWidth: 1,
      pointHitRadius: 25, // for improved touch support
      borderDash: [10, 10],
      dragData: false,
      borderColor: '#3964D7',
      pointBackgroundColor: '#3964D7',
      pointBorderColor: '#3964D7',
    });

    this.chart.refresh();
  }
}
