
# Plan: Fix Duplicate Task Detection for Initial Tasks

## Root Cause
Initial tasks loaded from `initialTasks` don't have the `originalId` property set. The blocking logic uses a fallback of `t.id.split('-')[0]` which produces incorrect results (e.g., `'retail-1'` becomes `'retail'` instead of staying `'retail-1'`).

## Solution

### File: `src/hooks/useSimulation.ts`

**Change the fallback logic on line 106**

Current (broken):
```typescript
.map(t => t.originalId || t.id.split('-')[0])
```

The problem is that `split('-')[0]` only gets the first segment before any hyphen. For initial tasks with IDs like `'retail-1'`, this returns just `'retail'`.

Fixed version - extract the base template ID correctly:
```typescript
.map(t => {
  if (t.originalId) return t.originalId;
  // For initial tasks without originalId, extract template ID
  // Handle both 'retail-1' (initial) and 'retail-1-1737123456789' (recycled) formats
  const parts = t.id.split('-');
  // If last part looks like a timestamp (13+ digits), remove it
  if (parts.length > 2 && parts[parts.length - 1].length >= 13) {
    return parts.slice(0, -1).join('-');
  }
  return t.id; // Return full ID for initial tasks like 'retail-1'
})
```

### Alternative Fix: Set `originalId` on Initial Tasks

**File: `src/data/demoData.ts`**

Add `originalId` when creating initial tasks (lines 23-37):

```typescript
export const initialTasks: Task[] = (() => {
  const demoTasks = getTasksForDemo('quick-demo')
    .map(correctTaskStatus)
    .map(t => ({ ...t, originalId: t.id })); // Add originalId
  
  const demoTaskIds = new Set(demoTasks.map(t => t.id));
  
  const additionalTasks = allIndustryTasks
    .filter(t => !demoTaskIds.has(t.id))
    .slice(0, 3)
    .map((task, idx) => ({
      ...task,
      originalId: task.id, // Add originalId
      status: (['building', 'planning', 'validating'] as const)[idx % 3]
    }));
  
  return [...demoTasks, ...additionalTasks];
})();
```

## Recommended Approach

I recommend implementing **both fixes** for robustness:

1. **Fix `demoData.ts`** - Ensures all initial tasks have `originalId` set from the start
2. **Fix `useSimulation.ts`** - Makes the fallback logic more robust for any edge cases

## Visual Explanation

```text
Before Fix:
┌─────────────────────────────────────────────────────────┐
│ Initial Task: id='retail-1', originalId=undefined       │
│ Fallback: 'retail-1'.split('-')[0] = 'retail'          │
│ Pool check: 'retail-1' !== 'retail' → NOT BLOCKED! ❌   │
└─────────────────────────────────────────────────────────┘

After Fix:
┌─────────────────────────────────────────────────────────┐
│ Initial Task: id='retail-1', originalId='retail-1'      │
│ Blocking ID: 'retail-1'                                 │
│ Pool check: 'retail-1' === 'retail-1' → BLOCKED ✓       │
└─────────────────────────────────────────────────────────┘
```

## Summary of Changes

| File | Change |
|------|--------|
| `src/data/demoData.ts` | Add `originalId: task.id` when creating initial tasks |
| `src/hooks/useSimulation.ts` | Fix fallback logic to return full ID for initial tasks |

## Testing

After implementing:
1. Refresh the demo
2. Wait for a task to reach "expert review" status
3. Verify that the same task template does NOT appear again in the queue
4. Confirm tasks only repeat after they move to "approved" or "learning" status
