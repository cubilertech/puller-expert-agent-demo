import { Task, ChatMessage, CodeDiff, SqlAnnotation, TableColumn, Assumption, TaskData } from '@/types';

// ============================================
// GROCERY & MASS MERCH DEMO DATA
// 5 Complete Tasks with Full Data
// ============================================

// Task 1: FreshPeak Strawberries Spoilage
const task1: Task = {
  id: 'grocery-1',
  title: 'FreshPeak Strawberries Daily Spoilage',
  requestor: 'Tom Anderson, Produce Manager',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 2),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 5),
  priority: 'high',
  description: 'What was the daily spoilage for FreshPeak Strawberries last week?',
  source: 'email',
  industry: 'grocery-mass-merch',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 87
};

const task1Messages: ChatMessage[] = [
  {
    id: 'grocery-1-msg-1',
    sender: 'user',
    content: 'What was the daily spoilage for FreshPeak Strawberries last week?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'text'
  },
  {
    id: 'grocery-1-msg-2',
    sender: 'agent',
    content: 'Analyzed spoilage data for FreshPeak Strawberries. Showing daily waste by units and cost.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'action',
    assumptions: [
      'Spoilage = units marked as waste/shrink',
      'Last week = Mon-Sun of prior week',
      'Cost calculated at wholesale price'
    ]
  }
];

const task1Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    DATE(w.waste_date) AS spoilage_date,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(w.units) AS units_spoiled,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(w.units * p.wholesale_cost) AS spoilage_cost' },
  { lineNumber: 5, type: 'unchanged', content: 'FROM waste_log w' },
  { lineNumber: 6, type: 'unchanged', content: 'JOIN products p ON w.product_id = p.product_id' },
  { lineNumber: 7, type: 'unchanged', content: "WHERE p.product_name = 'FreshPeak Strawberries'" },
  { lineNumber: 8, type: 'unchanged', content: "    AND DATE(w.waste_date) BETWEEN '2025-01-06' AND '2025-01-12'" },
  { lineNumber: 9, type: 'unchanged', content: 'GROUP BY DATE(w.waste_date)' },
  { lineNumber: 10, type: 'unchanged', content: 'ORDER BY spoilage_date;' }
];

const task1Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 4, title: 'Spoilage Metrics', description: 'Daily units and cost of spoiled product', type: 'selection' },
  { lineStart: 5, lineEnd: 6, title: 'Data Sources', description: 'Waste log joined with product pricing', type: 'source' },
  { lineStart: 7, lineEnd: 8, title: 'Filters', description: 'FreshPeak Strawberries, last week date range', type: 'filter' },
  { lineStart: 9, lineEnd: 10, title: 'Grouping', description: 'Daily aggregation, chronological order', type: 'grouping' }
];

const task1TableColumns: TableColumn[] = [
  { key: 'spoilage_date', label: 'Date', align: 'left' },
  { key: 'units_spoiled', label: 'Units Spoiled', align: 'right' },
  { key: 'spoilage_cost', label: 'Cost', align: 'right' }
];

const task1TableData = [
  { spoilage_date: '2025-01-06', units_spoiled: 34, spoilage_cost: '$119.00' },
  { spoilage_date: '2025-01-07', units_spoiled: 28, spoilage_cost: '$98.00' },
  { spoilage_date: '2025-01-08', units_spoiled: 41, spoilage_cost: '$143.50' },
  { spoilage_date: '2025-01-09', units_spoiled: 52, spoilage_cost: '$182.00' },
  { spoilage_date: '2025-01-10', units_spoiled: 67, spoilage_cost: '$234.50' },
  { spoilage_date: '2025-01-11', units_spoiled: 89, spoilage_cost: '$311.50' },
  { spoilage_date: '2025-01-12', units_spoiled: 45, spoilage_cost: '$157.50' }
];

const task1Assumptions: Assumption[] = [
  { id: '1', text: 'Spoilage = units logged as waste/shrink in waste_log', includeInMessage: true },
  { id: '2', text: 'Cost calculated using wholesale price ($3.50/unit)', includeInMessage: true },
  { id: '3', text: 'Includes all stores aggregated', includeInMessage: false }
];

const task1ResponseMessage = `**Weekly spoilage summary** for FreshPeak Strawberries:

- **Total Units Spoiled**: 356 units
- **Total Cost**: $1,246.00
- **Peak Day**: Saturday (89 units, $311.50)

**Trend**: Spoilage increased steadily from Monday to Saturday, with a sharp drop on Sunday. Consider reducing Saturday shipments or earlier markdowns on Friday.`;


// Task 2: PureLeaf Kale Mix Under-Ordering
const task2: Task = {
  id: 'grocery-2',
  title: 'PureLeaf Kale Mix Under-Ordering Stores',
  requestor: 'Diana Ross, Category Manager',
  status: 'review',
  timestamp: new Date(Date.now() - 1000 * 60 * 18),
  priority: 'medium',
  description: 'Which stores are consistently under-ordering PureLeaf Kale Mix?',
  source: 'slack',
  industry: 'grocery-mass-merch',
  flags: { urgency: false, humanRequested: true, vip: false },
  confidence: 68
};

const task2Messages: ChatMessage[] = [
  {
    id: 'grocery-2-msg-1',
    sender: 'user',
    content: 'Which stores are consistently under-ordering PureLeaf Kale Mix?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'text'
  },
  {
    id: 'grocery-2-msg-2',
    sender: 'agent',
    content: 'Identified stores with stockout frequency above 30% for PureLeaf Kale Mix over the last 4 weeks.',
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    type: 'action',
    assumptions: [
      'Under-ordering = stockout occurred 30%+ of days',
      'Analyzed last 4 weeks of inventory data',
      'Stockout = end-of-day inventory < safety stock'
    ]
  }
];

const task2Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    s.store_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    s.region,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(CASE WHEN i.on_hand < i.safety_stock THEN 1 END) AS stockout_days,' },
  { lineNumber: 5, type: 'unchanged', content: '    COUNT(*) AS total_days,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(COUNT(CASE WHEN i.on_hand < i.safety_stock THEN 1 END) * 100.0 / COUNT(*), 1) AS stockout_pct' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM daily_inventory i' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN stores s ON i.store_id = s.store_id' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN products p ON i.product_id = p.product_id' },
  { lineNumber: 10, type: 'unchanged', content: "WHERE p.product_name = 'PureLeaf Kale Mix'" },
  { lineNumber: 11, type: 'unchanged', content: '    AND i.snapshot_date >= CURRENT_DATE - 28' },
  { lineNumber: 12, type: 'unchanged', content: 'GROUP BY s.store_id, s.store_name, s.region' },
  { lineNumber: 13, type: 'unchanged', content: 'HAVING COUNT(CASE WHEN i.on_hand < i.safety_stock THEN 1 END) * 100.0 / COUNT(*) >= 30' },
  { lineNumber: 14, type: 'unchanged', content: 'ORDER BY stockout_pct DESC;' }
];

const task2Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Stockout Metrics', description: 'Calculating stockout days and percentage per store', type: 'aggregation' },
  { lineStart: 7, lineEnd: 9, title: 'Data Sources', description: 'Daily inventory joined with stores and products', type: 'source' },
  { lineStart: 10, lineEnd: 11, title: 'Filters', description: 'Product filter and 4-week lookback', type: 'filter' },
  { lineStart: 12, lineEnd: 14, title: 'Grouping & Threshold', description: 'Store-level aggregation with 30% stockout threshold', type: 'grouping' }
];

const task2TableColumns: TableColumn[] = [
  { key: 'store_name', label: 'Store', align: 'left' },
  { key: 'region', label: 'Region', align: 'left' },
  { key: 'stockout_days', label: 'Stockout Days', align: 'right' },
  { key: 'stockout_pct', label: 'Stockout %', align: 'right' }
];

const task2TableData = [
  { store_name: 'Westside Market #127', region: 'West', stockout_days: 15, stockout_pct: '53.6%' },
  { store_name: 'Downtown Fresh #089', region: 'Central', stockout_days: 13, stockout_pct: '46.4%' },
  { store_name: 'Northgate Grocery #203', region: 'North', stockout_days: 12, stockout_pct: '42.9%' },
  { store_name: 'Lakeside Foods #156', region: 'East', stockout_days: 11, stockout_pct: '39.3%' },
  { store_name: 'Valley Market #312', region: 'South', stockout_days: 9, stockout_pct: '32.1%' }
];

const task2Assumptions: Assumption[] = [
  { id: '1', text: 'Under-ordering = stockout occurred on 30%+ of days', includeInMessage: true },
  { id: '2', text: 'Stockout = end-of-day inventory below safety stock level', includeInMessage: true },
  { id: '3', text: 'Analysis period: last 28 days', includeInMessage: true }
];

const task2ResponseMessage = `**5 stores** are consistently under-ordering PureLeaf Kale Mix:

| Store | Region | Stockout Rate |
|-------|--------|---------------|
| Westside Market #127 | West | 53.6% |
| Downtown Fresh #089 | Central | 46.4% |
| Northgate Grocery #203 | North | 42.9% |

**Recommendation**: Increase automatic reorder quantities by 20-30% at these locations and review demand forecasting models.`;


// Task 3: OmegaEggs Substitution Analysis
const task3: Task = {
  id: 'grocery-3',
  title: 'OmegaEggs 12ct Substitution Patterns',
  requestor: 'Kevin O\'Brien, Fresh Ops',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 32),
  priority: 'medium',
  description: 'For OmegaEggs 12ct, how often are customers offered a substitute and what do they accept?',
  source: 'email',
  industry: 'grocery-mass-merch',
  flags: { urgency: false, humanRequested: false, vip: true },
  confidence: 82
};

const task3Messages: ChatMessage[] = [
  {
    id: 'grocery-3-msg-1',
    sender: 'user',
    content: 'For OmegaEggs 12ct, how often are customers offered a substitute and what do they accept?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    type: 'text'
  },
  {
    id: 'grocery-3-msg-2',
    sender: 'agent',
    content: 'Analyzing substitution patterns for OmegaEggs 12ct in online orders over the last 30 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 32),
    type: 'action',
    assumptions: [
      'Substitution offered when original item unavailable',
      'Online/pickup orders only (substitution tracked)',
      'Acceptance = customer did not refund the substitute'
    ]
  }
];

const task3Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    sub.substitute_product AS offered_substitute,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(*) AS times_offered,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(CASE WHEN sub.accepted = true THEN 1 ELSE 0 END) AS times_accepted,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(SUM(CASE WHEN sub.accepted = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS acceptance_rate' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM substitutions sub' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN products p ON sub.original_product_id = p.product_id' },
  { lineNumber: 8, type: 'unchanged', content: "WHERE p.product_name = 'OmegaEggs 12ct'" },
  { lineNumber: 9, type: 'unchanged', content: '    AND sub.sub_date >= CURRENT_DATE - 30' },
  { lineNumber: 10, type: 'unchanged', content: 'GROUP BY sub.substitute_product' },
  { lineNumber: 11, type: 'unchanged', content: 'ORDER BY times_offered DESC;' }
];

const task3Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Substitution Metrics', description: 'Offered count, accepted count, and acceptance rate', type: 'aggregation' },
  { lineStart: 6, lineEnd: 7, title: 'Data Sources', description: 'Substitutions table joined with products', type: 'source' },
  { lineStart: 8, lineEnd: 9, title: 'Filters', description: 'OmegaEggs 12ct, last 30 days', type: 'filter' },
  { lineStart: 10, lineEnd: 11, title: 'Grouping', description: 'By substitute product, ordered by frequency', type: 'grouping' }
];

const task3TableColumns: TableColumn[] = [
  { key: 'offered_substitute', label: 'Substitute Offered', align: 'left' },
  { key: 'times_offered', label: 'Times Offered', align: 'right' },
  { key: 'times_accepted', label: 'Accepted', align: 'right' },
  { key: 'acceptance_rate', label: 'Accept Rate', align: 'right' }
];

const task3TableData = [
  { offered_substitute: 'OmegaEggs 18ct', times_offered: 234, times_accepted: 198, acceptance_rate: '84.6%' },
  { offered_substitute: 'FarmFresh Eggs 12ct', times_offered: 187, times_accepted: 112, acceptance_rate: '59.9%' },
  { offered_substitute: 'OmegaEggs 6ct (x2)', times_offered: 89, times_accepted: 67, acceptance_rate: '75.3%' },
  { offered_substitute: 'OrganicChoice Eggs 12ct', times_offered: 56, times_accepted: 41, acceptance_rate: '73.2%' }
];

const task3Assumptions: Assumption[] = [
  { id: '1', text: 'Substitution offered when original item out of stock at fulfillment', includeInMessage: true },
  { id: '2', text: 'Online/pickup orders only (in-store substitutions not tracked)', includeInMessage: true },
  { id: '3', text: 'Acceptance = customer kept substitute (no refund requested)', includeInMessage: true }
];

const task3ResponseMessage = `**Substitution analysis** for OmegaEggs 12ct (last 30 days):

**Top Substitutes by Acceptance Rate:**
1. OmegaEggs 18ct - 84.6% acceptance (234 offers)
2. OmegaEggs 6ct (x2) - 75.3% acceptance (89 offers)
3. OrganicChoice Eggs 12ct - 73.2% acceptance (56 offers)

**Key Insight**: Same-brand substitutes have significantly higher acceptance. Prioritize OmegaEggs 18ct as the default substitute.`;


// Task 4: ValueBrew Coffee Repeat Cycle
const task4: Task = {
  id: 'grocery-4',
  title: 'ValueBrew Coffee Repeat Purchase Cycle',
  requestor: 'Samantha Lee, Loyalty Team',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 48),
  priority: 'low',
  description: "What's the typical number of days between repeat purchases of ValueBrew Coffee?",
  source: 'meeting',
  industry: 'grocery-mass-merch',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 95
};

const task4Messages: ChatMessage[] = [
  {
    id: 'grocery-4-msg-1',
    sender: 'user',
    content: 'What\'s the typical number of days between repeat purchases of ValueBrew Coffee?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    type: 'text'
  },
  {
    id: 'grocery-4-msg-2',
    sender: 'agent',
    content: 'Calculated median and average days between ValueBrew Coffee purchases for repeat customers.',
    timestamp: new Date(Date.now() - 1000 * 60 * 48),
    type: 'action',
    assumptions: [
      'Repeat customer = 2+ purchases of this product',
      'Gap calculated between consecutive purchases',
      'Median used for "typical" (less sensitive to outliers)'
    ]
  }
];

const task4Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH purchase_gaps AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT customer_id,' },
  { lineNumber: 3, type: 'unchanged', content: '           order_date,' },
  { lineNumber: 4, type: 'unchanged', content: '           LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_order,' },
  { lineNumber: 5, type: 'unchanged', content: '           DATEDIFF(order_date, LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) AS days_gap' },
  { lineNumber: 6, type: 'unchanged', content: '    FROM orders o' },
  { lineNumber: 7, type: 'unchanged', content: '    JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 8, type: 'unchanged', content: '    JOIN products p ON oi.product_id = p.product_id' },
  { lineNumber: 9, type: 'unchanged', content: "    WHERE p.product_name = 'ValueBrew Coffee'" },
  { lineNumber: 10, type: 'unchanged', content: ')' },
  { lineNumber: 11, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 12, type: 'unchanged', content: '    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_gap) AS median_days,' },
  { lineNumber: 13, type: 'unchanged', content: '    AVG(days_gap) AS avg_days,' },
  { lineNumber: 14, type: 'unchanged', content: '    MIN(days_gap) AS min_days,' },
  { lineNumber: 15, type: 'unchanged', content: '    MAX(days_gap) AS max_days' },
  { lineNumber: 16, type: 'unchanged', content: 'FROM purchase_gaps' },
  { lineNumber: 17, type: 'unchanged', content: 'WHERE days_gap IS NOT NULL;' }
];

const task4Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 10, title: 'Purchase Gaps CTE', description: 'Calculating days between consecutive purchases per customer', type: 'aggregation' },
  { lineStart: 11, lineEnd: 15, title: 'Summary Statistics', description: 'Median, average, min, max gap in days', type: 'selection' },
  { lineStart: 16, lineEnd: 17, title: 'Filter', description: 'Excluding first purchases (no previous order)', type: 'filter' }
];

const task4TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'value', label: 'Days', align: 'right' }
];

const task4TableData = [
  { metric: 'Median Gap', value: 21 },
  { metric: 'Average Gap', value: 24.3 },
  { metric: 'Minimum Gap', value: 7 },
  { metric: 'Maximum Gap', value: 89 },
  { metric: 'Repeat Customers Analyzed', value: 4287 }
];

const task4Assumptions: Assumption[] = [
  { id: '1', text: 'Repeat customer = 2+ purchases of ValueBrew Coffee', includeInMessage: true },
  { id: '2', text: 'Median used as "typical" (less affected by outliers)', includeInMessage: true },
  { id: '3', text: 'All-time purchase history analyzed', includeInMessage: false }
];

const task4ResponseMessage = `**Typical repeat purchase cycle** for ValueBrew Coffee: **21 days** (median)

**Distribution Summary:**
- Median: 21 days
- Average: 24.3 days
- Range: 7 to 89 days
- Sample Size: 4,287 repeat customers

**Insight**: Most customers repurchase every 3 weeks. Consider timing loyalty offers around day 18-20 to encourage on-time repurchase.`;


// Task 5: GreenGlow Avocados Sell-Through
const task5: Task = {
  id: 'grocery-5',
  title: 'GreenGlow Avocados Sell-Through Rate',
  requestor: 'Maria Garcia, Produce Buyer',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 62),
  priority: 'medium',
  description: "What's the sell-through rate for GreenGlow Avocados by store region?",
  source: 'email',
  industry: 'grocery-mass-merch',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 89
};

const task5Messages: ChatMessage[] = [
  {
    id: 'grocery-5-msg-1',
    sender: 'user',
    content: 'What\'s the sell-through rate for GreenGlow Avocados by store region?',
    timestamp: new Date(Date.now() - 1000 * 60 * 75),
    type: 'text'
  },
  {
    id: 'grocery-5-msg-2',
    sender: 'agent',
    content: 'Calculating sell-through rates for GreenGlow Avocados across all regions for the last 4 weeks.',
    timestamp: new Date(Date.now() - 1000 * 60 * 62),
    type: 'action',
    assumptions: [
      'Sell-through = units sold / units received',
      'Last 4 weeks of receiving and sales data',
      'Aggregated by store region'
    ]
  }
];

const task5Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    s.region,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(sl.units) AS units_sold,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(r.units_received) AS units_received,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(SUM(sl.units) * 100.0 / NULLIF(SUM(r.units_received), 0), 1) AS sell_through_pct' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM sales sl' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN stores s ON sl.store_id = s.store_id' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN products p ON sl.product_id = p.product_id' },
  { lineNumber: 9, type: 'unchanged', content: 'LEFT JOIN receiving r ON r.store_id = sl.store_id AND r.product_id = sl.product_id' },
  { lineNumber: 10, type: 'unchanged', content: "WHERE p.product_name = 'GreenGlow Avocados'" },
  { lineNumber: 11, type: 'unchanged', content: '    AND sl.txn_date >= CURRENT_DATE - 28' },
  { lineNumber: 12, type: 'unchanged', content: 'GROUP BY s.region' },
  { lineNumber: 13, type: 'unchanged', content: 'ORDER BY sell_through_pct DESC;' }
];

const task5Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Sell-Through Calculation', description: 'Units sold / units received as percentage', type: 'aggregation' },
  { lineStart: 6, lineEnd: 9, title: 'Data Sources', description: 'Sales, stores, products, and receiving data', type: 'source' },
  { lineStart: 10, lineEnd: 11, title: 'Filters', description: 'GreenGlow Avocados, last 4 weeks', type: 'filter' },
  { lineStart: 12, lineEnd: 13, title: 'Grouping', description: 'By region, ordered by sell-through rate', type: 'grouping' }
];

const task5TableColumns: TableColumn[] = [
  { key: 'region', label: 'Region', align: 'left' },
  { key: 'units_sold', label: 'Sold', align: 'right' },
  { key: 'units_received', label: 'Received', align: 'right' },
  { key: 'sell_through_pct', label: 'Sell-Through', align: 'right' }
];

const task5TableData = [
  { region: 'West Coast', units_sold: 12450, units_received: 13200, sell_through_pct: '94.3%' },
  { region: 'Southwest', units_sold: 8920, units_received: 9800, sell_through_pct: '91.0%' },
  { region: 'Midwest', units_sold: 6780, units_received: 7800, sell_through_pct: '86.9%' },
  { region: 'Northeast', units_sold: 5430, units_received: 6500, sell_through_pct: '83.5%' },
  { region: 'Southeast', units_sold: 4200, units_received: 5200, sell_through_pct: '80.8%' }
];

const task5Assumptions: Assumption[] = [
  { id: '1', text: 'Sell-through = (units sold / units received) × 100', includeInMessage: true },
  { id: '2', text: 'Analysis period: last 4 weeks', includeInMessage: true },
  { id: '3', text: 'Aggregated across all stores within each region', includeInMessage: false }
];

const task5ResponseMessage = `**Sell-through rates** for GreenGlow Avocados by region:

| Region | Sell-Through |
|--------|--------------|
| West Coast | 94.3% |
| Southwest | 91.0% |
| Midwest | 86.9% |
| Northeast | 83.5% |
| Southeast | 80.8% |

**Insight**: West Coast and Southwest are performing excellently (90%+). Consider reducing shipments to Southeast where 1 in 5 avocados are going unsold.`;


// Export all tasks and task data
export const groceryMassMerchTasks: Task[] = [task1, task2, task3, task4, task5];

export const groceryMassMerchTaskData: Record<string, TaskData> = {
  'grocery-1': {
    messages: task1Messages,
    code: task1Code,
    annotations: task1Annotations,
    tableColumns: task1TableColumns,
    tableData: task1TableData,
    assumptions: task1Assumptions,
    responseMessage: task1ResponseMessage,
    knowledgeUpdate: 'SPOILAGE_ANALYSIS: Use waste_log table, calculate cost at wholesale price'
  },
  'grocery-2': {
    messages: task2Messages,
    code: task2Code,
    annotations: task2Annotations,
    tableColumns: task2TableColumns,
    tableData: task2TableData,
    assumptions: task2Assumptions,
    responseMessage: task2ResponseMessage,
    knowledgeUpdate: 'STOCKOUT_THRESHOLD: Under-ordering = stockouts on 30%+ of days'
  },
  'grocery-3': {
    messages: task3Messages,
    code: task3Code,
    annotations: task3Annotations,
    tableColumns: task3TableColumns,
    tableData: task3TableData,
    assumptions: task3Assumptions,
    responseMessage: task3ResponseMessage,
    knowledgeUpdate: 'SUBSTITUTION_TRACKING: Same-brand subs have higher acceptance rates'
  },
  'grocery-4': {
    messages: task4Messages,
    code: task4Code,
    annotations: task4Annotations,
    tableColumns: task4TableColumns,
    tableData: task4TableData,
    assumptions: task4Assumptions,
    responseMessage: task4ResponseMessage,
    knowledgeUpdate: 'REPEAT_CYCLE: Use LAG() for purchase gap analysis, median for typical'
  },
  'grocery-5': {
    messages: task5Messages,
    code: task5Code,
    annotations: task5Annotations,
    tableColumns: task5TableColumns,
    tableData: task5TableData,
    assumptions: task5Assumptions,
    responseMessage: task5ResponseMessage,
    knowledgeUpdate: 'SELL_THROUGH: sold/received ratio, use NULLIF to avoid division by zero'
  }
};
