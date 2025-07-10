import React, { useState } from 'react';
import { Save, X, FileText, AlertCircle } from 'lucide-react';

export const SaveDialog = ({ isOpen, onClose, onSave, fileName = '', data, headers }) => {
  const [name, setName] = useState(fileName);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a file name');
      return;
    }

    setSaving(true);
    try {
      await onSave(name.trim(), description.trim());
      onClose();
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Save className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Save CSV File</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter file name"
              disabled={saving}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add a description for this file"
              disabled={saving}
            />
          </div>

          {data && headers && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">File Details</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Rows: {data.length}</p>
                <p>Columns: {headers.length}</p>
                <p>Headers: {headers.slice(0, 3).join(', ')}{headers.length > 3 ? '...' : ''}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};