# Database Schema Reference
#### Last Updated: November 18, 2025

This document provides a detailed reference for the IEEE-UCF website database schema. All schema definitions are maintained in `src/lib/database/schema.ts`.

---

## Table of Contents
- [Enums](#enums)
- [Tables](#tables)
  - [Authentication Tables](#authentication-tables)
  - [Member Tables](#member-tables)
  - [Committee Tables](#committee-tables)
  - [Event Tables](#event-tables)
  - [Project Tables](#project-tables)
  - [Sponsorship Tables](#sponsorship-tables)
  - [Permission Tables](#permission-tables)
- [Relationships](#relationships)
- [Indexes](#indexes)

---

## Enums

### `officer_role_enum`
Defines the various officer positions within the organization.

**Values:**
- `Executive Chair` - Top executive officer
- `Vice Chair` - Second-in-command
- `Treasurer` - Financial officer
- `Secretary` - Administrative officer
- `Project Chair` - Project management lead
- `Workshop Chair` - Workshop coordination lead
- `Conference Chair` - Conference organization lead
- `Outreach Chair` - Community outreach lead
- `Service Chair` - Service activities lead
- `Social Chair` - Social events lead
- `Professional Development Chair` - Career development lead
- `Marketing Chair` - Marketing and communications lead
- `Software Chair` - Software development lead

### `permission_enum`
Defines the types of permissions that can be granted to members.

**Values:**
- `scan_attendance` - Ability to scan QR codes and mark event attendance
- `view_statistics` - Ability to view analytics and statistics
- `manage_context` - Ability to manage committee/project settings

### `context_type_enum`
Defines the scope/context where permissions can be applied.

**Values:**
- `global` - System-wide permissions
- `committee` - Committee-specific permissions
- `project` - Project-specific permissions

### `gender_enum`
Gender identification options for member profiles.

**Values:**
- `M` - Male
- `F` - Female
- `NB` - Non-Binary
- `O` - Other
- `PNTS` - Prefer Not To Say

### `sponsorship_tier_enum`
Sponsorship levels for corporate sponsors.

**Values:**
- `Bronze` - Entry-level sponsorship
- `Silver` - Mid-tier sponsorship
- `Gold` - Premium sponsorship

### `event_host_type_enum`
Defines which entity is hosting an event.

**Values:**
- `club` - Event hosted by the club organization
- `committee` - Event hosted by a specific committee
- `project` - Event hosted by a project team
- `member` - Event hosted by an individual member

---

## Tables

### Authentication Tables

#### `users`
_NextAuth.js authentication users - stores OAuth login information._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique user identifier |
| `name` | `text` | | Display name from OAuth provider |
| `email` | `varchar(255)` | Not Null, Unique | User's email address |
| `email_verified` | `timestamp` | | Email verification timestamp |
| `image` | `text` | | Profile image URL from Discord |
| `discordID` | `varchar(64)` | Unique | Discord user ID |

**Indexes:**
- `users_idx_id` on `id`
- `users_idx_discord_id` on `discordID`

**Relationships:**
- Has one `members` record (1:1 relationship via `user_id`)

---

#### `accounts`
_NextAuth.js OAuth account information._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique account identifier |
| `user_id` | `uuid` | Not Null, FK → `users.id` | Associated user |
| `type` | `varchar(255)` | Not Null | Account type (e.g., "oauth") |
| `provider` | `varchar(255)` | Not Null | OAuth provider name (e.g., "discord") |
| `provider_account_id` | `varchar(255)` | Not Null | Provider's user ID |
| `refresh_token` | `text` | | OAuth refresh token |
| `access_token` | `text` | | OAuth access token |
| `expires_at` | `integer` | | Token expiration timestamp |
| `token_type` | `varchar(255)` | | Token type (e.g., "Bearer") |
| `scope` | `varchar(255)` | | OAuth scope |
| `id_token` | `text` | | JWT ID token |
| `session_state` | `varchar(255)` | | OAuth session state |

**Relationships:**
- Belongs to `users` via `user_id`

---

#### `sessions`
_NextAuth.js session management._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `session_token` | `varchar(255)` | Primary Key | Unique session token |
| `user_id` | `uuid` | Not Null, FK → `users.id` | Associated user |
| `expires` | `timestamp` | Not Null | Session expiration timestamp |

**Relationships:**
- Belongs to `users` via `user_id`

---

### Member Tables

#### `members`
_Core member information and profiles._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique member identifier |
| `user_id` | `uuid` | Not Null, Unique, FK → `users.id` | Associated authentication user (1:1) |
| `first_name` | `varchar(255)` | Not Null | Member's first name |
| `middle_name` | `varchar(255)` | | Member's middle name |
| `last_name` | `varchar(255)` | Not Null | Member's last name |
| `officer_role` | `officer_role_enum` | | Officer position (if applicable) |
| `administrator` | `boolean` | Not Null, Default: `false` | System administrator flag |
| `officer_status` | `boolean` | Not Null, Default: `false` | Current officer status |
| `biography` | `text` | | Member biography/description |
| `dues_paid` | `boolean` | Not Null, Default: `false` | Membership dues payment status |
| `discordID` | `varchar(64)` | Unique | Discord user ID |
| `date_of_birth` | `date` | Not Null | Date of birth |
| `personal_email` | `varchar(255)` | Not Null, Unique | Personal email address |
| `ucf_email` | `varchar(255)` | Not Null, Unique | UCF student email |
| `phone_number` | `varchar(20)` | | Contact phone number |
| `major` | `varchar(255)` | Not Null | Academic major |
| `gender` | `gender_enum` | Not Null | Gender identification |
| `graduation_year` | `integer` | Not Null | Expected graduation year |
| `portrait_url` | `varchar(500)` | | Profile photo URL |
| `resume_url` | `text` | | Resume/CV URL |
| `linkedin_url` | `text` | | LinkedIn profile URL |
| `github_url` | `text` | | GitHub profile URL |
| `website_url` | `text` | | Personal website URL |
| `active` | `boolean` | Not Null, Default: `true` | Active membership status |
| `created_at` | `timestamp` | Not Null, Default: `now()` | Record creation timestamp |
| `updated_at` | `timestamp` | Not Null, Default: `now()` | Last update timestamp |

**Indexes:**
- `members_idx_id` on `id`
- `members_idx_user_id` on `user_id`
- `members_idx_discordID` on `discordID`
- `members_idx_personal_email` on `personal_email`
- `members_idx_ucf_email` on `ucf_email`
- `members_idx_officer_status` on `officer_status`
- `members_idx_officer_role` on `officer_role`
- `members_idx_administrator` on `administrator`
- `members_idx_dues_paid` on `dues_paid`
- `members_idx_graduation_year` on `graduation_year`
- `members_idx_major` on `major`
- `members_idx_gender` on `gender`
- `members_idx_created_at` on `created_at`
- `members_idx_updated_at` on `updated_at`
- `members_idx_full_name` on `(first_name, last_name)`

**Relationships:**
- Belongs to one `users` record via `user_id` (1:1)
- Has many `committee_members` records
- Has many `project_members` records
- Has many `event_attendees` records
- Has many `member_permissions` records
- Can scan attendance for other members via `event_attendees.scanner_id`

---

### Committee Tables

#### `committees`
_Organization committees (e.g., Software, Workshop, etc.)._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique committee identifier |
| `title` | `varchar(255)` | Not Null | Committee name |
| `slug` | `varchar(64)` | Unique | URL-friendly identifier |
| `about` | `text` | Not Null | Committee description |
| `discord_role_id` | `varchar(64)` | | Associated Discord role ID |
| `active` | `boolean` | Not Null, Default: `true` | Active status |
| `created_at` | `timestamp` | Not Null, Default: `now()` | Record creation timestamp |
| `updated_at` | `timestamp` | Not Null, Default: `now()` | Last update timestamp |

**Indexes:**
- `committees_idx_id` on `id`
- `committees_idx_title` on `title`
- `committees_idx_slug` on `slug`
- `committees_idx_created_at` on `created_at`
- `committees_idx_updated_at` on `updated_at`

**Relationships:**
- Has many `committee_members` records
- Can host `events` (polymorphic via `host_type` = 'committee')

---

#### `committee_members`
_Junction table linking members to committees._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique record identifier |
| `committee_id` | `uuid` | Not Null, FK → `committees.id` | Committee reference |
| `member_id` | `uuid` | Not Null, FK → `members.id` | Member reference |
| `is_chair` | `boolean` | Not Null, Default: `false` | Committee chair status |

**Indexes:**
- `committee_members_idx_id` on `id`
- `committee_members_idx_committee_id` on `committee_id`
- `committee_members_idx_member_id` on `member_id`
- `committee_members_idx_is_chair` on `is_chair`

**Unique Constraints:**
- `(committee_id, member_id)` - A member can only join a committee once

**Relationships:**
- Belongs to `committees` via `committee_id`
- Belongs to `members` via `member_id`

---

### Event Tables

#### `events`
_Events hosted by the organization._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique event identifier |
| `title` | `varchar(255)` | Not Null | Event title |
| `location` | `varchar(255)` | Not Null | Event location |
| `host_type` | `event_host_type_enum` | Not Null, Default: `'committee'` | Type of host entity |
| `host_id` | `uuid` | | Polymorphic FK to host entity |
| `slug` | `varchar(64)` | Unique | URL-friendly identifier |
| `start_time` | `timestamp` | Not Null | Event start time |
| `end_time` | `timestamp` | | Event end time |
| `requires_dues` | `boolean` | Not Null, Default: `false` | Requires paid dues for attendance |
| `active` | `boolean` | Not Null, Default: `true` | Active status |
| `description` | `text` | Not Null | Event description |
| `flyer_url` | `varchar(500)` | | Event flyer image URL |
| `rsvp_link` | `varchar(500)` | | RSVP/registration link |
| `photo_urls` | `text` | | Comma-separated photo URLs |
| `created_at` | `timestamp` | Not Null, Default: `now()` | Record creation timestamp |
| `updated_at` | `timestamp` | Not Null, Default: `now()` | Last update timestamp |

**Indexes:**
- `events_idx_id` on `id`
- `events_idx_host` on `(host_type, host_id)`
- `events_idx_start_time` on `start_time` (ascending)
- `events_idx_time_desc` on `start_time` (descending)
- `events_idx_title` on `title`
- `events_idx_location` on `location`
- `events_idx_created_at` on `created_at`
- `events_idx_updated_at` on `updated_at`

**Relationships:**
- Has many `event_attendees` records
- Hosted by polymorphic entity via `(host_type, host_id)`

---

#### `event_attendees`
_Junction table tracking event attendance with QR code scanning info._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique record identifier |
| `event_id` | `uuid` | Not Null, FK → `events.id` | Event reference |
| `member_id` | `uuid` | Not Null, FK → `members.id` | Attending member |
| `scanner_id` | `uuid` | FK → `members.id` (nullable) | Member who scanned QR code |
| `timestamp` | `timestamp` | Not Null, Default: `now()` | Attendance timestamp |

**Indexes:**
- `event_attendees_idx_id` on `id`
- `event_attendees_idx_event_id` on `event_id`
- `event_attendees_idx_member_id` on `member_id`
- `event_attendees_idx_scanner_id` on `scanner_id`
- `event_attendees_idx_timestamp` on `timestamp`

**Unique Constraints:**
- `(event_id, member_id)` - A member can only attend an event once

**Relationships:**
- Belongs to `events` via `event_id`
- Belongs to `members` via `member_id` (attendee)
- Belongs to `members` via `scanner_id` (scanner, nullable)

---

### Project Tables

#### `projects`
_Student projects undertaken by the organization._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique project identifier |
| `title` | `varchar(255)` | Not Null | Project name |
| `slug` | `varchar(64)` | Unique | URL-friendly identifier |
| `overview` | `text` | Not Null | Project description |
| `hardware_info` | `text` | | Hardware specifications/requirements |
| `software_info` | `text` | | Software stack information |
| `skills` | `text` | | Required/learned skills (comma-separated) |
| `photo_urls` | `text` | | Project photo URLs (array) |
| `discord_role_id` | `varchar(64)` | | Associated Discord role ID |
| `active` | `boolean` | Not Null, Default: `true` | Active status |
| `created_at` | `timestamp` | Not Null, Default: `now()` | Record creation timestamp |
| `updated_at` | `timestamp` | Not Null, Default: `now()` | Last update timestamp |

**Indexes:**
- `projects_idx_id` on `id`
- `projects_idx_title` on `title`
- `projects_idx_slug` on `slug`
- `projects_idx_created_at` on `created_at`
- `projects_idx_updated_at` on `updated_at`

**Relationships:**
- Has many `project_members` records
- Can host `events` (polymorphic via `host_type` = 'project')

---

#### `project_members`
_Junction table linking members to projects._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique record identifier |
| `project_id` | `uuid` | Not Null, FK → `projects.id` | Project reference |
| `member_id` | `uuid` | Not Null, FK → `members.id` | Member reference |
| `is_lead` | `boolean` | Not Null, Default: `false` | Project lead status |

**Indexes:**
- `project_members_idx_id` on `id`
- `project_members_idx_project_id` on `project_id`
- `project_members_idx_member_id` on `member_id`
- `project_members_idx_is_lead` on `is_lead`

**Unique Constraints:**
- `(project_id, member_id)` - A member can only join a project once

**Relationships:**
- Belongs to `projects` via `project_id`
- Belongs to `members` via `member_id`

---

### Sponsorship Tables

#### `sponsorships`
_Corporate sponsors and their contribution details._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique sponsorship identifier |
| `company_name` | `varchar(255)` | Not Null | Company name |
| `money_donated` | `integer` | Not Null | Donation amount (cents) |
| `description` | `text` | | Sponsorship description |
| `tier` | `sponsorship_tier_enum` | Not Null | Sponsorship tier level |
| `company_logo_url` | `varchar(500)` | | Company logo image URL |
| `website_url` | `varchar(500)` | | Company website URL |
| `contact_email` | `varchar(255)` | Not Null | Contact email address |
| `active` | `boolean` | Not Null, Default: `true` | Active sponsorship status |
| `created_at` | `timestamp` | Not Null, Default: `now()` | Record creation timestamp |
| `updated_at` | `timestamp` | Not Null, Default: `now()` | Last update timestamp |

**Indexes:**
- `sponsorships_idx_id` on `id`
- `sponsorships_idx_company_name` on `company_name`
- `sponsorships_idx_tier` on `tier`
- `sponsorships_idx_created_at` on `created_at`
- `sponsorships_idx_updated_at` on `updated_at`

---

### Permission Tables

#### `member_permissions`
_Granular permission management for members in specific contexts._

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, Default: `random()` | Unique permission identifier |
| `member_id` | `uuid` | Not Null, FK → `members.id` | Member receiving permission |
| `granted_by_id` | `uuid` | FK → `members.id` (nullable) | Member who granted permission |
| `context_type` | `context_type_enum` | Not Null | Permission scope (global/committee/project) |
| `context_id` | `uuid` | | Polymorphic FK to context entity |
| `permission` | `permission_enum` | Not Null | Type of permission granted |
| `active` | `boolean` | Not Null, Default: `true` | Active permission status |
| `created_at` | `timestamp` | Not Null, Default: `now()` | Permission grant timestamp |
| `expires_at` | `timestamp` | | Optional expiration timestamp |

**Indexes:**
- `member_permissions_idx_member` on `member_id`
- `member_permissions_idx_context` on `(context_type, context_id)`

**Unique Constraints:**
- `(member_id, context_type, context_id, permission)` - Prevents duplicate permissions

**Relationships:**
- Belongs to `members` via `member_id` (permission holder)
- Belongs to `members` via `granted_by_id` (granter, nullable)
- Polymorphic relationship to context entity via `(context_type, context_id)`

---

## Relationships

### Key Relationship Patterns

#### One-to-One
- `users` ↔ `members` via `user_id` - Each auth user has exactly one member profile

#### One-to-Many
- `users` → `accounts` - A user can have multiple OAuth accounts
- `users` → `sessions` - A user can have multiple active sessions
- `members` → `committee_members` - A member can be in multiple committees
- `members` → `project_members` - A member can be in multiple projects
- `members` → `event_attendees` - A member can attend multiple events
- `members` → `member_permissions` - A member can have multiple permissions
- `members` → `event_attendees` (as scanner) - A member can scan multiple attendees
- `committees` → `committee_members` - A committee has multiple members
- `projects` → `project_members` - A project has multiple members
- `events` → `event_attendees` - An event has multiple attendees

#### Polymorphic Relationships
- **Event Hosts**: `events.host_id` references different tables based on `events.host_type`
  - `'club'` → General organization events
  - `'committee'` → `committees.id`
  - `'project'` → `projects.id`
  - `'member'` → `members.id`

- **Permission Context**: `member_permissions.context_id` references different tables based on `context_type`
  - `'global'` → System-wide permission (context_id is NULL)
  - `'committee'` → `committees.id`
  - `'project'` → `projects.id`

---

## Indexes

The schema includes comprehensive indexing for optimal query performance:

### Primary Key Indexes
All tables use UUID primary keys with default B-tree indexes.

### Foreign Key Indexes
All foreign key columns are indexed for efficient joins and cascading operations.

### Query Optimization Indexes
- **Full-text search**: `members_idx_full_name` on `(first_name, last_name)`
- **Temporal queries**: Multiple indexes on timestamp columns (`created_at`, `updated_at`, `start_time`)
- **Filtering**: Indexes on commonly filtered columns (`active`, `dues_paid`, `tier`, etc.)
- **Polymorphic relationships**: Composite indexes on `(type, id)` pairs
- **Event ordering**: Dual indexes on `start_time` (ascending and descending) for different query patterns

### Unique Constraints
- **Natural keys**: Email addresses, Discord IDs, slugs
- **Junction tables**: Composite unique constraints prevent duplicate memberships/attendance
- **Permission system**: Prevents duplicate permission grants

---

## Notes

### Cascade Behaviors
- **ON DELETE CASCADE**: Deleting a user/member automatically removes all related records
- **ON DELETE SET NULL**: Deleting a scanner/granter preserves attendance/permission records but nullifies the reference

### Timestamp Management
- All `updated_at` fields automatically update via `$onUpdate(() => sql\`now()\`)` trigger
- `created_at` fields are immutable and set on record creation

### Data Types
- **UUIDs**: Used for all primary keys and foreign keys for security and scalability
- **Enums**: Enforced at database level for data integrity
- **Text vs Varchar**: Text used for unlimited content, varchar for constrained fields
