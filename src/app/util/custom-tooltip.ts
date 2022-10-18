const getOrCreateTooltip = (chart: {
  canvas: {
    parentNode: {
      querySelector: (arg0: string) => any;
      appendChild: (arg0: any) => void;
    };
  };
}) => {
  let tooltipEl = chart.canvas.parentNode.querySelector(
    '.custom-chart-tooltip'
  );

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.classList.add('custom-chart-tooltip');

    const tooltipContainer = document.createElement('div');
    tooltipContainer.classList.add('custom-chart-tooltip-container');

    tooltipEl.appendChild(tooltipContainer);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltipHandler = (context: {
  chart: any;
  tooltip: any;
}) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const bodyLines = tooltip.body.map((b: { lines: any }) => b.lines);

    const tooltipBody = document.createElement('div');
    tooltipBody.classList.add('tooltip-body');

    bodyLines.forEach((body: string, i: string | number) => {
      const colors = tooltip.labelColors[i];
      const tooltipRow = document.createElement('div');
      tooltipRow.classList.add('tooltip-row');

      const span = document.createElement('span');
      span.classList.add('icon');
      span.style.background = colors.borderColor;
      span.style.borderColor = colors.borderColor;

      const dataset = tooltip.dataPoints[i];
      const valueText = dataset.formattedValue;
      const labelText = `${dataset.dataset.custom.tooltipLabel} (${dataset.dataset.label})`;

      const label = document.createTextNode(labelText);
      const valueSpan = document.createElement('span');
      valueSpan.textContent = valueText;
      valueSpan.style.marginLeft = 'auto';

      tooltipRow.appendChild(span);
      tooltipRow.appendChild(label);
      tooltipRow.appendChild(valueSpan);

      tooltipBody.appendChild(tooltipRow);
    });

    const tableRoot = tooltipEl.querySelector(
      '.custom-chart-tooltip-container'
    );

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    const oldFooter = tooltipEl.querySelector('.tooltip-footer');

    if (oldFooter) {
      oldFooter.remove();
    }

    const customFooter = document.createElement('div');
    customFooter.classList.add('tooltip-footer');
    const footerText = document.createTextNode(
      'Click on a data point to copy a value. '
    );

    // Add new children
    customFooter.appendChild(footerText);
    tooltipBody.appendChild(customFooter);
    tableRoot.appendChild(tooltipBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding =
    tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};
