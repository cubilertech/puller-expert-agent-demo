export type TaskStatus = 'ingesting' | 'asserting' | 'planning' | 'building' | 'validating' | 'generating' | 'review' | 'sent' | 'approved' | 'learning';

export type SentStatus = 'pending' | 'viewed' | 'awaiting_response';

export type TaskSource = 'email' | 'slack' | 'meeting';

export type IndustryVertical = 
  | 'retail-ecommerce'
  | 'grocery-mass-merch'
  | 'cpg-consumer-brands'
  | 'hospitality-restaurants'
  | 'fashion-shoes'
  | 'media-entertainment';

export interface TaskFlags {
  urgency: boolean;       // Time-sensitive processing
  humanRequested: boolean; // Customer wants escalation
  vip: boolean;           // C-suite request
}

export interface Task {
  id: string;
  originalId?: string; // Original task ID for data lookup when task is recycled
  title: string;
  requestor: string;
  status: TaskStatus;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  description: string;
  source: TaskSource;
  flags: TaskFlags;
  confidence: number; // 0-100, triggers review if below threshold
  industry?: IndustryVertical; // Industry vertical for demo categorization
  sentStatus?: SentStatus; // For sent tasks: pending, viewed, awaiting_response
  sentAt?: Date; // When the response was sent to requestor
  requestorFeedback?: 'positive' | 'negative' | null; // Feedback from requestor
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'reasoning' | 'action';
  assumptions?: string[]; // Nested assumptions within a response
}

export interface CodeDiff {
  lineNumber: number;
  type: 'unchanged' | 'added' | 'removed';
  content: string;
}

export interface SqlAnnotation {
  lineStart: number;
  lineEnd: number;
  title: string;
  description: string;
  type: 'selection' | 'source' | 'aggregation' | 'filter' | 'grouping' | 'ordering' | 'expert';
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface Assumption {
  id: string;
  text: string;
  includeInMessage: boolean;
}

export interface TaskData {
  messages: ChatMessage[];
  code: CodeDiff[];
  annotations: SqlAnnotation[];
  tableColumns: TableColumn[];
  tableData: Record<string, string | number>[];
  knowledgeUpdate: string;
  responseMessage: string;
  assumptions: Assumption[];
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

// Expert can adjust this - tasks below this threshold go to expert review
export const CONFIDENCE_THRESHOLD = 80;
