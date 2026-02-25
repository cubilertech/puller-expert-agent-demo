# Puller AI — Backend Developer Handoff Guide

> Everything you need to build the REST API that powers the Puller AI Command Center.

---

## 1. Project Context

**Puller AI** is an AI-powered data analytics command center. Business users submit data requests (via email, Slack, or meetings), and the system autonomously generates SQL queries, data previews, and human-readable responses. An expert analyst reviews and approves outputs before they're sent back.

The **frontend** is a React/TypeScript SPA that currently runs entirely on demo data. Your job is to build the **backend REST API** so the frontend can operate against real data.

---

## 2. Architecture

```
┌───────────────────────────────────────────────┐
│              React Frontend (SPA)              │
│  Vite + React 18 + TypeScript + Tailwind CSS  │
└──────────────────────┬────────────────────────┘
                       │  HTTPS / JSON
         ┌─────────────▼──────────────┐
         │   src/services/api/        │  ← Frontend service layer
         │   client.ts  (fetch + JWT) │    (your API contract)
         │   authApi.ts               │
         │   tasksApi.ts              │
         │   contextApi.ts            │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │     Your REST API          │
         │     (any language/stack)   │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │     Database + Services    │
         └────────────────────────────┘
```

---

## 3. Authentication

### Flow

1. User submits email + password on the login page
2. Frontend calls `POST /auth/login` with `{ email, password }`
3. Backend validates credentials, returns `{ token, user }`
4. Frontend stores the JWT in `localStorage` under key `puller_auth_token`
5. All subsequent requests include `Authorization: Bearer <token>`
6. On logout, frontend calls `POST /auth/logout` and clears the stored token

### Token Requirements

- Format: Standard JWT (HS256 or RS256)
- The frontend does **not** decode the token — it's treated as an opaque string
- Token expiry is up to you; the frontend will surface 401 errors to the user
- `GET /auth/session` should validate the token and return the user object

---

## 4. Data Model

### Entity Relationships

```
User
 └── has many Tasks (as requestor or assigned expert)

Task
 ├── has many ChatMessages (conversation thread)
 ├── has many CodeDiff lines (generated SQL with diff tracking)
 ├── has many SqlAnnotations (code explanations)
 ├── has many Assumptions (things the AI assumed)
 ├── has TableColumns + TableData (data preview)
 ├── has responseMessage (draft response text)
 └── has knowledgeUpdate (what was learned)

ContextItem (knowledge base)
 └── standalone entity, linked to organization/user
```

### Task Table

| Column             | Type      | Notes                                           |
|--------------------|-----------|--------------------------------------------------|
| id                 | string PK | e.g. `retail-1`, `grocery-2`                    |
| title              | string    |                                                  |
| requestor          | string    | Name and role, e.g. "Sarah Chen (VP Sales)"     |
| status             | enum      | See pipeline stages below                        |
| timestamp          | datetime  | When the task was created                        |
| priority           | enum      | `low`, `medium`, `high`                          |
| description        | text      | Full request description                         |
| source             | enum      | `email`, `slack`, `meeting`                      |
| flags_urgency      | boolean   |                                                  |
| flags_human_requested | boolean |                                                  |
| flags_vip          | boolean   |                                                  |
| confidence         | integer   | 0–100                                            |
| industry           | enum      | Optional industry vertical                       |
| sent_status        | enum      | `pending`, `viewed`, `awaiting_response` or null |
| sent_at            | datetime  | Nullable                                         |
| requestor_feedback | enum      | `positive`, `negative`, or null                  |

### ChatMessage Table

| Column     | Type      | Notes                          |
|------------|-----------|--------------------------------|
| id         | string PK |                                |
| task_id    | string FK | References Task                |
| sender     | enum      | `user`, `agent`, `system`      |
| content    | text      |                                |
| timestamp  | datetime  |                                |
| type       | enum      | `text`, `reasoning`, `action`  |
| assumptions| json      | Array of strings (optional)    |

### CodeDiff Table

| Column      | Type      | Notes                           |
|-------------|-----------|----------------------------------|
| task_id     | string FK | References Task                  |
| line_number | integer   |                                  |
| type        | enum      | `unchanged`, `added`, `removed`  |
| content     | text      |                                  |

### SqlAnnotation Table

| Column      | Type      | Notes                                                     |
|-------------|-----------|-----------------------------------------------------------|
| task_id     | string FK | References Task                                           |
| line_start  | integer   |                                                           |
| line_end    | integer   |                                                           |
| title       | string    |                                                           |
| description | text      |                                                           |
| type        | enum      | `selection`, `source`, `aggregation`, `filter`, `grouping`, `ordering`, `expert` |

### ContextItem Table

| Column    | Type      | Notes                                      |
|-----------|-----------|--------------------------------------------|
| id        | string PK |                                            |
| type      | enum      | `entity`, `rule`, `fact`                   |
| source    | enum      | `upload`, `chat`, `api`, `screen-record`   |
| content   | text      |                                            |
| metadata  | json      | Arbitrary key-value pairs                  |
| timestamp | datetime  |                                            |
| status    | enum      | `pending`, `processed`, `error`            |

---

## 5. Task Pipeline Logic

Tasks move through a 10-stage pipeline. The frontend displays these as visual progress stages.

```
ingesting → asserting → planning → building → validating → generating → review → sent → approved → learning
```

| Stage        | What Happens                                                    |
|--------------|-----------------------------------------------------------------|
| `ingesting`  | Parse and understand the incoming request                       |
| `asserting`  | Identify assumptions, constraints, and required context         |
| `planning`   | Build the execution plan (which tables, joins, etc.)            |
| `building`   | Generate the SQL query                                          |
| `validating` | Run checks — syntax, data availability, result sanity           |
| `generating` | Create the human-readable response and data preview             |
| `review`     | **Expert review** — triggered when `confidence < 80`            |
| `sent`       | Response has been sent to the requestor                         |
| `approved`   | Requestor confirmed the response is correct                     |
| `learning`   | System updates its knowledge base from this interaction         |

### Confidence Threshold

- The constant `CONFIDENCE_THRESHOLD = 80` is defined in the frontend
- Tasks with `confidence >= 80` can skip `review` and go directly to `sent`
- Tasks with `confidence < 80` stop at `review` for human expert intervention

---

## 6. Environment Setup

The frontend reads two environment variables to switch between demo and live mode:

| Variable              | Default  | Description                                     |
|-----------------------|----------|-------------------------------------------------|
| `VITE_API_BASE_URL`   | `""`     | Your API's base URL (e.g. `https://api.puller.ai`) |
| `VITE_USE_MOCK_DATA`  | `true`   | Set to `false` to enable real API calls         |

### To test against your backend:

1. Set `VITE_USE_MOCK_DATA=false`
2. Set `VITE_API_BASE_URL=https://your-api-url.com`
3. The frontend will automatically call your API instead of using demo data

No code changes are needed — the service layer handles the branching.

---

## 7. CORS Requirements

The frontend is a SPA served from a different origin. Your API must include CORS headers:

```
Access-Control-Allow-Origin: <frontend_origin>
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

For development, you may use `*` for the origin, but restrict it in production.

---

## 8. Error Contract

**All errors** must return this shape:

```json
{
  "status": 401,
  "message": "Invalid email or password"
}
```

The frontend's HTTP client (`src/services/api/client.ts`) parses errors by:
1. Checking `res.ok`
2. Attempting to read `message` from the JSON body
3. Falling back to `res.statusText`

Consistent error formatting ensures the UI can display meaningful messages.

---

## 9. Frontend Code References

These are the files that define the API contract on the frontend side:

| File                                  | Purpose                                       |
|---------------------------------------|-----------------------------------------------|
| `src/config/api.ts`                   | Base URL and mock-mode configuration          |
| `src/services/api/client.ts`          | Fetch wrapper with auth headers               |
| `src/services/api/types.ts`           | TypeScript DTOs (request/response shapes)     |
| `src/services/api/authApi.ts`         | Auth endpoints with mock fallback             |
| `src/services/api/tasksApi.ts`        | Task endpoints with DTO converters            |
| `src/services/api/contextApi.ts`      | Context Hub endpoints                         |
| `src/services/api/index.ts`           | Barrel exports                                |
| `src/hooks/api/useTasks.ts`           | React Query hooks for tasks                   |
| `src/hooks/api/useContextItemsQuery.ts` | React Query hooks for context items         |
| `src/types/index.ts`                  | Internal UI types (converted from API DTOs)   |

---

## 10. Testing Checklist

Use this checklist to verify your API works with the frontend:

- [ ] **Login**: `POST /auth/login` returns `{ token, user }` — frontend stores token and redirects to dashboard
- [ ] **Session**: `GET /auth/session` returns `{ authenticated: true, user }` with valid token
- [ ] **Task list**: `GET /tasks` returns `{ tasks: [...] }` — tasks appear in the Task Feed
- [ ] **Task detail**: `GET /tasks/:id` returns full detail — clicking a task shows messages, code, data preview
- [ ] **Status update**: `PATCH /tasks/:id/status` updates the task — pipeline stage changes in UI
- [ ] **Send response**: `POST /tasks/:id/send` — task moves to `sent` status with timestamp
- [ ] **Context list**: `GET /context` returns `{ items: [...] }` — items appear in Context Hub
- [ ] **Add context**: `POST /context` returns created item — new item appears in the list
- [ ] **Delete context**: `DELETE /context/:id` — item removed from the list
- [ ] **API connect**: `POST /context/connect` — connection registered without error
- [ ] **Logout**: `POST /auth/logout` — session invalidated, frontend redirects to login
- [ ] **Error handling**: Invalid requests return `{ status, message }` — errors display as toast notifications

---

## 11. Quick Start

```bash
# 1. Clone the frontend
git clone <repo-url>
cd puller-ai

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_API_BASE_URL=http://localhost:3001" >> .env
echo "VITE_USE_MOCK_DATA=false" >> .env

# 4. Start frontend
npm run dev

# 5. Start your API on port 3001
# The frontend will now make real API calls
```

---

## Questions?

Refer to `API_DOCUMENTATION.md` for the complete endpoint specification with request/response examples, and `ARCHITECTURE.md` for the full frontend architecture overview.
