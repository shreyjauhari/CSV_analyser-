import Dexie from 'dexie';

// Define the database
export class CVDatabase extends Dexie {
  constructor() {
    super('CVAnalyticsDB');
    
    this.version(1).stores({
      csvFiles: '++id, name, uploadDate, headers, data, size, description',
      chartConfigs: '++id, fileId, chartType, config, createdDate, name'
    });
  }
}

// Create database instance
export const db = new CVDatabase();

// Database operations
export const dbOperations = {
  // Save CSV file
  async saveCsvFile(name, headers, data, description = '') {
    try {
      const fileData = {
        name,
        uploadDate: new Date(),
        headers,
        data,
        size: data.length,
        description
      };
      
      const id = await db.csvFiles.add(fileData);
      return { success: true, id, message: 'File saved successfully' };
    } catch (error) {
      console.error('Error saving CSV file:', error);
      return { success: false, message: 'Failed to save file' };
    }
  },

  // Get all CSV files
  async getAllCsvFiles() {
    try {
      const files = await db.csvFiles.orderBy('uploadDate').reverse().toArray();
      return { success: true, files };
    } catch (error) {
      console.error('Error fetching CSV files:', error);
      return { success: false, files: [] };
    }
  },

  // Get specific CSV file
  async getCsvFile(id) {
    try {
      const file = await db.csvFiles.get(id);
      return { success: true, file };
    } catch (error) {
      console.error('Error fetching CSV file:', error);
      return { success: false, file: null };
    }
  },

  // Delete CSV file
  async deleteCsvFile(id) {
    try {
      await db.csvFiles.delete(id);
      // Also delete associated chart configs
      await db.chartConfigs.where('fileId').equals(id).delete();
      return { success: true, message: 'File deleted successfully' };
    } catch (error) {
      console.error('Error deleting CSV file:', error);
      return { success: false, message: 'Failed to delete file' };
    }
  },

  // Save chart configuration
  async saveChartConfig(fileId, chartType, config, name) {
    try {
      const chartData = {
        fileId,
        chartType,
        config,
        createdDate: new Date(),
        name
      };
      
      const id = await db.chartConfigs.add(chartData);
      return { success: true, id, message: 'Chart configuration saved' };
    } catch (error) {
      console.error('Error saving chart config:', error);
      return { success: false, message: 'Failed to save chart configuration' };
    }
  },

  // Get chart configurations for a file
  async getChartConfigs(fileId) {
    try {
      const configs = await db.chartConfigs.where('fileId').equals(fileId).toArray();
      return { success: true, configs };
    } catch (error) {
      console.error('Error fetching chart configs:', error);
      return { success: false, configs: [] };
    }
  },

  // Get database statistics
  async getStats() {
    try {
      const totalFiles = await db.csvFiles.count();
      const totalCharts = await db.chartConfigs.count();
      const totalDataPoints = await db.csvFiles.toArray().then(files => 
        files.reduce((sum, file) => sum + file.size, 0)
      );
      
      return {
        success: true,
        stats: { totalFiles, totalCharts, totalDataPoints }
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        success: false,
        stats: { totalFiles: 0, totalCharts: 0, totalDataPoints: 0 }
      };
    }
  }
};