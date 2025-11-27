/**
 * Componente de gráfico de línea usando Recharts
 */
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const LineChartComponent = ({
  data = [],
  xKey = 'date',
  yKey = 'count',
  lineColor = '#2563eb',
  title = '',
  height = 300,
}) => {
  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xKey}
            stroke="#6b7280"
            style={{ fontSize: '0.75rem' }}
          />
          <YAxis stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '0.875rem' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={lineColor}
            strokeWidth={2}
            dot={{ fill: lineColor, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
