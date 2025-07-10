//@ts-ignore
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { ChartGenerator } from './components/ChartGenerator';
import { ChartControls } from './components/ChartControls';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AboutUs } from './components/AboutUs';
import { TrackProgress } from './components/TrackProgress';
import { SavedFiles } from './components/SavedFiles';
import { SaveDialog } from './components/SaveDialog';
import { dbOperations } from './utils/database';
import { Save } from 'lucide-react';
import { Patient } from './components/Patient'; // Import the new Patient component

function App() {
  const [activeTab, setActiveTab] = useState('upload'); // Default to 'upload'
  const [csvData, setCsvData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [selectedChart, setSelectedChart] = useState('bar');
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentFileId, setCurrentFileId] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    xAxis: '',
    yAxis: '',
    title: 'CSV Data Analysis',
    color: '#3B82F6'
  });

  const [trackProgressData, setTrackProgressData] = useState([]);
  // State: To hold the currently selected patient for Patient.jsx
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);

  const handleDataUpload = useCallback((data, parsedHeaders, fileName = '') => {
    setCsvData(data);
    setHeaders(parsedHeaders);
    setCurrentFileName(fileName);
    setCurrentFileId(null);
    setTrackProgressData([]);
    setSelectedPatientForDetails(null); // Clear selected patient on new upload
    setActiveTab('upload');
    
    if (parsedHeaders.length >= 2) {
      setChartConfig(prev => ({
        ...prev,
        xAxis: parsedHeaders[0],
        yAxis: parsedHeaders[1]
      }));
    }
  }, []);

  const handleLoadSavedFile = useCallback((data, headers, fileName, fileId) => {
    setCsvData(data);
    setHeaders(headers);
    setCurrentFileName(fileName);
    setCurrentFileId(fileId);
    setActiveTab('upload');
    setTrackProgressData([]);
    setSelectedPatientForDetails(null); // Clear selected patient on load
    
    if (headers.length >= 2) {
      setChartConfig(prev => ({
        ...prev,
        xAxis: headers[0],
        yAxis: headers[1]
      }));
    }
  }, []);

  const handleSaveFile = useCallback(async (name, description) => {
    if (!csvData || !headers.length) return;

    const result = await dbOperations.saveCsvFile(name, headers, csvData, description);
    if (result.success) {
      setCurrentFileName(name);
      setCurrentFileId(result.id);
      alert('File saved successfully!');
    } else {
      alert('Failed to save file');
    }
  }, [csvData, headers]);

  const handleChartConfigChange = useCallback((config) => {
    setChartConfig(prev => ({ ...prev, ...config }));
  }, []);

  const resetData = useCallback(() => {
    setCsvData(null);
    setHeaders([]);
    setSelectedChart('bar');
    setCurrentFileName('');
    setCurrentFileId(null);
    setChartConfig({
      xAxis: '',
      yAxis: '',
      title: 'CSV Data Analysis',
      color: '#3B82F6'
    });
    setTrackProgressData([]);
    setSelectedPatientForDetails(null); // Reset selected patient
    setActiveTab('upload');
  }, []);

  const handleSaveDetailsForTracking = useCallback((data) => {
    console.log("Data saved for tracking:", data);
    setTrackProgressData(data);
    setActiveTab('progress');
  }, []);

  // Handler: Handles viewing a specific patient's details
  const handleViewPatientDetails = useCallback((patient) => {
    setSelectedPatientForDetails(patient); // Set the selected patient
    setActiveTab('patientDetails'); // Switch to the new patient details tab
  }, []);

  // Handler: Handles going back from Patient.jsx
  const handleBackToTrackProgress = useCallback(() => {
    setSelectedPatientForDetails(null); // Clear selected patient
    setActiveTab('progress'); // Go back to Track Progress list
  }, []);


  const renderContent = () => {
    switch (activeTab) {
      case 'saved':
        return (
          <SavedFiles
            onLoadFile={handleLoadSavedFile}
            onCreateNew={() => setActiveTab('upload')}
          />
        );

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
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">CSV Data Analysis</h1>
                    {currentFileName && (
                      <p className="text-gray-600 mt-1">
                        File: {currentFileName}
                        {currentFileId ? ' (Saved)' : ' (Unsaved)'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {!currentFileId && csvData && (
                      <button
                        onClick={() => setShowSaveDialog(true)}
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save File</span>
                      </button>
                    )}
                    <button
                      onClick={resetData}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Upload New File
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  <div className="xl:col-span-1">
                    <ChartControls
                      headers={headers}
                      selectedChart={selectedChart}
                      onChartChange={setSelectedChart}
                      chartConfig={chartConfig}
                      onConfigChange={handleChartConfigChange}
                    />
                  </div>

                  <div className="xl:col-span-3">
                    <ChartGenerator
                      data={csvData}
                      headers={headers}
                      chartType={selectedChart}
                      config={chartConfig}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <DataPreview
                    data={csvData}
                    headers={headers}
                    onSaveDetails={handleSaveDetailsForTracking}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'progress':
        return (
          <TrackProgress
            savedDetails={trackProgressData}
            onViewPatientDetails={handleViewPatientDetails} // Pass the handler
          />
        );

      case 'patientDetails': // New case for the Patient page
        return (
          <Patient
            patient={selectedPatientForDetails}
            onBack={handleBackToTrackProgress}
          />
        );

      case 'about':
        return <AboutUs />;

      default:
        return (
          <div className="text-center text-gray-600">
            Unknown tab. Please use the menu to navigate.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveFile}
        fileName={currentFileName}
        data={csvData}
        headers={headers}
      />
    </div>
  );
}

export default App;

