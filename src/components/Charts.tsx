/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

// --- STATS METRIC CARD ---
interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  subtext: string;
  trend?: {
    type: 'up' | 'down' | 'neutral';
    value: string;
  };
  icon: React.ReactNode;
  colorClass?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtext,
  trend,
  icon,
  colorClass = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
}) => {
  return (
    <div
      id={id}
      className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start justify-between"
    >
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
          {title}
        </span>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
            {value}
          </span>
          {trend && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                trend.type === 'up'
                  ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
                  : trend.type === 'down'
                  ? 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40'
                  : 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800/40'
              }`}
            >
              {trend.type === 'up' ? '↑' : trend.type === 'down' ? '↓' : '•'} {trend.value}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtext}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};


// --- CUSTOM NATIVE SVG BAR CHART ---
interface BarChartProps {
  id: string;
  data: { label: string; value: number; secondaryValue?: number }[];
  title: string;
  yLabel?: string;
  height?: number;
}

export const CustomBarChart: React.FC<BarChartProps> = ({
  id,
  data,
  title,
  yLabel,
  height = 200
}) => {
  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0))) || 1;
  const chartHeight = height - 40;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div id={id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          {title}
        </h4>
        {yLabel && <span className="text-2xs text-slate-400 dark:text-slate-500">{yLabel}</span>}
      </div>

      <div className="relative flex items-end justify-between space-x-2 pt-4" style={{ height: `${chartHeight}px` }}>
        {/* Y Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-slate-100 dark:border-slate-800/80">
          <div className="w-full border-t border-slate-50 dark:border-slate-800/40 h-0"></div>
          <div className="w-full border-t border-slate-50 dark:border-slate-800/40 h-0"></div>
          <div className="w-full border-t border-slate-50 dark:border-slate-800/40 h-0"></div>
        </div>

        {data.map((item, idx) => {
          const mainPct = (item.value / maxValue) * 100;
          const secPct = item.secondaryValue ? (item.secondaryValue / maxValue) * 100 : 0;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative z-10"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {hoveredIdx === idx && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-3xs font-mono py-1.5 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-30 transition-all duration-200">
                  <div className="font-semibold text-slate-300 mb-0.5">{item.label}</div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                    <span>Primary: {item.value}</span>
                  </div>
                  {item.secondaryValue !== undefined && (
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"></span>
                      <span>Secondary: {item.secondaryValue}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Bar Columns Container */}
              <div className="w-full flex items-end justify-center space-x-1 h-36">
                <div
                  style={{ height: `${mainPct}%` }}
                  className="w-4 bg-gradient-to-t from-[#002147] to-blue-600 dark:from-blue-700 dark:to-blue-500 rounded-t-xs group-hover:brightness-110 transition-all duration-500 ease-out"
                ></div>
                {item.secondaryValue !== undefined && (
                  <div
                    style={{ height: `${secPct}%` }}
                    className="w-4 bg-gradient-to-t from-[#00A651] to-emerald-400 dark:from-emerald-600 dark:to-emerald-400 rounded-t-xs group-hover:brightness-110 transition-all duration-500 ease-out"
                  ></div>
                )}
              </div>

              {/* Label */}
              <span className="text-3xs text-slate-400 dark:text-slate-500 font-medium tracking-tight mt-2 rotate-12 origin-top whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- CUSTOM NATIVE SVG LINE CHART ---
interface LineChartProps {
  id: string;
  data: { label: string; value: number }[];
  title: string;
  height?: number;
  strokeColor?: string;
}

export const CustomLineChart: React.FC<LineChartProps> = ({
  id,
  data,
  title,
  height = 200,
  strokeColor = '#10b981' // Medical Green
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values) || 1;
  const minVal = Math.min(...values) || 0;
  const range = maxVal - minVal || 1;

  // Generate SVG coordinates
  const svgWidth = 500;
  const svgHeight = height - 60;
  const padding = 20;

  const points = data.map((item, idx) => {
    const x = padding + (idx / (data.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((item.value - minVal) / range) * (svgHeight - padding * 2);
    return { x, y, item, idx };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Area path (closing the loop back to baseline)
  const areaD = data.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`
    : '';

  return (
    <div id={id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          {title}
        </h4>
        <span className="text-2xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-mono">
          Live Tracking
        </span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#f1f5f9" className="dark:stroke-slate-800/40" strokeDasharray="3,3" />
          <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#f1f5f9" className="dark:stroke-slate-800/40" strokeDasharray="3,3" />
          <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#e2e8f0" className="dark:stroke-slate-800/80" />

          {/* Area fill */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#lineGradient)"
              opacity="0.15"
              className="transition-all duration-500 ease-in-out"
            />
          )}

          {/* Sparkline path */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Interactive points */}
          {points.map((p) => (
            <g key={p.idx} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === p.idx ? '6' : '3.5'}
                fill={strokeColor}
                stroke="#fff"
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredIdx(p.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="transition-all duration-150"
              />
              {/* Tooltip on SVG overlay */}
              {hoveredIdx === p.idx && (
                <foreignObject
                  x={p.x - 55}
                  y={p.y - 45}
                  width="110"
                  height="40"
                  className="overflow-visible pointer-events-none z-30"
                >
                  <div className="bg-slate-900 dark:bg-slate-800 text-white text-3xs font-mono p-1 rounded shadow-md border border-slate-800 text-center">
                    <span className="font-semibold block text-slate-300">{p.item.label}</span>
                    <span className="text-emerald-400 font-bold">{p.item.value}</span>
                  </div>
                </foreignObject>
              )}
            </g>
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* X labels */}
        <div className="flex justify-between px-4 mt-2">
          {data.map((item, idx) => (
            <span key={idx} className="text-3xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tight">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- CUSTOM PIE/DONUT CHART ---
interface PieChartProps {
  id: string;
  data: { category: string; value: number; color: string }[];
  title: string;
}

export const CustomPieChart: React.FC<PieChartProps> = ({ id, data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  let accumulatedAngle = 0;

  return (
    <div id={id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">
        {title}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Ring Chart Graphic */}
        <div className="relative flex justify-center items-center h-40">
          <svg viewBox="0 0 100 100" className="w-36 h-36 transform -rotate-90 overflow-visible">
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;

              // SVG Circle Dash Array calculation for standard 15.915 radius
              // Circumference = 2 * PI * r = 100
              const radius = 15.915;
              const circumference = 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = 100 - accumulatedAngle;

              accumulatedAngle += percentage;

              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? '9' : '7'}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Absolute Center Counter */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
            <span className="text-2xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              {hoveredIdx !== null ? data[hoveredIdx].category : 'Total Fund'}
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
              {hoveredIdx !== null
                ? `$${(data[hoveredIdx].value / 1000).toFixed(0)}k`
                : `$${(total / 1000).toFixed(0)}k`}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                hoveredIdx === idx ? 'bg-slate-50 dark:bg-slate-800/60' : ''
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-md block shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                  {item.category}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
