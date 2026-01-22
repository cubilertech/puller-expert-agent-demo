

# Plan: Remove Ghost Tasks and Expand Demo Data

## Overview
Remove the ghost task system that's causing quality issues and expand the existing demo data to 150 high-quality tasks (5x current count) to ensure the demo runs with consistent quality content.

## Current State
- 30 complete tasks with full data (SQL, results, messages) across 6 industries
- 5 ghost task templates with no real data causing demo quality issues
- Ghost tasks create duplicates and show empty/incomplete content

## Implementation Plan

### Step 1: Remove Ghost Task System

**File: `src/data/demoData.ts`**
- Delete the `ghostTaskTemplates` array entirely
- Remove related exports

**File: `src/hooks/useSimulation.ts`**
- Remove the `addGhostTask` function completely
- Remove the `usedTemplateIndices` ref
- Remove the `taskCounterRef` ref
- Remove the ghost task interval timer from useEffect
- Keep only `progressTasks` and `simulateFeedback` for pipeline progression
- Update the return statement (no longer returning `addGhostTask`)

### Step 2: Expand Demo Data (5x per industry)

Add 20 new tasks to each industry file (currently 5 each), bringing total to 25 per industry = 150 total tasks.

**Files to expand:**

| File | Current Tasks | New Tasks | Total |
|------|---------------|-----------|-------|
| `src/data/industries/retailEcommerce.ts` | 5 | 20 | 25 |
| `src/data/industries/groceryMassMerch.ts` | 5 | 20 | 25 |
| `src/data/industries/cpgConsumerBrands.ts` | 5 | 20 | 25 |
| `src/data/industries/hospitalityRestaurants.ts` | 5 | 20 | 25 |
| `src/data/industries/fashionShoes.ts` | 5 | 20 | 25 |
| `src/data/industries/mediaEntertainment.ts` | 5 | 20 | 25 |

**New task ideas per industry:**

**Retail/E-commerce:**
- Cart abandonment analysis by device type
- Promo code redemption patterns
- Category cross-sell opportunities
- Customer acquisition cost by channel
- Product return rate drivers
- Seasonal demand forecasting
- Price elasticity analysis
- Customer lifetime value segments
- Inventory turnover optimization
- Shipping cost vs delivery speed tradeoffs

**Grocery/Mass Merch:**
- Fresh produce shrinkage analysis
- Private label vs national brand performance
- Peak shopping hour staffing optimization
- Circular ad effectiveness
- Basket size by day of week
- Loyalty program engagement metrics
- Out-of-stock impact analysis
- Supplier lead time variance
- Markdown timing optimization
- Store clustering by demographics

**CPG/Consumer Brands:**
- Trade promotion ROI by retailer
- Market share trend analysis
- Distribution void identification
- Pack size performance comparison
- New product launch velocity
- Competitor pricing intelligence
- Shelf placement impact study
- Regional flavor preferences
- Seasonal SKU rationalization
- Co-op marketing effectiveness

**Hospitality/Restaurants:**
- Table turnover optimization
- Menu item profitability matrix
- Reservation no-show prediction
- Labor cost vs traffic patterns
- Delivery vs dine-in margins
- Happy hour performance metrics
- Catering revenue analysis
- Customer complaint patterns
- Peak time capacity planning
- Beverage attachment rates

**Fashion/Shoes:**
- Size curve accuracy analysis
- Color trend velocity tracking
- Return rate by category
- Markdown depth optimization
- Influencer collaboration ROI
- Seasonal carryover analysis
- Store vs online size preferences
- New arrival sell-through rates
- Customer style clustering
- Fabric cost vs margin analysis

**Media/Entertainment:**
- Content engagement heatmaps
- Subscriber churn prediction
- Ad inventory fill rates
- Cross-platform viewing patterns
- Premiere day performance metrics
- Binge completion rates
- Social sentiment correlation
- Regional content preferences
- Subscription tier migration
- Creator performance analytics

### Step 3: Update Initial Task Loading

**File: `src/data/demoConfig.ts`**
- Update the quick-demo preset to load from the expanded pool
- Ensure variety in initial task selection

### Step 4: Clean Up Index.tsx (if needed)

**File: `src/pages/Index.tsx`**
- Remove any references to ghost task functionality
- Keep the simulation hook but it will only progress existing tasks

## Data Structure for New Tasks

Each new task needs complete data following the existing pattern:

```text
Task Object:
- id: unique identifier (e.g., 'retail-6', 'retail-7', etc.)
- title: descriptive task name
- requestor: person/team requesting
- status: initial status (mix of 'review', 'sent', 'building', etc.)
- timestamp: Date object
- priority: 'high' | 'medium' | 'low'
- description: brief description
- source: 'email' | 'slack' | 'meeting'
- flags: { urgency, humanRequested, vip }
- confidence: number (50-99)

TaskData Object:
- messages: ChatMessage[] (3-5 messages showing conversation)
- code: CodeDiff[] (SQL query with syntax highlighting)
- annotations: SqlAnnotation[] (explanatory notes)
- tableColumns: TableColumn[] (result column definitions)
- tableData: object[] (sample result rows)
- assumptions: Assumption[] (2-3 assumptions made)
- responseMessage: string (summary for requestor)
- knowledgeUpdate: string (what the system learned)
```

## File Changes Summary

| File | Action |
|------|--------|
| `src/data/demoData.ts` | Remove ghostTaskTemplates |
| `src/hooks/useSimulation.ts` | Remove addGhostTask and related code |
| `src/data/industries/retailEcommerce.ts` | Add 20 new complete tasks |
| `src/data/industries/groceryMassMerch.ts` | Add 20 new complete tasks |
| `src/data/industries/cpgConsumerBrands.ts` | Add 20 new complete tasks |
| `src/data/industries/hospitalityRestaurants.ts` | Add 20 new complete tasks |
| `src/data/industries/fashionShoes.ts` | Add 20 new complete tasks |
| `src/data/industries/mediaEntertainment.ts` | Add 20 new complete tasks |

## Expected Outcome
- No more ghost tasks with empty/incomplete content
- 150 high-quality tasks with full SQL, results, and messages
- Demo runs smoothly with consistent quality throughout
- Tasks progress through pipeline using existing simulation logic

