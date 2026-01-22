

# Plan: Enhanced Task Recycling with Smart Pool Management

## Objective
Update the task injection logic to:
1. Ensure no task repeats until the entire 30-task pool is exhausted
2. Skip tasks currently in "incoming" or "active" states during recycling
3. Only allow recycling of tasks in "done" states
4. Remove the incoming queue threshold for continuous task flow

## Current Issues

**Issue 1: Pool Reset Returns Early**
```typescript
if (availableTasks.length === 0) {
  usedTaskIdsRef.current.clear();
  return prev;  // ← Returns without injecting, causing gaps
}
```

**Issue 2: Incoming Threshold Limits Flow**
```typescript
if (incomingCount >= 3) return prev;  // ← Blocks injection when 3+ tasks in queue
```

**Issue 3: No State-Aware Recycling**
The current logic doesn't check if a task template is already active in the queue before recycling it.

## Solution Overview

```text
Task States Classification:
┌─────────────────────────────────────────────────────────────┐
│ INCOMING (Cannot Recycle)                                   │
│   ingesting, asserting, planning, building,                 │
│   validating, generating, review                            │
├─────────────────────────────────────────────────────────────┤
│ ACTIVE (Cannot Recycle)                                     │
│   sent                                                      │
├─────────────────────────────────────────────────────────────┤
│ DONE (Can Recycle)                                          │
│   approved, learning                                        │
└─────────────────────────────────────────────────────────────┘
```

## File Changes

### File: `src/hooks/useSimulation.ts`

**Change 1: Remove Incoming Queue Threshold (Line 103)**

Delete this block:
```typescript
// Only inject if we have fewer than 3 tasks in incoming
if (incomingCount >= 3) return prev;
```

This allows continuous task injection regardless of queue size.

---

**Change 2: Rewrite Pool Selection Logic (Lines 105-120)**

Replace the current logic with state-aware recycling:

```typescript
// Get IDs of tasks currently in incoming or active states (cannot recycle)
const incomingStatuses: TaskStatus[] = [...processingStages, 'review'];
const activeStatuses: TaskStatus[] = ['sent'];
const blockedOriginalIds = new Set(
  prev
    .filter(t => [...incomingStatuses, ...activeStatuses].includes(t.status))
    .map(t => t.originalId || t.id.split('-')[0]) // Get original template ID
);

// Find available tasks: not used in current cycle AND not blocked
let availableTasks = allIndustryTasks.filter(
  t => !usedTaskIdsRef.current.has(t.id) && !blockedOriginalIds.has(t.id)
);

// If all tasks used in cycle, try to recycle from done tasks
if (availableTasks.length === 0) {
  // Clear the used tracker to start new cycle
  usedTaskIdsRef.current.clear();
  taskPoolIndexRef.current = 0;
  
  // Re-filter: only allow tasks not currently blocked
  availableTasks = allIndustryTasks.filter(t => !blockedOriginalIds.has(t.id));
  
  // If everything is blocked (all 30 tasks active), wait for next interval
  if (availableTasks.length === 0) {
    return prev;
  }
}
```

---

**Change 3: Clean Up Unused Variables (Lines 98-100)**

Since we're removing the threshold, we can simplify the status arrays:

Remove:
```typescript
const incomingStatuses = [...processingStages, 'review'];
const incomingCount = prev.filter(t => incomingStatuses.includes(t.status)).length;
```

Move the status definitions inside the new logic block.

## Complete Updated `injectNewTask` Function

```typescript
const injectNewTask = useCallback(() => {
  setTasks((prev) => {
    // Define which statuses block recycling
    const incomingStatuses: TaskStatus[] = [...processingStages, 'review'];
    const activeStatuses: TaskStatus[] = ['sent'];
    
    // Get original IDs of tasks currently in blocked states
    const blockedOriginalIds = new Set(
      prev
        .filter(t => [...incomingStatuses, ...activeStatuses].includes(t.status))
        .map(t => t.originalId || t.id.split('-')[0])
    );

    // Find available tasks: not used in current cycle AND not blocked
    let availableTasks = allIndustryTasks.filter(
      t => !usedTaskIdsRef.current.has(t.id) && !blockedOriginalIds.has(t.id)
    );

    // If all tasks used in cycle, start new cycle
    if (availableTasks.length === 0) {
      usedTaskIdsRef.current.clear();
      taskPoolIndexRef.current = 0;
      
      // Re-filter excluding blocked tasks
      availableTasks = allIndustryTasks.filter(t => !blockedOriginalIds.has(t.id));
      
      // If all 30 tasks are in incoming/active, wait
      if (availableTasks.length === 0) {
        return prev;
      }
    }

    // Get next task from pool
    const nextTask = availableTasks[taskPoolIndexRef.current % availableTasks.length];
    taskPoolIndexRef.current++;
    
    // Mark as used in this cycle
    usedTaskIdsRef.current.add(nextTask.id);

    // Create new instance with unique ID
    const newTask: Task = {
      ...nextTask,
      id: `${nextTask.id}-${Date.now()}`,
      originalId: nextTask.id,
      status: 'ingesting' as TaskStatus,
      timestamp: new Date(),
      sentAt: undefined,
      sentStatus: undefined
    };

    return [...prev, newTask];
  });
}, [setTasks]);
```

## Expected Behavior After Changes

| Scenario | Before | After |
|----------|--------|-------|
| Pool exhausted | Gaps in injection | Immediate recycling from done tasks |
| 3+ tasks in incoming | Blocks injection | Continues injecting |
| Task in "sent" state | Could be recycled | Blocked until approved |
| Task in "review" state | Could be recycled | Blocked until completed |
| All 30 in active use | N/A | Waits for tasks to complete |

## Testing Checklist

1. Run demo for 5+ minutes - tasks should continuously appear
2. Verify no duplicate task titles visible at same time
3. Confirm tasks only repeat after moving to "approved" or "learning"
4. Check that removing one task from queue allows its template to be reused

