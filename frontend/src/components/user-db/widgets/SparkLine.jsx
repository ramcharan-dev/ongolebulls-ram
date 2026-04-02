import React, { useMemo } from 'react';

export const SparkLine = ({ data = [], width = 80, height = 32, color = '#3B82F6', fillOpacity = 0.12 }) => {
  const id = useMemo(() => `spark-${Math.random().toString(36).slice(2, 9)}`, []);

  const points = useMemo(() => {
    if (!data.length) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1 || 1);
    const padding = 2;
    const h = height - padding * 2;

    return data.map((v, i) => {
      const x = i * stepX;
      const y = padding + h - ((v - min) / range) * h;
      return `${x},${y}`;
    }).join(' ');
  }, [data, width, height]);

  if (!data.length) return null;

  const lastY = points.split(' ').pop();

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#${id})`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot at end */}
      {lastY && (
        <circle
          cx={width}
          cy={parseFloat(lastY.split(',')[1])}
          r="2.5"
          fill={color}
        />
      )}
    </svg>
  );
};
