# Puller AI — REST API Documentation

> **Version**: 1.0  
> **Base URL**: Configured via `VITE_API_BASE_URL` environment variable  
> **Content-Type**: `application/json` (all requests and responses)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Tasks](#2-tasks)
3. [Context Hub](#3-context-hub)
4. [Enums & Constants](#4-enums--constants)
5. [Error Handling](#5-error-handling)

---

## 1. Authentication

All authenticated endpoints require the header:

```
Authorization: Bearer <jwt_token>
```

The token is obtained from `POST /auth/login` and stored in `localStorage` under the key `puller_auth_token`.

---

### POST /auth/login

Authenticate a user with email and password.

**Request Body**

| Field      | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| `email`    | string | ✅       | User's email address |
| `password` | string | ✅       | User's password      |

```json
{
  "email": "zac@puller.ai",
  "password": "123456"
}
```

**Response `200 OK`**

| Field        | Type   | Description              |
|--------------|--------|--------------------------|
| `token`      | string | JWT bearer token         |
| `user.id`    | string | User's unique identifier |
| `user.email` | string | User's email             |
| `user.name`  | string | User's display name (optional) |

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr_01",
    "email": "zac@puller.ai",
    "name": "Zac"
  }
}
```

**Error `401`**

```json
{
  "status": 401,
  "message": "Invalid email or password. Please try again."
}
```

---

### POST /auth/logout

Invalidate the current session. **Requires auth.**

**Request Body**: None

**Response `204 No Content`**: Empty body

---

### GET /auth/session

Validate the current token and return the associated user. **Requires auth.**

**Response `200 OK`**

| Field           | Type    | Description                     |
|-----------------|---------|---------------------------------|
| `authenticated` | boolean | Whether the token is valid      |
| `user`          | object \| null | User object if authenticated |

```json
{
  "authenticated": true,
  "user": {
    "id": "usr_01",
    "email": "zac@puller.ai",
    "name": "Zac"
  }
}
```

Unauthenticated response:

```json
{
  "authenticated": false,
  "user": null
}
```

---

## 2. Tasks

All task endpoints **require auth**.

---

### GET /tasks

List all tasks. Supports optional query parameters for filtering.

**Query Parameters**

| Param      | Type   | Description                            |
|------------|--------|----------------------------------------|
| `status`   | string | Filter by task status (see enums)      |
| `priority` | string | Filter by priority: `low`, `medium`, `high` |
| `industry` | string | Filter by industry vertical (see enums)|

**Response `200 OK`**

```json
{
  "tasks": [
    {
      "id": "retail-1",
      "title": "Weekly Sales Performance by Region",
      "requestor": "Sarah Chen (VP Sales)",
      "status": "review",
      "timestamp": "2025-01-15T09:30:00Z",
      "priority": "high",
      "description": "Generate a comprehensive weekly sales report broken down by region...",
      "source": "email",
      "flags": {
        "urgency": true,
        "humanRequested": false,
        "vip": true
      },
      "confidence": 72,
      "industry": "retail-ecommerce",
      "sentStatus": null,
      "sentAt": null,
      "requestorFeedback": null
    }
  ]
}
```

**Task Object Schema**

| Field               | Type    | Required | Description                                    |
|---------------------|---------|----------|------------------------------------------------|
| `id`                | string  | ✅       | Unique task identifier                         |
| `title`             | string  | ✅       | Task title                                     |
| `requestor`         | string  | ✅       | Name and role of the person who requested      |
| `status`            | string  | ✅       | Pipeline status (see enums)                    |
| `timestamp`         | string  | ✅       | ISO 8601 datetime of task creation             |
| `priority`          | string  | ✅       | `low`, `medium`, or `high`                     |
| `description`       | string  | ✅       | Full task description                          |
| `source`            | string  | ✅       | How the task was submitted (see enums)         |
| `flags.urgency`     | boolean | ✅       | Time-sensitive processing flag                 |
| `flags.humanRequested` | boolean | ✅   | Customer wants human escalation                |
| `flags.vip`         | boolean | ✅       | C-suite request flag                           |
| `confidence`        | number  | ✅       | 0–100 confidence score                         |
| `industry`          | string  | ❌       | Industry vertical (see enums)                  |
| `sentStatus`        | string  | ❌       | Status after sending (see enums)               |
| `sentAt`            | string  | ❌       | ISO 8601 datetime when response was sent       |
| `requestorFeedback` | string \| null | ❌ | `positive`, `negative`, or `null`           |

---

### GET /tasks/:id

Fetch full task detail including messages, SQL code, annotations, table data, and response template.

**URL Parameters**

| Param | Type   | Description          |
|-------|--------|----------------------|
| `id`  | string | Task ID              |

**Response `200 OK`**

```json
{
  "task": {
    "id": "retail-1",
    "title": "Weekly Sales Performance by Region",
    "requestor": "Sarah Chen (VP Sales)",
    "status": "review",
    "timestamp": "2025-01-15T09:30:00Z",
    "priority": "high",
    "description": "Generate a comprehensive weekly sales report...",
    "source": "email",
    "flags": { "urgency": true, "humanRequested": false, "vip": true },
    "confidence": 72,
    "industry": "retail-ecommerce"
  },
  "messages": [
    {
      "id": "msg-1",
      "sender": "user",
      "content": "I need a weekly sales performance report by region.",
      "timestamp": "2025-01-15T09:30:00Z",
      "type": "text",
      "assumptions": []
    },
    {
      "id": "msg-2",
      "sender": "agent",
      "content": "I'll generate a weekly sales report grouped by region...",
      "timestamp": "2025-01-15T09:30:05Z",
      "type": "reasoning",
      "assumptions": ["Using fiscal week definition", "Excluding returns"]
    }
  ],
  "code": [
    { "lineNumber": 1, "type": "unchanged", "content": "SELECT" },
    { "lineNumber": 2, "type": "added", "content": "  region_name," },
    { "lineNumber": 3, "type": "added", "content": "  SUM(order_total) AS total_sales" },
    { "lineNumber": 4, "type": "unchanged", "content": "FROM fact_sales" },
    { "lineNumber": 5, "type": "removed", "content": "WHERE 1=1" },
    { "lineNumber": 6, "type": "added", "content": "WHERE order_date >= DATE_TRUNC('week', CURRENT_DATE)" }
  ],
  "annotations": [
    {
      "lineStart": 2,
      "lineEnd": 3,
      "title": "Column Selection",
      "description": "Selecting region name and aggregated sales total",
      "type": "selection"
    },
    {
      "lineStart": 4,
      "lineEnd": 4,
      "title": "Data Source",
      "description": "Using the fact_sales table as the primary data source",
      "type": "source"
    }
  ],
  "tableColumns": [
    { "key": "region", "label": "Region", "align": "left" },
    { "key": "total_sales", "label": "Total Sales", "align": "right" },
    { "key": "order_count", "label": "Orders", "align": "right" }
  ],
  "tableData": [
    { "region": "Northeast", "total_sales": 125000, "order_count": 1847 },
    { "region": "Southeast", "total_sales": 98000, "order_count": 1523 },
    { "region": "West", "total_sales": 142000, "order_count": 2104 }
  ],
  "knowledgeUpdate": "Applied fiscal week definition from company calendar. NULL handling rule used for missing region data.",
  "responseMessage": "Hi Sarah,\n\nHere's your weekly sales performance report broken down by region...",
  "assumptions": [
    { "id": "a1", "text": "Using fiscal week (Mon–Sun) per company calendar", "includeInMessage": true },
    { "id": "a2", "text": "Excluding refunded orders from totals", "includeInMessage": true },
    { "id": "a3", "text": "NULL regions mapped to 'Unassigned'", "includeInMessage": false }
  ]
}
```

**Messages Schema**

| Field         | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| `id`          | string   | Unique message ID                                |
| `sender`      | string   | `user`, `agent`, or `system`                     |
| `content`     | string   | Message text content                             |
| `timestamp`   | string   | ISO 8601 datetime                                |
| `type`        | string   | `text`, `reasoning`, or `action`                 |
| `assumptions` | string[] | Assumptions made during this response (optional) |

**Code Diff Schema**

| Field        | Type   | Description                              |
|--------------|--------|------------------------------------------|
| `lineNumber` | number | Line number in the generated code        |
| `type`       | string | `unchanged`, `added`, or `removed`       |
| `content`    | string | The code content for this line           |

**SQL Annotation Schema**

| Field         | Type   | Description                              |
|---------------|--------|------------------------------------------|
| `lineStart`   | number | First line of the annotated block        |
| `lineEnd`     | number | Last line of the annotated block         |
| `title`       | string | Short annotation title                   |
| `description` | string | Detailed explanation                     |
| `type`        | string | Annotation category (see enums)          |

**Table Column Schema**

| Field   | Type   | Description                              |
|---------|--------|------------------------------------------|
| `key`   | string | Column key matching tableData keys       |
| `label` | string | Display label for the column header      |
| `align` | string | `left`, `center`, or `right` (optional)  |

**Assumptions Schema**

| Field              | Type    | Description                             |
|--------------------|---------|-----------------------------------------|
| `id`               | string  | Unique assumption ID                    |
| `text`             | string  | Human-readable assumption text          |
| `includeInMessage` | boolean | Whether to include in the sent response |

---

### PATCH /tasks/:id/status

Update a task's pipeline status.

**URL Parameters**

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string | Task ID     |

**Request Body**

| Field    | Type   | Required | Description              |
|----------|--------|----------|--------------------------|
| `status` | string | ✅       | New status (see enums)   |

```json
{
  "status": "approved"
}
```

**Response `204 No Content`**: Empty body

---

### POST /tasks/:id/send

Send the generated response to the original requestor.

**URL Parameters**

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string | Task ID     |

**Request Body**

| Field         | Type   | Required | Description                               |
|---------------|--------|----------|-------------------------------------------|
| `message`     | string | ✅       | The response message to send              |
| `assumptions` | array  | ✅       | Assumptions with inclusion flags          |

```json
{
  "message": "Hi Sarah,\n\nHere's your weekly sales performance report...",
  "assumptions": [
    { "id": "a1", "text": "Using fiscal week (Mon–Sun)", "includeInMessage": true },
    { "id": "a2", "text": "Excluding refunded orders", "includeInMessage": true }
  ]
}
```

**Response `204 No Content`**: Empty body

---

## 3. Context Hub

All context endpoints **require auth**.

---

### GET /context

List all context items (knowledge base entries).

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "ctx-001",
      "type": "entity",
      "source": "upload",
      "content": "fact_sales table contains daily transaction records with columns: order_id, store_id, product_id, order_total, order_date",
      "metadata": { "fileName": "schema_docs.pdf", "pageCount": 12 },
      "timestamp": "2025-01-10T14:00:00Z",
      "status": "processed"
    },
    {
      "id": "ctx-002",
      "type": "rule",
      "source": "chat",
      "content": "Always convert NULL values to 0 in numeric aggregations",
      "metadata": {},
      "timestamp": "2025-01-12T10:30:00Z",
      "status": "processed"
    }
  ]
}
```

**Context Item Schema**

| Field      | Type   | Required | Description                              |
|------------|--------|----------|------------------------------------------|
| `id`       | string | ✅       | Unique context item ID                   |
| `type`     | string | ✅       | `entity`, `rule`, or `fact`              |
| `source`   | string | ✅       | How it was added (see enums)             |
| `content`  | string | ✅       | The knowledge content                    |
| `metadata` | object | ❌       | Arbitrary key-value metadata             |
| `timestamp`| string | ✅       | ISO 8601 datetime of creation            |
| `status`   | string | ✅       | Processing status (see enums)            |

---

### POST /context

Add a new context item to the knowledge base.

**Request Body**

| Field      | Type   | Required | Description                   |
|------------|--------|----------|-------------------------------|
| `type`     | string | ✅       | `entity`, `rule`, or `fact`   |
| `source`   | string | ✅       | `upload`, `chat`, `api`, `screen-record` |
| `content`  | string | ✅       | The knowledge content         |
| `metadata` | object | ❌       | Additional metadata           |

```json
{
  "type": "rule",
  "source": "chat",
  "content": "Fiscal weeks run Monday to Sunday per company calendar",
  "metadata": {}
}
```

**Response `201 Created`**

Returns the created context item (same schema as GET).

```json
{
  "id": "ctx-003",
  "type": "rule",
  "source": "chat",
  "content": "Fiscal weeks run Monday to Sunday per company calendar",
  "metadata": {},
  "timestamp": "2025-01-15T11:00:00Z",
  "status": "pending"
}
```

---

### DELETE /context/:id

Remove a context item from the knowledge base.

**URL Parameters**

| Param | Type   | Description       |
|-------|--------|-------------------|
| `id`  | string | Context item ID   |

**Response `204 No Content`**: Empty body

---

### POST /context/connect

Register an external API connection for automated context ingestion.

**Request Body**

| Field         | Type   | Required | Description                                |
|---------------|--------|----------|--------------------------------------------|
| `name`        | string | ✅       | Display name for the connection            |
| `endpoint`    | string | ✅       | API endpoint URL                           |
| `authType`    | string | ✅       | `bearer`, `api-key`, or `oauth`            |
| `credentials` | object | ✅       | Key-value pairs for authentication         |

```json
{
  "name": "Snowflake Data Catalog",
  "endpoint": "https://api.snowflake.com/v1/catalog",
  "authType": "bearer",
  "credentials": {
    "token": "sf_live_abc123..."
  }
}
```

**Response `204 No Content`**: Empty body

---

## 4. Enums & Constants

### Task Statuses (pipeline stages)

| Value        | Description                                         |
|--------------|-----------------------------------------------------|
| `ingesting`  | Task received, parsing request                      |
| `asserting`  | Identifying assumptions and constraints              |
| `planning`   | Building execution plan                              |
| `building`   | Generating SQL / code                                |
| `validating` | Running validation checks on generated output        |
| `generating` | Creating the response message and data preview       |
| `review`     | Awaiting human expert review (confidence < 80)       |
| `sent`       | Response sent to requestor                           |
| `approved`   | Requestor approved the response                      |
| `learning`   | System learning from feedback, updating knowledge    |

### Task Sources

| Value     | Description                      |
|-----------|----------------------------------|
| `email`   | Request came via email           |
| `slack`   | Request came via Slack           |
| `meeting` | Request captured from a meeting  |

### Priorities

| Value    |
|----------|
| `low`    |
| `medium` |
| `high`   |

### Industry Verticals

| Value                      | Description                 |
|----------------------------|-----------------------------|
| `retail-ecommerce`         | Retail & E-commerce         |
| `grocery-mass-merch`       | Grocery & Mass Merchandise  |
| `cpg-consumer-brands`      | CPG & Consumer Brands       |
| `hospitality-restaurants`  | Hospitality & Restaurants   |
| `fashion-shoes`            | Fashion & Shoes             |
| `media-entertainment`      | Media & Entertainment       |

### Sent Statuses

| Value               | Description                          |
|---------------------|--------------------------------------|
| `pending`           | Sent but not yet viewed              |
| `viewed`            | Requestor has opened the response    |
| `awaiting_response` | Requestor is reviewing / responding  |

### Context Item Types

| Value    | Description                          |
|----------|--------------------------------------|
| `entity` | Data entity (table, column, schema)  |
| `rule`   | Business rule or transformation      |
| `fact`   | Known fact or metric definition      |

### Context Sources

| Value           | Description                      |
|-----------------|----------------------------------|
| `upload`        | File upload                      |
| `chat`          | Manual chat input                |
| `api`           | External API ingestion           |
| `screen-record` | Screen recording capture        |

### Context Statuses

| Value       | Description                    |
|-------------|--------------------------------|
| `pending`   | Queued for processing          |
| `processed` | Successfully processed         |
| `error`     | Processing failed              |

### SQL Annotation Types

| Value         | Description                           |
|---------------|---------------------------------------|
| `selection`   | Column or field selection             |
| `source`      | Data source (FROM / JOIN)             |
| `aggregation` | Aggregation function (SUM, COUNT...) |
| `filter`      | WHERE / HAVING clause                 |
| `grouping`    | GROUP BY clause                       |
| `ordering`    | ORDER BY clause                       |
| `expert`      | Expert-added annotation               |

---

## 5. Error Handling

All error responses follow a consistent format:

```json
{
  "status": <http_status_code>,
  "message": "<human_readable_error>"
}
```

### Common Error Codes

| Status | Meaning                | Example Message                          |
|--------|------------------------|------------------------------------------|
| 400    | Bad Request            | "Missing required field: email"          |
| 401    | Unauthorized           | "Invalid email or password"              |
| 403    | Forbidden              | "Insufficient permissions"               |
| 404    | Not Found              | "Task not found"                         |
| 422    | Unprocessable Entity   | "Invalid status transition"              |
| 500    | Internal Server Error  | "An unexpected error occurred"           |

---

## Frontend Integration Reference

The frontend consumes this API through the service layer at `src/services/api/`. See:

- `client.ts` — HTTP client that attaches auth headers and normalizes errors
- `authApi.ts` — Auth service with mock/live branching
- `tasksApi.ts` — Tasks service with DTO-to-internal type converters
- `contextApi.ts` — Context Hub service
- `types.ts` — TypeScript interfaces for all API DTOs
