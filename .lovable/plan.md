

# Context Hub: Side Panel Feature

## Overview

Transform the Context Graph button in the header into an interactive slide-in panel that provides a comprehensive context management experience. The panel will feature a side-by-side layout with a **Context Log** (showing all collected context in timeline view) and a **Context Input Hub** (allowing multiple methods to add new context).

## User Experience Flow

```text
+---------------------------------------------------------------+
| Header:  [Brain icon] 12 updates  <-- Click to open panel     |
+---------------------------------------------------------------+
|                                                               |
|  Main Dashboard (slightly dimmed when panel is open)          |
|                                                               |
+-----------------------------------+---------------------------+
                                    |                           |
                                    |   CONTEXT HUB PANEL       |
                                    |   (Slides in from right)  |
                                    |                           |
                                    |   [Log] | [Add Context]   |
                                    |                           |
                                    +---------------------------+
```

---

## Panel Layout Design

### Left Side: Context Log (Timeline View)
- Chronological feed of all context items
- Each entry shows: timestamp, type badge (Entity/Rule/Fact), source icon, content preview
- Entries grouped by "Today", "Yesterday", "Earlier"
- Clickable entries to expand and see full details
- Visual indicator for newly added items (subtle animation)

### Right Side: Context Input Hub
Four input methods presented as tabs or cards:

| Method | Description |
|--------|-------------|
| **Upload** | Drag-and-drop zone for documents (PDF, CSV, JSON, etc.) with file type indicators |
| **Chat** | Text input for natural language context ("Our fiscal year ends in March") |
| **API** | Connect external data sources with endpoint configuration |
| **Screen Record** | Capture screen recordings to provide visual context |

---

## Component Structure

```text
src/components/
├── ContextHubPanel.tsx        (Main panel container with Sheet)
├── ContextLog.tsx             (Timeline view of collected context)
├── ContextInputHub.tsx        (Tabbed input interface)
├── inputs/
│   ├── ContextUploader.tsx    (File upload component)
│   ├── ContextChat.tsx        (Chat/prompt input)
│   ├── ContextApiConnect.tsx  (API connection interface)
│   └── ContextScreenRecord.tsx (Screen recording interface)
```

---

## Feature Details

### 1. Context Log Panel
- **Timeline entries**: Show icon, timestamp, type badge, preview text
- **Expandable cards**: Click to see full content and metadata
- **Search/filter**: Optional quick filter by type
- **Empty state**: Friendly message when no context yet

### 2. File Upload
- Drag-and-drop zone with visual feedback
- Supported formats: PDF, CSV, JSON, TXT, XLSX
- Processing indicator during upload
- Success confirmation with extracted preview

### 3. Chat Input
- Text area for typing context rules/facts
- Example prompts for guidance
- Submit adds to timeline immediately
- Auto-categorization suggestion (Entity/Rule/Fact)

### 4. API Connection
- Form fields: Endpoint URL, Authentication type, Headers
- Test connection button
- Sync status indicator
- Schedule options (one-time, periodic)

### 5. Screen Recording
- Start/Stop recording button
- Recording indicator with timer
- Preview before saving
- Transcription placeholder (future enhancement)

---

## Technical Approach

### State Management
- New `useContextHub` hook to manage panel state and context items
- New `ContextItem` type to represent logged context entries
- Integration with existing `KnowledgeNode` system

### Panel Implementation
- Use shadcn/ui `Sheet` component for slide-in behavior
- Make `ContextGraphHeader` clickable to open the panel
- Maintain existing animations when new context is added

### New Types
```typescript
interface ContextItem {
  id: string;
  type: 'entity' | 'rule' | 'fact';
  source: 'upload' | 'chat' | 'api' | 'screen-record';
  content: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  status: 'pending' | 'processed' | 'error';
}
```

---

## Implementation Steps

1. **Create types and hook** - Add `ContextItem` type and `useContextHub` hook for managing context state

2. **Build ContextHubPanel** - Main container using Sheet component with side-by-side layout

3. **Build ContextLog** - Timeline view component with grouped entries and expand/collapse

4. **Build ContextInputHub** - Tabbed interface housing all four input methods

5. **Build input components** - Each of the four input methods (Upload, Chat, API, Screen Record)

6. **Integrate with header** - Make ContextGraphHeader clickable to open the panel

7. **Connect to KnowledgeNode system** - Bridge new context items to existing graph visualization

8. **Add animations** - Smooth transitions when panel opens/closes and new items are added

---

## Visual Design Notes

- Panel width: approximately 50-60% of viewport
- Semi-transparent backdrop to dim main content
- Consistent with existing dark theme and color system
- Use existing color coding: Primary (Entity), Warning (Rule), Success (Fact)
- Close button and click-outside-to-close behavior

