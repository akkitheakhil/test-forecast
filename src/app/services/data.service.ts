import { Injectable } from '@angular/core';
import mockData from '../json/mock-data.json';

interface PlottableData {
  x: string;
  y: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  getDataForChart(hubName: String) {
    const filterByHub = mockData.predictions?.filter(
      (predict: any) => predict?.scope?.site_id === hubName
    );

    let mappedData: PlottableData[] = filterByHub?.map(
      (prediction: {
        window_start_time: string | number | Date;
        amount: number;
      }) => {
        const dataTime = new Date(prediction?.window_start_time);
        const date =
          dataTime.getFullYear() +
          '-' +
          ('0' + (dataTime.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + dataTime.getDate()).slice(-2);
        return { x: new Date(date).toDateString(), y: prediction.amount };
      }
    );

    const aggregatedData = mappedData.reduce(
      (acc: Record<string, number>, cur: PlottableData) => {
        if (acc[cur.x]) {
          acc[cur.x] += cur.y;
        } else {
          acc[cur.x] = cur.y;
        }
        return acc;
      },
      {}
    );

    return Object.entries(aggregatedData).map(([key, value]) => {
      return { x: new Date(key), y: value };
    });
  }

  getAllHubs(): string[] {
    const sitesArray = mockData.predictions?.map(
      (predict: any) => predict?.scope?.site_id
    );
    return [...new Set(sitesArray)] as string[];
  }
}
