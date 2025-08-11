import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  className?: string;
}

export function LineChart({ data, width = 300, height = 200, className }: LineChartProps) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * (width - 40) + 20;
    const y = height - 40 - ((item.value - minValue) / range) * (height - 80);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />
        
        {/* Line */}
        <polyline
          fill="none"
          stroke="#006B76"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * (width - 40) + 20;
          const y = height - 40 - ((item.value - minValue) / range) * (height - 80);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#006B76"
              stroke="white"
              strokeWidth="2"
              className="hover:r-6 transition-all cursor-pointer"
            />
          );
        })}
        
        {/* Labels */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * (width - 40) + 20;
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

interface BarChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  className?: string;
}

export function BarChart({ data, width = 300, height = 200, className }: BarChartProps) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (width - 40) / data.length - 10;

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 60);
          const x = 20 + index * ((width - 40) / data.length);
          const y = height - 40 - barHeight;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || '#006B76'}
                rx="4"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {item.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs fill-gray-800 font-medium"
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface PieChartProps {
  data: ChartData[];
  size?: number;
  className?: string;
}

export function PieChart({ data, size = 200, className }: PieChartProps) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  const radius = size / 2 - 20;
  const center = size / 2;

  const colors = ['#006B76', '#00A8CC', '#00E5FF', '#4FC3F7', '#81D4FA'];

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size}>
        {data.map((item, index) => {
          const percentage = item.value / total;
          const startAngle = cumulativePercentage * 2 * Math.PI - Math.PI / 2;
          const endAngle = (cumulativePercentage + percentage) * 2 * Math.PI - Math.PI / 2;
          
          const x1 = center + radius * Math.cos(startAngle);
          const y1 = center + radius * Math.sin(startAngle);
          const x2 = center + radius * Math.cos(endAngle);
          const y2 = center + radius * Math.sin(endAngle);
          
          const largeArcFlag = percentage > 0.5 ? 1 : 0;
          
          const pathData = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          cumulativePercentage += percentage;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color || colors[index % colors.length]}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute top-0 right-0 bg-white p-2 rounded shadow-lg">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: item.color || colors[index % colors.length] }}
            />
            <span>{item.label}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}