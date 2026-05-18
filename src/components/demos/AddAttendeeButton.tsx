'use client';

import React from 'react';
import { trpc } from '@/lib/trpc/client';

export function AddAttendeeButton() {
	const [selectedEventId, setSelectedEventId] = React.useState('');
	const [discordId, setDiscordId] = React.useState('391510831050784774');

	const { data: events = [], isLoading: eventsLoading } = trpc.event.getAll.useQuery();

	const addAttendee = trpc.event.addAttendee.useMutation({
		onSuccess: () => alert('Successfully added attendee!'),
		onError: (err) => alert(`Failed to add attendee: ${err.message}`),
	});

	return (
		<div className="flex flex-col gap-3 mb-4 w-full max-w-sm">
			<select
				value={selectedEventId}
				onChange={(e) => setSelectedEventId(e.target.value)}
				className="px-3 py-2 rounded-md border border-ieee-grey bg-ieee-dark-grey text-white text-sm focus:outline-none focus:border-ieee-bright-yellow"
				disabled={eventsLoading}
			>
				<option value="" disabled>
					{eventsLoading ? 'Loading events...' : '-- Select an event --'}
				</option>
				{events.map((event) => (
					<option key={event.id} value={event.id}>
						{event.title}
					</option>
				))}
			</select>
			<input
				type="text"
				value={discordId}
				onChange={(e) => setDiscordId(e.target.value)}
				placeholder="Discord ID"
				className="px-3 py-2 rounded-md border border-ieee-grey bg-ieee-dark-grey text-white text-sm placeholder:text-ieee-grey focus:outline-none focus:border-ieee-bright-yellow"
			/>
			<button
				onClick={() => addAttendee.mutate({ eventId: selectedEventId, discordId })}
				disabled={addAttendee.isPending || !selectedEventId || !discordId}
				className="px-6 py-3 bg-ieee-dark-yellow hover:bg-ieee-bright-yellow text-black rounded-sm font-heading transition-colors disabled:bg-ieee-grey disabled:text-ieee-dark-grey disabled:cursor-not-allowed"
			>
				{addAttendee.isPending ? 'Adding...' : 'Add Test Attendee'}
			</button>
		</div>
	);
}
