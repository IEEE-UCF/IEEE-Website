"use client";
import React, { useState, useEffect } from 'react';
import { type Event } from '@/lib/database/schema';

export const EventList = () => {
	const [events, setEvents] = useState<Event[]>([]);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch('/api/events');
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
		<div className="w-full max-w-4xl mx-auto mt-8">
			<h2 className="text-2xl font-bold mb-4 text-white">Events</h2>
			<ul className="bg-white rounded-lg shadow-lg overflow-hidden">
				{events.map((event) => (
					<li key={event.id} className="p-4 border-b border-gray-200 last:border-b-0">
						<h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
						<p className="text-gray-600">{event.location}</p>
						<p className="text-gray-600">{new Date(event.startTime).toLocaleString()}</p>
					</li>
				))}
			</ul>
		</div>
	);
};
