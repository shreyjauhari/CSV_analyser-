import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { ChartGenerator } from './components/ChartGenerator';
import { ChartControls } from './components/ChartControls';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { AboutUs } from './components/AboutUs';
import { TrackProgress } from './components/TrackProgress';
import { Upload } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [csvData, setCsvData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [selectedChart, setSelectedChart] = useState('bar');
  const [chartConfig, setChartConfig] = useState({
    xAxis: '',
    yAxis: '',
    title: 'CSV Data Analysis',
    color: '#3B82F6'
  });

  const handleDataUpload = useCallback((data, parsedHeaders) => {
    setCsvData(data);
    setHeaders(parsedHeaders);
    
    // Auto-configure chart with first two columns
    if (parsedHeaders.length >= 2) {
      setChartConfig(prev => ({
        ...prev,
        xAxis: parsedHeaders[0],
        yAxis: parsedHeaders[1]
      }));
    }
  }, []);

  const handleChartConfigChange = useCallback((config) => {
    setChartConfig(prev => ({ ...prev, ...config }));
  }, []);

  const resetData = useCallback(() => {
    setCsvData(null);
    setHeaders([]);
    setSelectedChart('bar');
    setChartConfig({
      xAxis: '',
      yAxis: '',
      title: 'CSV Data Analysis',
      color: '#3B82F6'
    });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      // case 'dashboard':
      //   return <Dashboard />;
      
      
      
      case 'upload':
        return (
          <div className="max-w-7xl mx-auto">
            {!csvData ? (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Upload Your CSV Data
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Upload your CSV data in CSV format and instantly generate insightful charts and analytics. 
                    Perfect for tracking skills, experience, and career progression.
                  </p>
                </div>
                
                <FileUpload onDataUpload={handleDataUpload} />
                
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 font-bold text-xl">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CSV Data</h3>
                    {/* <p className="text-gray-600">Upload your CSV information in CSV format</p> */}
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-purple-600 font-bold text-xl">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyze Data</h3>
                    {/* <p className="text-gray-600">Generate charts and visualizations automatically</p> */}
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 font-bold text-xl">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                    {/* <p className="text-gray-600">Monitor your career development over time</p> */}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">CSV Data Analysis</h1>
                  <button
                    onClick={resetData}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Upload New File
                  </button>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  {/* Chart Controls */}
                  <div className="xl:col-span-1">
                    <ChartControls
                      headers={headers}
                      selectedChart={selectedChart}
                      onChartChange={setSelectedChart}
                      chartConfig={chartConfig}
                      onConfigChange={handleChartConfigChange}
                    />
                  </div>
                  
                  {/* Chart Display */}
                  <div className="xl:col-span-3">
                    <ChartGenerator
                      data={csvData}
                      headers={headers}
                      chartType={selectedChart}
                      config={chartConfig}
                    />
                  </div>
                </div>
                
                {/* Data Preview */}
                <div className="mt-8">
                  <DataPreview data={csvData} headers={headers} />
                </div>
              </div>
            )}
          </div>
        );
      
      case 'progress':
        return <TrackProgress cvData={csvData} />;
      case 'about':
        return <AboutUs />;
      default:
        return <upload/>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}

export default App;