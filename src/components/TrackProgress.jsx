


// import React, { useState, useMemo, useEffect } from 'react';
// import { Search, Trash2, CheckCircle2 } from 'lucide-react';

// const LOCAL_STORAGE_KEY = 'SAVED_PATIENTS';

// export const TrackProgress = ({ savedDetails = [], onViewPatientDetails }) => {
//   const [patients, setPatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   const PATIENT_NAME_KEY = 'NAME';
//   const AGE_KEY = 'AGE';
//   const CONTACT_NUMBER_KEY = 'CONTACT \nNO.';
//   const SERIAL_KEY = 'S. NO.';

//   // Load and merge new patients with existing ones from localStorage
//   useEffect(() => {
//     const loadInitialPatients = () => {
//       const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
//       let existingPatients = [];

//       try {
//         if (stored) {
//           existingPatients = JSON.parse(stored);
//         }
//       } catch (e) {
//         console.error("Error parsing localStorage data:", e);
//       }

//       let newPatients = [];

//       if (savedDetails && savedDetails.length > 0) {
//         newPatients = savedDetails
//           .filter(row => {
//             const name = (row[PATIENT_NAME_KEY] || '').trim().toUpperCase();
//             return name !== 'NAME' && name !== '-' && name !== '';
//           })
//           .map((row, index) => {
//             const serial = row[SERIAL_KEY] && String(row[SERIAL_KEY]).trim() !== ''
//               ? String(row[SERIAL_KEY])
//               : `patient-${index}-${Date.now()}`;
//             return {
//               serial,
//               ...row,
//             };
//           });
//       }

//       // Merge without duplicates
//       const merged = [
//         ...existingPatients,
//         ...newPatients.filter(newP => {
//           const newSerial = newP.serial || newP[SERIAL_KEY];
//           return !existingPatients.some(existing => (existing.serial || existing[SERIAL_KEY]) === newSerial);
//         }),
//       ];

//       setPatients(merged);
//     };

//     loadInitialPatients();
//   }, [savedDetails]);

//   // Delete a tile
//   const handleDelete = (serial) => {
//     setPatients(prev => prev.filter(p => (p.serial || p[SERIAL_KEY]) !== serial));
//   };

//   // Save to localStorage
//   const handleProceed = () => {
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patients));
//     alert('Patient list saved for future sessions.');
//   };

//   // Filtered search
//   const filteredPatients = useMemo(() => {
//     let currentPatients = [...patients];
//     if (searchTerm) {
//       const lower = searchTerm.toLowerCase();
//       currentPatients = currentPatients.filter(p => {
//         const nameMatch = (p[PATIENT_NAME_KEY] || '').toLowerCase().includes(lower);
//         const ageMatch = (p[AGE_KEY] || '').toLowerCase().includes(lower);
//         const contactMatch = (p[CONTACT_NUMBER_KEY] || '').toLowerCase().includes(lower);
//         const serialMatch = (p[SERIAL_KEY] || p.serial || '').toLowerCase().includes(lower);
//         return nameMatch || ageMatch || contactMatch || serialMatch;
//       });
//     }
//     return currentPatients;
//   }, [patients, searchTerm]);

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Track Patient Progress</h2>

//       {/* Search Bar */}
//       <div className="relative mb-6">
//         <input
//           type="text"
//           placeholder="Search by name, age, contact, or serial number..."
//           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//       </div>

//       {/* Proceed Button */}
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={handleProceed}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//         >
//           <CheckCircle2 className="w-5 h-5" />
//           save data
//         </button>
//       </div>

//       {/* Patient Cards */}
//       {filteredPatients.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredPatients.map((p) => {
//             const serial = p.serial || p[SERIAL_KEY];
//             return (
//               <div
//                 key={serial}
//                 className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition relative"
//               >
//                 {/* Delete button */}
//                 <button
//                   onClick={() => handleDelete(serial)}
//                   className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                   title="Delete"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>

//                 {/* Patient Info */}
//                 <div onClick={() => onViewPatientDetails(p)} className="cursor-pointer">
//                   <h3 className="text-lg font-semibold text-blue-800 truncate">
//                     {p[PATIENT_NAME_KEY]}
//                   </h3>
//                   <p className="text-sm text-gray-600">Serial No: {serial || '-'}</p>
//                   <p className="text-sm text-gray-600">Age: {p[AGE_KEY] || '-'}</p>
//                   <p className="text-sm text-gray-600">Contact: {p[CONTACT_NUMBER_KEY] || '-'}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p className="text-gray-600">
//           {searchTerm
//             ? "No matching patients found for your search term."
//             : "No data loaded. Please upload a CSV and save details to see patient progress."}
//         </p>
//       )}
//     </div>
//   );
// };


// import React, { useState, useMemo, useEffect } from 'react';
// import { Search, Trash2, CheckCircle2 } from 'lucide-react';

// const LOCAL_STORAGE_KEY = 'SAVED_PATIENTS';

// export const TrackProgress = ({ savedDetails = [], onViewPatientDetails }) => {
//   const [patients, setPatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   const PATIENT_NAME_KEY = 'NAME';
//   const AGE_KEY = 'AGE';
//   const CONTACT_NUMBER_KEY = 'CONTACT \nNO.';
//   const SERIAL_KEY = 'S. NO.';

//   // Load saved patients from localStorage on mount
//   useEffect(() => {
//     const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
//     try {
//       if (stored) {
//         setPatients(JSON.parse(stored));
//       }
//     } catch (e) {
//       console.error('Error parsing localStorage data:', e);
//     }
//   }, []);

//   // Delete a tile and update localStorage
//   const handleDelete = (serial) => {
//     const updated = patients.filter(p => (p.serial || p[SERIAL_KEY]) !== serial);
//     setPatients(updated);
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
//   };

//   // Save to localStorage by merging new savedDetails
//   const handleProceed = () => {
//     let newPatients = [];

//     if (savedDetails && savedDetails.length > 0) {
//       newPatients = savedDetails
//         .filter(row => {
//           const name = (row[PATIENT_NAME_KEY] || '').trim().toUpperCase();
//           return name !== 'NAME' && name !== '-' && name !== '';
//         })
//         .map((row, index) => {
//           const serial = row[SERIAL_KEY] && String(row[SERIAL_KEY]).trim() !== ''
//             ? String(row[SERIAL_KEY])
//             : `patient-${index}-${Date.now()}`;
//           return {
//             serial,
//             ...row,
//           };
//         });
//     }

//     const merged = [
//       ...patients,
//       ...newPatients.filter(newP => {
//         const newSerial = newP.serial || newP[SERIAL_KEY];
//         return !patients.some(existing => (existing.serial || existing[SERIAL_KEY]) === newSerial);
//       }),
//     ];

//     setPatients(merged);
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
//     alert('Patient list saved for future sessions.');
//   };

//   // Filtered search
//   const filteredPatients = useMemo(() => {
//     let currentPatients = [...patients];
//     if (searchTerm) {
//       const lower = searchTerm.toLowerCase();
//       currentPatients = currentPatients.filter(p => {
//         const nameMatch = (p[PATIENT_NAME_KEY] || '').toLowerCase().includes(lower);
//         const ageMatch = (p[AGE_KEY] || '').toLowerCase().includes(lower);
//         const contactMatch = (p[CONTACT_NUMBER_KEY] || '').toLowerCase().includes(lower);
//         const serialMatch = (p[SERIAL_KEY] || p.serial || '').toLowerCase().includes(lower);
//         return nameMatch || ageMatch || contactMatch || serialMatch;
//       });
//     }
//     return currentPatients;
//   }, [patients, searchTerm]);

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Track Patient Progress</h2>

//       {/* Search Bar */}
//       <div className="relative mb-6">
//         <input
//           type="text"
//           placeholder="Search by name, age, contact, or serial number..."
//           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//       </div>

//       {/* Proceed Button */}
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={handleProceed}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//         >
//           <CheckCircle2 className="w-5 h-5" />
//           Save Data
//         </button>
//       </div>

//       {/* Patient Cards */}
//       {filteredPatients.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredPatients.map((p) => {
//             const serial = p.serial || p[SERIAL_KEY];
//             return (
//               <div
//                 key={serial}
//                 className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition relative"
//               >
//                 {/* Delete button */}
//                 <button
//                   onClick={() => handleDelete(serial)}
//                   className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                   title="Delete"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>

//                 {/* Patient Info */}
//                 <div onClick={() => onViewPatientDetails(p)} className="cursor-pointer">
//                   <h3 className="text-lg font-semibold text-blue-800 truncate">
//                     {p[PATIENT_NAME_KEY]}
//                   </h3>
//                   <p className="text-sm text-gray-600">Serial No: {serial || '-'}</p>
//                   <p className="text-sm text-gray-600">Age: {p[AGE_KEY] || '-'}</p>
//                   <p className="text-sm text-gray-600">Contact: {p[CONTACT_NUMBER_KEY] || '-'}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p className="text-gray-600">
//           {searchTerm
//             ? "No matching patients found for your search term."
//             : "No data loaded. Please upload a CSV and save details to see patient progress."}
//         </p>
//       )}
//     </div>
//   );
// };


import React, { useState, useMemo, useEffect } from 'react';
import { Search, Trash2, CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'SAVED_PATIENTS';

export const TrackProgress = ({ savedDetails = [], onViewPatientDetails }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const PATIENT_NAME_KEY = 'NAME';
  const AGE_KEY = 'AGE';
  const CONTACT_NUMBER_KEY = 'CONTACT \nNO.';
  const SERIAL_KEY = 'S. NO.';

  // Merge new CSV data with localStorage immediately on savedDetails change
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let existingPatients = [];

    try {
      if (stored) {
        existingPatients = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error parsing localStorage data:', e);
    }

    // Prepare new patients from savedDetails
    let newPatients = [];

    if (savedDetails && savedDetails.length > 0) {
      newPatients = savedDetails
        .filter(row => {
          const name = (row[PATIENT_NAME_KEY] || '').trim().toUpperCase();
          return name !== 'NAME' && name !== '-' && name !== '';
        })
        .map((row, index) => {
          const serial = row[SERIAL_KEY] && String(row[SERIAL_KEY]).trim() !== ''
            ? String(row[SERIAL_KEY])
            : `patient-${index}-${Date.now()}`;
          return {
            serial,
            ...row,
          };
        });

      // Filter out duplicates
      newPatients = newPatients.filter(newP => {
        const newSerial = newP.serial || newP[SERIAL_KEY];
        return !existingPatients.some(existing => (existing.serial || existing[SERIAL_KEY]) === newSerial);
      });
    }

    const merged = [...existingPatients, ...newPatients];
    setPatients(merged);
  }, [savedDetails]);

  // Delete patient and update localStorage
  const handleDelete = (serial) => {
    const updated = patients.filter(p => (p.serial || p[SERIAL_KEY]) !== serial);
    setPatients(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Save all current data (old + new) to localStorage
  const handleProceed = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patients));
    alert('Patient list saved for future sessions.');
  };

  // Search filter
  const filteredPatients = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return patients.filter(p => {
      return (
        (p[PATIENT_NAME_KEY] || '').toLowerCase().includes(lower) ||
        (p[AGE_KEY] || '').toLowerCase().includes(lower) ||
        (p[CONTACT_NUMBER_KEY] || '').toLowerCase().includes(lower) ||
        (p[SERIAL_KEY] || p.serial || '').toLowerCase().includes(lower)
      );
    });
  }, [patients, searchTerm]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Track Patient Progress</h2>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by name, age, contact, or serial number..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Save Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleProceed}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <CheckCircle2 className="w-5 h-5" />
          Save Data
        </button>
      </div>

      {/* Patient Tiles */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((p) => {
            const serial = p.serial || p[SERIAL_KEY];
            return (
              <div
                key={serial}
                className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition relative"
              >
                <button
                  onClick={() => handleDelete(serial)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div onClick={() => onViewPatientDetails(p)} className="cursor-pointer">
                  <h3 className="text-lg font-semibold text-blue-800 truncate">
                    {p[PATIENT_NAME_KEY]}
                  </h3>
                  <p className="text-sm text-gray-600">Serial No: {serial || '-'}</p>
                  <p className="text-sm text-gray-600">Age: {p[AGE_KEY] || '-'}</p>
                  <p className="text-sm text-gray-600">Contact: {p[CONTACT_NUMBER_KEY] || '-'}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">
          {searchTerm
            ? "No matching patients found for your search term."
            : "No data loaded. Please upload a CSV and save details to see patient progress."}
        </p>
      )}
    </div>
  );
};
