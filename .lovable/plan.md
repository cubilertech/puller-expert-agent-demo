

# Plan: Prepare for Real API Integration (Custom REST API)

## Overview

Introduce an API service layer that abstracts all data fetching behind clean interfaces. The app currently uses hardcoded demo data, simulated auth, and in-memory state. This plan creates a clean separation so you can swap in real API endpoints without touching UI components.

## Architecture

```text
┌─────────────────────────────────────────────────┐
│                  UI Components                   │
│  (TaskFeed, ContextThread, ArtifactEditor, etc.) │
└──────────────────────┬──────────────────────────┘
                       │
         ┌─────────────▼──────────────┐
         │   React Query Hooks        │
         │   src/hooks/api/           │
         │   - useTasks.ts            │
         │   - useTaskData.ts         │
         │   - useAuth.ts (updated)   │
         │   - useContextItems.ts     │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │   API Service Layer        │
         │   src/services/api/        │
         │   - client.ts  (fetch wrapper)
         │   - authApi.ts             │
         │   - tasksApi.ts            │
         │   - contextApi.ts          │
         │   - types.ts (API DTOs)    │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │   Config                   │
         │   src/config/api.ts        │
         │   - BASE_URL, USE_MOCK     │
         └────────────────────────────┘
```

## Files to Create

### 1. `src/config/api.ts` — API Configuration
- Exports `API_BASE_URL` from `import.meta.env.VITE_API_BASE_URL` with fallback to `""`.
- Exports `USE_MOCK_DATA` flag (`import.meta.env.VITE_USE_MOCK_DATA !== 'false'`) — defaults to `true` so the app keeps working with demo data until a real backend is connected.

### 2. `src/services/api/client.ts` — HTTP Client
- A thin `apiClient` wrapper around `fetch` that:
  - Prepends `API_BASE_URL`
  - Attaches `Authorization: Bearer <token>` from stored auth token
  - Sets `Content-Type: application/json`
  - Handles response parsing and error normalization
  - Exports typed `get`, `post`, `put`, `delete` methods

### 3. `src/services/api/types.ts` — API DTOs
- Request/response type definitions that map to the backend contract (separate from internal UI types).
- Includes: `LoginRequest`, `LoginResponse`, `TaskListResponse`, `TaskDetailResponse`, `ContextItemRequest`, `ContextItemResponse`, etc.

### 4. `src/services/api/authApi.ts` — Auth Service
- `login(email, password)` → POST `/auth/login` → returns `{ token, user }`
- `logout()` → POST `/auth/logout`
- `getSession()` → GET `/auth/session`
- When `USE_MOCK_DATA` is true, returns hardcoded demo credentials logic (current behavior).

### 5. `src/services/api/tasksApi.ts` — Tasks Service
- `fetchTasks()` → GET `/tasks`
- `fetchTaskById(id)` → GET `/tasks/:id` (returns task data with messages, code, annotations)
- `updateTaskStatus(id, status)` → PATCH `/tasks/:id/status`
- `sendToRequestor(id, message, assumptions)` → POST `/tasks/:id/send`
- When `USE_MOCK_DATA` is true, returns current demo data.

### 6. `src/services/api/contextApi.ts` — Context Hub Service
- `fetchContextItems()` → GET `/context`
- `addContextItem(item)` → POST `/context`
- `deleteContextItem(id)` → DELETE `/context/:id`
- `connectApi(config)` → POST `/context/connect`
- When `USE_MOCK_DATA` is true, returns current demo items.

### 7. `src/services/api/index.ts` — Barrel export

## Files to Create (React Query Hooks)

### 8. `src/hooks/api/useTasks.ts`
- `useTasksQuery()` — wraps `fetchTasks` with React Query, returns `{ data, isLoading, error }`
- `useTaskDataQuery(taskId)` — wraps `fetchTaskById`
- `useSendToRequestorMutation()` — wraps `sendToRequestor`
- When mock mode is on, returns current state from demo data instead of fetching.

### 9. `src/hooks/api/useContextItemsQuery.ts`
- `useContextItemsQuery()` — wraps `fetchContextItems`
- `useAddContextMutation()` — wraps `addContextItem`

### 10. `src/hooks/api/index.ts` — Barrel export

## Files to Modify

### 11. `src/hooks/useAuth.ts`
- Replace `sessionStorage` calls with `authApi.login()` / `authApi.logout()`.
- Store token from API response; attach to subsequent requests via the client.
- Keep backward-compatible interface (`isAuthenticated`, `userEmail`, `logout`, `requireAuth`).

### 12. `src/pages/Login.tsx`
- Replace inline credential check with `authApi.login(email, password)`.
- On success, store the returned token (used by `client.ts`).

### 13. `src/pages/Index.tsx`
- No changes initially. The simulation hook and demo data continue to work in mock mode.
- Add a comment/TODO showing where to swap `initialTasks` with `useTasksQuery()` when ready.

### 14. `src/hooks/useContextHub.ts`
- Add conditional: if `!USE_MOCK_DATA`, call `contextApi` methods instead of managing local state.
- Keep existing demo behavior as the default.

## Environment Variables

Add to project (via `.env` or Lovable secrets when connected to Cloud):

```
VITE_API_BASE_URL=https://your-api.example.com
VITE_USE_MOCK_DATA=true
```

## Technical Details

- **Zero breaking changes**: The `USE_MOCK_DATA` flag defaults to `true`, so the app works identically until a real backend URL is configured.
- **React Query** is already installed — used for caching, refetching, and loading/error states.
- **Token storage**: Use `localStorage` for the JWT token (read by `client.ts` on every request). The auth hook clears it on logout.
- **API error handling**: The client normalizes errors into `{ status, message }` objects that hooks can surface via toast notifications.
- **Type mapping**: API DTOs are converted to internal types (e.g., `Task`, `ContextItem`) at the service layer boundary, keeping UI components unchanged.

