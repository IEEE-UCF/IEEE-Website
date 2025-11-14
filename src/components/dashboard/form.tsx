"use client";
import React, { useState } from 'react';
// Assuming your schema.ts file is located at `@/lib/db/schema`
// Please adjust this import path if it's different.
import { NewEvent } from '@/lib/database/schema';
import { Button } from '../ui/button';

// --- Type Definitions ---

// Interface for the raw demo event data
interface DemoEventData {
  title: string;
  location: string;
  committeeId: number | null;
  description: string;
  flyerUrl: string | null;
  rsvpLink: string | null;
  photoUrls: string; // JSON string
  startTime: string; // ISO string
  endTime: string; // ISO string
  requiresDues: boolean;
  slug: string;
}

// Type for the 'hostType' dropdown
type HostType = 'club' | 'committee' | 'project' | 'member' | '';

// Interface for the form's state
interface EventFormData {
  title: string;
  location: string;
  hostType: HostType;
  hostId: string;
  startTime: string; // Format: YYYY-MM-DDTHH:MM
  endTime: string; // Format: YYYY-MM-DDTHH:MM
  requiresDues: boolean;
  description: string;
  flyerUrl: string;
  rsvpLink: string;
  duration: string; // In minutes, as a string
}

/*
 * We no longer need the manual `ApiEventPayload` interface, 
 * since we are now importing `NewEvent` directly from the schema.
 *
 * interface ApiEventPayload { ... } // <- This is now removed.
*/

// --- Demo Data ---

const demoEventData: DemoEventData = {
  title: 'Demo Event - Test Insertion',
  location: 'Virtual / Online',
  committeeId: null, // This will map to hostType and hostId
  description: 'This is a test event created via the /api/events/demo route for database insertion testing.',
  flyerUrl: null,
  rsvpLink: null,
  photoUrls: JSON.stringify(["/path/to/demo/photo1.jpg", "/path/to/demo/photo2.png"]),
  startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
  requiresDues: false,
  slug: 'demo-event-test',
};

// --- Helper Functions ---

/**
 * Function to format date for datetime-local input
 * @param isoString - An ISO date string
 * @returns A string in YYYY-MM-DDTHH:MM format, or ''
 */
const formatDateTimeLocal = (isoString: string | null | undefined): string => {
  if (!isoString) return '';
  // The input type="datetime-local" expects format YYYY-MM-DDTHH:MM
  try {
    return isoString.slice(0, 16);
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
};

/**
 * Function to calculate duration in minutes
 * @param startTimeStr - An ISO or datetime-local string
 * @param endTimeStr - An ISO or datetime-local string
 * @returns Duration in minutes as a string, or ''
 */
const calculateDurationMinutes = (startTimeStr: string | null | undefined, endTimeStr: string | null | undefined): string => {
  if (!startTimeStr || !endTimeStr) return '';
  try {
    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);
    const durationMs = end.getTime() - start.getTime();
    if (isNaN(durationMs) || durationMs < 0) return '';
    return Math.round(durationMs / (1000 * 60)).toString();
  } catch (error) {
    console.error("Error calculating duration:", error);
    return '';
  }
};

// --- React Component ---

export const FormPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use the EventFormData interface for state
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    location: '',
    hostType: '',
    hostId: '',
    startTime: '',
    endTime: '',
    requiresDues: false,
    description: '',
    flyerUrl: '',
    rsvpLink: '',
    duration: '',
  });

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  // Function to load demo data into the form
  const loadDemoData = () => {
    // Type the prepared data object for safety
    const preparedDemoData: EventFormData = {
      title: demoEventData.title,
      location: demoEventData.location,
      hostType: demoEventData.committeeId === null ? 'committee' : '', // Assuming null maps to 'committee'
      hostId: demoEventData.committeeId === null ? '' : String(demoEventData.committeeId),
      startTime: formatDateTimeLocal(demoEventData.startTime),
      endTime: formatDateTimeLocal(demoEventData.endTime),
      requiresDues: demoEventData.requiresDues,
      description: demoEventData.description,
      flyerUrl: demoEventData.flyerUrl || '', // Use empty string if null
      rsvpLink: demoEventData.rsvpLink || '',   // Use empty string if null
      duration: calculateDurationMinutes(demoEventData.startTime, demoEventData.endTime),
    };
    setFormData(preparedDemoData);
  };

  /**
   * Type-safe change handler for all form inputs.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Assert that 'name' is a key of our form data state
    const key = name as keyof EventFormData;

    // Type-safe update: handle boolean checkbox separately
    if (key === 'requiresDues' && type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [key]: checked
      }));
    } 
    // Handle all other inputs (which have string values)
    else if (key !== 'requiresDues') {
      setFormData(prev => ({
        ...prev,
        [key]: value
      }));

      // --- Automatic Duration Calculation ---
      // Recalculate duration if start or end time changes
      if (key === 'startTime') {
        setFormData(prev => ({
          ...prev,
          duration: calculateDurationMinutes(value, prev.endTime)
        }));
      } else if (key === 'endTime') {
        setFormData(prev => ({
          ...prev,
          duration: calculateDurationMinutes(prev.startTime, value)
        }));
      }
      // --- End Automatic Duration ---

    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert form data back to ISO strings for the API
      // startTime is required, so we can assume it's not empty
      const startTimeISO = new Date(formData.startTime).toISOString();
      // endTime is optional, send null if empty, otherwise send ISO string
      const endTimeISO = formData.endTime ? new Date(formData.endTime).toISOString() : null;

      // Construct the payload using the imported NewEvent type
      // This is now our "Single Source of Truth"
      const payload: NewEvent = {
        title: formData.title,
        location: formData.location,
        committeeId: formData.hostType === 'committee' ? formData.hostId : null,
        description: formData.description,
        flyerUrl: formData.flyerUrl || null, // Send null if empty
        rsvpLink: formData.rsvpLink || null,   // Send null if empty
        photoUrls: JSON.stringify([]), // Placeholder, as it's not in the form
        startTime: startTimeISO,
        endTime: endTimeISO,
        requiresDues: formData.requiresDues,
        // slug will be handled by the backend API route
        // id, createdAt, updatedAt, active will be handled by the database
      };

      const response = await fetch('/api/events/newEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Event created successfully');
        togglePopup();
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Failed to create event:', errorData);
      }
    } catch (error) {
      console.error('An error occurred while creating the event', error);
    }
  };

  return (
    <div>
      <button onClick={togglePopup} className="bg-white mr-2">Test Popup</button>
      <button onClick={loadDemoData} className="bg-blue-500 text-white px-4 py-2 rounded-md">Load Demo Data</button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg text-black max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl mb-4">Create Event</h2>
            <form onSubmit={handleSubmit}>
              
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {/* Host Type */}
              <div className="mb-4">
                <label htmlFor="hostType" className="block text-sm font-medium text-gray-700">Host Type</label>
                <select name="hostType" id="hostType" value={formData.hostType} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Select Host Type</option>
                  <option value="club">Club</option>
                  <option value="committee">Committee</option>
                  <option value="project">Project</option>
                  <option value="member">Member</option>
                </select>
              </div>

              {/* Host ID */}
              <div className="mb-4">
                <label htmlFor="hostId" className="block text-sm font-medium text-gray-700">Host ID</label>
                <input type="text" name="hostId" id="hostId" value={formData.hostId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {/* Start Time */}
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="datetime-local" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {/* End Time */}
              <div className="mb-4">
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="datetime-local" name="endTime" id="endTime" value={formData.endTime} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {/* Duration (Read-only) */}
              <div className="mb-4">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <input type="number" name="duration" id="duration" value={formData.duration} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" readOnly />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {/* Flyer URL */}
              <div className="mb-4">
                <label htmlFor="flyerUrl" className="block text-sm font-medium text-gray-700">Flyer URL</label>
                <input type="text" name="flyerUrl" id="flyerUrl" value={formData.flyerUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {/* RSVP Link */}
              <div className="mb-4">
                <label htmlFor="rsvpLink" className="block text-sm font-medium text-gray-700">RSVP Link</label>
                <input type="text" name="rsvpLink" id="rsvpLink" value={formData.rsvpLink} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {/* Requires Dues */}
              <div className="flex items-center mb-4">
                <input type="checkbox" name="requiresDues" id="requiresDues" checked={formData.requiresDues} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="requiresDues" className="ml-2 block text-sm text-gray-900">Requires Dues</label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end">
                <button type="button" onClick={togglePopup} className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">Close</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};