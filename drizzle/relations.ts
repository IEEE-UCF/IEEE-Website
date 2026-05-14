import { relations } from 'drizzle-orm/relations';
import {
	members,
	committees,
	committeeMembers,
	projects,
	projectMembers,
	events,
	users,
	eventAttendees,
	sessions,
	accounts,
	memberPermissions,
} from './schema';

export const committeesRelations = relations(committees, ({ one, many }) => ({
	member: one(members, {
		fields: [committees.chairId],
		references: [members.id],
	}),
	committeeMembers: many(committeeMembers),
	events: many(events),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
	committees: many(committees),
	committeeMembers: many(committeeMembers),
	projectMembers: many(projectMembers),
	user: one(users, {
		fields: [members.userId],
		references: [users.id],
	}),
	eventAttendees: many(eventAttendees),
	memberPermissions_memberId: many(memberPermissions, {
		relationName: 'memberPermissions_memberId_members_id',
	}),
	memberPermissions_grantedById: many(memberPermissions, {
		relationName: 'memberPermissions_grantedById_members_id',
	}),
}));

export const committeeMembersRelations = relations(committeeMembers, ({ one }) => ({
	committee: one(committees, {
		fields: [committeeMembers.committeeId],
		references: [committees.id],
	}),
	member: one(members, {
		fields: [committeeMembers.memberId],
		references: [members.id],
	}),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
	project: one(projects, {
		fields: [projectMembers.projectId],
		references: [projects.id],
	}),
	member: one(members, {
		fields: [projectMembers.memberId],
		references: [members.id],
	}),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
	projectMembers: many(projectMembers),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
	committee: one(committees, {
		fields: [events.committeeId],
		references: [committees.id],
	}),
	eventAttendees: many(eventAttendees),
}));

export const usersRelations = relations(users, ({ many }) => ({
	members: many(members),
	sessions: many(sessions),
	accounts: many(accounts),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
	event: one(events, {
		fields: [eventAttendees.eventId],
		references: [events.id],
	}),
	member: one(members, {
		fields: [eventAttendees.memberId],
		references: [members.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const memberPermissionsRelations = relations(memberPermissions, ({ one }) => ({
	member_memberId: one(members, {
		fields: [memberPermissions.memberId],
		references: [members.id],
		relationName: 'memberPermissions_memberId_members_id',
	}),
	member_grantedById: one(members, {
		fields: [memberPermissions.grantedById],
		references: [members.id],
		relationName: 'memberPermissions_grantedById_members_id',
	}),
}));
