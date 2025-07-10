📊 CSV Analyser
CSV Analyser is a powerful, React-based web application for uploading, analyzing, visualizing, and managing CSV data. It supports dynamic chart generation, patient tracking, PDF export, and local storage of user-generated data – all wrapped in a clean, responsive UI.

🚀 Features
✅ Upload and parse .csv files using PapaParse

🔍 Preview, filter, and sort tabular data

📈 Generate dynamic charts (Bar, Line, Pie, Area) with Recharts

💾 Save data with metadata (name, description) and load it later

📄 Export filtered results as PDF using jsPDF

🧑‍⚕️ Track patient progress with search functionality

📂 Upload and manage PDF prescriptions per patient (stored in localStorage)

🎨 Clean, responsive UI built with TailwindCSS and Lucide Icons

🛠 Tech Stack
React (JSX)

PapaParse – CSV parsing

jsPDF – PDF export

Recharts – Chart rendering

TailwindCSS – UI styling

Lucide-react – Iconography

📦 Installation
bash
Copy
Edit
git clone https://github.com/shreyjauhari/csv-analyser.git
cd csv-analyser
npm install
npm run dev
📁 Project Structure & Components
✅ FileUpload.jsx
CSV Upload and Preprocessing

Drag & drop or file-select interface

Validates .csv format and parses multi-row headers

Preserves metadata rows

Allows interactive filtering before processing

📋 DataPreview.jsx
Sortable & Paginated Table Preview

Displays parsed CSV data in a paginated table

Supports sorting on any column (ascending/descending)

Calls onSaveDetails with the filtered/sorted data

Uses Lucide icons for sorting indicators and actions

📊 ChartControls.jsx
Dynamic Chart Configurator

Choose chart type: Bar, Line, Area, Pie

Select data columns for X/Y axes or label/value

Set custom chart titles and color themes

📈 ChartGenerator.jsx
Chart Rendering Engine

Renders charts dynamically using user-selected config

Supports:

Bar Chart

Line Chart

Area Chart

Pie Chart

Handles non-numeric values gracefully

Custom tooltips and responsive layout

🧑‍⚕️ TrackProgress.jsx
Patient Search & Overview

Receives patient data from saved CSV

Filters out invalid headers/empty rows

Ensures each entry has a unique Serial No.

Real-time search by name, age, contact, or serial number

Clickable patient cards trigger onViewPatientDetails(...)

📁 Patient.jsx
Patient Details & PDF Management

Displays structured patient info

Upload up to 3 PDF prescriptions (≤ 5MB each)

Files stored in localStorage with metadata

Prevents duplicates by name/size

Real-time storage usage indicator

PDF list with delete & download options

💾 SavedFiles.jsx
Saved CSV File Management

Loads CSV files saved locally (e.g., IndexedDB or localStorage)

Displays metadata: name, rows, columns, upload date

Click to Load & Analyze, Download, or Delete

Shows aggregate stats: total files, charts, data points

“Upload New File” button triggers file upload UI

💬 SaveDialog.jsx
File Metadata Input & Save Confirmation

Collects file name (required) and optional description

Displays file summary (rows, columns, headers)

Calls onSave(name, description) on submit

Shows saving spinner and closes on success

Cancel or X icon dismisses the dialog

🧭 Header.jsx
Responsive Navigation Header

Shows logo and tab-based navigation (desktop)

Displays dropdown navigation (mobile)

Logo imported from ./pics/image.png

Rounded and sized w-15 h-20

🌐 Reference UI Inspiration
 https://github.com/zakaria-29-dev/React-JS-UI-Design-Finance-Dashboard-Payments-updates
