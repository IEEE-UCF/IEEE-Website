'use client';

import { trpc } from '@/lib/trpc/client';

export function AddAttendeeButton() {
	const addAttendee = trpc.event.addAttendee.useMutation({
		onSuccess: () => alert('Successfully added attendee!'),
		onError: (err) => alert(`Failed to add attendee: ${err.message}`),
	});

	return (
		<button
			onClick={() =>
				addAttendee.mutate({
					eventId: 'be1af011-bfe8-46b5-a187-d43ed9322685',
					discordId: '391510831050784774',
				})
			}
			disabled={addAttendee.isPending}
			className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
		>
			Add Test Attendee
		</button>
	);
}
