'use client';
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { trpc } from '@/lib/trpc/client';

export const EventList = () => {
	const { data: events = [], isLoading } = trpc.event.getAll.useQuery();

	return (
		<Card className="w-full max-w-4xl mx-auto mt-8 rounded-xl bg-black shadow-sm shadow-[0_0_20px_rgba(250,204,21,0.5)] text-card-foreground flex flex-col p-6">
			<CardTitle className="text-2xl font-subheading -mb-2 text-white">
				Events
			</CardTitle>
			<CardContent>
				<div className="w-full max-w-4xl mx-auto">
					<ScrollArea className={`${events.length > 3 ? 'h-80' : ''} rounded-md border-ieee-grey`}>
						{isLoading ? (
							<p className="p-4 text-center text-ieee-white">Loading events...</p>
						) : events.length === 0 ? (
							<p className="p-4 text-center text-ieee-white">No events found.</p>
						) : (
							events.map((event) => (
								<Card key={event.id} className="rounded-md border-ieee-grey mb-4">
									<div className="p-4">
										<h3 className="text-xl font-semibold text-white">{event.title}</h3>
										<p className="text-ieee-light-grey">{event.location}</p>
										<p className="text-ieee-light-grey">{event.startTime}</p>
									</div>
								</Card>
							))
						)}
						<ScrollBar orientation="vertical" />
					</ScrollArea>
				</div>
			</CardContent>
		</Card>
	);
};