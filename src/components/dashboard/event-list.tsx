"use client";
import React, { useState, useEffect } from 'react';
import { type Event } from '@/lib/database/schema';

export const EventList = () => {
	const [events, setEvents] = useState<Event[]>([]);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch('/api/events/getEvents');
				if (response.ok) {
					const { data } = await response.json();
					setEvents(data);
				}
			} catch (error) {
				console.error('Failed to fetch events', error);
			}
		};

		fetchEvents();
	}, []);

	return (
		<div className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-2xl font-bold mb-4 text-gray-800">Events</h2>
			{/* Container for the scrollable list */}
			<div className={`${events.length > 3 ? 'max-h-80 overflow-y-auto' : ''}`}>
				<ul className="divide-y divide-gray-200">
					{events.length === 0 ? (
						<p className="p-4 text-center text-gray-500">No events found.</p>
					) : (
						events.map((event) => (
							<li key={event.id} className="p-4">
								<h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
								<p className="text-gray-600">{event.location}</p>
								<p className="text-gray-600">{new Date(event.startTime).toLocaleString()}</p>
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
};
