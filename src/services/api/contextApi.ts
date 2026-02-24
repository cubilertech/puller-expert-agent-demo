import { USE_MOCK_DATA } from '@/config/api';
import { apiClient } from './client';
import type {
  ContextListResponse,
  ContextItemResponse,
  ContextItemRequest,
  ConnectApiRequest,
} from './types';
import { ContextItem } from '@/types';

// ── Converter ───────────────────────────────────

function apiToContextItem(api: ContextItemResponse): ContextItem {
  return {
    id: api.id,
    type: api.type as ContextItem['type'],
    source: api.source as ContextItem['source'],
    content: api.content,
    metadata: api.metadata,
    timestamp: new Date(api.timestamp),
    status: api.status as ContextItem['status'],
  };
}

// ── Service ─────────────────────────────────────

export const contextApi = {
  async fetchContextItems(): Promise<ContextItem[]> {
    if (USE_MOCK_DATA) {
      // Mock data is managed locally by useContextHub hook
      return [];
    }
    const res = await apiClient.get<ContextListResponse>('/context');
    return res.items.map(apiToContextItem);
  },

  async addContextItem(item: ContextItemRequest): Promise<ContextItem> {
    if (USE_MOCK_DATA) {
      // In mock mode, the hook handles local state
      return {
        id: `ctx-${Date.now()}`,
        type: item.type as ContextItem['type'],
        source: item.source as ContextItem['source'],
        content: item.content,
        metadata: item.metadata,
        timestamp: new Date(),
        status: 'pending',
      };
    }
    const res = await apiClient.post<ContextItemResponse>('/context', item);
    return apiToContextItem(res);
  },

  async deleteContextItem(id: string): Promise<void> {
    if (USE_MOCK_DATA) return;
    await apiClient.delete(`/context/${id}`);
  },

  async connectApi(config: ConnectApiRequest): Promise<void> {
    if (USE_MOCK_DATA) return;
    await apiClient.post('/context/connect', config);
  },
};
