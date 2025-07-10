
import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Filter, X, Plus } from 'lucide-react';
import Papa from 'papaparse';

export const FileUpload = ({ onDataUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [initialRowsRaw, setInitialRowsRaw] = useState([]); // New state to store the first 3 raw lines

  const processFile = useCallback((file) => {
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Please upload a CSV file'
      });
      return;
    }

    setIsProcessing(true);
    setUploadStatus(null);
    // Clear previous states
    setRawData(null);
    setHeaders([]);
    setFilteredData(null);
    setFilters([]);
    setInitialRowsRaw([]); // Clear initial raw rows

    Papa.parse(file, {
      header: false, // Parse without automatic header detection to get all rows as arrays
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setUploadStatus({
            type: 'error',
            message: 'Error parsing CSV file: ' + results.errors[0].message
          });
          setIsProcessing(false);
          return;
        }

        // Check for sufficient rows (at least 3 initial rows + 1 header row + 1 data row)
        if (results.data.length < 5) { // Lines 0, 1, 2 (initial) + Line 3 (header) + Line 4 (first data)
          setUploadStatus({
            type: 'error',
            message: 'CSV file must contain at least 5 rows (2 metadata + 2 header lines + 1 data row).'
          });
          setIsProcessing(false);
          return;
        }

        // Store the first 3 raw rows as initial metadata (Lines 0, 1, 2 from the file)
        setInitialRowsRaw(results.data.slice(0, 3));

        // Construct the actual headers from Line 2 and Line 3 of the CSV
        const mainHeaderRow = results.data[2]; // e.g., ["S. NO.", "NAME", ..., "MEDICINES", ...]
        const subHeaderRow = results.data[3];  // e.g., ["", "", ..., "Amlodipne 5mg", ...]

        const actualHeaders = [];
        // Assuming first 10 columns are from mainHeaderRow (S. NO. to DIAGONSES)
        for (let i = 0; i < 10; i++) {
            if (mainHeaderRow[i] && mainHeaderRow[i].trim() !== '') {
                actualHeaders.push(mainHeaderRow[i].trim());
            }
        }
        // Remaining columns are medication names from subHeaderRow (starting from index 10)
        for (let i = 10; i < subHeaderRow.length; i++) {
            if (subHeaderRow[i] && subHeaderRow[i].trim() !== '') {
                actualHeaders.push(subHeaderRow[i].trim());
            }
        }
        
        if (actualHeaders.length < 2) {
          setUploadStatus({
            type: 'error',
            message: 'Could not determine suitable headers from the CSV file.'
          });
          setIsProcessing(false);
          return;
        }
        setHeaders(actualHeaders);

        // Parse the actual data rows (starting from Line 4, index 4) into objects
        const parsedData = results.data.slice(4).map(rowArray => {
          const rowObject = {};
          actualHeaders.forEach((header, index) => {
            rowObject[header] = rowArray[index] || ''; // Map values to headers, default to empty string if missing
          });
          return rowObject;
        });

        setRawData(parsedData);
        setFilteredData(parsedData); // Initially, filtered data is all raw data
        setShowFilters(true);
        
        setUploadStatus({
          type: 'success',
          message: `Successfully loaded ${parsedData.length} data rows. Initial 3 rows preserved. You can now apply filters.`
        });

        setIsProcessing(false);
      },
      error: (error) => {
        setUploadStatus({
          type: 'error',
          message: 'Error reading file: ' + error.message
        });
        setIsProcessing(false);
      }
    });
  }, []);

  const addFilter = () => {
    setFilters([...filters, {
      id: Date.now(),
      column: headers[0] || '',
      operator: 'equals',
      value: ''
    }]);
  };

  const removeFilter = (id) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const updateFilter = (id, field, value) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, [field]: value } : filter
    ));
  };

  const applyFilters = useCallback(() => {
    if (!rawData || filters.length === 0) {
      setFilteredData(rawData);
      return;
    }

    const filtered = rawData.filter(row => {
      return filters.every(filter => {
        if (!filter.column || !filter.value) return true;
        
        const cellValue = row[filter.column];
        const filterValue = filter.value.toLowerCase();
        
        // Handle different data types
        const numericCellValue = parseFloat(cellValue);
        const numericFilterValue = parseFloat(filter.value);
        
        switch (filter.operator) {
          case 'equals':
            return cellValue?.toString().toLowerCase() === filterValue;
          case 'contains':
            return cellValue?.toString().toLowerCase().includes(filterValue);
          case 'starts_with':
            return cellValue?.toString().toLowerCase().startsWith(filterValue);
          case 'ends_with':
            return cellValue?.toString().toLowerCase().endsWith(filterValue);
          case 'greater_than':
            return !isNaN(numericCellValue) && !isNaN(numericFilterValue) && numericCellValue > numericFilterValue;
          case 'less_than':
            return !isNaN(numericCellValue) && !isNaN(numericFilterValue) && numericCellValue < numericFilterValue;
          case 'greater_equal':
            return !isNaN(numericCellValue) && !isNaN(numericFilterValue) && numericCellValue >= numericFilterValue;
          case 'less_equal':
            return !isNaN(numericCellValue) && !isNaN(numericFilterValue) && numericCellValue <= numericFilterValue;
          case 'not_equals':
            return cellValue?.toString().toLowerCase() !== filterValue;
          default:
            return true;
        }
      });
    });

    setFilteredData(filtered);
  }, [rawData, filters]);

  const clearFilters = () => {
    setFilters([]);
    setFilteredData(rawData);
  };

  const proceedWithData = () => {
    const dataToUse = filteredData || rawData;

    if (!dataToUse || headers.length === 0) {
      console.warn("No data or headers to proceed with.");
      return;
    }

    // Construct the full data array for onDataUpload
    // This array will contain:
    // 1. The initial 3 raw rows (converted to objects matching the data headers)
    // 2. The derived header row itself (as an object)
    // 3. The filtered data rows (as objects)
    const combinedDataForUpload = [];

    // Add initial raw rows (Lines 0, 1, 2) converted to objects
    initialRowsRaw.forEach(rowArray => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = rowArray[index] || ''; // Map based on index, fill missing with empty string
      });
      combinedDataForUpload.push(obj);
    });

    // Add the header row itself as an object
    const headerRowObject = {};
    headers.forEach(header => { headerRowObject[header] = header; });
    combinedDataForUpload.push(headerRowObject);

    // Add the filtered data rows
    combinedDataForUpload.push(...dataToUse);

    const fileName = `filtered_data_${new Date().getTime()}`;
    onDataUpload(combinedDataForUpload, headers, fileName);
  };

  // Apply filters whenever filters change
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'greater_than', label: 'Greater than (>)' },
    { value: 'less_than', label: 'Less than (<)' },
    { value: 'greater_equal', label: 'Greater or equal (>=)' },
    { value: 'less_equal', label: 'Less or equal (<=)' },
    { value: 'not_equals', label: 'Not equals' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          ) : (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isDragging ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-500'}`} />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isProcessing ? 'Processing your file...' : 'Upload your CSV file'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isProcessing 
                ? 'Please wait while we parse your data'
                : 'Drag and drop your CSV file here, or click to browse'
              }
            </p>
          </div>
          
          {!isProcessing && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FileText className="w-4 h-4" />
              <span>Supports CSV files up to 10MB</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Upload Status */}
      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${
          uploadStatus.type === 'error' 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {uploadStatus.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{uploadStatus.message}</span>
        </div>
      )}

      {/* Filter Section */}
      {showFilters && rawData && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Filter Data</h3>
                <p className="text-sm text-gray-600">
                  Apply filters to your data before generating charts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredData?.length || 0} of {rawData?.length || 0} rows
              </span>
            </div>
          </div>

          {/* Filter Builder */}
          <div className="space-y-4">
            {filters.map((filter, index) => (
              <div key={filter.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Column Selection */}
                  <select
                    value={filter.column}
                    onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select column...</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>

                  {/* Operator Selection */}
                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {operatorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* Value Input */}
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                    placeholder="Enter value..."
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Filter Info */}
                  <div className="flex items-center text-sm text-gray-600">
                    Filter #{index + 1}
                  </div>
                </div>

                {/* Remove Filter Button */}
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add Filter Button */}
            <button
              onClick={addFilter}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Filter</span>
            </button>
          </div>

          {/* Quick Filter Examples */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Filter Examples:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
              <div>• Gender equals "male"</div>
              <div>• Age greater than 25</div>
              <div>• Name contains "john"</div>
              <div>• Salary greater or equal 50000</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={filters.length === 0}
            >
              Clear All Filters
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                Showing {filteredData?.length || 0} filtered results
              </div>
              <button
                onClick={proceedWithData}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Proceed with Filtered Data
              </button>
            </div>
          </div>

          {/* Data Preview */}
          {(initialRowsRaw.length > 0 || (filteredData && filteredData.length > 0)) && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      {headers.slice(0, 6).map(header => (
                        <th key={header} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                          {header}
                        </th>
                      ))}
                      {headers.length > 6 && (
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                          +{headers.length - 6} more
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Display initial raw rows first */}
                    {initialRowsRaw.map((rowArray, rowIndex) => (
                      <tr key={`initial-raw-${rowIndex}`} className="bg-blue-50 text-blue-800"> {/* Highlight initial rows */}
                        {headers.slice(0, 6).map((header, colIndex) => (
                          <td key={`${header}-${rowIndex}`} className="px-3 py-2 border-b">
                            {rowArray[colIndex] || '-'} {/* Access by index as initialRowsRaw are arrays of values */}
                          </td>
                        ))}
                        {headers.length > 6 && (
                          <td className="px-3 py-2 border-b text-blue-500">...</td>
                        )}
                      </tr>
                    ))}
                    {/* Then display actual filtered data (first 5 rows) */}
                    {filteredData.slice(0, 5).map((row, index) => (
                      <tr key={`data-row-${index}`} className="hover:bg-gray-50">
                        {headers.slice(0, 6).map(header => (
                          <td key={header} className="px-3 py-2 border-b text-gray-900">
                            {row[header] || '-'}
                          </td>
                        ))}
                        {headers.length > 6 && (
                          <td className="px-3 py-2 border-b text-gray-500">...</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(initialRowsRaw.length + (filteredData?.length || 0)) > 5 && (
                <p className="text-xs text-gray-500 mt-2">
                  ... and {((filteredData?.length || 0) + initialRowsRaw.length) - Math.min(5, (filteredData?.length || 0) + initialRowsRaw.length)} more rows
                </p>
              )}
            </div>
          )}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
          
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            
          Our platform transforms complex CSV information into beautiful, actionable insights that drive career success.
        </p>
      </div>
 

      {/* Mission Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Doctors For You (DFY) is a pan-India humanitarian organization providing medical care to vulnerable communities during crises and non-crisis situations. Founded in 2007, DFY operates across disaster zones with a focus on emergency aid, health access, and capacity building. </p>
            
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Team collaboration" 
              className="rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl"></div>
          </div>
        </div>
      </div>


      {/* Technology Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
        <div className="text-center mb-12">
            
            
        </div>
          
      </div>
    </div>
    </div>
    
  );
};