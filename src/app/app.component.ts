import { Component } from '@angular/core';
import 'chart.js';
import 'chartjs-plugin-dragdata';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public lineChartData: Array<any> | undefined;


  public lineChartOptions: any;

  public lineChartLabels: Array<any> = [100, 200, 300, 400];

  ngOnInit(): void {
    this.lineChartOptions = {
      animation: false,
      responsive: false,
      title: {
        display: true,
        fontSize: 30,
        text: ''
      },

      dragData: true,
      dragX: false,
      dragDataRound: 10,
      onDragStart: (event: any, element: any) => { console.log(` `); },
      onDrag: (event: any, datasetIndex: any, index: any, value: { y: any; }) => { console.log(`New y-value is ${value.y} `); },
      onDragEnd: (event: any, datasetIndex: any, index: any, value: { y: any; }) => {
        console.log(`New y-value is ${value.y} `);
      },
    };

    this.lineChartData = [
      {
        data: [],
        label: '',
        yAxisID: 'A',
        pointHitRadius: 30,
        fill: false,
      },
      {
        data: [],
        label: '',
        yAxisID: 'A',
        pointHitRadius: 30,
        fill: false,
      },
      {
        data: [],
        label: '',
        yAxisID: 'B',
        pointHitRadius: 30,
        fill: false,
      }
    ];


    for (let i = 0; i < 4; i++) {
      this.lineChartData[0].data.push({ x: (i + 1) * 100, y: Math.floor((Math.random() * 90) + 10) });
      this.lineChartData[1].data.push({ x: (i + 1) * 100, y: Math.floor((Math.random() * 80) + 0) });
      this.lineChartData[2].data.push({ x: (i + 1) * 100, y: Math.floor((Math.random() * 70) + 20) });
    }


  }
}
