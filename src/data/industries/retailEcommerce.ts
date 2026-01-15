import { Task, ChatMessage, CodeDiff, SqlAnnotation, TableColumn, Assumption, TaskData } from '@/types';

// ============================================
// RETAIL & E-COMMERCE DEMO DATA
// 5 Complete Tasks with Full Data
// ============================================

// Task 1: GlowMax Serum Weekly Sales Trend
const task1: Task = {
  id: 'retail-1',
  title: 'GlowMax Serum Weekly Sales Trend',
  requestor: 'Sarah Chen, Analytics Lead',
  status: 'review',
  timestamp: new Date(Date.now() - 1000 * 60 * 8),
  priority: 'medium',
  description: 'How did sales of GlowMax Serum trend by day last week?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 92
};

const task1Messages: ChatMessage[] = [
  {
    id: 'retail-1-msg-1',
    sender: 'user',
    content: 'How did sales of "GlowMax Serum" trend by day last week?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'text'
  },
  {
    id: 'retail-1-msg-2',
    sender: 'agent',
    content: 'Analyzed daily sales data for GlowMax Serum across all channels. Query generated with 6 rows showing upward weekend trend.',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    type: 'action',
    assumptions: [
      '"Last week" means the most recent full Monday-Sunday period',
      'Counting units sold per day to show trends',
      'No seasonal or promotional adjustments included'
    ]
  }
];

const task1Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    DATE(s.txn_ts) AS sales_date,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(s.units) AS units_sold' },
  { lineNumber: 4, type: 'unchanged', content: 'FROM sales s' },
  { lineNumber: 5, type: 'unchanged', content: 'JOIN products p ON p.product_id = s.product_id' },
  { lineNumber: 6, type: 'unchanged', content: "WHERE p.product_name = 'GlowMax Serum'" },
  { lineNumber: 7, type: 'unchanged', content: "    AND DATE(s.txn_ts) BETWEEN DATE '2025-01-06' AND DATE '2025-01-12'" },
  { lineNumber: 8, type: 'unchanged', content: 'GROUP BY DATE(s.txn_ts)' },
  { lineNumber: 9, type: 'unchanged', content: 'ORDER BY sales_date;' }
];

const task1Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 3, title: 'Column Selection', description: 'Extracting date and aggregating unit sales for daily trend', type: 'selection' },
  { lineStart: 4, lineEnd: 5, title: 'Data Sources', description: 'Joining sales transactions with product dimension', type: 'source' },
  { lineStart: 6, lineEnd: 7, title: 'Product & Date Filter', description: 'Filtering to GlowMax Serum and last week date range', type: 'filter' },
  { lineStart: 8, lineEnd: 9, title: 'Grouping & Order', description: 'Daily aggregation sorted chronologically', type: 'grouping' }
];

const task1TableColumns: TableColumn[] = [
  { key: 'sales_date', label: 'Sales Date', align: 'left' },
  { key: 'units_sold', label: 'Units Sold', align: 'right' }
];

const task1TableData = [
  { sales_date: '2025-01-06', units_sold: 42 },
  { sales_date: '2025-01-07', units_sold: 38 },
  { sales_date: '2025-01-08', units_sold: 44 },
  { sales_date: '2025-01-09', units_sold: 63 },
  { sales_date: '2025-01-10', units_sold: 59 },
  { sales_date: '2025-01-11', units_sold: 91 }
];

const task1Assumptions: Assumption[] = [
  { id: '1', text: '"Last week" = Monday-Sunday (2025-01-06 to 2025-01-12)', includeInMessage: true },
  { id: '2', text: 'Simple unit count per day (no revenue calculation)', includeInMessage: true },
  { id: '3', text: 'No seasonal/promotional adjustments applied', includeInMessage: false }
];

const task1ResponseMessage = `Here's the daily sales trend for GlowMax Serum last week:

**Key Insight**: Sales showed an upward trend, peaking at **91 units on Saturday** (Jan 11).

The data shows steady growth from Monday (42 units) through Saturday, with a slight dip mid-week on Tuesday (38 units). Weekend performance was notably stronger, suggesting potential for weekend-focused promotions.`;


// Task 2: AeroMat Heater Stockouts
const task2: Task = {
  id: 'retail-2',
  title: 'AeroMat Heater Stockout Locations',
  requestor: 'Mike Johnson, Inventory Manager',
  status: 'review',
  timestamp: new Date(Date.now() - 1000 * 60 * 12),
  priority: 'high',
  description: 'Which stores sold out of AeroMat Heater yesterday?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 88
};

const task2Messages: ChatMessage[] = [
  {
    id: 'retail-2-msg-1',
    sender: 'user',
    content: 'Which stores sold out of AeroMat Heater yesterday?',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    type: 'text'
  },
  {
    id: 'retail-2-msg-2',
    sender: 'agent',
    content: 'Identified 7 stores with zero inventory for AeroMat Heater. Query cross-references current inventory with store locations.',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    type: 'action',
    assumptions: [
      'Sold out = current inventory on_hand = 0',
      'Using end-of-day inventory snapshot from yesterday',
      'Includes all active retail locations'
    ]
  }
];

const task2Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    s.store_id,' },
  { lineNumber: 3, type: 'unchanged', content: '    s.store_name,' },
  { lineNumber: 4, type: 'unchanged', content: '    s.region,' },
  { lineNumber: 5, type: 'unchanged', content: '    i.last_updated' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM inventory i' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN stores s ON i.store_id = s.store_id' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN products p ON i.product_id = p.product_id' },
  { lineNumber: 9, type: 'unchanged', content: "WHERE p.product_name = 'AeroMat Heater'" },
  { lineNumber: 10, type: 'unchanged', content: '    AND i.on_hand = 0' },
  { lineNumber: 11, type: 'unchanged', content: "    AND DATE(i.last_updated) = CURRENT_DATE - 1" },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY s.region, s.store_name;' }
];

const task2Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Store Details', description: 'Selecting store ID, name, region and inventory timestamp', type: 'selection' },
  { lineStart: 6, lineEnd: 8, title: 'Data Sources', description: 'Joining inventory with stores and products for complete context', type: 'source' },
  { lineStart: 9, lineEnd: 11, title: 'Stockout Filter', description: 'Filtering to specific product with zero inventory yesterday', type: 'filter' },
  { lineStart: 12, lineEnd: 12, title: 'Result Ordering', description: 'Organized by region for regional manager review', type: 'ordering' }
];

const task2TableColumns: TableColumn[] = [
  { key: 'store_id', label: 'Store ID', align: 'left' },
  { key: 'store_name', label: 'Store Name', align: 'left' },
  { key: 'region', label: 'Region', align: 'left' },
  { key: 'last_updated', label: 'Last Updated', align: 'right' }
];

const task2TableData = [
  { store_id: 'STR-142', store_name: 'Downtown Seattle', region: 'Pacific Northwest', last_updated: '2025-01-11 23:45' },
  { store_id: 'STR-089', store_name: 'Portland Lloyd Center', region: 'Pacific Northwest', last_updated: '2025-01-11 22:30' },
  { store_id: 'STR-203', store_name: 'Denver Cherry Creek', region: 'Mountain', last_updated: '2025-01-11 23:15' },
  { store_id: 'STR-167', store_name: 'Salt Lake City Gateway', region: 'Mountain', last_updated: '2025-01-11 21:00' },
  { store_id: 'STR-054', store_name: 'Chicago Magnificent Mile', region: 'Midwest', last_updated: '2025-01-11 23:50' },
  { store_id: 'STR-078', store_name: 'Minneapolis Nicollet', region: 'Midwest', last_updated: '2025-01-11 22:15' },
  { store_id: 'STR-312', store_name: 'Miami Beach', region: 'Southeast', last_updated: '2025-01-11 23:30' }
];

const task2Assumptions: Assumption[] = [
  { id: '1', text: 'Sold out = inventory on_hand equals zero', includeInMessage: true },
  { id: '2', text: 'Using end-of-day inventory snapshot from yesterday', includeInMessage: true },
  { id: '3', text: 'All active retail locations included in analysis', includeInMessage: false }
];

const task2ResponseMessage = `**7 stores** currently show zero inventory for AeroMat Heater as of yesterday's close:

**Regional Breakdown:**
- Pacific Northwest: 2 stores (Seattle, Portland)
- Mountain: 2 stores (Denver, Salt Lake City)
- Midwest: 2 stores (Chicago, Minneapolis)
- Southeast: 1 store (Miami)

Recommend prioritizing Pacific Northwest and Midwest regions for emergency restocking given multiple stockouts.`;


// Task 3: EcoBrew Pods View-But-No-Buy
const task3: Task = {
  id: 'retail-3',
  title: 'EcoBrew Pods Browse Abandonment',
  requestor: 'Lisa Park, Digital Marketing',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 25),
  priority: 'medium',
  description: "How many unique customers viewed EcoBrew Pods online last week but didn't purchase?",
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: true, vip: false },
  confidence: 85
};

const task3Messages: ChatMessage[] = [
  {
    id: 'retail-3-msg-1',
    sender: 'user',
    content: 'How many unique customers viewed EcoBrew Pods online last week but didn\'t purchase?',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    type: 'text'
  },
  {
    id: 'retail-3-msg-2',
    sender: 'agent',
    content: 'Analyzing browse-to-purchase funnel for EcoBrew Pods. Cross-referencing page views with transaction data.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    type: 'action',
    assumptions: [
      'Unique customers identified by customer_id or session_id',
      'Page view = product detail page visit',
      'Purchase = completed checkout within same week'
    ]
  }
];

const task3Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH viewers AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT DISTINCT customer_id' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM page_views pv' },
  { lineNumber: 4, type: 'unchanged', content: '    JOIN products p ON pv.product_id = p.product_id' },
  { lineNumber: 5, type: 'unchanged', content: "    WHERE p.product_name = 'EcoBrew Pods'" },
  { lineNumber: 6, type: 'unchanged', content: "        AND DATE(pv.view_ts) BETWEEN '2025-01-06' AND '2025-01-12'" },
  { lineNumber: 7, type: 'unchanged', content: '),' },
  { lineNumber: 8, type: 'unchanged', content: 'buyers AS (' },
  { lineNumber: 9, type: 'unchanged', content: '    SELECT DISTINCT customer_id' },
  { lineNumber: 10, type: 'unchanged', content: '    FROM orders o' },
  { lineNumber: 11, type: 'unchanged', content: '    JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 12, type: 'unchanged', content: '    JOIN products p ON oi.product_id = p.product_id' },
  { lineNumber: 13, type: 'unchanged', content: "    WHERE p.product_name = 'EcoBrew Pods'" },
  { lineNumber: 14, type: 'unchanged', content: "        AND DATE(o.order_date) BETWEEN '2025-01-06' AND '2025-01-12'" },
  { lineNumber: 15, type: 'unchanged', content: ')' },
  { lineNumber: 16, type: 'unchanged', content: 'SELECT COUNT(*) AS abandoned_viewers' },
  { lineNumber: 17, type: 'unchanged', content: 'FROM viewers v' },
  { lineNumber: 18, type: 'unchanged', content: 'WHERE v.customer_id NOT IN (SELECT customer_id FROM buyers);' }
];

const task3Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 7, title: 'Viewers CTE', description: 'Identifying unique customers who viewed EcoBrew Pods product page', type: 'filter' },
  { lineStart: 8, lineEnd: 15, title: 'Buyers CTE', description: 'Identifying unique customers who purchased EcoBrew Pods', type: 'filter' },
  { lineStart: 16, lineEnd: 18, title: 'Abandonment Count', description: 'Counting viewers who did NOT convert to buyers', type: 'aggregation' }
];

const task3TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'value', label: 'Value', align: 'right' }
];

const task3TableData = [
  { metric: 'Total Viewers', value: 2847 },
  { metric: 'Converted Buyers', value: 312 },
  { metric: 'Abandoned Viewers', value: 2535 },
  { metric: 'Conversion Rate', value: '11.0%' }
];

const task3Assumptions: Assumption[] = [
  { id: '1', text: 'Unique customers identified by logged-in customer_id', includeInMessage: true },
  { id: '2', text: 'Page view = product detail page visit (not just listing)', includeInMessage: true },
  { id: '3', text: 'Purchase window = same calendar week as view', includeInMessage: true }
];

const task3ResponseMessage = `**2,535 unique customers** viewed EcoBrew Pods online last week but didn't purchase.

**Funnel Analysis:**
- Total Viewers: 2,847
- Converted: 312 (11.0% conversion rate)
- Abandoned: 2,535 (89.0%)

This represents a significant remarketing opportunity. Consider targeted email campaigns or retargeting ads for this segment.`;


// Task 4: SmartBrew Pro Basket Analysis
const task4: Task = {
  id: 'retail-4',
  title: 'SmartBrew Pro Average Basket Size',
  requestor: 'James Wu, Merchandising',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 40),
  priority: 'low',
  description: "What's the average basket size for customers who bought SmartBrew Pro last month?",
  source: 'meeting',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 94
};

const task4Messages: ChatMessage[] = [
  {
    id: 'retail-4-msg-1',
    sender: 'user',
    content: 'What\'s the average basket size for customers who bought SmartBrew Pro last month?',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    type: 'text'
  },
  {
    id: 'retail-4-msg-2',
    sender: 'agent',
    content: 'Calculated average basket metrics for SmartBrew Pro purchasers in December 2024.',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    type: 'action',
    assumptions: [
      'Basket size = total items in same order (not just SmartBrew Pro)',
      'Last month = December 2024',
      'Excludes returns and cancelled orders'
    ]
  }
];

const task4Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    AVG(basket.total_items) AS avg_basket_size,' },
  { lineNumber: 3, type: 'unchanged', content: '    AVG(basket.total_value) AS avg_basket_value' },
  { lineNumber: 4, type: 'unchanged', content: 'FROM (' },
  { lineNumber: 5, type: 'unchanged', content: '    SELECT o.order_id,' },
  { lineNumber: 6, type: 'unchanged', content: '           SUM(oi.quantity) AS total_items,' },
  { lineNumber: 7, type: 'unchanged', content: '           SUM(oi.line_total) AS total_value' },
  { lineNumber: 8, type: 'unchanged', content: '    FROM orders o' },
  { lineNumber: 9, type: 'unchanged', content: '    JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 10, type: 'unchanged', content: '    WHERE o.order_id IN (' },
  { lineNumber: 11, type: 'unchanged', content: '        SELECT DISTINCT oi2.order_id' },
  { lineNumber: 12, type: 'unchanged', content: '        FROM order_items oi2' },
  { lineNumber: 13, type: 'unchanged', content: '        JOIN products p ON oi2.product_id = p.product_id' },
  { lineNumber: 14, type: 'unchanged', content: "        WHERE p.product_name = 'SmartBrew Pro'" },
  { lineNumber: 15, type: 'unchanged', content: '    )' },
  { lineNumber: 16, type: 'unchanged', content: "    AND DATE(o.order_date) BETWEEN '2024-12-01' AND '2024-12-31'" },
  { lineNumber: 17, type: 'unchanged', content: "    AND o.status != 'cancelled'" },
  { lineNumber: 18, type: 'unchanged', content: '    GROUP BY o.order_id' },
  { lineNumber: 19, type: 'unchanged', content: ') basket;' }
];

const task4Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 3, title: 'Aggregate Metrics', description: 'Calculating average items and value per basket', type: 'aggregation' },
  { lineStart: 4, lineEnd: 9, title: 'Basket Subquery', description: 'Computing per-order totals for all items', type: 'source' },
  { lineStart: 10, lineEnd: 15, title: 'SmartBrew Filter', description: 'Limiting to orders containing SmartBrew Pro', type: 'filter' },
  { lineStart: 16, lineEnd: 18, title: 'Date & Status Filter', description: 'December 2024, excluding cancelled orders', type: 'filter' }
];

const task4TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'value', label: 'Value', align: 'right' }
];

const task4TableData = [
  { metric: 'Average Basket Size', value: '4.2 items' },
  { metric: 'Average Basket Value', value: '$287.45' },
  { metric: 'SmartBrew Pro Price', value: '$149.99' },
  { metric: 'Avg Add-on Value', value: '$137.46' }
];

const task4Assumptions: Assumption[] = [
  { id: '1', text: 'Basket size = all items in order containing SmartBrew Pro', includeInMessage: true },
  { id: '2', text: 'Last month = December 2024', includeInMessage: true },
  { id: '3', text: 'Excludes cancelled and returned orders', includeInMessage: false }
];

const task4ResponseMessage = `SmartBrew Pro customers had an average basket of **4.2 items** worth **$287.45** last month.

**Basket Composition:**
- SmartBrew Pro: $149.99 (52% of basket)
- Additional Items: $137.46 average add-on value

This suggests strong cross-sell potential. Customers buying SmartBrew Pro are adding ~3 more items on average.`;


// Task 5: HydraBottle XL Hourly Sales
const task5: Task = {
  id: 'retail-5',
  title: 'HydraBottle XL Hourly Sales Pattern',
  requestor: 'Rachel Torres, Store Ops',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 55),
  priority: 'medium',
  description: 'What time of day do we sell the most HydraBottle XL units in-store?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: true },
  confidence: 91
};

const task5Messages: ChatMessage[] = [
  {
    id: 'retail-5-msg-1',
    sender: 'user',
    content: 'What time of day do we sell the most HydraBottle XL units in-store?',
    timestamp: new Date(Date.now() - 1000 * 60 * 65),
    type: 'text'
  },
  {
    id: 'retail-5-msg-2',
    sender: 'agent',
    content: 'Analyzing hourly sales distribution for HydraBottle XL across all physical stores.',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    type: 'action',
    assumptions: [
      'In-store = physical retail locations only',
      'Using last 30 days of transaction data',
      'Hour extracted from transaction timestamp'
    ]
  }
];

const task5Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    EXTRACT(HOUR FROM s.txn_ts) AS hour_of_day,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(s.units) AS units_sold,' },
  { lineNumber: 4, type: 'unchanged', content: '    ROUND(SUM(s.units) * 100.0 / SUM(SUM(s.units)) OVER(), 1) AS pct_of_total' },
  { lineNumber: 5, type: 'unchanged', content: 'FROM sales s' },
  { lineNumber: 6, type: 'unchanged', content: 'JOIN products p ON s.product_id = p.product_id' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN stores st ON s.store_id = st.store_id' },
  { lineNumber: 8, type: 'unchanged', content: "WHERE p.product_name = 'HydraBottle XL'" },
  { lineNumber: 9, type: 'unchanged', content: "    AND st.store_type = 'physical'" },
  { lineNumber: 10, type: 'unchanged', content: '    AND s.txn_ts >= CURRENT_DATE - 30' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY EXTRACT(HOUR FROM s.txn_ts)' },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY units_sold DESC;' }
];

const task5Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 4, title: 'Hourly Metrics', description: 'Extracting hour and calculating units with percentage', type: 'selection' },
  { lineStart: 5, lineEnd: 7, title: 'Data Sources', description: 'Joining sales with products and stores', type: 'source' },
  { lineStart: 8, lineEnd: 10, title: 'Filters', description: 'HydraBottle XL, physical stores, last 30 days', type: 'filter' },
  { lineStart: 11, lineEnd: 12, title: 'Grouping', description: 'Hourly aggregation sorted by volume', type: 'grouping' }
];

const task5TableColumns: TableColumn[] = [
  { key: 'hour_of_day', label: 'Hour', align: 'left' },
  { key: 'units_sold', label: 'Units Sold', align: 'right' },
  { key: 'pct_of_total', label: '% of Total', align: 'right' }
];

const task5TableData = [
  { hour_of_day: '12:00 PM', units_sold: 847, pct_of_total: '18.2%' },
  { hour_of_day: '1:00 PM', units_sold: 723, pct_of_total: '15.5%' },
  { hour_of_day: '11:00 AM', units_sold: 612, pct_of_total: '13.1%' },
  { hour_of_day: '5:00 PM', units_sold: 534, pct_of_total: '11.5%' },
  { hour_of_day: '6:00 PM', units_sold: 489, pct_of_total: '10.5%' }
];

const task5Assumptions: Assumption[] = [
  { id: '1', text: 'In-store = physical retail locations only (excludes online)', includeInMessage: true },
  { id: '2', text: 'Analysis based on last 30 days of transaction data', includeInMessage: true },
  { id: '3', text: 'Hour extracted from local store time zone', includeInMessage: false }
];

const task5ResponseMessage = `**Peak sales hour: 12:00 PM** with 847 units (18.2% of daily volume).

**Top Selling Hours:**
1. 12:00 PM - 847 units (18.2%)
2. 1:00 PM - 723 units (15.5%)
3. 11:00 AM - 612 units (13.1%)

The lunch hour (11 AM - 1 PM) accounts for **46.8% of all HydraBottle XL sales**. Consider staffing optimization and prominent placement during this window.`;


// Export all tasks and task data
export const retailEcommerceTasks: Task[] = [task1, task2, task3, task4, task5];

export const retailEcommerceTaskData: Record<string, TaskData> = {
  'retail-1': {
    messages: task1Messages,
    code: task1Code,
    annotations: task1Annotations,
    tableColumns: task1TableColumns,
    tableData: task1TableData,
    assumptions: task1Assumptions,
    responseMessage: task1ResponseMessage,
    knowledgeUpdate: 'PRODUCT_TREND_QUERY: Use DATE() for daily grouping, JOIN products for name filtering'
  },
  'retail-2': {
    messages: task2Messages,
    code: task2Code,
    annotations: task2Annotations,
    tableColumns: task2TableColumns,
    tableData: task2TableData,
    assumptions: task2Assumptions,
    responseMessage: task2ResponseMessage,
    knowledgeUpdate: 'STOCKOUT_DEFINITION: on_hand = 0 indicates sold out status'
  },
  'retail-3': {
    messages: task3Messages,
    code: task3Code,
    annotations: task3Annotations,
    tableColumns: task3TableColumns,
    tableData: task3TableData,
    assumptions: task3Assumptions,
    responseMessage: task3ResponseMessage,
    knowledgeUpdate: 'BROWSE_ABANDONMENT: Use NOT IN subquery for exclusion patterns'
  },
  'retail-4': {
    messages: task4Messages,
    code: task4Code,
    annotations: task4Annotations,
    tableColumns: task4TableColumns,
    tableData: task4TableData,
    assumptions: task4Assumptions,
    responseMessage: task4ResponseMessage,
    knowledgeUpdate: 'BASKET_ANALYSIS: Calculate totals for all items in orders containing target product'
  },
  'retail-5': {
    messages: task5Messages,
    code: task5Code,
    annotations: task5Annotations,
    tableColumns: task5TableColumns,
    tableData: task5TableData,
    assumptions: task5Assumptions,
    responseMessage: task5ResponseMessage,
    knowledgeUpdate: 'HOURLY_PATTERN: Use EXTRACT(HOUR) for time-of-day analysis'
  }
};
