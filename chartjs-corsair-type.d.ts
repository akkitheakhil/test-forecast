import { Chart } from 'chart.js';

declare type _Options<Data> = {
  horizontal: boolean;
  vertical: boolean;
  color: string;
  dash: any[];
  width: number;
};

export declare type Options<Data, Booleanish = true> = Booleanish extends true
  ? false | _Options<Data>
  : _Options<Data>;
declare module 'chart.js' {
  interface ChartDatasetProperties<TType extends ChartType, TData> {
    corsair?: Options<TData>;
  }
  interface PluginOptionsByType<TType extends ChartType> {
    corsair?: Options<any>;
  }
}
export declare type ScaleLimits = {
  min?: number | Date;
  max?: number | Date;
};

declare const CorsairPlugin: {
  id: string;
  afterInit: (chartInstance: Chart) => void;
  beforeEvent: (chart: Chart) => boolean;
};

export default CorsairPlugin;
