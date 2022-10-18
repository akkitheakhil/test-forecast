import { Plugin } from 'chart.js';

export const CorsairPlugin: Plugin = {
  id: 'corsair',

  afterInit: (chart: any) => {
    chart.corsair = {
      x: 0,
      y: 0,
    };
  },
  afterEvent: (
    chart: { corsair?: any; draw?: any; chartArea?: any },
    evt: { event: { x: any; y: any } }
  ) => {
    const {
      chartArea: { top, bottom, left, right },
    } = chart;
    const { x, y } = evt.event;
    if (x < left || x > right || y < top || y > bottom) {
      chart.corsair = {
        x,
        y,
        draw: false,
      };
      chart.draw();
      return;
    }

    chart.corsair = {
      x,
      y,
      draw: true,
    };

    chart.draw();
  },
  beforeDatasetsDraw: (
    chart: any,
    _: any,
    opts: {
      width: number;
      dash: any;
      color: string;
      vertical: any;
      horizontal: any;
    }
  ) => {
    const {
      ctx,
      chartArea: { top, bottom, left, right },
      tooltip,
      scales,
    } = chart;
    const { x, y, draw } = chart.corsair;

    const annotationEl = getOrCreateAnnotationLabel(chart);

    if (!draw) {
      annotationEl.remove();
      return;
    }

    if (!chart?.tooltip?._active?.length) {
      return;
    }

    const activePoint = chart.tooltip._active[0].element;

    ctx.save();
    ctx.beginPath();
    if (opts.vertical) {
      ctx.moveTo(activePoint.x, bottom);
      ctx.lineTo(activePoint.x, top);
    }
    if (opts.horizontal) {
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
    }

    while (annotationEl.firstChild) {
      annotationEl.firstChild.remove();
    }
    annotationEl.style.top = top + 'px';
    annotationEl.style.left = activePoint.x + 'px';

    const labelText = new Date(
      activePoint.$context.parsed.x
    ).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    });
    const label = document.createTextNode(labelText);
    annotationEl.appendChild(label);
    ctx.lineWidth = opts.width || 0;
    ctx.setLineDash(opts.dash || []);
    ctx.strokeStyle = opts.color || 'black';

    ctx.stroke();
    ctx.restore();
  },
  afterDatasetsDraw: (chart: any) => {
    const today = new Date().toISOString().split('T')[0];
    const dateToMatch = new Date(today).setHours(0);
    const xPos = chart
      .getDatasetMeta(0)
      .data.find((data: any) => data.$context.parsed.x === dateToMatch)?.x;

    const todayLabel = getOrCreateAnnotationLabel(chart, 'today-label');

    while (todayLabel.firstChild) {
      todayLabel.firstChild.remove();
    }
    todayLabel.style.top = '-35px';
    todayLabel.style.left = xPos + 'px';
    const label = document.createTextNode('Today');
    todayLabel.appendChild(label);
  },
};

const getOrCreateAnnotationLabel = (
  chart: {
    canvas: {
      parentNode: {
        querySelector: (arg0: string) => any;
        appendChild: (arg0: any) => void;
      };
    };
  },
  className: string = 'custom-label-annotation'
) => {
  let annotationEl = chart.canvas.parentNode.querySelector(`.${className}`);

  if (!annotationEl) {
    annotationEl = document.createElement('div');
    annotationEl.classList.add(`${className}`);
    chart.canvas.parentNode.appendChild(annotationEl);
  }

  return annotationEl;
};
