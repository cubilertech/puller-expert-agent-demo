

# Plan: Create API Documentation and Backend Developer Handoff Document

## Overview

Create two markdown documents that give a backend developer everything needed to build the REST API that powers the Puller AI Command Center frontend.

## Files to Create

### 1. `API_DOCUMENTATION.md` — Full API Reference

Complete endpoint specification covering all three domains:

**Authentication (3 endpoints)**
- `POST /auth/login` — Email/password login, returns JWT + user object
- `POST /auth/logout` — Invalidate session (requires auth)
- `GET /auth/session` — Validate current token, return user

**Tasks (4 endpoints)**
- `GET /tasks` — List all tasks (with optional filters by status, priority, industry)
- `GET /tasks/:id` — Full task detail including messages, SQL code, annotations, table data, response message, assumptions
- `PATCH /tasks/:id/status` — Update task pipeline status
- `POST /tasks/:id/send` — Send response to requestor with selected assumptions

**Context Hub (4 endpoints)**
- `GET /context` — List all context items
- `POST /context` — Add a new context item (chat input, upload, screen recording)
- `DELETE /context/:id` — Remove a context item
- `POST /context/connect` — Register an external API connection

For each endpoint the document will include:
- Method and path
- Request headers (Authorization)
- Request body JSON schema with field types and constraints
- Response body JSON schema
- Error response format (`{ status, message }`)
- Example request/response pairs using realistic demo data

**Enums and constants** section documenting all valid values:
- Task statuses: `ingesting | asserting | planning | building | validating | generating | review | sent | approved | learning`
- Task sources: `email | slack | meeting`
- Priorities: `low | medium | high`
- Industry verticals: `retail-ecommerce | grocery-mass-merch | cpg-consumer-brands | hospitality-restaurants | fashion-shoes | media-entertainment`
- Sent statuses: `pending | viewed | awaiting_response`
- Context item types: `entity | rule | fact`
- Context sources: `upload | chat | api | screen-record`
- Context statuses: `pending | processed | error`
- SQL annotation types: `selection | source | aggregation | filter | grouping | ordering | expert`

### 2. `BACKEND_HANDOFF.md` — Developer Handoff Guide

Practical guide for the backend developer covering:

- **Project context**: What Puller AI does, how the frontend works, what the backend needs to serve
- **Architecture diagram**: Frontend service layer → API → Backend
- **Authentication requirements**: JWT-based auth, token format expectations, how the frontend stores/sends tokens
- **Data model overview**: Entity relationships (Tasks, Messages, Code, Annotations, Context Items, Users)
- **Task pipeline logic**: The 10-stage pipeline and what each status means, confidence threshold (80) triggering expert review
- **Environment setup**: The frontend expects `VITE_API_BASE_URL` and `VITE_USE_MOCK_DATA=false` to switch from demo to live
- **CORS requirements**: Frontend origin needs to be whitelisted
- **Error contract**: All errors must return `{ status: number, message: string }`
- **Frontend code references**: Pointers to `src/services/api/` files where the backend contract is consumed
- **Testing approach**: Set `VITE_USE_MOCK_DATA=false` and `VITE_API_BASE_URL` to test against the real backend — the frontend will automatically switch from demo data to live API calls

## No Existing Files Modified

These are standalone documentation files at the project root, alongside the existing `ARCHITECTURE.md` and `README.md`.

