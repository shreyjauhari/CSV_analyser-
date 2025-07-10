import React, { useState, useEffect } from 'react';
import { Database, FileText, Trash2, Download, Calendar, BarChart3, Eye, Plus } from 'lucide-react';
import { dbOperations } from '../utils/database';

export const SavedFiles = ({ onLoadFile, onCreateNew }) => {
  const [savedFiles, setSavedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalFiles: 0, totalCharts: 0, totalDataPoints: 0 });

  useEffect(() => {
    loadSavedFiles();
    loadStats();
  }, []);

  const loadSavedFiles = async () => {
    setLoading(true);
    const result = await dbOperations.getAllCsvFiles();
    if (result.success) {
      setSavedFiles(result.files);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const result = await dbOperations.getStats();
    if (result.success) {
      setStats(result.stats);
    }
  };

  const handleDeleteFile = async (id, fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      const result = await dbOperations.deleteCsvFile(id);
      if (result.success) {
        loadSavedFiles();
        loadStats();
      } else {
        alert('Failed to delete file');
      }
    }
  };

  const handleLoadFile = async (file) => {
    onLoadFile(file.data, file.headers, file.name, file.id);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportFile = (file) => {
    const csvContent = [
      file.headers.join(','),
      ...file.data.map(row => file.headers.map(header => row[header] || '').join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Saved CSV Files</h1>
          <p className="text-xl text-gray-600">
            Manage your uploaded CSV files and access your saved chart configurations.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Upload New File</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Charts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCharts}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Points</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDataPoints.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Files List */}
      {savedFiles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Files</h3>
          <p className="text-gray-600 mb-6">Upload your first CSV file to get started with data analysis.</p>
          <button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Upload Your First File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate max-w-[200px]" title={file.name}>
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-600">{file.size} rows</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => exportFile(file)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Export CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.id, file.name)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Columns:</p>
                <div className="flex flex-wrap gap-1">
                  {file.headers.slice(0, 3).map((header, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {header}
                    </span>
                  ))}
                  {file.headers.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{file.headers.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(file.uploadDate)}</span>
                </div>
              </div>

              {file.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{file.description}</p>
              )}

              <button
                onClick={() => handleLoadFile(file)}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Eye className="w-4 h-4" />
                <span>Load & Analyze</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};