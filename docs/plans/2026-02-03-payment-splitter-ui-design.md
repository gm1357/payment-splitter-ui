# Payment Splitter UI — Design

Group expense tracking app. Users create accounts, form groups, log shared expenses, and settle debts manually outside the app.

## API

Backend is a separate NestJS service running at a configurable `NEXT_PUBLIC_API_URL`. OpenAPI spec available at `/api-json`. Auth via JWT bearer tokens. All monetary amounts in cents.

**Domains:** Auth (login), User (CRUD + profile), Group (create/join/leave/members), Expense (create/list/CSV upload), Settlement (record/list), Balance (group balances + suggested settlements).

## Routing

- `/login` — login form
- `/register` — registration form
- `/dashboard` — list of user's groups (protected)
- `/groups/[id]` — group detail with tabs (protected)
- `/profile` — user profile editing (protected)
- `/join/[id]` — invite link landing page (redirects to login if unauthenticated)

## Project Layout

- `app/` — pages and layouts (Next.js App Router)
- `lib/api/` — API client functions by domain (auth, users, groups, expenses, settlements, balances)
- `lib/context/` — React contexts (auth)
- `components/` — shared UI components (Button, Input, Card, Modal, Tabs, MemberSelect)
- `components/[feature]/` — feature-specific components (GroupCard, ExpenseRow, BalanceTable)

No state management library. React context for auth, fetch-on-mount with `useState`/`useEffect` in pages.

## Auth Flow

**Register:** Centered card with name, email, password fields. On submit, `POST /user` then `POST /auth/login`, redirect to `/dashboard`.

**Login:** Email and password. On submit, `POST /auth/login`, store JWT, fetch `/user/profile` for auth context, redirect to `/dashboard`.

**Invite link (`/join/[id]`):** If unauthenticated, store group ID, redirect to `/login` or `/register`. After auth, automatically `POST /group/{id}/join` and redirect to `/groups/[id]`.

**AuthProvider:** Wraps the app. Exposes `user`, `token`, `login()`, `logout()`, `isLoading`. On mount, validates stored token by fetching `/user/profile`. Logout clears token and redirects.

**API client:** A `fetchApi()` helper that prepends `NEXT_PUBLIC_API_URL`, attaches bearer token, handles JSON. Domain modules (e.g., `lib/api/groups.ts`) export typed functions calling `fetchApi()`.

## Dashboard (`/dashboard`)

Top bar with app name, user info, and logout. Below:

- **Group list:** Vertical cards showing group name and user's net balance. Click navigates to `/groups/[id]`.
- **Create group:** "New Group" button opens modal with a name field. On submit, `POST /group`, redirect to new group.
- **Empty state:** "No groups yet" message with prominent create button.
- **Invite link:** Copyable `/join/{groupId}` link shown after group creation and within group detail.

## Group Detail (`/groups/[id]`)

Header with group name, member count, "Add Expense" button, and overflow menu (Copy Invite Link, Upload CSV, Leave Group).

### Expenses Tab (default)

List of expenses sorted by most recent: description, amount, who paid, split count. "Add Expense" modal with: description, amount (dollars input → cents), payer dropdown (defaults to current user), included members multi-select (defaults to all). Calls `POST /expense`.

CSV upload in overflow menu: file picker for `.csv`, calls `POST /expense/upload/{groupId}`.

### Balances Tab

Table from `/balance/group/{groupId}`: member name, total paid, total owed, net balance. Below, "Suggested Settlements" from `/balance/group/{groupId}/suggest` — "X pays Y $Z" items with "Settle" button that pre-fills the settlement modal.

### Settlements Tab

List from `/settlement/group/{groupId}`: from, to, amount, notes, date. "Record Settlement" modal: from member, to member, amount, optional notes. Calls `POST /settlement`.

## Profile (`/profile`)

Accessible from dashboard top bar. Shows name and email. Edit mode switches name to input (email read-only). Save calls `PATCH /user/{id}`.

## Shared Components

All styled with Tailwind, minimal and clean:

- **Button** — primary and secondary variants
- **Input** — with label and error state
- **Card** — container with subtle border
- **Modal** — centered overlay with backdrop
- **Tabs** — tab switcher for group detail
- **MemberSelect** — dropdown/multi-select for group members

## Environment

Single env var: `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:3000`).

## Money Formatting

`formatCents(amount: number): string` utility — `5000` → `$50.00`. User inputs in dollars, converted to cents before API calls.

## Style

Minimal and clean. Tailwind utility classes. Dark mode via `prefers-color-scheme`. Geist font family (already configured).
