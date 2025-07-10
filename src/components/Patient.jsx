

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, ArrowLeft, Upload, Trash2, AlertCircle } from 'lucide-react';
 

// Base64 conversion helper
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};

// localStorage usage estimate
const getLocalStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += key.length + localStorage[key].length;
    }
  }
  return total;
};

// Human-readable file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const Patient = ({ patient, onBack }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [lastUploadTime, setLastUploadTime] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0 });

  const patientSerial = patient?.['S. NO.'] || patient?.['Serial Number'] || 'unknown';
  const localStorageKey = `patient_pdfs_${patientSerial}`;

  const updateStorageInfo = useCallback(() => {
    const used = getLocalStorageSize();
    const max = 5 * 1024 * 1024;
    setStorageInfo({ used, available: max - used });
  }, []);

  // Load on mount or patient change
  useEffect(() => {
    if (!patient) return;

    try {
      const data = localStorage.getItem(localStorageKey);
      if (data) {
        const parsed = JSON.parse(data);
        const loaded = parsed.map((pdf) => {
          const base64Data = pdf.base64.split(',')[1];
          const byteChars = atob(base64Data);
          const byteNums = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteNums[i] = byteChars.charCodeAt(i);
          }
          const blob = new Blob([new Uint8Array(byteNums)], { type: pdf.type });
          const file = new File([blob], pdf.name, {
            type: pdf.type,
            lastModified: pdf.lastModified || Date.now(),
          });

          return {
            id: pdf.id || `${pdf.name}_${pdf.uploadedAt}`,
            file,
            base64: pdf.base64,
            uploadedAt: new Date(pdf.uploadedAt),
          };
        });

        setPrescriptions(loaded);
        if (loaded.length > 0) {
          const latest = new Date(Math.max(...loaded.map((p) => p.uploadedAt.getTime())));
          setLastUploadTime(latest);
        }
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load prescriptions. Resetting.');
      localStorage.removeItem(localStorageKey);
    }

    updateStorageInfo();
  }, [patient, localStorageKey, updateStorageInfo]);

  // Save to localStorage when prescriptions change
  useEffect(() => {
    if (prescriptions.length === 0) {
      localStorage.removeItem(localStorageKey);
      updateStorageInfo();
      return;
    }

    try {
      const serialized = prescriptions.map((p) => ({
        id: p.id,
        name: p.file.name,
        type: p.file.type,
        base64: p.base64,
        uploadedAt: p.uploadedAt.toISOString(),
        lastModified: p.file.lastModified,
      }));
      const stringified = JSON.stringify(serialized);
      const size = stringified.length + localStorageKey.length;
      if (size > 4 * 1024 * 1024) {
        setError('Storage limit exceeded. Please remove some files.');
        return;
      }
      localStorage.setItem(localStorageKey, stringified);
      updateStorageInfo();
    } catch (e) {
      console.error(e);
      setError('Failed to save prescriptions.');
    }
  }, [prescriptions, localStorageKey, updateStorageInfo]);

  // Upload handler
  const handlePDFUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newFiles = [];

    for (const file of files) {
      if (file.type !== 'application/pdf') {
        setError(`"${file.name}" is not a PDF.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 5MB. Size: ${formatFileSize(file.size)}`);
        continue;
      }

      if (prescriptions.length + newFiles.length >= 3) {
        setError('Cannot upload more than 3 files.');
        break;
      }

      const duplicate = prescriptions.find(
        (p) => p.file.name === file.name && p.file.size === file.size
      );
      if (duplicate) {
        setError(`"${file.name}" already uploaded.`);
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        if (!base64.startsWith('data:application/pdf;base64,')) {
          throw new Error('Invalid base64.');
        }

        newFiles.push({
          id: `${file.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          file,
          base64,
          uploadedAt: new Date(),
        });
      } catch (e) {
        console.error(e);
        setError(`Failed to process "${file.name}".`);
      }
    }

    if (newFiles.length > 0) {
      setPrescriptions((prev) => [...prev, ...newFiles]);
      setLastUploadTime(new Date());
    }

    setIsUploading(false);
  }, [prescriptions]);

  const handleRemoveFile = useCallback((id) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
    setError(null);
  }, []);

  const handleClearAll = useCallback(() => {
    setPrescriptions([]);
    setError(null);
    setLastUploadTime(null);
  }, []);

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <button onClick={onBack} className="text-blue-600 underline">← Back</button>
        <p>No patient selected.</p>
      </div>
    );
  }

  const DISPLAY_KEYS = [
    'S. NO.', 'DATE', 'TIME', 'NAME', 'SEX', 'AGE', 'ADDRESS',
    'CONTACT \nNO.', 'DIAGNOSIS', 'MEDICINES', 'REMARKS'
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <div className="flex justify-between mb-6">
        <button onClick={onBack} className="text-gray-700 hover:underline flex items-center">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </button>
        <h2 className="text-xl font-bold">{patient['NAME'] || 'Patient Details'}</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
          <button className="ml-auto text-xl leading-none" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Patient Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {DISPLAY_KEYS.map((key) => (
          <div key={key} className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">{key.replace(/\n/g, ' ')}</p>
            <p className="font-medium text-gray-800">{patient[key] || '-'}</p>
          </div>
        ))}
      </div>

      {/* Prescriptions */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-blue-800 font-semibold">Prescriptions ({prescriptions.length}/3)</h3>
          {prescriptions.length > 0 && (
            <button onClick={handleClearAll} className="text-red-600 text-sm flex items-center">
              <Trash2 className="mr-1 w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        {/* Storage usage */}
        <div className="mb-4">
          <p className="text-sm text-blue-600">
            Storage Used: {formatFileSize(storageInfo.used)} / ~5MB
          </p>
          <div className="w-full bg-blue-200 rounded h-2 mt-1">
            <div
              className="bg-blue-700 h-2 rounded"
              style={{ width: `${(storageInfo.used / (5 * 1024 * 1024)) * 100}%` }}
            />
          </div>
        </div>

        {/* Upload UI */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-blue-700">
            Upload PDF Prescriptions
          </label>
          <input
            id={`upload-${patientSerial}`}
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => handlePDFUpload(e.target.files)}
            disabled={isUploading || prescriptions.length >= 3}
          />
          <p className="text-xs text-gray-500 mt-1">Only PDF, max 5MB. Max 3 files.</p>
        </div>

        {/* File List */}
        {prescriptions.length > 0 ? (
          prescriptions.map((p) => (
            <div
              key={p.id}
              className="flex items-center bg-white p-3 rounded shadow mb-2 border"
            >
              <FileText className="text-blue-600 w-5 h-5 mr-2" />
              <div className="flex-grow overflow-hidden">
                <a
                  href={URL.createObjectURL(p.file)}
                  download={p.file.name}
                  className="text-blue-700 underline truncate block"
                >
                  {p.file.name}
                </a>
                <p className="text-xs text-gray-500">{formatFileSize(p.file.size)} • {p.uploadedAt.toLocaleDateString()}</p>
              </div>
              <button
                className="text-red-500 ml-2"
                onClick={() => handleRemoveFile(p.id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-blue-600">
            <FileText className="w-8 h-8 mx-auto mb-2" />
            No prescriptions uploaded.
          </div>
        )}
      </div>
    </div>
  );
};
