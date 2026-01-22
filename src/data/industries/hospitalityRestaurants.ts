import { Task, ChatMessage, CodeDiff, SqlAnnotation, TableColumn, Assumption, TaskData } from '@/types';

// ============================================
// HOSPITALITY & RESTAURANTS DEMO DATA
// 5 Complete Tasks with Full Data
// ============================================

// Task 1: SunBrew Iced Coffee Hourly Demand
const task1: Task = {
  id: 'hospitality-1',
  title: 'SunBrew Iced Coffee Hourly Demand',
  requestor: 'Carlos Rivera, Operations Director',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 2),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 7),
  priority: 'high',
  description: 'What hours have the highest demand for SunBrew Iced Coffee?',
  source: 'email',
  industry: 'hospitality-restaurants',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 71
};

const task1Messages: ChatMessage[] = [
  {
    id: 'hospitality-1-msg-1',
    sender: 'user',
    content: 'What hours have the highest demand for SunBrew Iced Coffee?',
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    type: 'text'
  },
  {
    id: 'hospitality-1-msg-2',
    sender: 'agent',
    content: 'Analyzed hourly order patterns for SunBrew Iced Coffee across all locations for the past 2 weeks.',
    timestamp: new Date(Date.now() - 1000 * 60 * 7),
    type: 'action',
    assumptions: [
      'Demand = order count per hour',
      'Last 14 days of POS data',
      'All locations aggregated'
    ]
  }
];

const task1Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    EXTRACT(HOUR FROM order_time) AS hour_of_day,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(*) AS order_count,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(quantity) AS units_sold,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(SUM(quantity) * 100.0 / SUM(SUM(quantity)) OVER(), 1) AS pct_of_daily' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM orders o' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN menu_items mi ON oi.item_id = mi.item_id' },
  { lineNumber: 9, type: 'unchanged', content: "WHERE mi.item_name = 'SunBrew Iced Coffee'" },
  { lineNumber: 10, type: 'unchanged', content: '    AND o.order_date >= CURRENT_DATE - 14' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY EXTRACT(HOUR FROM order_time)' },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY units_sold DESC;' }
];

const task1Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Hourly Metrics', description: 'Hour, order count, units, and percentage of daily total', type: 'selection' },
  { lineStart: 6, lineEnd: 8, title: 'Data Sources', description: 'Orders joined with items and menu', type: 'source' },
  { lineStart: 9, lineEnd: 10, title: 'Filters', description: 'SunBrew Iced Coffee, last 14 days', type: 'filter' },
  { lineStart: 11, lineEnd: 12, title: 'Grouping', description: 'By hour, sorted by volume', type: 'grouping' }
];

const task1TableColumns: TableColumn[] = [
  { key: 'hour_of_day', label: 'Hour', align: 'left' },
  { key: 'order_count', label: 'Orders', align: 'right' },
  { key: 'units_sold', label: 'Units', align: 'right' },
  { key: 'pct_of_daily', label: '% of Daily', align: 'right' }
];

const task1TableData = [
  { hour_of_day: '8:00 AM', order_count: 1234, units_sold: 1567, pct_of_daily: '22.4%' },
  { hour_of_day: '9:00 AM', order_count: 1089, units_sold: 1345, pct_of_daily: '19.2%' },
  { hour_of_day: '2:00 PM', order_count: 876, units_sold: 1023, pct_of_daily: '14.6%' },
  { hour_of_day: '3:00 PM', order_count: 765, units_sold: 892, pct_of_daily: '12.8%' },
  { hour_of_day: '10:00 AM', order_count: 654, units_sold: 789, pct_of_daily: '11.3%' }
];

const task1Assumptions: Assumption[] = [
  { id: '1', text: 'Demand measured by units sold (not just order count)', includeInMessage: true },
  { id: '2', text: 'Last 14 days of POS transaction data', includeInMessage: true },
  { id: '3', text: 'All locations aggregated together', includeInMessage: false }
];

const task1ResponseMessage = `**Peak demand hours** for SunBrew Iced Coffee:

| Time | % of Daily Volume |
|------|-------------------|
| 8:00 AM | 22.4% |
| 9:00 AM | 19.2% |
| 2:00 PM | 14.6% |
| 3:00 PM | 12.8% |

**Key Insight**: Morning rush (8-9 AM) accounts for **41.6% of daily sales**. Secondary afternoon peak at 2-3 PM. Ensure cold brew prep is prioritized for these windows.`;


// Task 2: Missing Item Returns Analysis
const task2: Task = {
  id: 'hospitality-2',
  title: 'Missing Item Complaint Analysis',
  requestor: 'Jennifer Walsh, QA Manager',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 2),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 16),
  priority: 'high',
  description: 'Which menu items generate the most "missing item" complaints on delivery orders?',
  source: 'slack',
  industry: 'hospitality-restaurants',
  flags: { urgency: false, humanRequested: true, vip: false },
  confidence: 84
};

const task2Messages: ChatMessage[] = [
  {
    id: 'hospitality-2-msg-1',
    sender: 'user',
    content: 'Which menu items generate the most "missing item" complaints on delivery orders?',
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
    type: 'text'
  },
  {
    id: 'hospitality-2-msg-2',
    sender: 'agent',
    content: 'Analyzed customer complaints tagged as "missing item" for delivery orders in the last 30 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 16),
    type: 'action',
    assumptions: [
      'Missing item = complaint type "missing_item"',
      'Delivery orders only (excludes dine-in/pickup)',
      'Last 30 days of complaint data'
    ]
  }
];

const task2Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    mi.item_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    mi.category,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(*) AS missing_complaints,' },
  { lineNumber: 5, type: 'unchanged', content: '    SUM(oi.quantity) AS total_ordered,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(COUNT(*) * 100.0 / SUM(oi.quantity), 2) AS miss_rate' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM complaints c' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN order_items oi ON c.order_id = oi.order_id AND c.item_id = oi.item_id' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN menu_items mi ON oi.item_id = mi.item_id' },
  { lineNumber: 10, type: 'unchanged', content: 'JOIN orders o ON c.order_id = o.order_id' },
  { lineNumber: 11, type: 'unchanged', content: "WHERE c.complaint_type = 'missing_item'" },
  { lineNumber: 12, type: 'unchanged', content: "    AND o.order_type = 'delivery'" },
  { lineNumber: 13, type: 'unchanged', content: '    AND c.complaint_date >= CURRENT_DATE - 30' },
  { lineNumber: 14, type: 'unchanged', content: 'GROUP BY mi.item_name, mi.category' },
  { lineNumber: 15, type: 'unchanged', content: 'ORDER BY missing_complaints DESC' },
  { lineNumber: 16, type: 'unchanged', content: 'LIMIT 10;' }
];

const task2Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Complaint Metrics', description: 'Item name, complaints, total ordered, and miss rate', type: 'selection' },
  { lineStart: 7, lineEnd: 10, title: 'Data Sources', description: 'Complaints joined with orders and menu items', type: 'source' },
  { lineStart: 11, lineEnd: 13, title: 'Filters', description: 'Missing item type, delivery only, last 30 days', type: 'filter' },
  { lineStart: 14, lineEnd: 16, title: 'Grouping', description: 'By item, top 10 by complaint count', type: 'grouping' }
];

const task2TableColumns: TableColumn[] = [
  { key: 'item_name', label: 'Menu Item', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'missing_complaints', label: 'Complaints', align: 'right' },
  { key: 'miss_rate', label: 'Miss Rate', align: 'right' }
];

const task2TableData = [
  { item_name: 'Extra Sauce Packets', category: 'Condiments', missing_complaints: 234, miss_rate: '4.2%' },
  { item_name: 'Side of Fries', category: 'Sides', missing_complaints: 189, miss_rate: '2.8%' },
  { item_name: 'Dinner Roll', category: 'Bread', missing_complaints: 156, miss_rate: '3.1%' },
  { item_name: 'House Salad', category: 'Salads', missing_complaints: 123, miss_rate: '1.9%' },
  { item_name: 'Kids Applesauce', category: 'Kids', missing_complaints: 98, miss_rate: '5.7%' }
];

const task2Assumptions: Assumption[] = [
  { id: '1', text: 'Missing item = complaint tagged as "missing_item" type', includeInMessage: true },
  { id: '2', text: 'Delivery orders only (pickup/dine-in excluded)', includeInMessage: true },
  { id: '3', text: 'Miss rate = complaints / total units ordered', includeInMessage: true }
];

const task2ResponseMessage = `**Top "missing item" complaints** on delivery orders:

| Item | Complaints | Miss Rate |
|------|------------|-----------|
| Extra Sauce Packets | 234 | 4.2% |
| Side of Fries | 189 | 2.8% |
| Dinner Roll | 156 | 3.1% |
| Kids Applesauce | 98 | 5.7% ⚠️ |

**Action Items:**
1. **Sauce packets** and **small sides** are most frequently missed - add bagging checklist
2. **Kids Applesauce** has highest miss rate - consider packaging with kids meals`;


// Task 3: HeatBowl Chili Reorder Rate
const task3: Task = {
  id: 'hospitality-3',
  title: 'HeatBowl Chili 10-Day Reorder Rate',
  requestor: 'Marcus Brown, Menu Development',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 35),
  priority: 'medium',
  description: 'What percentage of customers who order HeatBowl Chili come back within 10 days?',
  source: 'email',
  industry: 'hospitality-restaurants',
  flags: { urgency: false, humanRequested: false, vip: true },
  confidence: 86
};

const task3Messages: ChatMessage[] = [
  {
    id: 'hospitality-3-msg-1',
    sender: 'user',
    content: 'What percentage of customers who order HeatBowl Chili come back within 10 days?',
    timestamp: new Date(Date.now() - 1000 * 60 * 48),
    type: 'text'
  },
  {
    id: 'hospitality-3-msg-2',
    sender: 'agent',
    content: 'Calculating 10-day return rate for HeatBowl Chili customers from loyalty program data.',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    type: 'action',
    assumptions: [
      'Customer identified by loyalty ID',
      'Return = any subsequent visit within 10 days',
      'Not necessarily ordering HeatBowl Chili again'
    ]
  }
];

const task3Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH chili_orders AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT o.customer_id, o.order_date' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM orders o' },
  { lineNumber: 4, type: 'unchanged', content: '    JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 5, type: 'unchanged', content: '    JOIN menu_items mi ON oi.item_id = mi.item_id' },
  { lineNumber: 6, type: 'unchanged', content: "    WHERE mi.item_name = 'HeatBowl Chili'" },
  { lineNumber: 7, type: 'unchanged', content: '        AND o.customer_id IS NOT NULL' },
  { lineNumber: 8, type: 'unchanged', content: '),' },
  { lineNumber: 9, type: 'unchanged', content: 'returns AS (' },
  { lineNumber: 10, type: 'unchanged', content: '    SELECT DISTINCT co.customer_id' },
  { lineNumber: 11, type: 'unchanged', content: '    FROM chili_orders co' },
  { lineNumber: 12, type: 'unchanged', content: '    JOIN orders o2 ON co.customer_id = o2.customer_id' },
  { lineNumber: 13, type: 'unchanged', content: '    WHERE o2.order_date > co.order_date' },
  { lineNumber: 14, type: 'unchanged', content: '        AND o2.order_date <= co.order_date + INTERVAL 10 DAY' },
  { lineNumber: 15, type: 'unchanged', content: ')' },
  { lineNumber: 16, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 17, type: 'unchanged', content: '    COUNT(DISTINCT co.customer_id) AS chili_customers,' },
  { lineNumber: 18, type: 'unchanged', content: '    COUNT(DISTINCT r.customer_id) AS returned,' },
  { lineNumber: 19, type: 'unchanged', content: '    ROUND(COUNT(DISTINCT r.customer_id) * 100.0 / COUNT(DISTINCT co.customer_id), 1) AS return_rate' },
  { lineNumber: 20, type: 'unchanged', content: 'FROM chili_orders co' },
  { lineNumber: 21, type: 'unchanged', content: 'LEFT JOIN returns r ON co.customer_id = r.customer_id;' }
];

const task3Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 8, title: 'Chili Orders CTE', description: 'Finding customers who ordered HeatBowl Chili', type: 'filter' },
  { lineStart: 9, lineEnd: 15, title: 'Returns CTE', description: 'Customers who came back within 10 days', type: 'filter' },
  { lineStart: 16, lineEnd: 21, title: 'Rate Calculation', description: 'Computing return rate as percentage', type: 'aggregation' }
];

const task3TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'value', label: 'Value', align: 'right' }
];

const task3TableData = [
  { metric: 'HeatBowl Chili Customers', value: 3456 },
  { metric: 'Returned Within 10 Days', value: 1245 },
  { metric: '10-Day Return Rate', value: '36.0%' },
  { metric: 'Menu Average Return Rate', value: '28.2%' }
];

const task3Assumptions: Assumption[] = [
  { id: '1', text: 'Customer identified via loyalty program ID', includeInMessage: true },
  { id: '2', text: 'Return = any subsequent visit (any menu item)', includeInMessage: true },
  { id: '3', text: '10-day window from initial HeatBowl Chili order', includeInMessage: true }
];

const task3ResponseMessage = `**10-day return rate** for HeatBowl Chili customers: **36.0%**

**Performance:**
- HeatBowl Customers: 3,456
- Returned in 10 Days: 1,245
- Return Rate: 36.0%
- Menu Average: 28.2%

**Insight**: HeatBowl Chili drives **7.8% higher return rate** than menu average. Consider featuring it in loyalty promotions to drive frequency.`;


// Task 4: MegaShake Vanilla Co-Purchase
const task4: Task = {
  id: 'hospitality-4',
  title: 'MegaShake Vanilla Co-Purchase Analysis',
  requestor: 'Amy Chen, Marketing Manager',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 52),
  priority: 'low',
  description: 'What items are most often ordered alongside MegaShake Vanilla?',
  source: 'meeting',
  industry: 'hospitality-restaurants',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 92
};

const task4Messages: ChatMessage[] = [
  {
    id: 'hospitality-4-msg-1',
    sender: 'user',
    content: 'What items are most often ordered alongside MegaShake Vanilla?',
    timestamp: new Date(Date.now() - 1000 * 60 * 65),
    type: 'text'
  },
  {
    id: 'hospitality-4-msg-2',
    sender: 'agent',
    content: 'Analyzing order basket composition for MegaShake Vanilla orders.',
    timestamp: new Date(Date.now() - 1000 * 60 * 52),
    type: 'action',
    assumptions: [
      'Same order = same ticket/transaction',
      'Excluding other MegaShake variants',
      'Last 60 days of order data'
    ]
  }
];

const task4Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    mi2.item_name AS paired_item,' },
  { lineNumber: 3, type: 'unchanged', content: '    mi2.category,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(*) AS pair_count,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(COUNT(*) * 100.0 / (' },
  { lineNumber: 6, type: 'unchanged', content: "        SELECT COUNT(DISTINCT order_id) FROM order_items oi JOIN menu_items mi ON oi.item_id = mi.item_id WHERE mi.item_name = 'MegaShake Vanilla'" },
  { lineNumber: 7, type: 'unchanged', content: '    ), 1) AS attach_rate' },
  { lineNumber: 8, type: 'unchanged', content: 'FROM order_items oi1' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN menu_items mi1 ON oi1.item_id = mi1.item_id' },
  { lineNumber: 10, type: 'unchanged', content: 'JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.item_id != oi2.item_id' },
  { lineNumber: 11, type: 'unchanged', content: 'JOIN menu_items mi2 ON oi2.item_id = mi2.item_id' },
  { lineNumber: 12, type: 'unchanged', content: "WHERE mi1.item_name = 'MegaShake Vanilla'" },
  { lineNumber: 13, type: 'unchanged', content: "    AND mi2.item_name NOT LIKE 'MegaShake%'" },
  { lineNumber: 14, type: 'unchanged', content: 'GROUP BY mi2.item_name, mi2.category' },
  { lineNumber: 15, type: 'unchanged', content: 'ORDER BY pair_count DESC' },
  { lineNumber: 16, type: 'unchanged', content: 'LIMIT 8;' }
];

const task4Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 7, title: 'Pairing Metrics', description: 'Paired item, category, count and attach rate', type: 'selection' },
  { lineStart: 8, lineEnd: 11, title: 'Self-Join', description: 'Finding other items in same order', type: 'source' },
  { lineStart: 12, lineEnd: 16, title: 'Filters & Grouping', description: 'Excluding other shakes, top 8 pairs', type: 'filter' }
];

const task4TableColumns: TableColumn[] = [
  { key: 'paired_item', label: 'Paired Item', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'pair_count', label: 'Pairings', align: 'right' },
  { key: 'attach_rate', label: 'Attach Rate', align: 'right' }
];

const task4TableData = [
  { paired_item: 'Classic Burger', category: 'Burgers', pair_count: 2345, attach_rate: '45.2%' },
  { paired_item: 'Crispy Chicken Sandwich', category: 'Sandwiches', pair_count: 1876, attach_rate: '36.2%' },
  { paired_item: 'Large Fries', category: 'Sides', pair_count: 1654, attach_rate: '31.9%' },
  { paired_item: 'Onion Rings', category: 'Sides', pair_count: 987, attach_rate: '19.0%' },
  { paired_item: 'Kids Meal', category: 'Kids', pair_count: 876, attach_rate: '16.9%' }
];

const task4Assumptions: Assumption[] = [
  { id: '1', text: 'Co-purchase = same order/transaction', includeInMessage: true },
  { id: '2', text: 'Excluding other MegaShake variants from results', includeInMessage: true },
  { id: '3', text: 'Last 60 days of transaction data', includeInMessage: false }
];

const task4ResponseMessage = `**Most common pairings** with MegaShake Vanilla:

| Item | Attach Rate |
|------|-------------|
| Classic Burger | 45.2% |
| Crispy Chicken Sandwich | 36.2% |
| Large Fries | 31.9% |
| Onion Rings | 19.0% |

**Insight**: Nearly half of MegaShake Vanilla orders include a Classic Burger. Consider a "Classic Combo" bundle promotion featuring these two items.`;


// Task 5: Mobile Order Percentage
const task5: Task = {
  id: 'hospitality-5',
  title: 'Mobile App Order Percentage by Location',
  requestor: 'David Park, Digital Strategy',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 68),
  priority: 'medium',
  description: 'What percentage of orders come through the mobile app at each location?',
  source: 'slack',
  industry: 'hospitality-restaurants',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 95
};

const task5Messages: ChatMessage[] = [
  {
    id: 'hospitality-5-msg-1',
    sender: 'user',
    content: 'What percentage of orders come through the mobile app at each location?',
    timestamp: new Date(Date.now() - 1000 * 60 * 80),
    type: 'text'
  },
  {
    id: 'hospitality-5-msg-2',
    sender: 'agent',
    content: 'Calculating mobile app order penetration by restaurant location for the last 30 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 68),
    type: 'action',
    assumptions: [
      'Mobile app = order_source "mobile_app"',
      'Last 30 days of order data',
      'All order types included (dine-in, pickup, delivery)'
    ]
  }
];

const task5Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    l.location_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    l.region,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(*) AS total_orders,' },
  { lineNumber: 5, type: 'unchanged', content: "    SUM(CASE WHEN o.order_source = 'mobile_app' THEN 1 ELSE 0 END) AS mobile_orders," },
  { lineNumber: 6, type: 'unchanged', content: "    ROUND(SUM(CASE WHEN o.order_source = 'mobile_app' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS mobile_pct" },
  { lineNumber: 7, type: 'unchanged', content: 'FROM orders o' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN locations l ON o.location_id = l.location_id' },
  { lineNumber: 9, type: 'unchanged', content: 'WHERE o.order_date >= CURRENT_DATE - 30' },
  { lineNumber: 10, type: 'unchanged', content: 'GROUP BY l.location_name, l.region' },
  { lineNumber: 11, type: 'unchanged', content: 'ORDER BY mobile_pct DESC;' }
];

const task5Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Channel Metrics', description: 'Location, total orders, mobile orders, and percentage', type: 'aggregation' },
  { lineStart: 7, lineEnd: 8, title: 'Data Sources', description: 'Orders joined with locations', type: 'source' },
  { lineStart: 9, lineEnd: 11, title: 'Filters & Grouping', description: 'Last 30 days, by location, sorted by mobile %', type: 'filter' }
];

const task5TableColumns: TableColumn[] = [
  { key: 'location_name', label: 'Location', align: 'left' },
  { key: 'region', label: 'Region', align: 'left' },
  { key: 'total_orders', label: 'Total', align: 'right' },
  { key: 'mobile_pct', label: 'Mobile %', align: 'right' }
];

const task5TableData = [
  { location_name: 'Downtown Financial', region: 'Urban', total_orders: 4521, mobile_pct: '62.3%' },
  { location_name: 'University District', region: 'Urban', total_orders: 3876, mobile_pct: '58.7%' },
  { location_name: 'Tech Park Campus', region: 'Suburban', total_orders: 2987, mobile_pct: '54.2%' },
  { location_name: 'Mall of America', region: 'Suburban', total_orders: 5234, mobile_pct: '41.5%' },
  { location_name: 'Highway Exit 42', region: 'Highway', total_orders: 2134, mobile_pct: '23.8%' }
];

const task5Assumptions: Assumption[] = [
  { id: '1', text: 'Mobile app = orders with source "mobile_app"', includeInMessage: true },
  { id: '2', text: 'Last 30 days of order data analyzed', includeInMessage: true },
  { id: '3', text: 'All order types included (dine-in, pickup, delivery)', includeInMessage: false }
];

const task5ResponseMessage = `**Mobile app order penetration** by location:

**Top Performers (>50% mobile):**
- Downtown Financial: 62.3%
- University District: 58.7%
- Tech Park Campus: 54.2%

**Opportunity Locations:**
- Mall of America: 41.5%
- Highway Exit 42: 23.8%

**Insight**: Urban locations drive highest mobile adoption. Consider targeted app promotion campaigns at Mall and Highway locations.`;


// Export all tasks and task data
export const hospitalityRestaurantsTasks: Task[] = [task1, task2, task3, task4, task5];

export const hospitalityRestaurantsTaskData: Record<string, TaskData> = {
  'hospitality-1': {
    messages: task1Messages,
    code: task1Code,
    annotations: task1Annotations,
    tableColumns: task1TableColumns,
    tableData: task1TableData,
    assumptions: task1Assumptions,
    responseMessage: task1ResponseMessage,
    knowledgeUpdate: 'HOURLY_DEMAND: Use EXTRACT(HOUR) for time-of-day analysis'
  },
  'hospitality-2': {
    messages: task2Messages,
    code: task2Code,
    annotations: task2Annotations,
    tableColumns: task2TableColumns,
    tableData: task2TableData,
    assumptions: task2Assumptions,
    responseMessage: task2ResponseMessage,
    knowledgeUpdate: 'COMPLAINT_ANALYSIS: Join complaints with orders for context'
  },
  'hospitality-3': {
    messages: task3Messages,
    code: task3Code,
    annotations: task3Annotations,
    tableColumns: task3TableColumns,
    tableData: task3TableData,
    assumptions: task3Assumptions,
    responseMessage: task3ResponseMessage,
    knowledgeUpdate: 'RETURN_RATE: Track any subsequent visit, not just same item'
  },
  'hospitality-4': {
    messages: task4Messages,
    code: task4Code,
    annotations: task4Annotations,
    tableColumns: task4TableColumns,
    tableData: task4TableData,
    assumptions: task4Assumptions,
    responseMessage: task4ResponseMessage,
    knowledgeUpdate: 'BASKET_PAIRING: Self-join order_items for co-purchase'
  },
  'hospitality-5': {
    messages: task5Messages,
    code: task5Code,
    annotations: task5Annotations,
    tableColumns: task5TableColumns,
    tableData: task5TableData,
    assumptions: task5Assumptions,
    responseMessage: task5ResponseMessage,
    knowledgeUpdate: 'CHANNEL_MIX: Conditional aggregation for source breakdown'
  }
};
