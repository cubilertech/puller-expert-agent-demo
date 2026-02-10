

# Guided Demo Storyline: Context-Driven Task Update

## Concept

Create a single "golden path" demo scenario where a specific task arrives, Puller drafts a response, the user adds context via the Context Hub, and the artifact **visibly updates** to reflect the new context. This creates a compelling narrative: "the system learns and adapts in real-time."

## The Story

We'll use the existing **retail-1** task (GlowMax Serum Weekly Sales Trend) as the "hero" task, with a **before/after** data transformation:

```text
1. Task arrives: "How did GlowMax Serum trend last week?"
2. Puller drafts response: Shows 6 days of data (Mon-Sat)
3. User opens Context Hub, adds context:
   "Our retail week runs Sunday through Saturday, not Monday through Sunday"
4. System processes the new context (animated)
5. Artifact UPDATES:
   - SQL changes (date filter updated, highlighted as diff)
   - Table data changes (Sunday row appears, new totals)
   - Assumptions update (reflects new week definition)
   - Response message updates with new insight
   - Learning signal fires ("RETAIL_WEEK_DEFINITION" learned)
```

## Implementation Approach

### 1. Guided Scenario Data (`src/data/guidedScenario.ts`)

Define the "before" and "after" versions of the task data:

| Element | Before (Current) | After (Context Applied) |
|---------|------------------|------------------------|
| SQL date filter | `'2025-01-06' AND '2025-01-12'` (Mon-Sun) | `'2025-01-05' AND '2025-01-11'` (Sun-Sat) |
| Table data | 6 rows (Mon-Sat) | 7 rows (Sun-Sat), different totals |
| Assumptions | "Last week = Monday-Sunday" | "Last week = Sunday-Saturday (per business rule)" |
| Response message | Peak on Saturday | Updated insight with Sunday included |
| SQL diff | All `unchanged` lines | Date line shown as `removed` + `added` |

### 2. Canned Context Action

Add a special "suggested context" prompt in the Context Hub chat that triggers the storyline:

- In the example prompts list, include: **"Our retail week runs Sunday-Saturday"**
- When this specific prompt is submitted, it triggers the guided scenario flow
- The system recognizes this as the "golden path" context and fires the update cascade

### 3. Update Cascade (in `Index.tsx`)

When the guided context is added:

1. **Context Log**: New item appears with "pending" shimmer animation
2. **Processing**: 2-second animated processing state
3. **Context processed**: Status changes to "processed"
4. **Task data swaps**: The `allTaskData['retail-1']` entry is replaced with the "after" version
5. **Artifact Editor re-renders**: SQL shows diff highlighting, table updates, assumptions refresh
6. **Learning signal**: Toast fires with "RETAIL_WEEK_DEFINITION = SUN-SAT"
7. **Knowledge Graph**: New node added for the retail week rule

### 4. Visual Feedback in Artifact Editor

When the update hits the Artifact Editor:

- A brief "Context Update Applied" banner flashes at the top
- The SQL view highlights the changed date filter line (red removed, green added)
- The table smoothly transitions to show the new data
- The assumption text updates with a subtle highlight animation

---

## Files to Create/Modify

### New File: `src/data/guidedScenario.ts`
- Contains the "after" version of `retail-1` task data (updated SQL, table, assumptions, message)
- Exports a function `getGuidedUpdate()` returning the updated `TaskData`
- Contains the trigger phrase constant

### Modify: `src/hooks/useContextHub.ts`
- Add a `onGuidedContextTrigger` callback parameter
- Detect when the guided context phrase is submitted
- Fire the callback to initiate the update cascade

### Modify: `src/pages/Index.tsx`
- Add `handleGuidedContext` function that:
  - Swaps the task data for `retail-1` with the "after" version
  - Triggers learning signal animation
  - Adds knowledge node to graph
- Pass this handler down through the Context Hub

### Modify: `src/components/ArtifactEditor.tsx`
- Add a "Context Update Applied" banner that shows briefly when data changes
- Detect when props change and flash the update indicator

### Modify: `src/components/inputs/ContextChat.tsx`
- Add the guided prompt to the example list (already has 12, this becomes a special one)

---

## Technical Details

### Trigger Detection
The guided scenario activates when `addContextItem` receives content matching (case-insensitive) keywords like "retail week" + "sunday" or "sun-sat". This keeps it feeling natural rather than requiring an exact phrase.

### Data Swap Mechanism
Rather than mutating the global `allTaskData`, we'll use a local state override in `Index.tsx`:

```typescript
const [taskDataOverrides, setTaskDataOverrides] = useState<Record<string, TaskData>>({});

// When rendering, check overrides first
const taskData = taskDataOverrides[taskDataId] || (taskDataId ? allTaskData[taskDataId] : null);
```

This keeps the override contained and resets on demo refresh.

### Update Animation Timing
```text
0ms    - Context item added to log (pending)
500ms  - Processing shimmer starts
1500ms - Context marked as "processed"
2000ms - Task data override applied
2200ms - "Context Update Applied" banner appears in Artifact Editor
2500ms - SQL diff highlights visible
3000ms - Learning signal toast fires
3500ms - Knowledge node added to graph
5000ms - Banner fades, update complete
```

### Demo Reset
The existing `handleRefreshDemo` function will also clear `taskDataOverrides`, resetting the guided scenario so it can be replayed.

