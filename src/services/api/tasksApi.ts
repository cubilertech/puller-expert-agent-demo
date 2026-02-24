import { USE_MOCK_DATA } from '@/config/api';
import { apiClient } from './client';
import type {
  TaskListResponse,
  TaskDetailResponse,
  UpdateTaskStatusRequest,
  SendToRequestorRequest,
  ApiTask,
} from './types';
import { Task, TaskData } from '@/types';
import { initialTasks, allTaskData, getTaskDataById } from '@/data/demoData';

// ── Converters (API DTO → internal types) ───────

function apiTaskToTask(api: ApiTask): Task {
  return {
    id: api.id,
    title: api.title,
    requestor: api.requestor,
    status: api.status as Task['status'],
    timestamp: new Date(api.timestamp),
    priority: api.priority,
    description: api.description,
    source: api.source as Task['source'],
    flags: api.flags,
    confidence: api.confidence,
    industry: api.industry as Task['industry'],
    sentStatus: api.sentStatus as Task['sentStatus'],
    sentAt: api.sentAt ? new Date(api.sentAt) : undefined,
    requestorFeedback: api.requestorFeedback,
  };
}

function apiDetailToTaskData(detail: TaskDetailResponse): TaskData {
  return {
    messages: detail.messages.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })),
    code: detail.code,
    annotations: detail.annotations,
    tableColumns: detail.tableColumns.map((c) => ({
      ...c,
      align: c.align as 'left' | 'center' | 'right' | undefined,
    })),
    tableData: detail.tableData,
    knowledgeUpdate: detail.knowledgeUpdate,
    responseMessage: detail.responseMessage,
    assumptions: detail.assumptions,
  };
}

// ── Service ─────────────────────────────────────

export const tasksApi = {
  async fetchTasks(): Promise<Task[]> {
    if (USE_MOCK_DATA) {
      return initialTasks;
    }
    const res = await apiClient.get<TaskListResponse>('/tasks');
    return res.tasks.map(apiTaskToTask);
  },

  async fetchTaskById(id: string): Promise<{ task: Task; data: TaskData } | null> {
    if (USE_MOCK_DATA) {
      const task = initialTasks.find((t) => t.id === id);
      const data = getTaskDataById(id);
      if (!task || !data) return null;
      return { task, data };
    }
    const res = await apiClient.get<TaskDetailResponse>(`/tasks/${id}`);
    return {
      task: apiTaskToTask(res.task),
      data: apiDetailToTaskData(res),
    };
  },

  async updateTaskStatus(id: string, status: string): Promise<void> {
    if (USE_MOCK_DATA) return;
    await apiClient.patch(`/tasks/${id}/status`, { status } as UpdateTaskStatusRequest);
  },

  async sendToRequestor(
    id: string,
    message: string,
    assumptions: SendToRequestorRequest['assumptions'],
  ): Promise<void> {
    if (USE_MOCK_DATA) return;
    await apiClient.post(`/tasks/${id}/send`, { message, assumptions } as SendToRequestorRequest);
  },
};
