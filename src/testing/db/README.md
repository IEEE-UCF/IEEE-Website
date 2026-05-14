# Database Testing

## DB Setup

```bash
docker compose up --detach
bun seed.ts --wipe <db_url>
drizzle-kit generate --config drizzle.config.ts # (if schema changed)
drizzle-kit migrate --config drizzle.config.ts
bun seed.ts --all <db_url>
```

### Seed Script Flags

- `--wipe`: wipe all tables before seeding
- `--seed`: seed all tables (default)
- `--seed [comma-separated table names]`: seed only specified tables (e.g., `--seed members,events`)

## dbdiagram.io Code

**DBML for Database Diagram (dbdiagram.io)**

Copy and paste the code below into the editor at https://dbdiagram.io to generate a visual Entity-Relationship Diagram (ERD) of the database.

```dbml
// ==== Enums ====

enum officer_role_enum {
  executive_chair
  executive_vice_chair
  executive_secretary
  executive_treasurer
  committee_lead
}

enum permission_enum {
  scan_attendance
  view_statistics
  manage_context
}

enum gender_enum {
  M
  F
  NB
  O
  PNTS
}

enum sponsorship_tier_enum {
  bronze
  silver
  gold
}

enum event_host_type_enum {
  club
  committee
  project
  member
}


// ==== Tables ====

Table members {
  id uuid [pk]
  first_name varchar(255) [not null]
  middle_name varchar(255)
  last_name varchar(255) [not null]
  officer_role officer_role_enum
  administrator boolean [not null, default: false]
  biography text
  dues_paid boolean [not null, default: false]
  discord_id varchar(64) [not null, unique]
  date_of_birth date [not null]
  email varchar(255) [not null, unique]
  phone_number varchar(20)
  major varchar(255) [not null]
  gender gender_enum [not null]
  graduation_year integer [not null]
  portrait_url varchar(500)
  resume_url text
  linkedin_url text
  github_url text
  website_url text
  active boolean [not null, default: true]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table committees {
  id uuid [pk]
  title varchar(255) [not null]
  slug varchar(64) [unique]
  about text [not null]
  chair_id uuid [not null]
  discord_role_id varchar(64)
  active boolean [not null, default: true]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table committee_members {
  id uuid [pk]
  committee_id uuid [not null]
  member_id uuid [not null]
  is_chair boolean [not null, default: false]
  Note: 'Composite unique key on (committee_id, member_id)'
}

Table events {
  id uuid [pk]
  title varchar(255) [not null]
  location varchar(255) [not null]
  host_type event_host_type_enum [not null]
  host_id uuid
  slug varchar(64) [unique]
  start_time timestamp [not null]
  end_time timestamp
  requires_dues boolean [not null, default: false]
  active boolean [not null, default: true]
  description text [not null]
  flyer_url varchar(500)
  rsvp_link varchar(500)
  photo_urls text
  duration integer
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table event_attendees {
  id uuid [pk]
  event_id uuid [not null]
  member_id uuid [not null]
  timestamp timestamp [not null, default: `now()`]
  Note: 'Composite unique key on (event_id, member_id)'
}

Table projects {
  id uuid [pk]
  title varchar(255) [not null]
  slug varchar(64) [unique]
  overview text [not null]
  hardware_info text
  software_info text
  skills text
  photo_urls text
  discord_role_id varchar(64)
  active boolean [not null, default: true]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table project_members {
  id uuid [pk]
  project_id uuid [not null]
  member_id uuid [not null]
  is_lead boolean [not null, default: false]
  Note: 'Composite unique key on (project_id, member_id)'
}

Table sponsorships {
  id uuid [pk]
  company_name varchar(255) [not null]
  money_donated integer [not null]
  description text
  tier sponsorship_tier_enum [not null]
  company_logo_url varchar(500)
  website_url varchar(500)
  contact_email varchar(255) [not null]
  active boolean [not null, default: true]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}

Table member_permissions {
  id uuid [pk]
  member_id uuid [not null]
  granted_by_id uuid
  context_type varchar(32) [not null]
  context_id uuid
  permission permission_enum [not null]
  active boolean [not null, default: true]
  created_at timestamp [not null, default: `now()`]
  expires_at timestamp
  Note: 'Composite unique key on (member_id, context_type, context_id, permission)'
}


// ==== Relationships ====

Ref: committees.chair_id > members.id

Ref: committee_members.committee_id > committees.id
Ref: committee_members.member_id > members.id

Ref: event_attendees.event_id > events.id
Ref: event_attendees.member_id > members.id

Ref: project_members.project_id > projects.id
Ref: project_members.member_id > members.id

Ref: member_permissions.member_id > members.id
Ref: member_permissions.granted_by_id > members.id

Ref: events.host_id > committees.id
Ref: events.host_id > projects.id
Ref: events.host_id > members.id

Ref: member_permissions.context_id > committees.id
Ref: member_permissions.context_id > projects.id
```
