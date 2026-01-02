export type TaskStatus = 'ingesting' | 'planning' | 'reasoning' | 'validating' | 'review' | 'approved' | 'learning';

export type TaskSource = 'email' | 'slack' | 'meeting';

export interface TaskFlags {
  urgency: boolean;       // Time-sensitive processing
  humanRequested: boolean; // Customer wants escalation
  vip: boolean;           // C-suite request
}

export interface Task {
  id: string;
  title: string;
  requestor: string;
  status: TaskStatus;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  description: string;
  source: TaskSource;
  flags: TaskFlags;
  confidence: number; // 0-100, triggers review if below threshold
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'reasoning' | 'action';
}

export interface CodeDiff {
  lineNumber: number;
  type: 'unchanged' | 'added' | 'removed';
  content: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'fact' | 'rule' | 'entity';
  x: number;
  y: number;
  isNew?: boolean;
  connections: string[];
}

export interface LearningSignal {
  id: string;
  rule: string;
  value: string;
  timestamp: Date;
}

// Expert can adjust this
export const CONFIDENCE_THRESHOLD = 75;
