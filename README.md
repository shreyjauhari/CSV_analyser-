# CSV Analyser

CSV Analyser is a robust and intuitive React-based tool designed to streamline the process of uploading, analyzing, and visualizing CSV data. It empowers users to effortlessly parse CSV files, apply dynamic filters, generate insightful charts, and export filtered results as downloadable PDFs.

---

## 🚀 Features

* **Effortless CSV Upload & Parsing:** Easily upload and parse `.csv` files. The intelligent parser handles structured multi-row headers and preserves metadata rows.
* **Interactive Data Preview:** Get a quick, interactive, and paginated preview of your uploaded data. Sort columns with a single click and apply filters before further processing.
* **Dynamic Data Filtering:** Filter your CSV data based on user-defined criteria, allowing you to focus on the information that matters most.
* **Powerful Chart Generation:** Visualize your data with dynamic charts! Supports **Bar**, **Line**, **Area**, and **Pie** charts, all built with `recharts`.
    * **Customizable Chart Controls:** Select chart types, choose X and Y axis data columns, set titles, and pick color themes for personalized visualizations.
    * **Intelligent Data Handling:** Automatically sanitizes non-numeric values for charting, treating them as 0.
* **PDF Export:** Export your filtered and processed data as a downloadable PDF.
* **Patient Data Management:** A dedicated module for displaying patient details, uploading and managing PDF prescriptions with local storage persistence and usage indicators.
* **Saved Files Management:** Conveniently manage and analyze previously saved CSV files, including metadata, chart statistics, and options to view, download, or delete.
* **Progress Tracking:** Track and search patient data dynamically, displaying key information in interactive cards.
* **Clean & Minimal UI:** Built with React, Tailwind CSS, and Lucide Icons for a responsive, modern, and intuitive user experience.

---

## 🛠 Tech Stack

* **React (JSX):** The core library for building the user interface.
* **PapaParse:** For fast and reliable CSV parsing.
* **recharts:** A composable charting library for React, used for dynamic data visualization.
* **jsPDF:** (Assumed for PDF generation – *if using a different library, update this*).
* **Tailwind CSS:** For highly customizable and utility-first CSS styling.
* **Lucide Icons:** A beautiful, consistent, and customizable icon library.
* **IndexedDB:** (Or other client-side storage) for persisting saved CSV files.

---

## 📦 Installation

To get the CSV Analyser up and running on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/shreyjauhari/csv-analyser.git](https://github.com/shreyjauhari/csv-analyser.git)
    cd csv-analyser
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # Ensure papaparse is installed, as it's a core dependency
    npm install papaparse
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

    This will typically open the application in your browser at `http://localhost:5173` (or a similar port).

---

## 📂 Project Structure & Key Components

The project is thoughtfully organized into several key React components, each meticulously designed to handle a specific facet of the application's functionality. This modular approach ensures maintainability, scalability, and a clear separation of concerns.

---

### `ChartControls.jsx`

This component serves as the **control panel for all chart customizations**. It empowers users to tailor their data visualizations precisely.

* **Chart Type Selection:** Users can easily switch between **Bar**, **Line**, **Area**, and **Pie** charts, allowing them to choose the most appropriate visual representation for their data.
* **Axis Data Mapping:** It provides intuitive dropdowns for selecting **data columns to be mapped to the X and Y axes** (for Bar, Line, Area charts) or **label and value** (for Pie charts). This dynamic mapping is crucial for generating meaningful charts from diverse CSV datasets.
* **Chart Title Configuration:** A dedicated input field allows users to **set a custom title** for their charts, ensuring clarity and context for the visualization.
* **Color Theme Selection:** Users can **pick a color theme** from a predefined set, enabling them to personalize the chart's aesthetic and align it with their preferences or branding.
* **State Management:** Internally, it manages the selected chart configurations (type, axes, title, theme) and passes these as props to `ChartGenerator.jsx` to render the actual chart.

---

### `ChartGenerator.jsx`

The heart of the data visualization, `ChartGenerator.jsx` is responsible for **rendering interactive and dynamic charts** based on the user's data and selected controls. It leverages the powerful `recharts` library.

* **Dynamic Data Transformation:** This component intelligently **parses and transforms the raw CSV data** into a structured format (`[{ name: 'A', value: 10 }, ...]`) suitable for `recharts`. This involves handling potential inconsistencies in the CSV data.
* **Automatic Data Sanitization:** A critical feature is its ability to **automatically handle non-numeric Y-axis values**, treating them gracefully as `0` to prevent rendering errors and ensure chart stability.
* **Configuration Validation & Feedback:** It provides **clear user feedback** for missing configurations or insufficient data, guiding the user to provide the necessary inputs before attempting to render a chart. For instance, if X or Y axes aren't selected, it will prompt the user.
* **Custom Tooltips & Styling:** Enhances user experience with **customizable tooltips** that display detailed data points on hover, and applies dynamic styling based on the chosen color theme.
* **Responsive Design:** Ensures that the generated charts are **fully responsive** and adapt seamlessly to various screen sizes and embedding layouts, making them suitable for dashboards or reports.
* **Chart Type Specific Rendering:** Contains conditional rendering logic to correctly render `BarChart`, `LineChart`, `AreaChart`, and `PieChart` components from `recharts`, passing the processed data and configuration to each.

---

### `DataPreview.jsx`

This component offers an **interactive, paginated, and sortable table preview** of the uploaded CSV data, providing users with a quick and efficient way to inspect and understand their dataset before deeper analysis or export.

* **Styled & Responsive Table:** Renders a clean, user-friendly table of the CSV data, designed with Tailwind CSS for responsiveness, ensuring it looks good on any device.
* **Column Sorting:** Users can **click on any column header to toggle sorting** (ascending ↔ descending). It intelligently handles both string and numeric sorting, providing immediate feedback on data organization.
* **Pagination Controls:** Implements **pagination, displaying 10 rows per page** by default. It includes intuitive navigation buttons (Previous, Next, page numbers) and displays `...` to handle large page ranges efficiently.
* **Data Persistence & Action:** Includes a **"Save Button"** that triggers the `onSaveDetails` prop function. This callback is crucial for external components to **persist or process the currently sorted and filtered dataset**, whether for saving, exporting, or further analysis.
* **Intuitive UI:** Features clean design with hover states on rows and column headers, complemented by Lucide icons for an enhanced visual experience.

---

### `FileUpload.jsx`

`FileUpload.jsx` is a powerful and customizable component that handles the entire process of **uploading, validating, parsing, and initially filtering CSV files**. It's built with modern UI libraries for a seamless user experience.

* **CSV File Validation:** Strictly validates uploaded files to ensure they are of the `.csv` type, preventing incorrect file formats from being processed.
* **Intelligent Multi-Row Header Parsing:** Utilizes `PapaParse` to **automatically parse complex, structured multi-row headers**, which is essential for datasets where column names span multiple rows.
* **Metadata Preservation:** Goes beyond just parsing data by **preserving crucial metadata rows**, allowing the application to retain context from the original CSV file.
* **Interactive Data Preview Integration:** After parsing, it provides an **interactive preview of the data**, often by passing it to `DataPreview.jsx`, allowing users to verify the parsed content immediately.
* **Advanced Filtering Support:** Offers functionalities to **interactively filter the parsed data**, empowering users to refine their dataset before proceeding to charting or exporting.
* **Progressive Workflow:** Once data is filtered and validated, this component facilitates the progression of the data to subsequent stages, such as chart generation or export, through appropriate callbacks.
* **Visual Feedback:** Provides clear visual cues during the upload and parsing process, such as loading indicators or success/error messages.

---

### `Header.jsx`

The `Header.jsx` component defines the **top-level navigation bar** of the application, ensuring a consistent and user-friendly experience across different screen sizes.

* **Responsive Navigation:** Dynamically adapts its layout based on screen width.
    * On **desktop (md+ breakpoints)**, it displays navigation tabs horizontally with accompanying Lucide icons, providing quick access to different sections.
    * On **mobile (<md breakpoints)**, it gracefully transitions to a compact `<select>` dropdown, optimizing for smaller screens while maintaining full navigation functionality.
* **Branding & Visual Identity:** Integrates an `imageLogo` (imported from `./pics/image.png`), which is styled to be **rounded and sized `w-15 h-20`**, serving as a clear visual identifier for the application.
* **Layout & Alignment:** Ensures the logo is **vertically centered** within the header, contributing to a clean and professional appearance.
* **Navigation Logic:** Manages the active navigation state, potentially using React Router's `NavLink` or similar, to highlight the currently selected page.

---

### `Patient.jsx`

The `Patient.jsx` component is a **comprehensive UI module designed for managing patient-specific information and their associated PDF prescriptions**. It focuses on user experience and data persistence.

* **Patient Information Display:** Efficiently extracts and displays common patient metadata (e.g., name, age, diagnosis, contact) defined by the `DISPLAY_KEYS` array. This information is presented in a **responsive 2-column layout** using Tailwind CSS grid for optimal readability.
* **PDF Prescription Upload & Management:** Provides a robust system for uploading **up to 3 PDF files per patient**.
    * Enforces **file size limits (≤ 5 MB)** and **type validation (must be `application/pdf`)**.
    * Prevents duplicate uploads based on name/size.
    * Each uploaded PDF is converted to a **Base64 string** using `FileReader`, making it storable.
* **`localStorage` Integration for Persistence:** Critically, it uses a **unique key per patient (e.g., `patient_pdfs_123`) to save and load Base64 PDF strings** and their metadata directly from `localStorage`. This ensures that uploaded prescriptions persist across browser sessions.
    * Includes logic to **remove all files if the prescription list is emptied**, helping manage storage.
    * Actively **manages `localStorage` quota** (around ~5MB per origin), providing a warning if limits are approached.
* **Storage Usage Indicator:** Features a **real-time visual indicator (storage bar)** showing the current `localStorage` usage (e.g., "1.2 MB / 5 MB"). This updates dynamically after each upload or deletion, providing transparency to the user.
* **File Management Interface:** Displays uploaded files in an organized list, showing the **file name (linked for direct download)**, file size, and upload date. Each entry includes a **"Delete" button (using the `Trash2` Lucide icon)** for easy removal.
* **Navigation Callback:** The `onBack` prop function provides a mechanism to **return to the previous view**, ensuring smooth navigation within the application flow.

---

### `SavedFiles.jsx`

This component is dedicated to **displaying and managing a list of CSV files that the user has previously saved**. It acts as a central hub for accessing historical data.

* **Load & Display Saved CSV Files:** Retrieves and presents a list of saved files from a client-side storage mechanism, typically **IndexedDB** (via `dbOperations.getAllCsvFiles()`). Each file entry includes crucial metadata: **name, number of rows, number of columns, upload date, and an optional description**.
* **Show File & Chart Statistics:** Integrates with `dbOperations.getStats()` to display **aggregate statistics** across all saved data, such as:
    * Total CSV files uploaded.
    * Total charts saved (if applicable).
    * Total data points (sum of rows across all files), offering a high-level overview of the user's stored data volume.
* **"Load & Analyze" Functionality:** Provides a button that, when clicked, triggers the `onLoadFile(...)` callback. This sends the selected file's data to a parent component, enabling its **re-loading for analysis or chart generation**.
* **File Deletion:** Allows users to **delete saved files after a confirmation step** (using `dbOperations.deleteCsvFile(...)`), ensuring accidental deletions are minimized.
* **File Download:** Facilitates **downloading the original `.csv` file** by generating a `Blob` from the stored data and programmatically triggering a download, making it easy to retrieve original datasets.
* **"Upload New File" Action:** Includes a prominent button that triggers the `onCreateNew()` callback, which typically **opens the `FileUpload.jsx` interface** to allow the user to add new data.

---

### `SaveDialog.jsx`

A focused modal component designed to **collect essential metadata from the user before saving a processed CSV file**. It provides a structured way to name and describe the saved dataset.

* **Collect File Metadata:** Presents input fields for the user to:
    * **Enter a file name (required)**: This ensures that every saved file has a clear identifier.
    * **Enter an optional description**: Allows users to add context or notes about the file, enhancing its discoverability later.
* **Display File Summary:** If `data` and `headers` props are provided, the dialog conveniently shows a **mini-summary of the file being saved**, including:
    * The total **number of rows**.
    * The total **number of columns**.
    * The **first 3 column headers**, giving a quick confirmation of the data structure.
* **Save Logic & Validation:** When the "Save File" button is clicked:
    * It **validates that a file name has been entered** before proceeding.
    * It calls the `onSave(name, description)` prop function, which is responsible for the actual data persistence logic (e.g., saving to IndexedDB).
    * Displays a **loading spinner** to indicate that the save operation is in progress, improving user feedback.
    * **Closes the modal automatically** after a successful save operation.
* **Close Dialog:** Provides clear mechanisms to close the modal: either by clicking the **close icon** (typically an 'X') or the **"Cancel" button**, both triggering the `onClose()` prop function.

---

### `TrackProgress.jsx`

This component is dedicated to **displaying and tracking patient-specific progress or details** derived from processed CSV data. It provides searching and a card-based view for easy navigation.

* **Patient Data Processing & Normalization:**
    * Receives `savedDetails` (an array of data rows) as a prop.
    * **Filters out invalid header rows or entries with empty names**, ensuring data integrity.
    * **Ensures each patient has a unique serial number (S. NO.)**: If missing, it intelligently generates one (e.g., `patient-0-<timestamp>`) to ensure every record is identifiable.
    * Stores this cleaned and normalized list in the component's internal `patients` state.
* **Dynamic Patient Search:** Offers a real-time search functionality, allowing users to **filter the patient list by various criteria**:
    * **Name**
    * **Age**
    * **Contact Number**
    * **Serial Number**
    * The filtering is efficiently implemented using `useMemo` to optimize performance, preventing unnecessary re-calculations.
* **Interactive Patient Cards Display:** For each filtered patient, it renders a **responsive and interactive card**. Each card prominently displays key information: **Name, Serial Number, Age, and Contact**.
    * Clicking on a patient card triggers the `onViewPatientDetails(patient)` callback, which is designed to open a **detailed view or modal for the selected patient**, allowing for deeper inspection or further actions.
* **Graceful Edge Case Handling:**
    * If no `savedDetails` are provided, it displays a **default "no data" message**, guiding the user.
    * If a search yields no matches, it shows a **specific "no matching results" message**.
    * Uses **fallback text ('-')** for fields like name, age, or contact if their values are missing in the data, ensuring a clean UI without broken displays.

---
 
 


## 🔗 References

* **GitHub Repository:** [https://github.com/shreyjauhari/csv-analyser](https://github.com/shreyjauhari/csv-analyser)
* **Inspired By:**
    * [React-JS-UI-Design-Finance-Dashboard-Payments-updates](https://github.com/zakaria-29-dev/React-JS-UI-Design-Finance-Dashboard-Payments-updates) (For UI design patterns and inspiration)
