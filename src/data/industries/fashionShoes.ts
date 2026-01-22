import { Task, ChatMessage, CodeDiff, SqlAnnotation, TableColumn, Assumption, TaskData } from '@/types';

// ============================================
// FASHION & SHOES DEMO DATA
// 5 Complete Tasks with Full Data
// ============================================

// Task 1: UrbanLayer Jacket Returns
const task1: Task = {
  id: 'fashion-1',
  title: 'UrbanLayer Jacket Daily Returns',
  requestor: 'Sophia Martinez, Returns Analyst',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 2),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 9),
  priority: 'high',
  description: "What's the daily return rate for UrbanLayer Jacket this month?",
  source: 'email',
  industry: 'fashion-shoes',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 86
};

const task1Messages: ChatMessage[] = [
  {
    id: 'fashion-1-msg-1',
    sender: 'user',
    content: 'What\'s the daily return rate for UrbanLayer Jacket this month?',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    type: 'text'
  },
  {
    id: 'fashion-1-msg-2',
    sender: 'agent',
    content: 'Calculated daily return rates for UrbanLayer Jacket in January 2025.',
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
    type: 'action',
    assumptions: [
      'Return rate = returns / units sold on that day',
      'This month = January 2025',
      'Matched returns to original sale date'
    ]
  }
];

const task1Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    s.sale_date,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(s.quantity) AS units_sold,' },
  { lineNumber: 4, type: 'unchanged', content: '    COALESCE(SUM(r.quantity), 0) AS units_returned,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(COALESCE(SUM(r.quantity), 0) * 100.0 / NULLIF(SUM(s.quantity), 0), 1) AS return_rate' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM sales s' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN products p ON s.product_id = p.product_id' },
  { lineNumber: 8, type: 'unchanged', content: 'LEFT JOIN returns r ON s.sale_id = r.original_sale_id' },
  { lineNumber: 9, type: 'unchanged', content: "WHERE p.product_name = 'UrbanLayer Jacket'" },
  { lineNumber: 10, type: 'unchanged', content: "    AND s.sale_date BETWEEN '2025-01-01' AND '2025-01-31'" },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY s.sale_date' },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY s.sale_date;' }
];

const task1Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Return Metrics', description: 'Date, units sold, returned, and return rate', type: 'selection' },
  { lineStart: 6, lineEnd: 8, title: 'Data Sources', description: 'Sales with products and left join to returns', type: 'source' },
  { lineStart: 9, lineEnd: 10, title: 'Filters', description: 'UrbanLayer Jacket, January 2025', type: 'filter' },
  { lineStart: 11, lineEnd: 12, title: 'Grouping', description: 'Daily aggregation, chronological', type: 'grouping' }
];

const task1TableColumns: TableColumn[] = [
  { key: 'sale_date', label: 'Date', align: 'left' },
  { key: 'units_sold', label: 'Sold', align: 'right' },
  { key: 'units_returned', label: 'Returned', align: 'right' },
  { key: 'return_rate', label: 'Rate', align: 'right' }
];

const task1TableData = [
  { sale_date: '2025-01-06', units_sold: 234, units_returned: 28, return_rate: '12.0%' },
  { sale_date: '2025-01-07', units_sold: 198, units_returned: 31, return_rate: '15.7%' },
  { sale_date: '2025-01-08', units_sold: 287, units_returned: 45, return_rate: '15.7%' },
  { sale_date: '2025-01-09', units_sold: 312, units_returned: 52, return_rate: '16.7%' },
  { sale_date: '2025-01-10', units_sold: 276, units_returned: 38, return_rate: '13.8%' }
];

const task1Assumptions: Assumption[] = [
  { id: '1', text: 'Return rate = returns matched to original sale date', includeInMessage: true },
  { id: '2', text: 'Analysis period: January 2025', includeInMessage: true },
  { id: '3', text: 'All return reasons included (not filtered)', includeInMessage: false }
];

const task1ResponseMessage = `**Daily return rate** for UrbanLayer Jacket (January 2025):

**Average Return Rate: 14.8%**

| Date | Sold | Returned | Rate |
|------|------|----------|------|
| Jan 6 | 234 | 28 | 12.0% |
| Jan 7 | 198 | 31 | 15.7% |
| Jan 8 | 287 | 45 | 15.7% |
| Jan 9 | 312 | 52 | 16.7% ⚠️ |

**Concern**: Return rate spiked to 16.7% on Jan 9. Recommend reviewing fit feedback for that batch.`;


// Task 2: FlexFit Running Shoes Size Distribution
const task2: Task = {
  id: 'fashion-2',
  title: 'FlexFit Running Shoes Size Variant Sales',
  requestor: 'Ryan Kim, Merchandising',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 2),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 17),
  priority: 'medium',
  description: 'How do FlexFit Running Shoes sales break down by size?',
  source: 'slack',
  industry: 'fashion-shoes',
  flags: { urgency: false, humanRequested: true, vip: false },
  confidence: 93
};

const task2Messages: ChatMessage[] = [
  {
    id: 'fashion-2-msg-1',
    sender: 'user',
    content: 'How do FlexFit Running Shoes sales break down by size?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'text'
  },
  {
    id: 'fashion-2-msg-2',
    sender: 'agent',
    content: 'Analyzing size distribution for FlexFit Running Shoes sales in the last 90 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 17),
    type: 'action',
    assumptions: [
      'Size from product variant attribute',
      'Last 90 days of sales',
      'All colors/styles combined'
    ]
  }
];

const task2Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    pv.size,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(s.quantity) AS units_sold,' },
  { lineNumber: 4, type: 'unchanged', content: '    ROUND(SUM(s.quantity) * 100.0 / SUM(SUM(s.quantity)) OVER(), 1) AS pct_of_total,' },
  { lineNumber: 5, type: 'unchanged', content: '    SUM(s.quantity * s.unit_price) AS revenue' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM sales s' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN product_variants pv ON s.variant_id = pv.variant_id' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN products p ON pv.product_id = p.product_id' },
  { lineNumber: 9, type: 'unchanged', content: "WHERE p.product_name = 'FlexFit Running Shoes'" },
  { lineNumber: 10, type: 'unchanged', content: '    AND s.sale_date >= CURRENT_DATE - 90' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY pv.size' },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY units_sold DESC;' }
];

const task2Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Size Metrics', description: 'Size, units, percentage, and revenue', type: 'selection' },
  { lineStart: 6, lineEnd: 8, title: 'Data Sources', description: 'Sales joined with variants and products', type: 'source' },
  { lineStart: 9, lineEnd: 10, title: 'Filters', description: 'FlexFit Running Shoes, last 90 days', type: 'filter' },
  { lineStart: 11, lineEnd: 12, title: 'Grouping', description: 'By size, ordered by volume', type: 'grouping' }
];

const task2TableColumns: TableColumn[] = [
  { key: 'size', label: 'Size', align: 'left' },
  { key: 'units_sold', label: 'Units', align: 'right' },
  { key: 'pct_of_total', label: '% of Total', align: 'right' },
  { key: 'revenue', label: 'Revenue', align: 'right' }
];

const task2TableData = [
  { size: '10', units_sold: 1234, pct_of_total: '18.4%', revenue: '$147,080' },
  { size: '9.5', units_sold: 1156, pct_of_total: '17.2%', revenue: '$137,764' },
  { size: '10.5', units_sold: 1089, pct_of_total: '16.2%', revenue: '$129,811' },
  { size: '9', units_sold: 987, pct_of_total: '14.7%', revenue: '$117,651' },
  { size: '11', units_sold: 876, pct_of_total: '13.1%', revenue: '$104,424' },
  { size: '8.5', units_sold: 654, pct_of_total: '9.8%', revenue: '$77,977' }
];

const task2Assumptions: Assumption[] = [
  { id: '1', text: 'Size extracted from product variant attributes', includeInMessage: true },
  { id: '2', text: 'Last 90 days of sales data', includeInMessage: true },
  { id: '3', text: 'All colors and styles combined', includeInMessage: false }
];

const task2ResponseMessage = `**Size distribution** for FlexFit Running Shoes:

**Top Selling Sizes:**
1. Size 10 - 18.4% of sales ($147K)
2. Size 9.5 - 17.2% of sales ($138K)
3. Size 10.5 - 16.2% of sales ($130K)

**Insight**: Sizes 9.5-10.5 account for **51.8%** of all sales. Ensure higher inventory allocation for this range to minimize stockouts.`;


// Task 3: GlowWeave Leggings Purchase Interval
const task3: Task = {
  id: 'fashion-3',
  title: 'GlowWeave Leggings Purchase Intervals',
  requestor: 'Amanda Chen, CRM Lead',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 38),
  priority: 'medium',
  description: "What's the average time between repeat purchases of GlowWeave Leggings?",
  source: 'email',
  industry: 'fashion-shoes',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 87
};

const task3Messages: ChatMessage[] = [
  {
    id: 'fashion-3-msg-1',
    sender: 'user',
    content: 'What\'s the average time between repeat purchases of GlowWeave Leggings?',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    type: 'text'
  },
  {
    id: 'fashion-3-msg-2',
    sender: 'agent',
    content: 'Calculating purchase intervals for repeat GlowWeave Leggings customers.',
    timestamp: new Date(Date.now() - 1000 * 60 * 38),
    type: 'action',
    assumptions: [
      'Repeat = 2+ purchases of any GlowWeave Leggings variant',
      'Interval = days between consecutive purchases',
      'Median used for typical (less outlier sensitive)'
    ]
  }
];

const task3Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH purchase_gaps AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT customer_id,' },
  { lineNumber: 3, type: 'unchanged', content: '           sale_date,' },
  { lineNumber: 4, type: 'unchanged', content: '           LAG(sale_date) OVER (PARTITION BY customer_id ORDER BY sale_date) AS prev_purchase,' },
  { lineNumber: 5, type: 'unchanged', content: '           DATEDIFF(sale_date, LAG(sale_date) OVER (PARTITION BY customer_id ORDER BY sale_date)) AS days_gap' },
  { lineNumber: 6, type: 'unchanged', content: '    FROM sales s' },
  { lineNumber: 7, type: 'unchanged', content: '    JOIN products p ON s.product_id = p.product_id' },
  { lineNumber: 8, type: 'unchanged', content: "    WHERE p.product_name LIKE 'GlowWeave Leggings%'" },
  { lineNumber: 9, type: 'unchanged', content: ')' },
  { lineNumber: 10, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 11, type: 'unchanged', content: '    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_gap) AS median_days,' },
  { lineNumber: 12, type: 'unchanged', content: '    AVG(days_gap) AS avg_days,' },
  { lineNumber: 13, type: 'unchanged', content: '    MIN(days_gap) AS min_days,' },
  { lineNumber: 14, type: 'unchanged', content: '    MAX(days_gap) AS max_days,' },
  { lineNumber: 15, type: 'unchanged', content: '    COUNT(*) AS repeat_purchases' },
  { lineNumber: 16, type: 'unchanged', content: 'FROM purchase_gaps' },
  { lineNumber: 17, type: 'unchanged', content: 'WHERE days_gap IS NOT NULL;' }
];

const task3Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 9, title: 'Purchase Gaps CTE', description: 'Using LAG to calculate days between purchases', type: 'aggregation' },
  { lineStart: 10, lineEnd: 15, title: 'Interval Statistics', description: 'Median, average, min, max, and count', type: 'selection' },
  { lineStart: 16, lineEnd: 17, title: 'Filter', description: 'Excluding first purchases (no previous)', type: 'filter' }
];

const task3TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'value', label: 'Days', align: 'right' }
];

const task3TableData = [
  { metric: 'Median Interval', value: 68 },
  { metric: 'Average Interval', value: 74.3 },
  { metric: 'Minimum Interval', value: 14 },
  { metric: 'Maximum Interval', value: 245 },
  { metric: 'Repeat Purchases Analyzed', value: 3567 }
];

const task3Assumptions: Assumption[] = [
  { id: '1', text: 'Repeat = 2+ purchases of any GlowWeave Leggings variant', includeInMessage: true },
  { id: '2', text: 'Median used for "typical" interval (less outlier sensitive)', includeInMessage: true },
  { id: '3', text: 'All-time purchase history analyzed', includeInMessage: false }
];

const task3ResponseMessage = `**Typical repurchase interval** for GlowWeave Leggings: **68 days** (median)

**Distribution:**
- Median: 68 days (~2.3 months)
- Average: 74.3 days
- Range: 14 to 245 days
- Sample: 3,567 repeat purchases

**Insight**: Ideal re-engagement window is around day 50-60 (before typical repurchase). Consider automated email campaigns targeting this window.`;


// Task 4: TrailStride Boots Top Stores
const task4: Task = {
  id: 'fashion-4',
  title: 'TrailStride Boots Top Performing Stores',
  requestor: 'Michael Torres, Retail Ops',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 55),
  priority: 'low',
  description: 'Which stores sell the most TrailStride Boots?',
  source: 'meeting',
  industry: 'fashion-shoes',
  flags: { urgency: false, humanRequested: false, vip: true },
  confidence: 94
};

const task4Messages: ChatMessage[] = [
  {
    id: 'fashion-4-msg-1',
    sender: 'user',
    content: 'Which stores sell the most TrailStride Boots?',
    timestamp: new Date(Date.now() - 1000 * 60 * 68),
    type: 'text'
  },
  {
    id: 'fashion-4-msg-2',
    sender: 'agent',
    content: 'Ranking stores by TrailStride Boots sales volume for the current quarter.',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    type: 'action',
    assumptions: [
      'Top = highest units sold',
      'Current quarter = Q1 2025',
      'Physical stores only'
    ]
  }
];

const task4Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    st.store_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    st.region,' },
  { lineNumber: 4, type: 'unchanged', content: '    st.store_type,' },
  { lineNumber: 5, type: 'unchanged', content: '    SUM(s.quantity) AS units_sold,' },
  { lineNumber: 6, type: 'unchanged', content: '    SUM(s.quantity * s.unit_price) AS revenue' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM sales s' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN stores st ON s.store_id = st.store_id' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN products p ON s.product_id = p.product_id' },
  { lineNumber: 10, type: 'unchanged', content: "WHERE p.product_name = 'TrailStride Boots'" },
  { lineNumber: 11, type: 'unchanged', content: "    AND s.sale_date BETWEEN '2025-01-01' AND '2025-03-31'" },
  { lineNumber: 12, type: 'unchanged', content: "    AND st.store_type = 'physical'" },
  { lineNumber: 13, type: 'unchanged', content: 'GROUP BY st.store_name, st.region, st.store_type' },
  { lineNumber: 14, type: 'unchanged', content: 'ORDER BY units_sold DESC' },
  { lineNumber: 15, type: 'unchanged', content: 'LIMIT 10;' }
];

const task4Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Store Metrics', description: 'Store details, units sold, and revenue', type: 'selection' },
  { lineStart: 7, lineEnd: 9, title: 'Data Sources', description: 'Sales, stores, and products joined', type: 'source' },
  { lineStart: 10, lineEnd: 12, title: 'Filters', description: 'TrailStride Boots, Q1 2025, physical stores', type: 'filter' },
  { lineStart: 13, lineEnd: 15, title: 'Grouping', description: 'By store, top 10 by units', type: 'grouping' }
];

const task4TableColumns: TableColumn[] = [
  { key: 'store_name', label: 'Store', align: 'left' },
  { key: 'region', label: 'Region', align: 'left' },
  { key: 'units_sold', label: 'Units', align: 'right' },
  { key: 'revenue', label: 'Revenue', align: 'right' }
];

const task4TableData = [
  { store_name: 'Denver Flagship', region: 'Mountain', units_sold: 456, revenue: '$68,400' },
  { store_name: 'Seattle REI District', region: 'Pacific NW', units_sold: 423, revenue: '$63,450' },
  { store_name: 'Portland Outdoor Hub', region: 'Pacific NW', units_sold: 398, revenue: '$59,700' },
  { store_name: 'Salt Lake City', region: 'Mountain', units_sold: 367, revenue: '$55,050' },
  { store_name: 'Boulder Trail Center', region: 'Mountain', units_sold: 345, revenue: '$51,750' }
];

const task4Assumptions: Assumption[] = [
  { id: '1', text: 'Ranking by units sold (not revenue)', includeInMessage: true },
  { id: '2', text: 'Q1 2025 (January-March)', includeInMessage: true },
  { id: '3', text: 'Physical retail stores only (excludes online)', includeInMessage: true }
];

const task4ResponseMessage = `**Top stores** for TrailStride Boots (Q1 2025):

| Store | Region | Units | Revenue |
|-------|--------|-------|---------|
| Denver Flagship | Mountain | 456 | $68.4K |
| Seattle REI District | Pacific NW | 423 | $63.5K |
| Portland Outdoor Hub | Pacific NW | 398 | $59.7K |

**Insight**: Mountain and Pacific Northwest regions dominate. Consider allocating higher inventory to these outdoor-focused locations.`;


// Task 5: BalanceTone Sports Bra Return Reasons
const task5: Task = {
  id: 'fashion-5',
  title: 'BalanceTone Sports Bra Return Reasons',
  requestor: 'Jennifer Lee, Product Quality',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 72),
  priority: 'high',
  description: 'What are the most common return reasons for BalanceTone Sports Bra?',
  source: 'email',
  industry: 'fashion-shoes',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 74
};

const task5Messages: ChatMessage[] = [
  {
    id: 'fashion-5-msg-1',
    sender: 'user',
    content: 'What are the most common return reasons for BalanceTone Sports Bra?',
    timestamp: new Date(Date.now() - 1000 * 60 * 85),
    type: 'text'
  },
  {
    id: 'fashion-5-msg-2',
    sender: 'agent',
    content: 'Analyzing return reasons for BalanceTone Sports Bra in the last 6 months.',
    timestamp: new Date(Date.now() - 1000 * 60 * 72),
    type: 'action',
    assumptions: [
      'Return reason from returns table',
      'Last 6 months of return data',
      'All size/color variants combined'
    ]
  }
];

const task5Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    r.return_reason,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(*) AS return_count,' },
  { lineNumber: 4, type: 'unchanged', content: '    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) AS pct_of_returns' },
  { lineNumber: 5, type: 'unchanged', content: 'FROM returns r' },
  { lineNumber: 6, type: 'unchanged', content: 'JOIN sales s ON r.original_sale_id = s.sale_id' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN products p ON s.product_id = p.product_id' },
  { lineNumber: 8, type: 'unchanged', content: "WHERE p.product_name = 'BalanceTone Sports Bra'" },
  { lineNumber: 9, type: 'unchanged', content: '    AND r.return_date >= CURRENT_DATE - 180' },
  { lineNumber: 10, type: 'unchanged', content: 'GROUP BY r.return_reason' },
  { lineNumber: 11, type: 'unchanged', content: 'ORDER BY return_count DESC;' }
];

const task5Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 4, title: 'Reason Metrics', description: 'Return reason, count, and percentage', type: 'selection' },
  { lineStart: 5, lineEnd: 7, title: 'Data Sources', description: 'Returns joined with sales and products', type: 'source' },
  { lineStart: 8, lineEnd: 9, title: 'Filters', description: 'BalanceTone Sports Bra, last 6 months', type: 'filter' },
  { lineStart: 10, lineEnd: 11, title: 'Grouping', description: 'By reason, ordered by frequency', type: 'grouping' }
];

const task5TableColumns: TableColumn[] = [
  { key: 'return_reason', label: 'Return Reason', align: 'left' },
  { key: 'return_count', label: 'Count', align: 'right' },
  { key: 'pct_of_returns', label: '% of Returns', align: 'right' }
];

const task5TableData = [
  { return_reason: 'Wrong Size - Too Small', return_count: 234, pct_of_returns: '32.1%' },
  { return_reason: 'Wrong Size - Too Large', return_count: 187, pct_of_returns: '25.7%' },
  { return_reason: 'Uncomfortable/Poor Fit', return_count: 156, pct_of_returns: '21.4%' },
  { return_reason: 'Quality Issue', return_count: 89, pct_of_returns: '12.2%' },
  { return_reason: 'Changed Mind', return_count: 63, pct_of_returns: '8.6%' }
];

const task5Assumptions: Assumption[] = [
  { id: '1', text: 'Return reason from customer-provided feedback', includeInMessage: true },
  { id: '2', text: 'Last 6 months of return data', includeInMessage: true },
  { id: '3', text: 'All sizes and colors combined', includeInMessage: false }
];

const task5ResponseMessage = `**Return reasons** for BalanceTone Sports Bra:

**Fit Issues Dominate (79.2%):**
- Wrong Size - Too Small: 32.1%
- Wrong Size - Too Large: 25.7%
- Uncomfortable/Poor Fit: 21.4%

**Other:**
- Quality Issue: 12.2%
- Changed Mind: 8.6%

**Action**: Nearly 80% of returns are fit-related. Recommend enhanced size guide, virtual fit tool, or adjusting size chart based on feedback.`;


// Export all tasks and task data
export const fashionShoesTasks: Task[] = [task1, task2, task3, task4, task5];

export const fashionShoesTaskData: Record<string, TaskData> = {
  'fashion-1': {
    messages: task1Messages,
    code: task1Code,
    annotations: task1Annotations,
    tableColumns: task1TableColumns,
    tableData: task1TableData,
    assumptions: task1Assumptions,
    responseMessage: task1ResponseMessage,
    knowledgeUpdate: 'RETURN_RATE: Match returns to original sale date for accurate rate'
  },
  'fashion-2': {
    messages: task2Messages,
    code: task2Code,
    annotations: task2Annotations,
    tableColumns: task2TableColumns,
    tableData: task2TableData,
    assumptions: task2Assumptions,
    responseMessage: task2ResponseMessage,
    knowledgeUpdate: 'SIZE_ANALYSIS: Use product_variants for size/color attributes'
  },
  'fashion-3': {
    messages: task3Messages,
    code: task3Code,
    annotations: task3Annotations,
    tableColumns: task3TableColumns,
    tableData: task3TableData,
    assumptions: task3Assumptions,
    responseMessage: task3ResponseMessage,
    knowledgeUpdate: 'PURCHASE_INTERVAL: Use LAG() for gap analysis, median for typical'
  },
  'fashion-4': {
    messages: task4Messages,
    code: task4Code,
    annotations: task4Annotations,
    tableColumns: task4TableColumns,
    tableData: task4TableData,
    assumptions: task4Assumptions,
    responseMessage: task4ResponseMessage,
    knowledgeUpdate: 'STORE_RANKING: Join stores table for location attributes'
  },
  'fashion-5': {
    messages: task5Messages,
    code: task5Code,
    annotations: task5Annotations,
    tableColumns: task5TableColumns,
    tableData: task5TableData,
    assumptions: task5Assumptions,
    responseMessage: task5ResponseMessage,
    knowledgeUpdate: 'RETURN_REASONS: Categorize by return_reason field, calculate percentages'
  }
};
