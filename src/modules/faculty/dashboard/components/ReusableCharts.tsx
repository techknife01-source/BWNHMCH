import React, { memo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  AttendanceTrendItem,
  TeachingHoursItem,
  AssignmentCompletionItem,
  StudentPerformanceDistribution,
} from '../types/dashboard.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AttendanceTrendChartProps {
  data: AttendanceTrendItem[];
}

export const AttendanceTrendChart = memo<AttendanceTrendChartProps>(({ data }) => {
  const chartData = {
    labels: data.map((d) => d.period),
    datasets: [
      {
        label: '1st BHMS Batch',
        data: data.map((d) => d.batch1stYear),
        borderColor: '#00A651',
        backgroundColor: 'rgba(0, 166, 81, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00A651',
      },
      {
        label: '2nd BHMS Batch',
        data: data.map((d) => d.batch2ndYear),
        borderColor: '#002147',
        backgroundColor: 'rgba(0, 33, 71, 0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#002147',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 11, weight: 'bold' }, usePointStyle: true, boxWidth: 8 },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        min: 50,
        max: 100,
        ticks: { callback: (v) => `${v}%`, font: { size: 10 } },
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
      },
      x: { ticks: { font: { size: 10 } }, grid: { display: false } },
    },
  };

  return <Line data={chartData} options={options} />;
});

AttendanceTrendChart.displayName = 'AttendanceTrendChart';

interface TeachingHoursChartProps {
  data: TeachingHoursItem[];
}

export const TeachingHoursChart = memo<TeachingHoursChartProps>(({ data }) => {
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.hours),
        backgroundColor: data.map((d) => d.color || '#00A651'),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { font: { size: 11, weight: 'bold' }, usePointStyle: true, boxWidth: 10 },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
});

TeachingHoursChart.displayName = 'TeachingHoursChart';

interface AssignmentCompletionChartProps {
  data: AssignmentCompletionItem[];
}

export const AssignmentCompletionChart = memo<AssignmentCompletionChartProps>(({ data }) => {
  const chartData = {
    labels: data.map((d) => d.subject),
    datasets: [
      {
        label: 'Evaluated Logbooks',
        data: data.map((d) => d.evaluated),
        backgroundColor: '#00A651',
        borderRadius: 8,
      },
      {
        label: 'Pending Review',
        data: data.map((d) => d.pending),
        backgroundColor: '#F59E0B',
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 11, weight: 'bold' }, usePointStyle: true },
      },
    },
    scales: {
      y: { ticks: { font: { size: 10 } } },
      x: { ticks: { font: { size: 10 } }, grid: { display: false } },
    },
  };

  return <Bar data={chartData} options={options} />;
});

AssignmentCompletionChart.displayName = 'AssignmentCompletionChart';

interface StudentPerformanceChartProps {
  data: StudentPerformanceDistribution[];
}

export const StudentPerformanceChart = memo<StudentPerformanceChartProps>(({ data }) => {
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        label: 'Students Count',
        data: data.map((d) => d.count),
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 11, weight: 'bold' }, usePointStyle: true },
      },
    },
    scales: {
      y: { ticks: { font: { size: 10 } } },
      x: { ticks: { font: { size: 10 } }, grid: { display: false } },
    },
  };

  return <Bar data={chartData} options={options} />;
});

StudentPerformanceChart.displayName = 'StudentPerformanceChart';
