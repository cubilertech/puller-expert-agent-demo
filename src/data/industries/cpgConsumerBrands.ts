import { Task, ChatMessage, CodeDiff, SqlAnnotation, TableColumn, Assumption, TaskData } from '@/types';

// ============================================
// CPG & CONSUMER BRANDS DEMO DATA
// 5 Complete Tasks with Full Data
// ============================================

// Task 1: GlowMate Deodorant Repeat Rate
const task1: Task = {
  id: 'cpg-1',
  title: 'GlowMate Deodorant Repeat Purchase Rate',
  requestor: 'Jessica Brown, Brand Manager',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 2),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 6),
  priority: 'high',
  description: "What's the repeat purchase rate for GlowMate Deodorant within 90 days?",
  source: 'email',
  industry: 'cpg-consumer-brands',
  flags: { urgency: false, humanRequested: false, vip: true },
  confidence: 91
};

const task1Messages: ChatMessage[] = [
  {
    id: 'cpg-1-msg-1',
    sender: 'user',
    content: 'What\'s the repeat purchase rate for GlowMate Deodorant within 90 days?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'text'
  },
  {
    id: 'cpg-1-msg-2',
    sender: 'agent',
    content: 'Calculated 90-day repeat purchase rate for GlowMate Deodorant using cohort analysis.',
    timestamp: new Date(Date.now() - 1000 * 60 * 6),
    type: 'action',
    assumptions: [
      'First-time buyers defined as customers with no prior GlowMate purchase',
      '90-day window starts from first purchase date',
      'Repeat = any subsequent purchase of same product'
    ]
  }
];

const task1Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH first_buyers AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT customer_id, MIN(order_date) AS first_purchase' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM orders o' },
  { lineNumber: 4, type: 'unchanged', content: '    JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 5, type: 'unchanged', content: '    JOIN products p ON oi.product_id = p.product_id' },
  { lineNumber: 6, type: 'unchanged', content: "    WHERE p.product_name = 'GlowMate Deodorant'" },
  { lineNumber: 7, type: 'unchanged', content: '    GROUP BY customer_id' },
  { lineNumber: 8, type: 'unchanged', content: '),' },
  { lineNumber: 9, type: 'unchanged', content: 'repeat_buyers AS (' },
  { lineNumber: 10, type: 'unchanged', content: '    SELECT fb.customer_id' },
  { lineNumber: 11, type: 'unchanged', content: '    FROM first_buyers fb' },
  { lineNumber: 12, type: 'unchanged', content: '    JOIN orders o ON fb.customer_id = o.customer_id' },
  { lineNumber: 13, type: 'unchanged', content: '    JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 14, type: 'unchanged', content: '    JOIN products p ON oi.product_id = p.product_id' },
  { lineNumber: 15, type: 'unchanged', content: "    WHERE p.product_name = 'GlowMate Deodorant'" },
  { lineNumber: 16, type: 'unchanged', content: '        AND o.order_date > fb.first_purchase' },
  { lineNumber: 17, type: 'unchanged', content: '        AND o.order_date <= fb.first_purchase + INTERVAL 90 DAY' },
  { lineNumber: 18, type: 'unchanged', content: ')' },
  { lineNumber: 19, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 20, type: 'unchanged', content: '    COUNT(DISTINCT fb.customer_id) AS total_first_buyers,' },
  { lineNumber: 21, type: 'unchanged', content: '    COUNT(DISTINCT rb.customer_id) AS repeat_buyers,' },
  { lineNumber: 22, type: 'unchanged', content: '    ROUND(COUNT(DISTINCT rb.customer_id) * 100.0 / COUNT(DISTINCT fb.customer_id), 1) AS repeat_rate' },
  { lineNumber: 23, type: 'unchanged', content: 'FROM first_buyers fb' },
  { lineNumber: 24, type: 'unchanged', content: 'LEFT JOIN repeat_buyers rb ON fb.customer_id = rb.customer_id;' }
];

const task1Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 8, title: 'First Buyers CTE', description: 'Identifying each customer\'s first GlowMate purchase', type: 'filter' },
  { lineStart: 9, lineEnd: 18, title: 'Repeat Buyers CTE', description: 'Finding customers who repurchased within 90 days', type: 'filter' },
  { lineStart: 19, lineEnd: 24, title: 'Rate Calculation', description: 'Computing repeat rate as percentage', type: 'aggregation' }
];

const task1TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'value', label: 'Value', align: 'right' }
];

const task1TableData = [
  { metric: 'Total First-Time Buyers', value: 8234 },
  { metric: 'Repeat Buyers (90 days)', value: 2963 },
  { metric: 'Repeat Purchase Rate', value: '36.0%' },
  { metric: 'Category Benchmark', value: '28.5%' }
];

const task1Assumptions: Assumption[] = [
  { id: '1', text: 'First-time buyer = no prior GlowMate Deodorant purchase in data', includeInMessage: true },
  { id: '2', text: '90-day window from first purchase date', includeInMessage: true },
  { id: '3', text: 'Repeat = any subsequent GlowMate Deodorant purchase', includeInMessage: true }
];

const task1ResponseMessage = `**90-day repeat purchase rate** for GlowMate Deodorant: **36.0%**

**Performance Summary:**
- First-Time Buyers: 8,234
- Repeat Buyers: 2,963
- Repeat Rate: 36.0%
- Category Benchmark: 28.5%

**Insight**: GlowMate is outperforming category average by 7.5 percentage points, indicating strong product satisfaction and loyalty.`;


// Task 2: BrightBite Toothpaste First-Time Buyers
const task2: Task = {
  id: 'cpg-2',
  title: 'BrightBite Toothpaste New Customer Acquisition',
  requestor: 'Michael Chen, Growth Marketing',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 2),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 14),
  priority: 'medium',
  description: 'How many first-time buyers did BrightBite Toothpaste attract last quarter?',
  source: 'slack',
  industry: 'cpg-consumer-brands',
  flags: { urgency: false, humanRequested: true, vip: false },
  confidence: 88
};

const task2Messages: ChatMessage[] = [
  {
    id: 'cpg-2-msg-1',
    sender: 'user',
    content: 'How many first-time buyers did BrightBite Toothpaste attract last quarter?',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    type: 'text'
  },
  {
    id: 'cpg-2-msg-2',
    sender: 'agent',
    content: 'Analyzed Q4 2024 new customer acquisition for BrightBite Toothpaste across all channels.',
    timestamp: new Date(Date.now() - 1000 * 60 * 14),
    type: 'action',
    assumptions: [
      'First-time buyer = no prior BrightBite purchase ever',
      'Last quarter = Q4 2024 (Oct-Dec)',
      'All retail channels included'
    ]
  }
];

const task2Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH customer_history AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT customer_id, MIN(order_date) AS first_purchase' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM orders o' },
  { lineNumber: 4, type: 'unchanged', content: '    JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 5, type: 'unchanged', content: '    JOIN products p ON oi.product_id = p.product_id' },
  { lineNumber: 6, type: 'unchanged', content: "    WHERE p.product_name = 'BrightBite Toothpaste'" },
  { lineNumber: 7, type: 'unchanged', content: '    GROUP BY customer_id' },
  { lineNumber: 8, type: 'unchanged', content: ')' },
  { lineNumber: 9, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 10, type: 'unchanged', content: "    DATE_TRUNC('month', first_purchase) AS month," },
  { lineNumber: 11, type: 'unchanged', content: '    COUNT(*) AS new_buyers' },
  { lineNumber: 12, type: 'unchanged', content: 'FROM customer_history' },
  { lineNumber: 13, type: 'unchanged', content: "WHERE first_purchase BETWEEN '2024-10-01' AND '2024-12-31'" },
  { lineNumber: 14, type: 'unchanged', content: 'GROUP BY DATE_TRUNC(\'month\', first_purchase)' },
  { lineNumber: 15, type: 'unchanged', content: 'ORDER BY month;' }
];

const task2Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 8, title: 'Customer History CTE', description: 'Finding each customer\'s first BrightBite purchase ever', type: 'filter' },
  { lineStart: 9, lineEnd: 11, title: 'Monthly Aggregation', description: 'Counting new buyers by month', type: 'aggregation' },
  { lineStart: 12, lineEnd: 15, title: 'Q4 Filter', description: 'Limiting to Q4 2024, grouped by month', type: 'filter' }
];

const task2TableColumns: TableColumn[] = [
  { key: 'month', label: 'Month', align: 'left' },
  { key: 'new_buyers', label: 'New Buyers', align: 'right' },
  { key: 'mom_change', label: 'MoM Change', align: 'right' }
];

const task2TableData = [
  { month: 'October 2024', new_buyers: 4521, mom_change: '-' },
  { month: 'November 2024', new_buyers: 5234, mom_change: '+15.8%' },
  { month: 'December 2024', new_buyers: 6892, mom_change: '+31.7%' },
  { month: 'Q4 Total', new_buyers: 16647, mom_change: '' }
];

const task2Assumptions: Assumption[] = [
  { id: '1', text: 'First-time buyer = customer\'s first-ever BrightBite purchase', includeInMessage: true },
  { id: '2', text: 'Last quarter = Q4 2024 (October - December)', includeInMessage: true },
  { id: '3', text: 'All retail channels and regions included', includeInMessage: false }
];

const task2ResponseMessage = `BrightBite Toothpaste attracted **16,647 first-time buyers** in Q4 2024.

**Monthly Breakdown:**
- October: 4,521 new buyers
- November: 5,234 (+15.8% MoM)
- December: 6,892 (+31.7% MoM)

**Insight**: Strong momentum through Q4 with December seeing highest acquisition, likely driven by holiday promotions and gift purchases.`;


// Task 3: ShinePlus Shampoo Cross-Sell
const task3: Task = {
  id: 'cpg-3',
  title: 'ShinePlus Shampoo Cross-Sell Patterns',
  requestor: 'Amanda Wright, Category Lead',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 28),
  priority: 'medium',
  description: 'What products do customers most commonly buy alongside ShinePlus Shampoo?',
  source: 'email',
  industry: 'cpg-consumer-brands',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 85
};

const task3Messages: ChatMessage[] = [
  {
    id: 'cpg-3-msg-1',
    sender: 'user',
    content: 'What products do customers most commonly buy alongside ShinePlus Shampoo?',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    type: 'text'
  },
  {
    id: 'cpg-3-msg-2',
    sender: 'agent',
    content: 'Analyzing market basket data for ShinePlus Shampoo co-purchases in the last 90 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
    type: 'action',
    assumptions: [
      'Alongside = same order/transaction',
      'Last 90 days of transaction data',
      'Excluding ShinePlus Shampoo itself from results'
    ]
  }
];

const task3Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    p2.product_name AS cross_sell_product,' },
  { lineNumber: 3, type: 'unchanged', content: '    p2.category,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(DISTINCT oi1.order_id) AS co_purchase_count,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(COUNT(DISTINCT oi1.order_id) * 100.0 / (' },
  { lineNumber: 6, type: 'unchanged', content: "        SELECT COUNT(DISTINCT order_id) FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE p.product_name = 'ShinePlus Shampoo'" },
  { lineNumber: 7, type: 'unchanged', content: '    ), 1) AS attach_rate' },
  { lineNumber: 8, type: 'unchanged', content: 'FROM order_items oi1' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN products p1 ON oi1.product_id = p1.product_id' },
  { lineNumber: 10, type: 'unchanged', content: 'JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.product_id != oi2.product_id' },
  { lineNumber: 11, type: 'unchanged', content: 'JOIN products p2 ON oi2.product_id = p2.product_id' },
  { lineNumber: 12, type: 'unchanged', content: "WHERE p1.product_name = 'ShinePlus Shampoo'" },
  { lineNumber: 13, type: 'unchanged', content: 'GROUP BY p2.product_name, p2.category' },
  { lineNumber: 14, type: 'unchanged', content: 'ORDER BY co_purchase_count DESC' },
  { lineNumber: 15, type: 'unchanged', content: 'LIMIT 10;' }
];

const task3Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 7, title: 'Cross-Sell Metrics', description: 'Product name, category, count and attach rate', type: 'selection' },
  { lineStart: 8, lineEnd: 11, title: 'Self-Join Logic', description: 'Finding other products in same orders', type: 'source' },
  { lineStart: 12, lineEnd: 15, title: 'Filters & Limits', description: 'ShinePlus orders only, top 10 results', type: 'filter' }
];

const task3TableColumns: TableColumn[] = [
  { key: 'cross_sell_product', label: 'Product', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'co_purchase_count', label: 'Co-Purchases', align: 'right' },
  { key: 'attach_rate', label: 'Attach Rate', align: 'right' }
];

const task3TableData = [
  { cross_sell_product: 'ShinePlus Conditioner', category: 'Hair Care', co_purchase_count: 4523, attach_rate: '67.2%' },
  { cross_sell_product: 'ShinePlus Hair Mask', category: 'Hair Care', co_purchase_count: 2134, attach_rate: '31.7%' },
  { cross_sell_product: 'SilkGlow Body Wash', category: 'Body Care', co_purchase_count: 1876, attach_rate: '27.9%' },
  { cross_sell_product: 'ShinePlus Leave-In Spray', category: 'Hair Care', co_purchase_count: 1654, attach_rate: '24.6%' },
  { cross_sell_product: 'GlowMate Deodorant', category: 'Personal Care', co_purchase_count: 1234, attach_rate: '18.3%' }
];

const task3Assumptions: Assumption[] = [
  { id: '1', text: 'Co-purchase = products in same order/transaction', includeInMessage: true },
  { id: '2', text: 'Analysis period: last 90 days', includeInMessage: true },
  { id: '3', text: 'Attach rate = % of ShinePlus orders containing this product', includeInMessage: true }
];

const task3ResponseMessage = `**Top cross-sell products** with ShinePlus Shampoo:

| Product | Attach Rate |
|---------|-------------|
| ShinePlus Conditioner | 67.2% |
| ShinePlus Hair Mask | 31.7% |
| SilkGlow Body Wash | 27.9% |
| ShinePlus Leave-In Spray | 24.6% |

**Key Insight**: 2 out of 3 shampoo buyers also purchase the conditioner. Consider bundle pricing or "complete your routine" promotions.`;


// Task 4: PowerClean Pods Shipments vs Sales
const task4: Task = {
  id: 'cpg-4',
  title: 'PowerClean Pods Inventory Flow Analysis',
  requestor: 'David Miller, Supply Chain',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 42),
  priority: 'high',
  description: 'How do PowerClean Pods shipments compare to sell-through by retailer?',
  source: 'slack',
  industry: 'cpg-consumer-brands',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 75
};

const task4Messages: ChatMessage[] = [
  {
    id: 'cpg-4-msg-1',
    sender: 'user',
    content: 'How do PowerClean Pods shipments compare to sell-through by retailer?',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    type: 'text'
  },
  {
    id: 'cpg-4-msg-2',
    sender: 'agent',
    content: 'Comparing shipment volumes to POS sell-through for PowerClean Pods by retail partner.',
    timestamp: new Date(Date.now() - 1000 * 60 * 42),
    type: 'action',
    assumptions: [
      'Shipments = units shipped from distribution centers',
      'Sell-through = POS data from retail partners',
      'Last 4 weeks of data'
    ]
  }
];

const task4Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    r.retailer_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(sh.units_shipped) AS units_shipped,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(pos.units_sold) AS units_sold,' },
  { lineNumber: 5, type: 'unchanged', content: '    SUM(sh.units_shipped) - SUM(pos.units_sold) AS inventory_build,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(SUM(pos.units_sold) * 100.0 / NULLIF(SUM(sh.units_shipped), 0), 1) AS sell_through_pct' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM shipments sh' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN retailers r ON sh.retailer_id = r.retailer_id' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN products p ON sh.product_id = p.product_id' },
  { lineNumber: 10, type: 'unchanged', content: 'LEFT JOIN pos_sales pos ON pos.retailer_id = sh.retailer_id AND pos.product_id = sh.product_id' },
  { lineNumber: 11, type: 'unchanged', content: "WHERE p.product_name = 'PowerClean Pods'" },
  { lineNumber: 12, type: 'unchanged', content: '    AND sh.ship_date >= CURRENT_DATE - 28' },
  { lineNumber: 13, type: 'unchanged', content: 'GROUP BY r.retailer_name' },
  { lineNumber: 14, type: 'unchanged', content: 'ORDER BY inventory_build DESC;' }
];

const task4Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Flow Metrics', description: 'Shipped, sold, inventory build, and sell-through %', type: 'aggregation' },
  { lineStart: 7, lineEnd: 10, title: 'Data Sources', description: 'Shipments, retailers, products, POS data', type: 'source' },
  { lineStart: 11, lineEnd: 14, title: 'Filters', description: 'PowerClean Pods, last 4 weeks, by retailer', type: 'filter' }
];

const task4TableColumns: TableColumn[] = [
  { key: 'retailer_name', label: 'Retailer', align: 'left' },
  { key: 'units_shipped', label: 'Shipped', align: 'right' },
  { key: 'units_sold', label: 'Sold', align: 'right' },
  { key: 'inventory_build', label: 'Inv. Build', align: 'right' },
  { key: 'sell_through_pct', label: 'Sell-Through', align: 'right' }
];

const task4TableData = [
  { retailer_name: 'MegaMart', units_shipped: 45000, units_sold: 32000, inventory_build: 13000, sell_through_pct: '71.1%' },
  { retailer_name: 'ValueStore', units_shipped: 38000, units_sold: 29500, inventory_build: 8500, sell_through_pct: '77.6%' },
  { retailer_name: 'QuickShop', units_shipped: 22000, units_sold: 18900, inventory_build: 3100, sell_through_pct: '85.9%' },
  { retailer_name: 'FreshMart', units_shipped: 18000, units_sold: 17200, inventory_build: 800, sell_through_pct: '95.6%' },
  { retailer_name: 'CityGrocer', units_shipped: 12000, units_sold: 11800, inventory_build: 200, sell_through_pct: '98.3%' }
];

const task4Assumptions: Assumption[] = [
  { id: '1', text: 'Shipments = units shipped from our distribution centers', includeInMessage: true },
  { id: '2', text: 'Sell-through = POS data reported by retail partners', includeInMessage: true },
  { id: '3', text: 'Inventory build = shipped - sold (positive = accumulating)', includeInMessage: true }
];

const task4ResponseMessage = `**Shipment vs Sell-Through** for PowerClean Pods (last 4 weeks):

**Inventory Building At:**
- MegaMart: +13,000 units (71.1% sell-through) ⚠️
- ValueStore: +8,500 units (77.6% sell-through)

**Performing Well:**
- FreshMart: 95.6% sell-through
- CityGrocer: 98.3% sell-through

**Action**: Consider reducing shipments to MegaMart by 20-25% or coordinate promotional support to move excess inventory.`;


// Task 5: EcoSpark Laundry Sheets Retention
const task5: Task = {
  id: 'cpg-5',
  title: 'EcoSpark Laundry Sheets 30-Day Retention',
  requestor: 'Emily Zhang, DTC Lead',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 58),
  priority: 'medium',
  description: 'What percentage of EcoSpark Laundry Sheets buyers repurchase within 30 days?',
  source: 'meeting',
  industry: 'cpg-consumer-brands',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 93
};

const task5Messages: ChatMessage[] = [
  {
    id: 'cpg-5-msg-1',
    sender: 'user',
    content: 'What percentage of EcoSpark Laundry Sheets buyers repurchase within 30 days?',
    timestamp: new Date(Date.now() - 1000 * 60 * 70),
    type: 'text'
  },
  {
    id: 'cpg-5-msg-2',
    sender: 'agent',
    content: 'Calculating 30-day repurchase rate for EcoSpark Laundry Sheets from DTC channel.',
    timestamp: new Date(Date.now() - 1000 * 60 * 58),
    type: 'action',
    assumptions: [
      '30-day window from each purchase',
      'DTC channel only (direct website purchases)',
      'Any subsequent EcoSpark purchase counts as repeat'
    ]
  }
];

const task5Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH purchases AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT customer_id, order_date,' },
  { lineNumber: 3, type: 'unchanged', content: '           LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS next_purchase' },
  { lineNumber: 4, type: 'unchanged', content: '    FROM orders o' },
  { lineNumber: 5, type: 'unchanged', content: '    JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 6, type: 'unchanged', content: '    JOIN products p ON oi.product_id = p.product_id' },
  { lineNumber: 7, type: 'unchanged', content: "    WHERE p.product_name = 'EcoSpark Laundry Sheets'" },
  { lineNumber: 8, type: 'unchanged', content: "        AND o.channel = 'dtc'" },
  { lineNumber: 9, type: 'unchanged', content: ')' },
  { lineNumber: 10, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 11, type: 'unchanged', content: '    COUNT(*) AS total_purchases,' },
  { lineNumber: 12, type: 'unchanged', content: '    SUM(CASE WHEN DATEDIFF(next_purchase, order_date) <= 30 THEN 1 ELSE 0 END) AS repeat_within_30,' },
  { lineNumber: 13, type: 'unchanged', content: '    ROUND(SUM(CASE WHEN DATEDIFF(next_purchase, order_date) <= 30 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS retention_rate' },
  { lineNumber: 14, type: 'unchanged', content: 'FROM purchases' },
  { lineNumber: 15, type: 'unchanged', content: 'WHERE order_date >= CURRENT_DATE - 90;' }
];

const task5Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 9, title: 'Purchase Sequence CTE', description: 'Using LEAD to find next purchase for each customer', type: 'filter' },
  { lineStart: 10, lineEnd: 13, title: 'Retention Metrics', description: 'Counting total and 30-day repeats, calculating rate', type: 'aggregation' },
  { lineStart: 14, lineEnd: 15, title: 'Date Filter', description: 'Purchases in last 90 days for reliable next-purchase data', type: 'filter' }
];

const task5TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'value', label: 'Value', align: 'right' }
];

const task5TableData = [
  { metric: 'Total Purchases Analyzed', value: 12847 },
  { metric: 'Repurchased Within 30 Days', value: 3468 },
  { metric: '30-Day Retention Rate', value: '27.0%' },
  { metric: 'Category Average', value: '18.5%' }
];

const task5Assumptions: Assumption[] = [
  { id: '1', text: '30-day window from each purchase date', includeInMessage: true },
  { id: '2', text: 'DTC channel only (website direct purchases)', includeInMessage: true },
  { id: '3', text: 'Repeat = any subsequent EcoSpark Laundry Sheets order', includeInMessage: true }
];

const task5ResponseMessage = `**30-day repurchase rate** for EcoSpark Laundry Sheets: **27.0%**

**Performance:**
- Total Purchases: 12,847
- Repurchased in 30 Days: 3,468
- Retention Rate: 27.0%
- Category Average: 18.5%

**Insight**: EcoSpark is beating category average by 8.5 points. The eco-friendly positioning and subscription model are driving strong repeat behavior.`;


// Export all tasks and task data
export const cpgConsumerBrandsTasks: Task[] = [task1, task2, task3, task4, task5];

export const cpgConsumerBrandsTaskData: Record<string, TaskData> = {
  'cpg-1': {
    messages: task1Messages,
    code: task1Code,
    annotations: task1Annotations,
    tableColumns: task1TableColumns,
    tableData: task1TableData,
    assumptions: task1Assumptions,
    responseMessage: task1ResponseMessage,
    knowledgeUpdate: 'REPEAT_RATE: Use cohort-based analysis with INTERVAL for time windows'
  },
  'cpg-2': {
    messages: task2Messages,
    code: task2Code,
    annotations: task2Annotations,
    tableColumns: task2TableColumns,
    tableData: task2TableData,
    assumptions: task2Assumptions,
    responseMessage: task2ResponseMessage,
    knowledgeUpdate: 'FIRST_TIME_BUYER: MIN(order_date) identifies first purchase'
  },
  'cpg-3': {
    messages: task3Messages,
    code: task3Code,
    annotations: task3Annotations,
    tableColumns: task3TableColumns,
    tableData: task3TableData,
    assumptions: task3Assumptions,
    responseMessage: task3ResponseMessage,
    knowledgeUpdate: 'BASKET_ANALYSIS: Self-join order_items for co-purchase patterns'
  },
  'cpg-4': {
    messages: task4Messages,
    code: task4Code,
    annotations: task4Annotations,
    tableColumns: task4TableColumns,
    tableData: task4TableData,
    assumptions: task4Assumptions,
    responseMessage: task4ResponseMessage,
    knowledgeUpdate: 'SUPPLY_DEMAND: Compare shipments to POS for inventory health'
  },
  'cpg-5': {
    messages: task5Messages,
    code: task5Code,
    annotations: task5Annotations,
    tableColumns: task5TableColumns,
    tableData: task5TableData,
    assumptions: task5Assumptions,
    responseMessage: task5ResponseMessage,
    knowledgeUpdate: 'RETENTION: Use LEAD() window function for next-purchase analysis'
  }
};
