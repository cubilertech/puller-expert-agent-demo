/**
 * API Data Transfer Objects
 * 
 * These types represent the backend API contract.
 * They are separate from internal UI types (src/types/index.ts).
 * Conversion happens at the service layer boundary.
 */

// ── Auth ────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface SessionResponse {
  authenticated: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
}

// ── Tasks ───────────────────────────────────────

export interface TaskListResponse {
  tasks: ApiTask[];
}

export interface ApiTask {
  id: string;
  title: string;
  requestor: string;
  status: string;
  timestamp: string; // ISO date
  priority: 'low' | 'medium' | 'high';
  description: string;
  source: string;
  flags: {
    urgency: boolean;
    humanRequested: boolean;
    vip: boolean;
  };
  confidence: number;
  industry?: string;
  sentStatus?: string;
  sentAt?: string; // ISO date
  requestorFeedback?: 'positive' | 'negative' | null;
}

export interface TaskDetailResponse {
  task: ApiTask;
  messages: ApiChatMessage[];
  code: ApiCodeDiff[];
  annotations: ApiSqlAnnotation[];
  tableColumns: { key: string; label: string; align?: string }[];
  tableData: Record<string, string | number>[];
  knowledgeUpdate: string;
  responseMessage: string;
  assumptions: { id: string; text: string; includeInMessage: boolean }[];
}

export interface ApiChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  type: 'text' | 'reasoning' | 'action';
  assumptions?: string[];
}

export interface ApiCodeDiff {
  lineNumber: number;
  type: 'unchanged' | 'added' | 'removed';
  content: string;
}

export interface ApiSqlAnnotation {
  lineStart: number;
  lineEnd: number;
  title: string;
  description: string;
  type: 'selection' | 'source' | 'aggregation' | 'filter' | 'grouping' | 'ordering' | 'expert';
}

export interface UpdateTaskStatusRequest {
  status: string;
}

export interface SendToRequestorRequest {
  message: string;
  assumptions: { id: string; text: string; includeInMessage: boolean }[];
}

// ── Context Hub ─────────────────────────────────

export interface ContextItemResponse {
  id: string;
  type: string;
  source: string;
  content: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  status: string;
}

export interface ContextItemRequest {
  type: string;
  source: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ContextListResponse {
  items: ContextItemResponse[];
}

export interface ConnectApiRequest {
  name: string;
  endpoint: string;
  authType: 'bearer' | 'api-key' | 'oauth';
  credentials: Record<string, string>;
}

// ── Common ──────────────────────────────────────

export interface ApiError {
  status: number;
  message: string;
}
