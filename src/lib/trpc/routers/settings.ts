import { z } from 'zod';
import { createTRPCRouter, adminProcedure, officerProcedure } from '../trpc';
import {
	getOfficerGrantableCapabilities,
	setOfficerGrantableCapabilities,
} from '@/lib/settings';
import { OFFICER_DELEGABLE_CAPABILITIES } from '@/lib/permissions';

export const settingsRouter = createTRPCRouter({
	/**
	 * Which capabilities officers are currently allowed to grant to plain members.
	 * Readable by any staff member (officers need it to know what they can toggle).
	 */
	officerGrantableCapabilities: officerProcedure.query(async () => ({
		delegable: [...OFFICER_DELEGABLE_CAPABILITIES],
		enabled: await getOfficerGrantableCapabilities(),
	})),

	/** Admin-only: set the officer-delegable capability allow-list. */
	setOfficerGrantableCapabilities: adminProcedure
		.input(z.object({ capabilities: z.array(z.string().max(64)) }))
		.mutation(async ({ input }) => ({
			enabled: await setOfficerGrantableCapabilities(input.capabilities),
		})),
});
