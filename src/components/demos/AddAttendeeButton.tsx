'use client';

import React from 'react';

export function AddAttendeeButton() {
	const handleAddAttendee = async () => {
		try {
			const response = await fetch('/api/events/addEventAttendee', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					eventId: 'be1af011-bfe8-46b5-a187-d43ed9322685',
					discordId: '391510831050784774',
				}),
			});

			const result = await response.json();

			if (result.success) {
				alert('Successfully added attendee!');
			} else {
				alert(`Failed to add attendee: ${result.error}`);
			}
		} catch (error) {
			console.error('Error adding event attendee:', error);
			alert('An error occurred while adding the attendee.');
		}
	};

	return (
		<button
			onClick={handleAddAttendee}
			className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
		>
			Add Test Attendee
		</button>
	);
}
