import { useState, useCallback, useRef } from 'react';
import { ContextItem, ContextItemType, ContextSource, KnowledgeNode } from '@/types';
import { isGuidedTrigger } from '@/data/guidedScenario';

// Demo context items for initial state
const demoContextItems: ContextItem[] = [
  {
    id: 'ctx-1',
    type: 'entity',
    source: 'upload',
    content: 'Product catalog with 15,000 SKUs imported from inventory system',
    metadata: { fileName: 'product_catalog_2024.csv', rows: 15000 },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'processed',
  },
  {
    id: 'ctx-2',
    type: 'rule',
    source: 'chat',
    content: 'Fiscal year ends in March. Q1 = April-June, Q2 = July-Sept, Q3 = Oct-Dec, Q4 = Jan-March',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: 'processed',
  },
  {
    id: 'ctx-3',
    type: 'fact',
    source: 'api',
    content: 'Connected to Salesforce CRM - syncing customer data every 6 hours',
    metadata: { endpoint: 'https://api.salesforce.com/v52.0', syncInterval: '6h' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    status: 'processed',
  },
  {
    id: 'ctx-4',
    type: 'entity',
    source: 'screen-record',
    content: 'Dashboard walkthrough showing KPI calculations and report generation workflow',
    metadata: { duration: '5:32', transcribed: true },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    status: 'processed',
  },
  {
    id: 'ctx-5',
    type: 'rule',
    source: 'chat',
    content: 'Revenue NULL values should be treated as ZERO for aggregation purposes',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    status: 'processed',
  },
];

interface UseContextHubOptions {
  onGuidedContextTrigger?: () => void;
}

interface UseContextHubReturn {
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  contextItems: ContextItem[];
  addContextItem: (item: Omit<ContextItem, 'id' | 'timestamp' | 'status'>) => ContextItem;
  updateContextItem: (id: string, updates: Partial<ContextItem>) => void;
  removeContextItem: (id: string) => void;
  convertToKnowledgeNode: (item: ContextItem) => KnowledgeNode;
  guidedTriggered: boolean;
}

export function useContextHub(options?: UseContextHubOptions): UseContextHubReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [contextItems, setContextItems] = useState<ContextItem[]>(demoContextItems);
  const [guidedTriggered, setGuidedTriggered] = useState(false);

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);
  const togglePanel = useCallback(() => setIsOpen((prev) => !prev), []);

  const addContextItem = useCallback((item: Omit<ContextItem, 'id' | 'timestamp' | 'status'>): ContextItem => {
    const newItem: ContextItem = {
      ...item,
      id: `ctx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date(),
      status: 'pending',
    };
    setContextItems((prev) => [newItem, ...prev]);
    
    // Simulate processing with longer duration for realism
    setTimeout(() => {
      setContextItems((prev) =>
        prev.map((i) => (i.id === newItem.id ? { ...i, status: 'processed' } : i))
      );
    }, 3000);

    // Check for guided scenario trigger
    if (!guidedTriggered && isGuidedTrigger(item.content)) {
      setGuidedTriggered(true);
      // Fire the guided context cascade after processing animation
      setTimeout(() => {
        options?.onGuidedContextTrigger?.();
      }, 3500);
    }
    
    return newItem;
  }, [guidedTriggered, options]);

  const updateContextItem = useCallback((id: string, updates: Partial<ContextItem>) => {
    setContextItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const removeContextItem = useCallback((id: string) => {
    setContextItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const convertToKnowledgeNode = useCallback((item: ContextItem): KnowledgeNode => {
    return {
      id: `node-${item.id}`,
      label: item.content.slice(0, 20) + (item.content.length > 20 ? '...' : ''),
      type: item.type,
      x: 80 + Math.random() * 140,
      y: 280 + Math.random() * 60,
      isNew: true,
      connections: ['node-1'],
    };
  }, []);

  return {
    isOpen,
    openPanel,
    closePanel,
    togglePanel,
    contextItems,
    addContextItem,
    updateContextItem,
    removeContextItem,
    convertToKnowledgeNode,
    guidedTriggered,
  };
}
