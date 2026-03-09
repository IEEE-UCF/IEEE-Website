'use client';
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc/client';

type HostType = 'club' | 'committee' | 'project' | 'member' | '';

interface EventFormData {
	title: string;
	location: string;
	hostType: HostType;
	hostId: string;
	startTime: string;
	endTime: string;
	requiresDues: boolean;
	description: string;
	flyerUrl: string;
	rsvpLink: string;
}

const formatDateTimeLocal = (isoString: string | null | undefined): string => {
	if (!isoString) return '';
	try { return isoString.slice(0, 16); } catch { return ''; }
};

export const FormPopup: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
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
	});

	const utils = trpc.useUtils();

	const createEvent = trpc.event.create.useMutation({
		onSuccess: () => {
			utils.event.getAll.invalidate();
			setIsOpen(false);
			setFormData({
				title: '', location: '', hostType: '', hostId: '',
				startTime: '', endTime: '', requiresDues: false,
				description: '', flyerUrl: '', rsvpLink: '',
			});
		},
		onError: (err) => {
			console.error('Failed to create event:', err);
		},
	});

	const togglePopup = () => setIsOpen(!isOpen);

	const loadDemoData = () => {
		const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const dayAfter = new Date(Date.now() + 25 * 60 * 60 * 1000);
		setFormData({
			title: 'Demo Event - Test Insertion',
			location: 'Virtual / Online',
			hostType: 'committee',
			hostId: '',
			startTime: formatDateTimeLocal(tomorrow.toISOString()),
			endTime: formatDateTimeLocal(dayAfter.toISOString()),
			requiresDues: false,
			description: 'This is a test event created for database insertion testing.',
			flyerUrl: '',
			rsvpLink: '',
		});
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const key = name as keyof EventFormData;
		if (key === 'requiresDues' && type === 'checkbox') {
			setFormData((prev) => ({ ...prev, [key]: (e.target as HTMLInputElement).checked }));
		} else {
			setFormData((prev) => ({ ...prev, [key]: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await createEvent.mutateAsync({
			title: formData.title,
			description: formData.description,
			location: formData.location,
			startTime: new Date(formData.startTime).toISOString(),
			endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
			committeeId: formData.hostType === 'committee' && formData.hostId ? formData.hostId : undefined,
			flyerUrl: formData.flyerUrl || undefined,
			rsvpLink: formData.rsvpLink || undefined,
			requiresDues: formData.requiresDues,
		});
	};

	return (
		<div>
			<button
				onClick={togglePopup}
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Create Event
			</button>
			{isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
					<div className="bg-white p-8 rounded-lg text-black max-w-lg w-full max-h-[90vh] overflow-y-auto">
						<h2 className="text-2xl mb-4">Create Event</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
								<input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm" />
							</div>
							<div className="mb-4">
								<label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
								<input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm" />
							</div>
							<div className="mb-4">
								<label htmlFor="hostType" className="block text-sm font-medium text-gray-700">Host Type</label>
								<select name="hostType" id="hostType" value={formData.hostType} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm">
									<option value="">Select Host Type</option>
									<option value="club">Club</option>
									<option value="committee">Committee</option>
									<option value="project">Project</option>
									<option value="member">Member</option>
								</select>
							</div>
							<div className="mb-4">
								<label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
								<input type="datetime-local" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm" />
							</div>
							<div className="mb-4">
								<label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
								<input type="datetime-local" name="endTime" id="endTime" value={formData.endTime} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm" />
							</div>
							<div className="mb-4">
								<label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
								<textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm" />
							</div>
							<div className="mb-4">
								<label htmlFor="flyerUrl" className="block text-sm font-medium text-gray-700">Flyer URL</label>
								<input type="text" name="flyerUrl" id="flyerUrl" value={formData.flyerUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm" />
							</div>
							<div className="mb-4">
								<label htmlFor="rsvpLink" className="block text-sm font-medium text-gray-700">RSVP Link</label>
								<input type="text" name="rsvpLink" id="rsvpLink" value={formData.rsvpLink} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm" />
							</div>
							<div className="flex items-center mb-4">
								<input type="checkbox" name="requiresDues" id="requiresDues" checked={formData.requiresDues} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
								<label htmlFor="requiresDues" className="ml-2 block text-sm text-gray-900">Requires Dues</label>
							</div>
							{createEvent.isError && (
								<p className="text-red-600 text-sm mb-4">{createEvent.error.message}</p>
							)}
							<div className="flex justify-end">
								<button type="button" onClick={loadDemoData} className="bg-indigo-600 text-white px-4 py-2 rounded-md mr-30">
									Load Demo Data
								</button>
								<button type="button" onClick={togglePopup} className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
									Close
								</button>
								<button type="submit" disabled={createEvent.isPending} className="bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50">
									{createEvent.isPending ? 'Submitting...' : 'Submit'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};