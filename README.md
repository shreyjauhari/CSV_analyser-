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

### `FileUpload.jsx`

 A powerful and customizable CSV uploader with metadata-aware parsing and advanced filtering support for React. Built with Tailwind CSS, Lucide Icons, and PapaParse, this component allows users to:

Upload and validate .csv files.

Automatically parse structured multi-row headers.

Preserve metadata rows.

Preview and filter the parsed data interactively.

Proceed with filtered data for further usage (e.g., chart generation or exporting).

### `Header.jsx`
Renders a top-level navigation bar that adapts to screen size.

Desktop (md+): Shows tabs horizontally with icons.

Mobile (<md): Displays a <select> dropdown for navigation.

Uses an image logo (imageLogo) imported from ./pics/image.png.

The logo is: rounded 

15x20 units in size (custom w-15 h-20)

Centered vertically in the header


### `Patient.jsx`
The Patient component is a comprehensive UI module for:

Displaying a patient's details

Uploading, previewing, and storing PDF prescriptions

Managing localStorage to persist file uploads across sessions

patient: object – Patient data with fields like name, age, etc.

onBack: function – Callback to go back to the previous view
 
1. Patient Info Display
Extracts common patient metadata (like name, age, diagnosis, etc.).

Keys defined in DISPLAY_KEYS array.

Shown in a responsive 2-column layout using Tailwind grid.

2. PDF Prescription Upload
Allows users to upload up to 3 PDF files, with:

Individual file size ≤ 5 MB

File type must be application/pdf

Duplicate name/size prevention

Each upload is converted to Base64 using FileReader

Base64 string saved in localStorage with metadata

3. localStorage Management
Uses a unique key per patient (e.g., patient_pdfs_123)

Automatically saves and loads PDFs from localStorage

Removes all files if prescription list is emptied

Manages storage quota (limit: ~5MB)

 4. Storage Usage Indicator
Shows real-time usage of localStorage visually:

Storage bar with size (e.g., 1.2 MB / 5 MB)

Dynamically updated after each upload/delete

5. File Management
Uploaded files appear in a list with:

Name (linked to download)

File size and upload date

Delete button (Trash2)

### `SavedFiles.jsx`
It displays and manages a list of saved CSV files that a user previously uploaded, providing options to view, download, delete, or analyze each file.

 Main Functionalities:
Load and Display Saved CSV Files
Loads files from a local IndexedDB (or another client-side storage via dbOperations.getAllCsvFiles()).

Each file includes metadata: name, number of rows, columns, upload date, and optional description.

 Show File and Chart Stats
 
Calls dbOperations.getStats() to show:

Total CSV files uploaded

Total charts saved

Total data points (sum of rows across files)
 
Clicking “Load & Analyze” runs onLoadFile(...) to send the file data to a parent component for analysis/charting.
 
Deletes a file after user confirmation using dbOperations.deleteCsvFile(...).
 
Allows downloading the file as a .csv by generating a Blob and triggering a download.
 
"Upload New File" button triggers onCreateNew() to open an upload UI (handled by the parent).

 ### `SaveDialog.jsx`

1. Collect File Metadata
Allows the user to:

Enter a file name (required)

Enter an optional description

2.Display File Summary
If data and headers are provided, it shows a mini summary:

Number of rows

Number of columns

First 3 column headers

3. Save the File
When the "Save File" button is clicked:

Validates that a file name is entered.

Calls onSave(name, description) (passed in as a prop).

Shows a loading spinner while saving.

Closes the modal after a successful save.

4.  Close the Dialog
Clicking the  icon or "Cancel" button closes the modal via onClose().

### `TrackProgress.jsx`
1. Receive and Process Patient Data
Takes savedDetails (array of rows) as a prop.

Filters out invalid header rows or empty names.

Ensures each patient has a serial number (S. NO.); if missing, generates one with a fallback like patient-0-<timestamp>.

Stores the cleaned-up list in the patients state.

2. Search Patients Dynamically
The user can search by:

Name

Age

Contact Number

Serial Number

Filters patient list in real time using useMemo.

3. Display Patient Cards
For each filtered patient:

Shows Name, Serial Number, Age, and Contact.

Cards are responsive and interactive.

Clicking a card triggers onViewPatientDetails(patient) → likely opens a detailed view or modal.

4. Handles Edge Cases Gracefully
If no savedDetails → shows a default "no data" message.

If no matches found from search → shows a specific "no matching results" message.

Uses fallback text ('-') if fields like name, age, or contact are missing.
