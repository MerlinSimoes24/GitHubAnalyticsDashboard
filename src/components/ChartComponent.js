import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment'; // Import moment library for date formatting

const ChartComponent = ({ data, title, chartId }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      const dates = data.map(item => moment.unix(item.week).toDate());
      const counts = data.map(item => item.total);
console.log(dates)
console.log(counts)  
      const ctx = chartRef.current.getContext('2d');
      // new Chart(ctx, {
      //   type: 'line', // Change chart type here
      //   data: {
      //     labels: dates,
      //     datasets: [{
      //       label: title,
      //       data: counts,
      //       borderColor: 'rgba(75, 192, 192, 1)',
      //       borderWidth: 1,
      //       fill: false
      //     }]
      //   },
      //   options: { // Customize chart options here
      //     scales: {
      //       x: {
      //         type: 'time',
      //         time: {
      //           unit: 'day',
      //           displayFormats: {
      //             day: 'MM/DD/YYYY'
      //           }
      //         }
      //       },
      //       y: {
      //         beginAtZero: true
      //       }
      //     },
      //     plugins: {
      //       title: {
      //         display: true,
      //         text: title
      //       }
      //     }
      //   }
      // });
    }
  }, [data, title]);
  return (
    <div>
      <h2>{title}</h2>
      <canvas ref={chartRef} id={chartId} width="400" height="200"></canvas>
    </div>
  );
};

export default ChartComponent;