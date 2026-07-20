/*
# Create contact_messages and leads tables (single-tenant, no auth)

## Purpose
Stores inbound messages from the portfolio contact form and email
subscriptions from the "Quiz Hub updates" lead-capture field. The site has no
sign-in screen, so the anon-key client must be able to INSERT. Reads are NOT
exposed to the anon client (only inserts), so visitors cannot enumerate other
people's messages.

## 1. New Tables

### contact_messages
- `id` (uuid, primary key)
- `name` (text, not null) — sender's name
- `email` (text, not null) — sender's email
- `message` (text, not null) — the message body
- `quiz_interest` (boolean, default false) — did the sender ask about the Quiz Hub
- `created_at` (timestamptz, default now())

### leads
- `id` (uuid, primary key)
- `email` (text, not null, unique) — subscriber email
- `source` (text, default 'portfolio') — where the lead came from
- `created_at` (timestamptz, default now())

## 2. Security (RLS)
- Both tables have RLS ENABLED.
- INSERT-only for `anon, authenticated` on both tables (visitors can submit
  but never read). No SELECT/UPDATE/DELETE policies are granted to anon, so
  the public client cannot list or modify stored messages/leads.
- This is intentionally public-write / private-read: the data is NOT shared
  publicly, but anyone must be able to submit. The absence of a SELECT policy
  for anon is the security boundary, not a `USING (true)` shortcut.

## 3. Important Notes
1. No `user_id` columns — single-tenant, no auth.
2. `leads.email` has a UNIQUE constraint so re-subscribing is idempotent.
3. No UPDATE/DELETE policies for anon — only the service-role key (server-side)
   can manage or read these rows.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  quiz_interest boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages"
ON contact_messages FOR INSERT
TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'portfolio',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads"
ON leads FOR INSERT
TO anon, authenticated WITH CHECK (true);
