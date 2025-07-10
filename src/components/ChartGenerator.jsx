import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

export const ChartGenerator = ({ data, headers, chartType, config }) => {
  const chartData = useMemo(() => {
    if (!data || !config.xAxis || !config.yAxis) return [];
    
    return data.map(row => ({
      [config.xAxis]: row[config.xAxis],
      [config.yAxis]: isNaN(parseFloat(row[config.yAxis])) ? 0 : parseFloat(row[config.yAxis])
    })).filter(row => row[config.xAxis] && row[config.yAxis] !== undefined);
  }, [data, config.xAxis, config.yAxis]);

  const pieData = useMemo(() => {
    if (!chartData.length) return [];
    
    const aggregated = chartData.reduce((acc, item) => {
      const key = item[config.xAxis];
      acc[key] = (acc[key] || 0) + item[config.yAxis];
      return acc;
    }, {});

    return Object.entries(aggregated).map(([name, value]) => ({
      name,
      value
    }));
  }, [chartData, config.xAxis, config.yAxis]);

  const renderChart = () => {
    if (!config.xAxis || !config.yAxis) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configure Your Chart</h3>
            <p className="text-gray-600">Please select X and Y axis columns to generate your chart.</p>
          </div>
        </div>
      );
    }

    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">No valid data found for the selected columns.</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={config.xAxis} 
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey={config.yAxis} 
                fill={config.color}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={config.xAxis} 
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={config.yAxis} 
                stroke={config.color}
                strokeWidth={3}
                dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={config.xAxis} 
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey={config.yAxis} 
                stroke={config.color}
                strokeWidth={2}
                fill={config.color}
                fillOpacity={0.3}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {config.title}
          </h3>
        </div>
        
        {chartData.length > 0 && (
          <div className="text-sm text-gray-500">
            {chartData.length} data points
          </div>
        )}
      </div>
      
      <div className="chart-container">
        {renderChart()}
      </div>
      
      {chartData.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              X-Axis: <span className="font-medium text-gray-900">{config.xAxis}</span>
            </span>
            <span className="text-gray-600">
              Y-Axis: <span className="font-medium text-gray-900">{config.yAxis}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};