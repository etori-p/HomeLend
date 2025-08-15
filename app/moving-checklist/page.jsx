'use client';

import React, { useState, useEffect } from 'react';


// Inline SVG Icons for a clean, dependency-free solution.
const ClipboardListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
    <path d="M12 7V2" />
  </svg>
);

const CheckCircleIcon = ({ checked }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition-colors duration-200 ${
      checked ? 'text-green-500' : 'text-gray-400'
    }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
);

const Trash2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Mock data for the checklist, with a Kenyan context
const checklistData = [
  {
    title: '2 Months Before Moving',
    description: 'Start early to avoid last-minute stress and ensure a smooth transition.',
    tasks: [
      { text: 'Review your current tenancy agreement and confirm the notice period (usually 1-2 months).' },
      { text: 'Give written notice to your landlord or agent as per the agreement.' },
      { text: 'Start decluttering. Sell or donate unwanted furniture and household items on platforms like OLX or Facebook Marketplace.' },
      { text: 'Begin researching moving companies or ask around for reliable drivers with a lorry or pickup.' },
      { text: 'Create a budget for moving expenses, including packing supplies, transport, and potential cleaning costs.' },
    ],
  },
  {
    title: '1 Month Before Moving',
    description: 'The countdown begins. It’s time to get hands-on with the preparations.',
    tasks: [
      { text: 'Book your moving company or confirm your transport arrangements (lorry/pickup).' },
      { text: 'Buy packing materials: boxes, tape, bubble wrap, and markers. Local supermarkets and hardware stores often have these.' },
      { text: 'Start packing non-essential items like books, off-season clothes, and decorative items.' },
      { text: 'Notify utility companies (KPLC, Nairobi Water & Sewerage Co. or other county water bodies) of your move-out date.' },
      { text: 'Arrange for deep cleaning of your old home after you move out, or plan to do it yourself.' },
    ],
  },
  {
    title: '1 Week Before Moving',
    description: 'Finalize the details and get ready for the big day.',
    tasks: [
      { text: 'Confirm final arrangements with your moving company or driver.' },
      { text: 'Pack an essentials box with items you’ll need immediately: toiletries, snacks, first-aid kit, important documents.' },
      { text: 'Take photos or videos of the old home’s condition for your records to help with the security deposit refund process.' },
      { text: 'Take final meter readings for KPLC and your water provider.' },
      { text: 'Confirm the handover process with your landlord or caretaker (watchman).' },
    ],
  },
  {
    title: 'Moving Day',
    description: 'It\'s all happening! Stay calm and focused.',
    tasks: [
      { text: 'Ensure all boxes are clearly labeled with their contents and the room they belong in.' },
      { text: 'Supervise the loading of the lorry/pickup to ensure fragile items are handled with care.' },
      { text: 'Do a final walk-through of the empty house to ensure nothing is left behind.' },
      { text: 'Hand over the keys and get a signed receipt or acknowledgement from your landlord.' },
      { text: 'Upon arrival at your new place, check that all items have arrived safely.' },
    ],
  },
  {
    title: 'After Moving',
    description: 'You\'ve made it! Now for the final steps to settle in.',
    tasks: [
      { text: 'Start the process of connecting utilities at your new home (KPLC and water).' },
      { text: 'Update your address with your bank, mobile service provider, and any other important services.' },
      { text: 'Clean and organize your new home before unpacking all your boxes.' },
      { text: 'Settle in and get to know your new neighborhood and neighbors.' },
      { text: 'Wait for the security deposit from your previous landlord.' },
    ],
  },
];

// Component to display a single checklist item
const ChecklistItem = ({ item, sectionIndex, taskIndex, onToggle }) => (
  <label
    htmlFor={`item-${sectionIndex}-${taskIndex}`}
    className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
  >
    <input
      type="checkbox"
      id={`item-${sectionIndex}-${taskIndex}`}
      checked={item.checked}
      onChange={() => onToggle(sectionIndex, taskIndex)}
      className="hidden"
    />
    <div className={`flex items-center justify-center w-6 h-6 border-2 rounded-full transition-all duration-200 ${item.checked ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
      {item.checked && (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
    <span className={`ml-4 text-base transition-colors duration-200 ${item.checked ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
      {item.text}
    </span>
  </label>
);

// Main application component
export default function MovingChecklistPage() {
  const [checklist, setChecklist] = useState(checklistData);

  // Load checklist state from local storage on initial load
  useEffect(() => {
    try {
      const savedChecklist = localStorage.getItem('movingChecklist');
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist));
      }
    } catch (error) {
      console.error("Failed to load checklist from local storage:", error);
    }
  }, []);

  // Save checklist state to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('movingChecklist', JSON.stringify(checklist));
    } catch (error) {
      console.error("Failed to save checklist to local storage:", error);
    }
  }, [checklist]);

  // Function to handle toggling a task
  const handleToggle = (sectionIndex, taskIndex) => {
    const newChecklist = [...checklist];
    newChecklist[sectionIndex].tasks[taskIndex].checked = !newChecklist[sectionIndex].tasks[taskIndex].checked;
    setChecklist(newChecklist);
  };

  // Function to reset the entire checklist
  const handleReset = () => {
    const defaultChecklist = checklistData.map(section => ({
      ...section,
      tasks: section.tasks.map(task => ({ ...task, checked: false })),
    }));
    setChecklist(defaultChecklist);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10 p-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-center mb-4">
            <ClipboardListIcon />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Moving Checklist
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A practical guide and checklist to help you manage your move from one house, apartment, or bedsitter to another with ease.
          </p>
        </header>

        {/* Reset Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors duration-200 shadow-sm"
          >
            <Trash2Icon />
            <span className="ml-2">Reset Checklist</span>
          </button>
        </div>

        {/* Checklist Sections */}
        <div className="space-y-8">
          {checklist.map((section, sectionIndex) => (
            <section key={section.title} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{section.description}</p>
              <div className="space-y-2">
                {section.tasks.map((task, taskIndex) => (
                  <ChecklistItem
                    key={taskIndex}
                    item={task}
                    sectionIndex={sectionIndex}
                    taskIndex={taskIndex}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* A note about Kenyan specifics */}
        <footer className="mt-10 p-6 bg-yellow-50 text-yellow-800 rounded-xl shadow-md flex items-start space-x-3">
          <AlertCircleIcon />
          <p className="text-sm">
            <span className="font-semibold">A quick note on Kenyan terms:</span> <br/>
            `Bedsitter` refers to a studio apartment. `Lorry` or `truck` are commonly used for hiring moving transport. A `watchman` is a security guard, often acting as a caretaker.
          </p>
        </footer>

      </div>
    </div>
  );
}
