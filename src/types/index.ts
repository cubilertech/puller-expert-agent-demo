export type TaskStatus = 'pending' | 'review' | 'approved' | 'learning';

export interface Task {
  id: string;
  title: string;
  requestor: string;
  status: TaskStatus;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  description: string;
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
