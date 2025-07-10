 

import React from 'react';
import { BarChart3, LineChart, PieChart, AreaChart, Settings, Palette } from 'lucide-react';
 
const chartTypes = [
  { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
  { id: 'line', name: 'Line Chart', icon: LineChart },
  { id: 'area', name: 'Area Chart', icon: AreaChart },
  { id: 'pie', name: 'Pie Chart', icon: PieChart }
];

// Axis configuration per chart type
const chartAxisConfig = {
  bar: { type: 'xy' },
  line: { type: 'xy' },
  area: { type: 'xy' },
  pie: { type: 'label-value' }
};

// Predefined color options
const colorOptions = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
  '#EF4444', '#06B6D4', '#84CC16', '#F97316'
];

// ChartControls component
export const ChartControls = ({
  headers,
  selectedChart,
  onChartChange,
  chartConfig,
  onConfigChange
}) => {
  const handleConfigChange = (key, value) => {
    onConfigChange({ [key]: value });
  };

  const axisType = chartAxisConfig[selectedChart]?.type || 'xy';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Chart Settings</h3>
      </div>

      {/* Chart Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Chart Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {chartTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => onChartChange(type.id)}
                className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                  selectedChart === type.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <div className="text-sm font-medium">{type.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Axis Configuration */}
      {axisType === 'xy' && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              X-Axis Column
            </label>
            <select
              value={chartConfig.xAxis}
              onChange={(e) => handleConfigChange('xAxis', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select column...</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Y-Axis Column
            </label>
            <select
              value={chartConfig.yAxis}
              onChange={(e) => handleConfigChange('yAxis', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select column...</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {axisType === 'label-value' && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label Column
            </label>
            <select
              value={chartConfig.labelColumn}
              onChange={(e) => handleConfigChange('labelColumn', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select column...</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value Column
            </label>
            <select
              value={chartConfig.valueColumn}
              onChange={(e) => handleConfigChange('valueColumn', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select column...</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Chart Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chart Title
        </label>
        <input
          type="text"
          value={chartConfig.title}
          onChange={(e) => handleConfigChange('title', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter chart title"
        />
      </div>

      {/* Color Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Color Theme</span>
          </div>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => handleConfigChange('color', color)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                chartConfig.color === color
                  ? 'border-gray-800 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            alert('Export functionality would be implemented here');
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          Export Chart
        </button>
      </div>
    </div>
  );
};

