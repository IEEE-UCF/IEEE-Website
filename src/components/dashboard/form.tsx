"use client";
import React, { useState } from 'react';

export const FormPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Add your form submission logic here
  };

  return (
    <div>
      <button onClick={togglePopup} className="bg-white">Test Popup</button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg text-black">
            <h2 className="text-2xl mb-4">Create Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="hostType" className="block text-sm font-medium text-gray-700">Host Type</label>
                <select name="hostType" id="hostType" value={formData.hostType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Select Host Type</option>
                  <option value="club">Club</option>
                  <option value="committee">Committee</option>
                  <option value="project">Project</option>
                  <option value="member">Member</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="hostId" className="block text-sm font-medium text-gray-700">Host ID</label>
                <input type="text" name="hostId" id="hostId" value={formData.hostId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="datetime-local" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="datetime-local" name="endTime" id="endTime" value={formData.endTime} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <input type="number" name="duration" id="duration" value={formData.duration} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="flyerUrl" className="block text-sm font-medium text-gray-700">Flyer URL</label>
                <input type="text" name="flyerUrl" id="flyerUrl" value={formData.flyerUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="rsvpLink" className="block text-sm font-medium text-gray-700">RSVP Link</label>
                <input type="text" name="rsvpLink" id="rsvpLink" value={formData.rsvpLink} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="flex items-center mb-4">
                <input type="checkbox" name="requiresDues" id="requiresDues" checked={formData.requiresDues} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="requiresDues" className="ml-2 block text-sm text-gray-900">Requires Dues</label>
              </div>
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
