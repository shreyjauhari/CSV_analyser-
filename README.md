# CSV Analyser

CSV Analyser is a simple React-based tool that allows users to upload a `.csv` file, filter its data, and export the filtered results as a downloadable PDF.

## 🚀 Features

- Upload and parse CSV files
- Filter data based on user-defined criteria
- Export filtered data as a PDF
- Clean and minimal UI built with React

## 🛠 Tech Stack

- **React (JSX)**
- **PapaParse** for CSV parsing
- **jsPDF** (assumed for PDF generation – replace if using another)

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shreyjauhari/csv-analyser.git
   cd csv-analyser
    npm install papaparse
   npm run dev
  

<h2>2.refrence github repos :</h2>
https://github.com/zakaria-29-dev/React-JS-UI-Design-Finance-Dashboard-Payments-updates


<h2>3.Pages :</h2>

### `ChartControls.jsx`
It allows the user to:

Select a chart type

Choose data columns for X and Y axes or label/value (depending on chart type)

Set a chart title

Pick a color theme

### `ChartGenerator.jsx`

This component is responsible for rendering dynamic charts based on uploaded CSV data. It supports four chart types: **Bar**, **Line**, **Area**, and **Pie**, and is built using `recharts`.

- Dynamically parses and transforms CSV data into a format suitable for charting
- Automatically handles data sanitization (non-numeric Y values are treated as 0)
- Provides user feedback for missing configuration or data
- Custom tooltips and styling for enhanced UI
- Responsive design for embedding in various layouts



- **Bar Chart**
- **Line Chart**
- **Area Chart**
- **Pie Chart**

### `DataPreview.jsx`

The `DataPreview` component provides an interactive, paginated, and sortable preview of the uploaded CSV data. It's designed for quick inspection, sorting, and filtering before further processing (like saving or exporting).

#### 🧩 Features

- Renders a styled, responsive table of CSV data
- Supports sorting by column (ascending/descending)
- Paginated view with navigation controls
- Allows saving the sorted/filtered data via a callback (`onSaveDetails`)
- Clean UI with hover states and intuitive design using Lucide icons

- **Sorting:** Clicking a column header toggles sort direction (`asc` ↔ `desc`). Supports string and numeric sorting.
- **Pagination:** Shows 10 rows per page with navigation buttons. Displays `...` when skipping large page ranges.
- **Save Button:** Calls the `onSaveDetails` prop function with the currently sorted data set.
 






