import { Task, ChatMessage, CodeDiff, SqlAnnotation, TableColumn, Assumption, TaskData } from '@/types';

// ============================================
// RETAIL & E-COMMERCE DEMO DATA
// 25 Complete Tasks with Full Data
// ============================================

// Task 1: GlowMax Serum Weekly Sales Trend
const task1: Task = {
  id: 'retail-1',
  title: 'GlowMax Serum Weekly Sales Trend',
  requestor: 'Sarah Chen, Analytics Lead',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 2),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 8),
  priority: 'medium',
  description: 'How did sales of GlowMax Serum trend by day last week?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 92
};

const task1Messages: ChatMessage[] = [
  { id: 'retail-1-msg-1', sender: 'user', content: 'How did sales of "GlowMax Serum" trend by day last week?', timestamp: new Date(Date.now() - 1000 * 60 * 15), type: 'text' },
  { id: 'retail-1-msg-2', sender: 'agent', content: 'Analyzed daily sales data for GlowMax Serum across all channels. Query generated with 6 rows showing upward weekend trend.', timestamp: new Date(Date.now() - 1000 * 60 * 8), type: 'action', assumptions: ['"Last week" means the most recent full Monday-Sunday period', 'Counting units sold per day to show trends', 'No seasonal or promotional adjustments included'] }
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

const task1ResponseMessage = `Here's the daily sales trend for GlowMax Serum last week:\n\n**Key Insight**: Sales showed an upward trend, peaking at **91 units on Saturday** (Jan 11).\n\nThe data shows steady growth from Monday (42 units) through Saturday, with a slight dip mid-week on Tuesday (38 units). Weekend performance was notably stronger, suggesting potential for weekend-focused promotions.`;


// Task 2: AeroMat Heater Stockouts
const task2: Task = {
  id: 'retail-2',
  title: 'AeroMat Heater Stockout Locations',
  requestor: 'Mike Johnson, Inventory Manager',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 2),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 12),
  priority: 'high',
  description: 'Which stores sold out of AeroMat Heater yesterday?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 88
};

const task2Messages: ChatMessage[] = [
  { id: 'retail-2-msg-1', sender: 'user', content: 'Which stores sold out of AeroMat Heater yesterday?', timestamp: new Date(Date.now() - 1000 * 60 * 20), type: 'text' },
  { id: 'retail-2-msg-2', sender: 'agent', content: 'Identified 7 stores with zero inventory for AeroMat Heater. Query cross-references current inventory with store locations.', timestamp: new Date(Date.now() - 1000 * 60 * 12), type: 'action', assumptions: ['Sold out = current inventory on_hand = 0', 'Using end-of-day inventory snapshot from yesterday', 'Includes all active retail locations'] }
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

const task2ResponseMessage = `**7 stores** currently show zero inventory for AeroMat Heater as of yesterday's close:\n\n**Regional Breakdown:**\n- Pacific Northwest: 2 stores (Seattle, Portland)\n- Mountain: 2 stores (Denver, Salt Lake City)\n- Midwest: 2 stores (Chicago, Minneapolis)\n- Southeast: 1 store (Miami)\n\nRecommend prioritizing Pacific Northwest and Midwest regions for emergency restocking given multiple stockouts.`;


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
  { id: 'retail-3-msg-1', sender: 'user', content: 'How many unique customers viewed EcoBrew Pods online last week but didn\'t purchase?', timestamp: new Date(Date.now() - 1000 * 60 * 35), type: 'text' },
  { id: 'retail-3-msg-2', sender: 'agent', content: 'Analyzing browse-to-purchase funnel for EcoBrew Pods. Cross-referencing page views with transaction data.', timestamp: new Date(Date.now() - 1000 * 60 * 25), type: 'action', assumptions: ['Unique customers identified by customer_id or session_id', 'Page view = product detail page visit', 'Purchase = completed checkout within same week'] }
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

const task3ResponseMessage = `**2,535 unique customers** viewed EcoBrew Pods online last week but didn't purchase.\n\n**Funnel Analysis:**\n- Total Viewers: 2,847\n- Converted: 312 (11.0% conversion rate)\n- Abandoned: 2,535 (89.0%)\n\nThis represents a significant remarketing opportunity. Consider targeted email campaigns or retargeting ads for this segment.`;


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
  { id: 'retail-4-msg-1', sender: 'user', content: 'What\'s the average basket size for customers who bought SmartBrew Pro last month?', timestamp: new Date(Date.now() - 1000 * 60 * 50), type: 'text' },
  { id: 'retail-4-msg-2', sender: 'agent', content: 'Calculated average basket metrics for SmartBrew Pro purchasers in December 2024.', timestamp: new Date(Date.now() - 1000 * 60 * 40), type: 'action', assumptions: ['Basket size = total items in same order (not just SmartBrew Pro)', 'Last month = December 2024', 'Excludes returns and cancelled orders'] }
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

const task4ResponseMessage = `SmartBrew Pro customers had an average basket of **4.2 items** worth **$287.45** last month.\n\n**Basket Composition:**\n- SmartBrew Pro: $149.99 (52% of basket)\n- Additional Items: $137.46 average add-on value\n\nThis suggests strong cross-sell potential. Customers buying SmartBrew Pro are adding ~3 more items on average.`;


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
  { id: 'retail-5-msg-1', sender: 'user', content: 'What time of day do we sell the most HydraBottle XL units in-store?', timestamp: new Date(Date.now() - 1000 * 60 * 65), type: 'text' },
  { id: 'retail-5-msg-2', sender: 'agent', content: 'Analyzing hourly sales distribution for HydraBottle XL across all physical stores.', timestamp: new Date(Date.now() - 1000 * 60 * 55), type: 'action', assumptions: ['In-store = physical retail locations only', 'Using last 30 days of transaction data', 'Hour extracted from transaction timestamp'] }
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

const task5ResponseMessage = `**Peak sales hour: 12:00 PM** with 847 units (18.2% of daily volume).\n\n**Top Selling Hours:**\n1. 12:00 PM - 847 units (18.2%)\n2. 1:00 PM - 723 units (15.5%)\n3. 11:00 AM - 612 units (13.1%)\n\nThe lunch hour (11 AM - 1 PM) accounts for **46.8% of all HydraBottle XL sales**. Consider staffing optimization and prominent placement during this window.`;


// Task 6: Cart Abandonment by Device Type
const task6: Task = {
  id: 'retail-6',
  title: 'Cart Abandonment by Device Type',
  requestor: 'Emily Watson, UX Research',
  status: 'ingesting',
  timestamp: new Date(Date.now() - 1000 * 60 * 3),
  priority: 'high',
  description: 'What is the cart abandonment rate breakdown by device type?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 89
};

const task6Messages: ChatMessage[] = [
  { id: 'retail-6-msg-1', sender: 'user', content: 'What is the cart abandonment rate breakdown by device type?', timestamp: new Date(Date.now() - 1000 * 60 * 10), type: 'text' },
  { id: 'retail-6-msg-2', sender: 'agent', content: 'Analyzed cart abandonment rates across desktop, mobile, and tablet devices for the past 30 days.', timestamp: new Date(Date.now() - 1000 * 60 * 3), type: 'action', assumptions: ['Abandonment = cart created but no checkout completed within 24 hours', 'Device type from user agent or session metadata', 'Last 30 days of cart data'] }
];

const task6Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    c.device_type,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(*) AS total_carts,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(CASE WHEN c.checkout_completed = false THEN 1 ELSE 0 END) AS abandoned,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(SUM(CASE WHEN c.checkout_completed = false THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS abandonment_rate' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM carts c' },
  { lineNumber: 7, type: 'unchanged', content: 'WHERE c.created_at >= CURRENT_DATE - 30' },
  { lineNumber: 8, type: 'unchanged', content: 'GROUP BY c.device_type' },
  { lineNumber: 9, type: 'unchanged', content: 'ORDER BY abandonment_rate DESC;' }
];

const task6Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Abandonment Metrics', description: 'Calculating total carts, abandoned carts, and abandonment rate per device', type: 'aggregation' },
  { lineStart: 6, lineEnd: 7, title: 'Data Source & Filter', description: 'Carts table filtered to last 30 days', type: 'filter' },
  { lineStart: 8, lineEnd: 9, title: 'Grouping', description: 'Grouped by device type, sorted by rate', type: 'grouping' }
];

const task6TableColumns: TableColumn[] = [
  { key: 'device_type', label: 'Device', align: 'left' },
  { key: 'total_carts', label: 'Total Carts', align: 'right' },
  { key: 'abandoned', label: 'Abandoned', align: 'right' },
  { key: 'abandonment_rate', label: 'Rate', align: 'right' }
];

const task6TableData = [
  { device_type: 'Mobile', total_carts: 45230, abandoned: 34876, abandonment_rate: '77.1%' },
  { device_type: 'Tablet', total_carts: 12456, abandoned: 8234, abandonment_rate: '66.1%' },
  { device_type: 'Desktop', total_carts: 28934, abandoned: 15234, abandonment_rate: '52.6%' }
];

const task6Assumptions: Assumption[] = [
  { id: '1', text: 'Abandonment = cart not converted to order within 24 hours', includeInMessage: true },
  { id: '2', text: 'Device type from session/user agent data', includeInMessage: true },
  { id: '3', text: 'Analysis period: last 30 days', includeInMessage: false }
];

const task6ResponseMessage = `**Cart abandonment rates by device:**\n\n| Device | Abandonment Rate |\n|--------|------------------|\n| Mobile | 77.1% |\n| Tablet | 66.1% |\n| Desktop | 52.6% |\n\n**Key Insight**: Mobile abandonment is **24.5 points higher** than desktop. Priority: Optimize mobile checkout flow - consider simplified forms, Apple Pay/Google Pay, and progress indicators.`;


// Task 7: Promo Code Redemption Patterns
const task7: Task = {
  id: 'retail-7',
  title: 'Promo Code Redemption Analysis',
  requestor: 'Derek Chen, Promotions Manager',
  status: 'asserting',
  timestamp: new Date(Date.now() - 1000 * 60 * 6),
  priority: 'medium',
  description: 'Which promo codes had the highest redemption rate this quarter?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: true, vip: false },
  confidence: 86
};

const task7Messages: ChatMessage[] = [
  { id: 'retail-7-msg-1', sender: 'user', content: 'Which promo codes had the highest redemption rate this quarter?', timestamp: new Date(Date.now() - 1000 * 60 * 15), type: 'text' },
  { id: 'retail-7-msg-2', sender: 'agent', content: 'Analyzing promo code performance for Q4 2024 by redemption rate.', timestamp: new Date(Date.now() - 1000 * 60 * 6), type: 'action', assumptions: ['Redemption rate = orders with code / total code distributions', 'This quarter = Q4 2024', 'Minimum 100 distributions for significance'] }
];

const task7Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    p.promo_code,' },
  { lineNumber: 3, type: 'unchanged', content: '    p.discount_type,' },
  { lineNumber: 4, type: 'unchanged', content: '    p.distributions,' },
  { lineNumber: 5, type: 'unchanged', content: '    COUNT(o.order_id) AS redemptions,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(COUNT(o.order_id) * 100.0 / p.distributions, 1) AS redemption_rate' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM promo_codes p' },
  { lineNumber: 8, type: 'unchanged', content: 'LEFT JOIN orders o ON o.promo_code = p.promo_code' },
  { lineNumber: 9, type: 'unchanged', content: "WHERE p.campaign_quarter = 'Q4-2024'" },
  { lineNumber: 10, type: 'unchanged', content: '    AND p.distributions >= 100' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY p.promo_code, p.discount_type, p.distributions' },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY redemption_rate DESC LIMIT 10;' }
];

const task7Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Promo Metrics', description: 'Code details, distributions, redemptions, and rate', type: 'selection' },
  { lineStart: 7, lineEnd: 8, title: 'Data Sources', description: 'Promo codes joined with orders', type: 'source' },
  { lineStart: 9, lineEnd: 12, title: 'Filters & Grouping', description: 'Q4 2024, minimum distributions, top 10', type: 'filter' }
];

const task7TableColumns: TableColumn[] = [
  { key: 'promo_code', label: 'Code', align: 'left' },
  { key: 'discount_type', label: 'Type', align: 'left' },
  { key: 'redemptions', label: 'Redemptions', align: 'right' },
  { key: 'redemption_rate', label: 'Rate', align: 'right' }
];

const task7TableData = [
  { promo_code: 'HOLIDAY25', discount_type: '25% Off', redemptions: 4523, redemption_rate: '34.2%' },
  { promo_code: 'FREESHIP', discount_type: 'Free Shipping', redemptions: 8934, redemption_rate: '28.7%' },
  { promo_code: 'WELCOME15', discount_type: '15% Off', redemptions: 2345, redemption_rate: '23.4%' },
  { promo_code: 'BUNDLE20', discount_type: '$20 Off $100+', redemptions: 1876, redemption_rate: '18.9%' },
  { promo_code: 'FLASH10', discount_type: '10% Off', redemptions: 1234, redemption_rate: '12.3%' }
];

const task7Assumptions: Assumption[] = [
  { id: '1', text: 'Redemption rate = orders using code / total distributions', includeInMessage: true },
  { id: '2', text: 'Q4 2024 campaign period', includeInMessage: true },
  { id: '3', text: 'Minimum 100 distributions for statistical significance', includeInMessage: false }
];

const task7ResponseMessage = `**Top performing promo codes in Q4 2024:**\n\n| Code | Type | Rate |\n|------|------|------|\n| HOLIDAY25 | 25% Off | 34.2% |\n| FREESHIP | Free Shipping | 28.7% |\n| WELCOME15 | 15% Off | 23.4% |\n\n**Insight**: Percentage-based discounts outperform dollar-off codes. HOLIDAY25's 34.2% rate is exceptional - consider similar aggressive discounts for future campaigns.`;


// Task 8: Category Cross-Sell Opportunities
const task8: Task = {
  id: 'retail-8',
  title: 'Category Cross-Sell Analysis',
  requestor: 'Angela Morris, Merchandising Director',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 22),
  priority: 'high',
  description: 'Which product categories are most frequently purchased together?',
  source: 'meeting',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: true },
  confidence: 93
};

const task8Messages: ChatMessage[] = [
  { id: 'retail-8-msg-1', sender: 'user', content: 'Which product categories are most frequently purchased together?', timestamp: new Date(Date.now() - 1000 * 60 * 32), type: 'text' },
  { id: 'retail-8-msg-2', sender: 'agent', content: 'Analyzing category co-occurrence patterns in multi-item orders for the past 90 days.', timestamp: new Date(Date.now() - 1000 * 60 * 22), type: 'action', assumptions: ['Together = same order/transaction', 'Multi-item orders only (2+ distinct categories)', 'Last 90 days of order data'] }
];

const task8Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    p1.category AS category_a,' },
  { lineNumber: 3, type: 'unchanged', content: '    p2.category AS category_b,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(DISTINCT oi1.order_id) AS co_purchase_count,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(COUNT(DISTINCT oi1.order_id) * 100.0 / (SELECT COUNT(DISTINCT order_id) FROM orders WHERE order_date >= CURRENT_DATE - 90), 2) AS order_pct' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM order_items oi1' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN products p1 ON oi1.product_id = p1.product_id' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.product_id < oi2.product_id' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN products p2 ON oi2.product_id = p2.product_id' },
  { lineNumber: 10, type: 'unchanged', content: 'WHERE p1.category != p2.category' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY p1.category, p2.category' },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY co_purchase_count DESC LIMIT 10;' }
];

const task8Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Co-Purchase Metrics', description: 'Category pairs with count and percentage of orders', type: 'selection' },
  { lineStart: 6, lineEnd: 9, title: 'Self-Join Logic', description: 'Finding different categories in same order', type: 'source' },
  { lineStart: 10, lineEnd: 12, title: 'Filters', description: 'Excluding same-category, top 10 pairs', type: 'filter' }
];

const task8TableColumns: TableColumn[] = [
  { key: 'category_a', label: 'Category A', align: 'left' },
  { key: 'category_b', label: 'Category B', align: 'left' },
  { key: 'co_purchase_count', label: 'Orders', align: 'right' },
  { key: 'order_pct', label: '% of Orders', align: 'right' }
];

const task8TableData = [
  { category_a: 'Skincare', category_b: 'Beauty Tools', co_purchase_count: 12456, order_pct: '18.4%' },
  { category_a: 'Coffee', category_b: 'Kitchen Accessories', co_purchase_count: 9823, order_pct: '14.5%' },
  { category_a: 'Fitness', category_b: 'Supplements', co_purchase_count: 8765, order_pct: '12.9%' },
  { category_a: 'Electronics', category_b: 'Accessories', co_purchase_count: 7654, order_pct: '11.3%' },
  { category_a: 'Home Decor', category_b: 'Lighting', co_purchase_count: 6543, order_pct: '9.7%' }
];

const task8Assumptions: Assumption[] = [
  { id: '1', text: 'Co-purchase = different categories in same order', includeInMessage: true },
  { id: '2', text: 'Last 90 days of order data', includeInMessage: true },
  { id: '3', text: 'Category pairs counted once per order (not per item)', includeInMessage: false }
];

const task8ResponseMessage = `**Top category cross-sell opportunities:**\n\n| Category Pair | Orders | % of All Orders |\n|---------------|--------|------------------|\n| Skincare + Beauty Tools | 12,456 | 18.4% |\n| Coffee + Kitchen Accessories | 9,823 | 14.5% |\n| Fitness + Supplements | 8,765 | 12.9% |\n\n**Recommendation**: Create bundle deals for Skincare + Beauty Tools (18.4% natural affinity). Consider "Complete Your Routine" prompts at checkout.`;


// Task 9: Customer Acquisition Cost by Channel
const task9: Task = {
  id: 'retail-9',
  title: 'Customer Acquisition Cost by Channel',
  requestor: 'Marcus Lee, Growth Marketing',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 35),
  priority: 'high',
  description: 'What is our customer acquisition cost by marketing channel?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: true, vip: false },
  confidence: 87
};

const task9Messages: ChatMessage[] = [
  { id: 'retail-9-msg-1', sender: 'user', content: 'What is our customer acquisition cost by marketing channel?', timestamp: new Date(Date.now() - 1000 * 60 * 45), type: 'text' },
  { id: 'retail-9-msg-2', sender: 'agent', content: 'Calculating CAC by channel using marketing spend and new customer conversions for Q4 2024.', timestamp: new Date(Date.now() - 1000 * 60 * 35), type: 'action', assumptions: ['CAC = channel spend / new customers acquired via that channel', 'New customer = first-time purchaser', 'Q4 2024 data'] }
];

const task9Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    m.channel,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(m.spend) AS total_spend,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(DISTINCT c.customer_id) AS new_customers,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(SUM(m.spend) / NULLIF(COUNT(DISTINCT c.customer_id), 0), 2) AS cac' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM marketing_spend m' },
  { lineNumber: 7, type: 'unchanged', content: 'LEFT JOIN customer_attribution c ON m.channel = c.first_touch_channel' },
  { lineNumber: 8, type: 'unchanged', content: "WHERE m.period = 'Q4-2024'" },
  { lineNumber: 9, type: 'unchanged', content: "    AND c.first_order_date BETWEEN '2024-10-01' AND '2024-12-31'" },
  { lineNumber: 10, type: 'unchanged', content: 'GROUP BY m.channel' },
  { lineNumber: 11, type: 'unchanged', content: 'ORDER BY cac ASC;' }
];

const task9Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'CAC Calculation', description: 'Channel, spend, new customers, and cost per acquisition', type: 'aggregation' },
  { lineStart: 6, lineEnd: 7, title: 'Data Sources', description: 'Marketing spend with customer attribution', type: 'source' },
  { lineStart: 8, lineEnd: 11, title: 'Filters & Grouping', description: 'Q4 2024, first-time customers only', type: 'filter' }
];

const task9TableColumns: TableColumn[] = [
  { key: 'channel', label: 'Channel', align: 'left' },
  { key: 'total_spend', label: 'Spend', align: 'right' },
  { key: 'new_customers', label: 'New Customers', align: 'right' },
  { key: 'cac', label: 'CAC', align: 'right' }
];

const task9TableData = [
  { channel: 'Organic Search', total_spend: '$0', new_customers: 8234, cac: '$0.00' },
  { channel: 'Email', total_spend: '$45,000', new_customers: 3456, cac: '$13.02' },
  { channel: 'Social Media', total_spend: '$125,000', new_customers: 4567, cac: '$27.37' },
  { channel: 'Paid Search', total_spend: '$234,000', new_customers: 5678, cac: '$41.21' },
  { channel: 'Display Ads', total_spend: '$89,000', new_customers: 1234, cac: '$72.12' }
];

const task9Assumptions: Assumption[] = [
  { id: '1', text: 'CAC = total channel spend / new customers from that channel', includeInMessage: true },
  { id: '2', text: 'First-touch attribution model', includeInMessage: true },
  { id: '3', text: 'Q4 2024 analysis period', includeInMessage: true }
];

const task9ResponseMessage = `**Customer Acquisition Cost by Channel (Q4 2024):**\n\n| Channel | CAC |\n|---------|-----|\n| Organic Search | $0.00 |\n| Email | $13.02 |\n| Social Media | $27.37 |\n| Paid Search | $41.21 |\n| Display Ads | $72.12 |\n\n**Insight**: Email has the best CAC among paid channels at $13.02. Display Ads at $72.12 may need optimization or reallocation to higher-performing channels.`;


// Task 10: Product Return Rate Drivers
const task10: Task = {
  id: 'retail-10',
  title: 'Product Return Rate Drivers',
  requestor: 'Natalie Brown, Quality Assurance',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 48),
  priority: 'high',
  description: 'Which products have the highest return rates and what are the top reasons?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 90
};

const task10Messages: ChatMessage[] = [
  { id: 'retail-10-msg-1', sender: 'user', content: 'Which products have the highest return rates and what are the top reasons?', timestamp: new Date(Date.now() - 1000 * 60 * 58), type: 'text' },
  { id: 'retail-10-msg-2', sender: 'agent', content: 'Analyzing return rates and reasons by product for the last 90 days.', timestamp: new Date(Date.now() - 1000 * 60 * 48), type: 'action', assumptions: ['Return rate = returned units / sold units', 'Last 90 days of sales and returns', 'Minimum 50 units sold for significance'] }
];

const task10Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    p.product_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(s.quantity) AS units_sold,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(r.quantity) AS units_returned,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(SUM(r.quantity) * 100.0 / NULLIF(SUM(s.quantity), 0), 1) AS return_rate,' },
  { lineNumber: 6, type: 'unchanged', content: '    MODE() WITHIN GROUP (ORDER BY r.return_reason) AS top_reason' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM sales s' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN products p ON s.product_id = p.product_id' },
  { lineNumber: 9, type: 'unchanged', content: 'LEFT JOIN returns r ON s.sale_id = r.original_sale_id' },
  { lineNumber: 10, type: 'unchanged', content: 'WHERE s.sale_date >= CURRENT_DATE - 90' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY p.product_name' },
  { lineNumber: 12, type: 'unchanged', content: 'HAVING SUM(s.quantity) >= 50' },
  { lineNumber: 13, type: 'unchanged', content: 'ORDER BY return_rate DESC LIMIT 10;' }
];

const task10Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Return Metrics', description: 'Product, sales, returns, rate, and top reason', type: 'selection' },
  { lineStart: 7, lineEnd: 9, title: 'Data Sources', description: 'Sales with products and returns', type: 'source' },
  { lineStart: 10, lineEnd: 13, title: 'Filters', description: 'Last 90 days, minimum volume, top 10', type: 'filter' }
];

const task10TableColumns: TableColumn[] = [
  { key: 'product_name', label: 'Product', align: 'left' },
  { key: 'return_rate', label: 'Return Rate', align: 'right' },
  { key: 'top_reason', label: 'Top Reason', align: 'left' }
];

const task10TableData = [
  { product_name: 'SlimFit Jeans Size S', return_rate: '32.4%', top_reason: 'Size too small' },
  { product_name: 'UltraSound Speaker', return_rate: '24.8%', top_reason: 'Did not match description' },
  { product_name: 'FlexBand Watch', return_rate: '21.3%', top_reason: 'Defective' },
  { product_name: 'SilkGlow Dress', return_rate: '19.7%', top_reason: 'Color different than shown' },
  { product_name: 'PowerLift Dumbbells', return_rate: '15.2%', top_reason: 'Changed mind' }
];

const task10Assumptions: Assumption[] = [
  { id: '1', text: 'Return rate = returned units / sold units', includeInMessage: true },
  { id: '2', text: 'Analysis period: last 90 days', includeInMessage: true },
  { id: '3', text: 'Minimum 50 units sold for statistical significance', includeInMessage: false }
];

const task10ResponseMessage = `**Products with highest return rates:**\n\n| Product | Return Rate | Top Reason |\n|---------|-------------|------------|\n| SlimFit Jeans Size S | 32.4% | Size too small |\n| UltraSound Speaker | 24.8% | Did not match description |\n| FlexBand Watch | 21.3% | Defective |\n\n**Action Items:**\n1. **SlimFit Jeans**: Update size guide, consider relabeling\n2. **UltraSound Speaker**: Review product images and descriptions\n3. **FlexBand Watch**: Escalate to quality team for defect investigation`;


// Task 11: Seasonal Demand Forecasting
const task11: Task = {
  id: 'retail-11',
  title: 'Seasonal Demand Patterns',
  requestor: 'Kevin Park, Supply Chain',
  status: 'ingesting',
  timestamp: new Date(Date.now() - 1000 * 60 * 4),
  priority: 'medium',
  description: 'What are the seasonal demand patterns for outdoor furniture?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 88
};

const task11Messages: ChatMessage[] = [
  { id: 'retail-11-msg-1', sender: 'user', content: 'What are the seasonal demand patterns for outdoor furniture?', timestamp: new Date(Date.now() - 1000 * 60 * 12), type: 'text' },
  { id: 'retail-11-msg-2', sender: 'agent', content: 'Analyzing monthly sales trends for outdoor furniture category over the past 2 years.', timestamp: new Date(Date.now() - 1000 * 60 * 4), type: 'action', assumptions: ['Outdoor furniture = products in Outdoor/Patio category', 'Monthly aggregation for seasonal patterns', '24 months of historical data'] }
];

const task11Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    EXTRACT(MONTH FROM s.sale_date) AS month,' },
  { lineNumber: 3, type: 'unchanged', content: '    ROUND(AVG(monthly_sales), 0) AS avg_monthly_units,' },
  { lineNumber: 4, type: 'unchanged', content: '    ROUND(AVG(monthly_revenue), 2) AS avg_monthly_revenue' },
  { lineNumber: 5, type: 'unchanged', content: 'FROM (' },
  { lineNumber: 6, type: 'unchanged', content: '    SELECT DATE_TRUNC(\'month\', s.sale_date) AS month, SUM(s.quantity) AS monthly_sales, SUM(s.quantity * s.unit_price) AS monthly_revenue' },
  { lineNumber: 7, type: 'unchanged', content: '    FROM sales s JOIN products p ON s.product_id = p.product_id' },
  { lineNumber: 8, type: 'unchanged', content: "    WHERE p.category = 'Outdoor Furniture'" },
  { lineNumber: 9, type: 'unchanged', content: '        AND s.sale_date >= CURRENT_DATE - INTERVAL 24 MONTH' },
  { lineNumber: 10, type: 'unchanged', content: '    GROUP BY DATE_TRUNC(\'month\', s.sale_date)' },
  { lineNumber: 11, type: 'unchanged', content: ') monthly' },
  { lineNumber: 12, type: 'unchanged', content: 'GROUP BY EXTRACT(MONTH FROM month) ORDER BY month;' }
];

const task11Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 4, title: 'Seasonal Averages', description: 'Month-over-month average units and revenue', type: 'aggregation' },
  { lineStart: 5, lineEnd: 11, title: 'Monthly Subquery', description: 'Aggregating by calendar month first', type: 'source' },
  { lineStart: 12, lineEnd: 12, title: 'Final Grouping', description: 'Average across same months over years', type: 'grouping' }
];

const task11TableColumns: TableColumn[] = [
  { key: 'month', label: 'Month', align: 'left' },
  { key: 'avg_monthly_units', label: 'Avg Units', align: 'right' },
  { key: 'avg_monthly_revenue', label: 'Avg Revenue', align: 'right' }
];

const task11TableData = [
  { month: 'March', avg_monthly_units: 1234, avg_monthly_revenue: '$89,456' },
  { month: 'April', avg_monthly_units: 2345, avg_monthly_revenue: '$178,234' },
  { month: 'May', avg_monthly_units: 4567, avg_monthly_revenue: '$345,678' },
  { month: 'June', avg_monthly_units: 5678, avg_monthly_revenue: '$423,456' },
  { month: 'July', avg_monthly_units: 4890, avg_monthly_revenue: '$367,890' }
];

const task11Assumptions: Assumption[] = [
  { id: '1', text: 'Outdoor furniture = Outdoor/Patio product category', includeInMessage: true },
  { id: '2', text: 'Average calculated across 24 months of data', includeInMessage: true },
  { id: '3', text: 'Monthly granularity for seasonal pattern visibility', includeInMessage: false }
];

const task11ResponseMessage = `**Seasonal demand pattern for Outdoor Furniture:**\n\n**Peak Season**: April-July\n- Peak month: June ($423K avg revenue)\n- Season ramp-up starts March\n- Decline begins August\n\n**Recommendation**: \n- Inventory build should start February\n- Peak staffing/logistics capacity needed May-June\n- Markdown season should begin late July`;


// Task 12: Price Elasticity Analysis
const task12: Task = {
  id: 'retail-12',
  title: 'Price Elasticity by Product Category',
  requestor: 'Diana Foster, Pricing Strategy',
  status: 'asserting',
  timestamp: new Date(Date.now() - 1000 * 60 * 9),
  priority: 'high',
  description: 'How do price changes affect demand across our main product categories?',
  source: 'meeting',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: true, vip: true },
  confidence: 82
};

const task12Messages: ChatMessage[] = [
  { id: 'retail-12-msg-1', sender: 'user', content: 'How do price changes affect demand across our main product categories?', timestamp: new Date(Date.now() - 1000 * 60 * 18), type: 'text' },
  { id: 'retail-12-msg-2', sender: 'agent', content: 'Calculating price elasticity coefficients by category using price change events and demand response.', timestamp: new Date(Date.now() - 1000 * 60 * 9), type: 'action', assumptions: ['Elasticity = % change in demand / % change in price', 'Using price change events in past 12 months', 'Controlling for seasonality'] }
];

const task12Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH price_changes AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT category, price_change_date,' },
  { lineNumber: 3, type: 'unchanged', content: '           (new_price - old_price) / old_price AS price_pct_change,' },
  { lineNumber: 4, type: 'unchanged', content: '           (post_units - pre_units) / pre_units AS demand_pct_change' },
  { lineNumber: 5, type: 'unchanged', content: '    FROM price_events' },
  { lineNumber: 6, type: 'unchanged', content: '    WHERE price_change_date >= CURRENT_DATE - 365' },
  { lineNumber: 7, type: 'unchanged', content: ')' },
  { lineNumber: 8, type: 'unchanged', content: 'SELECT category,' },
  { lineNumber: 9, type: 'unchanged', content: '       ROUND(AVG(demand_pct_change / NULLIF(price_pct_change, 0)), 2) AS elasticity,' },
  { lineNumber: 10, type: 'unchanged', content: '       COUNT(*) AS data_points' },
  { lineNumber: 11, type: 'unchanged', content: 'FROM price_changes GROUP BY category ORDER BY elasticity;' }
];

const task12Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 7, title: 'Price Change Events', description: 'Calculating percentage changes in price and demand', type: 'aggregation' },
  { lineStart: 8, lineEnd: 11, title: 'Elasticity Calculation', description: 'Average elasticity coefficient by category', type: 'selection' }
];

const task12TableColumns: TableColumn[] = [
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'elasticity', label: 'Elasticity', align: 'right' },
  { key: 'interpretation', label: 'Interpretation', align: 'left' }
];

const task12TableData = [
  { category: 'Luxury Goods', elasticity: -0.4, interpretation: 'Inelastic - can raise prices' },
  { category: 'Electronics', elasticity: -1.8, interpretation: 'Elastic - price sensitive' },
  { category: 'Apparel', elasticity: -1.2, interpretation: 'Moderately elastic' },
  { category: 'Home Basics', elasticity: -0.7, interpretation: 'Inelastic' },
  { category: 'Beauty', elasticity: -0.9, interpretation: 'Near unit elastic' }
];

const task12Assumptions: Assumption[] = [
  { id: '1', text: 'Elasticity = % demand change / % price change', includeInMessage: true },
  { id: '2', text: 'Based on price change events in past 12 months', includeInMessage: true },
  { id: '3', text: 'Negative values indicate normal demand behavior', includeInMessage: true }
];

const task12ResponseMessage = `**Price Elasticity by Category:**\n\n| Category | Elasticity | Strategy |\n|----------|------------|----------|\n| Luxury Goods | -0.4 | Room to raise prices |\n| Home Basics | -0.7 | Stable pricing okay |\n| Beauty | -0.9 | Minor price sensitivity |\n| Apparel | -1.2 | Moderate discounting works |\n| Electronics | -1.8 | Very price sensitive |\n\n**Insight**: Electronics customers are highly price-sensitive. Focus promotions here for volume; protect margins in Luxury.`;


// Task 13: Customer Lifetime Value Segments
const task13: Task = {
  id: 'retail-13',
  title: 'Customer LTV Segmentation',
  requestor: 'Robert Kim, Customer Analytics',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 28),
  priority: 'medium',
  description: 'What are the LTV distributions across our customer segments?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 91
};

const task13Messages: ChatMessage[] = [
  { id: 'retail-13-msg-1', sender: 'user', content: 'What are the LTV distributions across our customer segments?', timestamp: new Date(Date.now() - 1000 * 60 * 38), type: 'text' },
  { id: 'retail-13-msg-2', sender: 'agent', content: 'Calculating customer lifetime value by segment using historical purchase data.', timestamp: new Date(Date.now() - 1000 * 60 * 28), type: 'action', assumptions: ['LTV = total revenue from customer to date', 'Segments based on recency and frequency', 'All-time customer history'] }
];

const task13Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    c.segment,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(DISTINCT c.customer_id) AS customers,' },
  { lineNumber: 4, type: 'unchanged', content: '    ROUND(AVG(c.lifetime_value), 2) AS avg_ltv,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(SUM(c.lifetime_value), 2) AS total_ltv,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(SUM(c.lifetime_value) * 100.0 / SUM(SUM(c.lifetime_value)) OVER(), 1) AS pct_of_revenue' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM customers c' },
  { lineNumber: 8, type: 'unchanged', content: 'GROUP BY c.segment' },
  { lineNumber: 9, type: 'unchanged', content: 'ORDER BY avg_ltv DESC;' }
];

const task13Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'LTV Metrics', description: 'Segment, customer count, average and total LTV', type: 'aggregation' },
  { lineStart: 7, lineEnd: 9, title: 'Grouping', description: 'By customer segment, ordered by average LTV', type: 'grouping' }
];

const task13TableColumns: TableColumn[] = [
  { key: 'segment', label: 'Segment', align: 'left' },
  { key: 'customers', label: 'Customers', align: 'right' },
  { key: 'avg_ltv', label: 'Avg LTV', align: 'right' },
  { key: 'pct_of_revenue', label: '% Revenue', align: 'right' }
];

const task13TableData = [
  { segment: 'Champions', customers: 12345, avg_ltv: '$2,456', pct_of_revenue: '42.3%' },
  { segment: 'Loyal', customers: 23456, avg_ltv: '$876', pct_of_revenue: '28.7%' },
  { segment: 'Promising', customers: 34567, avg_ltv: '$234', pct_of_revenue: '11.3%' },
  { segment: 'At Risk', customers: 18234, avg_ltv: '$456', pct_of_revenue: '11.6%' },
  { segment: 'Hibernating', customers: 45678, avg_ltv: '$98', pct_of_revenue: '6.1%' }
];

const task13Assumptions: Assumption[] = [
  { id: '1', text: 'LTV = historical total revenue per customer', includeInMessage: true },
  { id: '2', text: 'Segments based on RFM (Recency, Frequency, Monetary)', includeInMessage: true },
  { id: '3', text: 'All-time purchase history used', includeInMessage: false }
];

const task13ResponseMessage = `**Customer LTV by Segment:**\n\n| Segment | % of Customers | Avg LTV | % Revenue |\n|---------|----------------|---------|------------|\n| Champions | 9% | $2,456 | 42.3% |\n| Loyal | 17% | $876 | 28.7% |\n| At Risk | 14% | $456 | 11.6% |\n\n**Key Insight**: Champions (9% of customers) drive 42% of revenue. Priority: Retain Champions and convert Loyal → Champions through VIP programs.`;


// Task 14: Inventory Turnover Optimization
const task14: Task = {
  id: 'retail-14',
  title: 'Inventory Turnover by Category',
  requestor: 'Steve Martinez, Inventory Planning',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 52),
  priority: 'medium',
  description: 'Which product categories have the slowest inventory turnover?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 89
};

const task14Messages: ChatMessage[] = [
  { id: 'retail-14-msg-1', sender: 'user', content: 'Which product categories have the slowest inventory turnover?', timestamp: new Date(Date.now() - 1000 * 60 * 62), type: 'text' },
  { id: 'retail-14-msg-2', sender: 'agent', content: 'Calculating inventory turnover ratio by category using COGS and average inventory.', timestamp: new Date(Date.now() - 1000 * 60 * 52), type: 'action', assumptions: ['Turnover = COGS / Average Inventory Value', 'Last 12 months of data', 'Average inventory = (beginning + ending) / 2'] }
];

const task14Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    p.category,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(s.cogs) AS annual_cogs,' },
  { lineNumber: 4, type: 'unchanged', content: '    AVG(i.inventory_value) AS avg_inventory,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(SUM(s.cogs) / NULLIF(AVG(i.inventory_value), 0), 2) AS turnover_ratio,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(365 / (SUM(s.cogs) / NULLIF(AVG(i.inventory_value), 0)), 0) AS days_to_sell' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM sales s' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN products p ON s.product_id = p.product_id' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN inventory_snapshots i ON p.product_id = i.product_id' },
  { lineNumber: 10, type: 'unchanged', content: 'WHERE s.sale_date >= CURRENT_DATE - 365' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY p.category ORDER BY turnover_ratio ASC;' }
];

const task14Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Turnover Metrics', description: 'COGS, average inventory, turnover ratio, and days to sell', type: 'aggregation' },
  { lineStart: 7, lineEnd: 9, title: 'Data Sources', description: 'Sales, products, and inventory snapshots', type: 'source' },
  { lineStart: 10, lineEnd: 11, title: 'Filters', description: 'Last 12 months, sorted by slowest turnover', type: 'filter' }
];

const task14TableColumns: TableColumn[] = [
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'turnover_ratio', label: 'Turnover', align: 'right' },
  { key: 'days_to_sell', label: 'Days to Sell', align: 'right' }
];

const task14TableData = [
  { category: 'Luxury Watches', turnover_ratio: 1.2, days_to_sell: 304 },
  { category: 'Fine Jewelry', turnover_ratio: 1.8, days_to_sell: 203 },
  { category: 'Outdoor Equipment', turnover_ratio: 2.4, days_to_sell: 152 },
  { category: 'Electronics', turnover_ratio: 8.7, days_to_sell: 42 },
  { category: 'Consumables', turnover_ratio: 24.3, days_to_sell: 15 }
];

const task14Assumptions: Assumption[] = [
  { id: '1', text: 'Turnover ratio = Annual COGS / Average Inventory', includeInMessage: true },
  { id: '2', text: 'Days to sell = 365 / Turnover ratio', includeInMessage: true },
  { id: '3', text: 'Last 12 months of sales data used', includeInMessage: false }
];

const task14ResponseMessage = `**Slowest inventory turnover categories:**\n\n| Category | Turnover | Days to Sell |\n|----------|----------|---------------|\n| Luxury Watches | 1.2x | 304 days |\n| Fine Jewelry | 1.8x | 203 days |\n| Outdoor Equipment | 2.4x | 152 days |\n\n**Recommendations:**\n1. Luxury/Jewelry: Expected for high-value items - maintain curated selection\n2. Outdoor Equipment: Review for overstock, consider seasonal markdowns`;


// Task 15: Shipping Speed vs Cost Tradeoffs
const task15: Task = {
  id: 'retail-15',
  title: 'Shipping Speed Impact on Conversion',
  requestor: 'Michelle Lee, Fulfillment',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 18),
  priority: 'high',
  description: 'How does shipping speed option affect conversion rate?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: true, vip: false },
  confidence: 85
};

const task15Messages: ChatMessage[] = [
  { id: 'retail-15-msg-1', sender: 'user', content: 'How does shipping speed option affect conversion rate?', timestamp: new Date(Date.now() - 1000 * 60 * 28), type: 'text' },
  { id: 'retail-15-msg-2', sender: 'agent', content: 'Analyzing conversion rates by shipping option selected at checkout.', timestamp: new Date(Date.now() - 1000 * 60 * 18), type: 'action', assumptions: ['Conversion = checkout initiated to order completed', 'Shipping option selected at checkout', 'Last 60 days of checkout data'] }
];

const task15Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    ch.shipping_option,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(*) AS checkouts_started,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(CASE WHEN ch.completed = true THEN 1 ELSE 0 END) AS orders_completed,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(SUM(CASE WHEN ch.completed = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS conversion_rate,' },
  { lineNumber: 6, type: 'unchanged', content: '    AVG(ch.shipping_cost) AS avg_shipping_cost' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM checkouts ch' },
  { lineNumber: 8, type: 'unchanged', content: 'WHERE ch.created_at >= CURRENT_DATE - 60' },
  { lineNumber: 9, type: 'unchanged', content: '    AND ch.shipping_option IS NOT NULL' },
  { lineNumber: 10, type: 'unchanged', content: 'GROUP BY ch.shipping_option' },
  { lineNumber: 11, type: 'unchanged', content: 'ORDER BY conversion_rate DESC;' }
];

const task15Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Shipping Metrics', description: 'Option, checkouts, completions, rate, and cost', type: 'aggregation' },
  { lineStart: 7, lineEnd: 9, title: 'Data Source', description: 'Checkouts table with shipping selection', type: 'source' },
  { lineStart: 10, lineEnd: 11, title: 'Grouping', description: 'By shipping option, sorted by conversion', type: 'grouping' }
];

const task15TableColumns: TableColumn[] = [
  { key: 'shipping_option', label: 'Shipping', align: 'left' },
  { key: 'conversion_rate', label: 'Conversion', align: 'right' },
  { key: 'avg_shipping_cost', label: 'Avg Cost', align: 'right' }
];

const task15TableData = [
  { shipping_option: 'Free (5-7 days)', conversion_rate: '78.4%', avg_shipping_cost: '$0.00' },
  { shipping_option: 'Standard (3-5 days)', conversion_rate: '62.3%', avg_shipping_cost: '$5.99' },
  { shipping_option: 'Express (1-2 days)', conversion_rate: '71.2%', avg_shipping_cost: '$12.99' },
  { shipping_option: 'Same Day', conversion_rate: '68.5%', avg_shipping_cost: '$24.99' }
];

const task15Assumptions: Assumption[] = [
  { id: '1', text: 'Conversion = checkout started to order completed', includeInMessage: true },
  { id: '2', text: 'Shipping option selected during checkout flow', includeInMessage: true },
  { id: '3', text: 'Last 60 days of checkout data analyzed', includeInMessage: false }
];

const task15ResponseMessage = `**Shipping speed impact on conversion:**\n\n| Shipping Option | Conversion Rate |\n|-----------------|------------------|\n| Free (5-7 days) | 78.4% |\n| Express (1-2 days) | 71.2% |\n| Same Day | 68.5% |\n| Standard (3-5 days) | 62.3% |\n\n**Key Insight**: Free shipping has highest conversion (78.4%), but Express at 71.2% shows customers will pay $12.99 for speed. Standard's low rate suggests the $5.99 fee isn't justified by the speed.`;


// Task 16: Email Campaign Performance
const task16: Task = {
  id: 'retail-16',
  title: 'Email Campaign Revenue Attribution',
  requestor: 'Jessica Wang, Email Marketing',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 42),
  priority: 'medium',
  description: 'Which email campaigns drove the most revenue last month?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 88
};

const task16Messages: ChatMessage[] = [
  { id: 'retail-16-msg-1', sender: 'user', content: 'Which email campaigns drove the most revenue last month?', timestamp: new Date(Date.now() - 1000 * 60 * 52), type: 'text' },
  { id: 'retail-16-msg-2', sender: 'agent', content: 'Analyzing email campaign performance with revenue attribution for December 2024.', timestamp: new Date(Date.now() - 1000 * 60 * 42), type: 'action', assumptions: ['Revenue attributed to campaign if order within 7 days of email click', 'Last month = December 2024', 'Unique customers per campaign'] }
];

const task16Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    e.campaign_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(DISTINCT e.recipient_id) AS recipients,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(CASE WHEN e.clicked = true THEN 1 ELSE 0 END) AS clicks,' },
  { lineNumber: 5, type: 'unchanged', content: '    COUNT(DISTINCT o.order_id) AS orders,' },
  { lineNumber: 6, type: 'unchanged', content: '    SUM(o.order_total) AS attributed_revenue' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM email_sends e' },
  { lineNumber: 8, type: 'unchanged', content: 'LEFT JOIN orders o ON e.recipient_id = o.customer_id' },
  { lineNumber: 9, type: 'unchanged', content: '    AND o.order_date BETWEEN e.sent_at AND e.sent_at + INTERVAL 7 DAY' },
  { lineNumber: 10, type: 'unchanged', content: "WHERE e.sent_at BETWEEN '2024-12-01' AND '2024-12-31'" },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY e.campaign_name ORDER BY attributed_revenue DESC;' }
];

const task16Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Campaign Metrics', description: 'Recipients, clicks, orders, and attributed revenue', type: 'aggregation' },
  { lineStart: 7, lineEnd: 9, title: 'Attribution Logic', description: 'Orders within 7 days of email click', type: 'source' },
  { lineStart: 10, lineEnd: 11, title: 'Filters', description: 'December 2024, sorted by revenue', type: 'filter' }
];

const task16TableColumns: TableColumn[] = [
  { key: 'campaign_name', label: 'Campaign', align: 'left' },
  { key: 'recipients', label: 'Recipients', align: 'right' },
  { key: 'orders', label: 'Orders', align: 'right' },
  { key: 'attributed_revenue', label: 'Revenue', align: 'right' }
];

const task16TableData = [
  { campaign_name: 'Holiday Sale Announcement', recipients: 234567, orders: 8934, attributed_revenue: '$567,234' },
  { campaign_name: 'Last Chance Holiday Deals', recipients: 189234, orders: 6234, attributed_revenue: '$423,456' },
  { campaign_name: 'Gift Guide 2024', recipients: 156789, orders: 4567, attributed_revenue: '$312,345' },
  { campaign_name: 'Abandoned Cart Reminder', recipients: 45678, orders: 3456, attributed_revenue: '$234,567' },
  { campaign_name: 'VIP Early Access', recipients: 23456, orders: 2345, attributed_revenue: '$198,765' }
];

const task16Assumptions: Assumption[] = [
  { id: '1', text: 'Revenue attributed if order placed within 7 days of email click', includeInMessage: true },
  { id: '2', text: 'December 2024 campaign period', includeInMessage: true },
  { id: '3', text: 'Multiple campaigns can attribute to same order', includeInMessage: false }
];

const task16ResponseMessage = `**Top email campaigns by revenue (December 2024):**\n\n| Campaign | Orders | Revenue |\n|----------|--------|----------|\n| Holiday Sale Announcement | 8,934 | $567K |\n| Last Chance Holiday Deals | 6,234 | $423K |\n| Gift Guide 2024 | 4,567 | $312K |\n\n**Insight**: Abandoned Cart has highest revenue per recipient ($5.13 vs $2.42 for Holiday Sale). Scale abandoned cart program for higher ROI.`;


// Task 17: New Product Launch Performance
const task17: Task = {
  id: 'retail-17',
  title: 'New Product Launch Velocity',
  requestor: 'Andrew Peters, Product Launch',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 58),
  priority: 'high',
  description: 'How are our Q4 product launches performing in terms of sell-through?',
  source: 'meeting',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: true, vip: true },
  confidence: 87
};

const task17Messages: ChatMessage[] = [
  { id: 'retail-17-msg-1', sender: 'user', content: 'How are our Q4 product launches performing in terms of sell-through?', timestamp: new Date(Date.now() - 1000 * 60 * 68), type: 'text' },
  { id: 'retail-17-msg-2', sender: 'agent', content: 'Analyzing first 30-day sell-through rates for products launched in Q4 2024.', timestamp: new Date(Date.now() - 1000 * 60 * 58), type: 'action', assumptions: ['New products = launch date in Q4 2024', 'Sell-through = units sold / initial inventory', 'First 30 days after launch'] }
];

const task17Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    p.product_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    p.launch_date,' },
  { lineNumber: 4, type: 'unchanged', content: '    p.initial_inventory,' },
  { lineNumber: 5, type: 'unchanged', content: '    SUM(s.quantity) AS units_sold_30d,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(SUM(s.quantity) * 100.0 / p.initial_inventory, 1) AS sell_through_pct' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM products p' },
  { lineNumber: 8, type: 'unchanged', content: 'LEFT JOIN sales s ON p.product_id = s.product_id' },
  { lineNumber: 9, type: 'unchanged', content: '    AND s.sale_date BETWEEN p.launch_date AND p.launch_date + INTERVAL 30 DAY' },
  { lineNumber: 10, type: 'unchanged', content: "WHERE p.launch_date BETWEEN '2024-10-01' AND '2024-12-31'" },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY p.product_name, p.launch_date, p.initial_inventory' },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY sell_through_pct DESC;' }
];

const task17Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Launch Metrics', description: 'Product, launch date, initial inventory, sales, and sell-through', type: 'selection' },
  { lineStart: 7, lineEnd: 9, title: 'Data Sources', description: 'Products with 30-day sales window', type: 'source' },
  { lineStart: 10, lineEnd: 12, title: 'Filters', description: 'Q4 2024 launches, sorted by sell-through', type: 'filter' }
];

const task17TableColumns: TableColumn[] = [
  { key: 'product_name', label: 'Product', align: 'left' },
  { key: 'launch_date', label: 'Launch', align: 'left' },
  { key: 'sell_through_pct', label: '30-Day Sell-Through', align: 'right' }
];

const task17TableData = [
  { product_name: 'HolidayGlow Candle Set', launch_date: 'Oct 15', sell_through_pct: '94.2%' },
  { product_name: 'WinterWarm Blanket', launch_date: 'Nov 1', sell_through_pct: '87.5%' },
  { product_name: 'TechPro Earbuds', launch_date: 'Oct 20', sell_through_pct: '72.3%' },
  { product_name: 'CozyFit Slippers', launch_date: 'Nov 15', sell_through_pct: '68.4%' },
  { product_name: 'SmartHome Hub', launch_date: 'Dec 1', sell_through_pct: '45.6%' }
];

const task17Assumptions: Assumption[] = [
  { id: '1', text: 'Sell-through = units sold in first 30 days / initial inventory', includeInMessage: true },
  { id: '2', text: 'Q4 2024 product launches (Oct-Dec)', includeInMessage: true },
  { id: '3', text: 'December launches may have incomplete 30-day data', includeInMessage: true }
];

const task17ResponseMessage = `**Q4 2024 Product Launch Performance:**\n\n| Product | 30-Day Sell-Through |\n|---------|---------------------|\n| HolidayGlow Candle Set | 94.2% ⭐ |\n| WinterWarm Blanket | 87.5% |\n| TechPro Earbuds | 72.3% |\n| CozyFit Slippers | 68.4% |\n| SmartHome Hub | 45.6% ⚠️ |\n\n**Actions**: Reorder HolidayGlow immediately. Investigate SmartHome Hub - consider promotional support or inventory rebalancing.`;


// Task 18: Customer Complaint Patterns
const task18: Task = {
  id: 'retail-18',
  title: 'Customer Complaint Analysis',
  requestor: 'Linda Chen, Customer Experience',
  status: 'ingesting',
  timestamp: new Date(Date.now() - 1000 * 60 * 5),
  priority: 'medium',
  description: 'What are the most common customer complaints by product category?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 86
};

const task18Messages: ChatMessage[] = [
  { id: 'retail-18-msg-1', sender: 'user', content: 'What are the most common customer complaints by product category?', timestamp: new Date(Date.now() - 1000 * 60 * 14), type: 'text' },
  { id: 'retail-18-msg-2', sender: 'agent', content: 'Analyzing complaint categories and frequency by product category for the past 90 days.', timestamp: new Date(Date.now() - 1000 * 60 * 5), type: 'action', assumptions: ['Complaints from support tickets and reviews', 'Categorized by complaint type', 'Last 90 days'] }
];

const task18Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    p.category,' },
  { lineNumber: 3, type: 'unchanged', content: '    c.complaint_type,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(*) AS complaint_count,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(PARTITION BY p.category), 1) AS pct_of_category' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM complaints c' },
  { lineNumber: 7, type: 'unchanged', content: 'JOIN products p ON c.product_id = p.product_id' },
  { lineNumber: 8, type: 'unchanged', content: 'WHERE c.complaint_date >= CURRENT_DATE - 90' },
  { lineNumber: 9, type: 'unchanged', content: 'GROUP BY p.category, c.complaint_type' },
  { lineNumber: 10, type: 'unchanged', content: 'ORDER BY p.category, complaint_count DESC;' }
];

const task18Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Complaint Metrics', description: 'Category, complaint type, count, and percentage', type: 'aggregation' },
  { lineStart: 6, lineEnd: 8, title: 'Data Sources', description: 'Complaints joined with products', type: 'source' },
  { lineStart: 9, lineEnd: 10, title: 'Grouping', description: 'By category and complaint type', type: 'grouping' }
];

const task18TableColumns: TableColumn[] = [
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'complaint_type', label: 'Top Complaint', align: 'left' },
  { key: 'complaint_count', label: 'Count', align: 'right' },
  { key: 'pct_of_category', label: '% of Cat.', align: 'right' }
];

const task18TableData = [
  { category: 'Apparel', complaint_type: 'Size/Fit Issues', complaint_count: 1234, pct_of_category: '42.3%' },
  { category: 'Electronics', complaint_type: 'Not as Described', complaint_count: 876, pct_of_category: '35.6%' },
  { category: 'Home & Kitchen', complaint_type: 'Damaged in Shipping', complaint_count: 654, pct_of_category: '28.9%' },
  { category: 'Beauty', complaint_type: 'Allergic Reaction', complaint_count: 234, pct_of_category: '18.4%' },
  { category: 'Sports', complaint_type: 'Defective', complaint_count: 345, pct_of_category: '24.1%' }
];

const task18Assumptions: Assumption[] = [
  { id: '1', text: 'Complaints from support tickets and product reviews', includeInMessage: true },
  { id: '2', text: 'Last 90 days of complaint data', includeInMessage: true },
  { id: '3', text: 'Showing top complaint type per category', includeInMessage: false }
];

const task18ResponseMessage = `**Top complaints by product category:**\n\n| Category | Top Complaint | % of Issues |\n|----------|---------------|-------------|\n| Apparel | Size/Fit Issues | 42.3% |\n| Electronics | Not as Described | 35.6% |\n| Home & Kitchen | Damaged in Shipping | 28.9% |\n\n**Priority Actions:**\n1. **Apparel**: Improve size guides, add customer reviews with fit info\n2. **Electronics**: Audit product descriptions for accuracy\n3. **Home & Kitchen**: Review packaging for fragile items`;


// Task 19: Mobile App vs Web Performance
const task19: Task = {
  id: 'retail-19',
  title: 'Mobile App vs Web Conversion',
  requestor: 'Tom Williams, Digital Product',
  status: 'asserting',
  timestamp: new Date(Date.now() - 1000 * 60 * 11),
  priority: 'high',
  description: 'How does mobile app performance compare to mobile web?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: false, vip: true },
  confidence: 90
};

const task19Messages: ChatMessage[] = [
  { id: 'retail-19-msg-1', sender: 'user', content: 'How does mobile app performance compare to mobile web?', timestamp: new Date(Date.now() - 1000 * 60 * 20), type: 'text' },
  { id: 'retail-19-msg-2', sender: 'agent', content: 'Comparing conversion rates, AOV, and engagement between mobile app and mobile web for the last 30 days.', timestamp: new Date(Date.now() - 1000 * 60 * 11), type: 'action', assumptions: ['Mobile app = iOS and Android apps', 'Mobile web = browser on mobile devices', 'Last 30 days of session data'] }
];

const task19Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    s.platform,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(DISTINCT s.session_id) AS sessions,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(DISTINCT o.order_id) AS orders,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(COUNT(DISTINCT o.order_id) * 100.0 / COUNT(DISTINCT s.session_id), 2) AS conversion_rate,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(AVG(o.order_total), 2) AS avg_order_value' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM sessions s' },
  { lineNumber: 8, type: 'unchanged', content: 'LEFT JOIN orders o ON s.session_id = o.session_id' },
  { lineNumber: 9, type: 'unchanged', content: 'WHERE s.session_start >= CURRENT_DATE - 30' },
  { lineNumber: 10, type: 'unchanged', content: "    AND s.platform IN ('mobile_app', 'mobile_web')" },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY s.platform;' }
];

const task19Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Platform Metrics', description: 'Sessions, orders, conversion rate, and AOV', type: 'aggregation' },
  { lineStart: 7, lineEnd: 8, title: 'Data Sources', description: 'Sessions with orders', type: 'source' },
  { lineStart: 9, lineEnd: 11, title: 'Filters', description: 'Last 30 days, mobile platforms only', type: 'filter' }
];

const task19TableColumns: TableColumn[] = [
  { key: 'platform', label: 'Platform', align: 'left' },
  { key: 'sessions', label: 'Sessions', align: 'right' },
  { key: 'conversion_rate', label: 'CVR', align: 'right' },
  { key: 'avg_order_value', label: 'AOV', align: 'right' }
];

const task19TableData = [
  { platform: 'Mobile App', sessions: 456789, conversion_rate: '4.8%', avg_order_value: '$87.34' },
  { platform: 'Mobile Web', sessions: 678901, conversion_rate: '2.1%', avg_order_value: '$62.45' }
];

const task19Assumptions: Assumption[] = [
  { id: '1', text: 'Mobile app = iOS and Android native apps', includeInMessage: true },
  { id: '2', text: 'Mobile web = browser sessions on mobile devices', includeInMessage: true },
  { id: '3', text: 'Last 30 days of session and order data', includeInMessage: false }
];

const task19ResponseMessage = `**Mobile App vs Mobile Web Performance:**\n\n| Metric | App | Web | Difference |\n|--------|-----|-----|------------|\n| Conversion | 4.8% | 2.1% | **+128%** |\n| AOV | $87.34 | $62.45 | **+40%** |\n| Sessions | 457K | 679K | -33% |\n\n**Insight**: App users convert 2.3x better and spend 40% more. Priority: Drive app downloads through mobile web prompts and incentives.`;


// Task 20: Loyalty Program ROI
const task20: Task = {
  id: 'retail-20',
  title: 'Loyalty Program Performance',
  requestor: 'Sarah Mitchell, Loyalty Marketing',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 24),
  priority: 'medium',
  description: 'What is the ROI of our loyalty program compared to non-members?',
  source: 'meeting',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: true, vip: false },
  confidence: 92
};

const task20Messages: ChatMessage[] = [
  { id: 'retail-20-msg-1', sender: 'user', content: 'What is the ROI of our loyalty program compared to non-members?', timestamp: new Date(Date.now() - 1000 * 60 * 34), type: 'text' },
  { id: 'retail-20-msg-2', sender: 'agent', content: 'Comparing loyalty member vs non-member metrics for purchase frequency, AOV, and retention.', timestamp: new Date(Date.now() - 1000 * 60 * 24), type: 'action', assumptions: ['Loyalty members = active program participants', 'Last 12 months of purchase data', 'ROI based on incremental revenue vs program costs'] }
];

const task20Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    CASE WHEN c.loyalty_member = true THEN \'Member\' ELSE \'Non-Member\' END AS customer_type,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(DISTINCT c.customer_id) AS customers,' },
  { lineNumber: 4, type: 'unchanged', content: '    ROUND(AVG(customer_orders.order_count), 1) AS avg_orders_per_year,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(AVG(customer_orders.total_spend), 2) AS avg_annual_spend,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(AVG(customer_orders.avg_order_value), 2) AS avg_order_value' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM customers c' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN (' },
  { lineNumber: 9, type: 'unchanged', content: '    SELECT customer_id, COUNT(*) AS order_count, SUM(order_total) AS total_spend, AVG(order_total) AS avg_order_value' },
  { lineNumber: 10, type: 'unchanged', content: '    FROM orders WHERE order_date >= CURRENT_DATE - 365 GROUP BY customer_id' },
  { lineNumber: 11, type: 'unchanged', content: ') customer_orders ON c.customer_id = customer_orders.customer_id' },
  { lineNumber: 12, type: 'unchanged', content: 'GROUP BY c.loyalty_member;' }
];

const task20Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Member Comparison', description: 'Customer type, count, orders, spend, and AOV', type: 'aggregation' },
  { lineStart: 7, lineEnd: 11, title: 'Order Aggregation', description: 'Subquery for per-customer order metrics', type: 'source' },
  { lineStart: 12, lineEnd: 12, title: 'Grouping', description: 'By loyalty membership status', type: 'grouping' }
];

const task20TableColumns: TableColumn[] = [
  { key: 'customer_type', label: 'Type', align: 'left' },
  { key: 'customers', label: 'Customers', align: 'right' },
  { key: 'avg_orders_per_year', label: 'Orders/Year', align: 'right' },
  { key: 'avg_annual_spend', label: 'Annual Spend', align: 'right' }
];

const task20TableData = [
  { customer_type: 'Member', customers: 89234, avg_orders_per_year: 6.8, avg_annual_spend: '$534.56' },
  { customer_type: 'Non-Member', customers: 234567, avg_orders_per_year: 2.1, avg_annual_spend: '$156.78' }
];

const task20Assumptions: Assumption[] = [
  { id: '1', text: 'Loyalty members = customers enrolled in rewards program', includeInMessage: true },
  { id: '2', text: 'Last 12 months of purchase data', includeInMessage: true },
  { id: '3', text: 'Annual metrics for fair comparison', includeInMessage: false }
];

const task20ResponseMessage = `**Loyalty Program Performance:**\n\n| Metric | Members | Non-Members | Lift |\n|--------|---------|-------------|------|\n| Orders/Year | 6.8 | 2.1 | **+224%** |\n| Annual Spend | $535 | $157 | **+241%** |\n| % of Customers | 28% | 72% | - |\n\n**ROI Calculation**: If program costs $2M/year and 89K members generate $2.5M more than if they were non-members, ROI = **125%**. Strong case for member acquisition investment.`;


// Task 21: Search Query Analysis
const task21: Task = {
  id: 'retail-21',
  title: 'Site Search Optimization',
  requestor: 'David Park, Search & Discovery',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 38),
  priority: 'high',
  description: 'What are the top searches with no results on our site?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 84
};

const task21Messages: ChatMessage[] = [
  { id: 'retail-21-msg-1', sender: 'user', content: 'What are the top searches with no results on our site?', timestamp: new Date(Date.now() - 1000 * 60 * 48), type: 'text' },
  { id: 'retail-21-msg-2', sender: 'agent', content: 'Analyzing zero-result searches to identify inventory gaps and search optimization opportunities.', timestamp: new Date(Date.now() - 1000 * 60 * 38), type: 'action', assumptions: ['Zero results = search returned 0 products', 'Last 30 days of search data', 'Grouped by normalized search term'] }
];

const task21Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    LOWER(TRIM(s.search_term)) AS search_term,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(*) AS search_count,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(DISTINCT s.session_id) AS unique_sessions' },
  { lineNumber: 5, type: 'unchanged', content: 'FROM searches s' },
  { lineNumber: 6, type: 'unchanged', content: 'WHERE s.results_count = 0' },
  { lineNumber: 7, type: 'unchanged', content: '    AND s.search_date >= CURRENT_DATE - 30' },
  { lineNumber: 8, type: 'unchanged', content: 'GROUP BY LOWER(TRIM(s.search_term))' },
  { lineNumber: 9, type: 'unchanged', content: 'ORDER BY search_count DESC LIMIT 20;' }
];

const task21Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 4, title: 'Search Metrics', description: 'Normalized term, search count, unique sessions', type: 'selection' },
  { lineStart: 5, lineEnd: 7, title: 'Data Source & Filter', description: 'Searches with zero results, last 30 days', type: 'filter' },
  { lineStart: 8, lineEnd: 9, title: 'Grouping', description: 'By search term, top 20', type: 'grouping' }
];

const task21TableColumns: TableColumn[] = [
  { key: 'search_term', label: 'Search Term', align: 'left' },
  { key: 'search_count', label: 'Searches', align: 'right' },
  { key: 'unique_sessions', label: 'Users', align: 'right' }
];

const task21TableData = [
  { search_term: 'airpods pro 2', search_count: 2345, unique_sessions: 2134 },
  { search_term: 'standing desk', search_count: 1876, unique_sessions: 1654 },
  { search_term: 'yoga pants petite', search_count: 1234, unique_sessions: 1098 },
  { search_term: 'vegan leather bag', search_count: 987, unique_sessions: 876 },
  { search_term: 'wireless charger magsafe', search_count: 876, unique_sessions: 765 }
];

const task21Assumptions: Assumption[] = [
  { id: '1', text: 'Zero results = search returned 0 matching products', includeInMessage: true },
  { id: '2', text: 'Search terms normalized (lowercase, trimmed)', includeInMessage: true },
  { id: '3', text: 'Last 30 days of search data', includeInMessage: false }
];

const task21ResponseMessage = `**Top zero-result searches (lost demand):**\n\n| Search Term | Searches | Unique Users |\n|-------------|----------|---------------|\n| airpods pro 2 | 2,345 | 2,134 |\n| standing desk | 1,876 | 1,654 |\n| yoga pants petite | 1,234 | 1,098 |\n\n**Opportunities:**\n1. **AirPods Pro 2**: High demand - add to inventory\n2. **Standing Desk**: Consider new category expansion\n3. **Yoga Pants Petite**: Add size variant or search synonyms`;


// Task 22: Warehouse Fulfillment Speed
const task22: Task = {
  id: 'retail-22',
  title: 'Fulfillment Center Performance',
  requestor: 'Chris Anderson, Operations',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 55),
  priority: 'medium',
  description: 'Which fulfillment centers have the fastest order processing times?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 91
};

const task22Messages: ChatMessage[] = [
  { id: 'retail-22-msg-1', sender: 'user', content: 'Which fulfillment centers have the fastest order processing times?', timestamp: new Date(Date.now() - 1000 * 60 * 65), type: 'text' },
  { id: 'retail-22-msg-2', sender: 'agent', content: 'Comparing fulfillment center performance by order-to-ship time for the last 30 days.', timestamp: new Date(Date.now() - 1000 * 60 * 55), type: 'action', assumptions: ['Processing time = order placed to shipped', 'Last 30 days of shipment data', 'Business hours only'] }
];

const task22Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    fc.center_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    fc.region,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(o.order_id) AS orders_processed,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(AVG(EXTRACT(HOUR FROM (s.shipped_at - o.order_date))), 1) AS avg_hours_to_ship,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM (s.shipped_at - o.order_date))), 1) AS p95_hours' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM orders o' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN shipments s ON o.order_id = s.order_id' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN fulfillment_centers fc ON s.center_id = fc.center_id' },
  { lineNumber: 10, type: 'unchanged', content: 'WHERE o.order_date >= CURRENT_DATE - 30' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY fc.center_name, fc.region ORDER BY avg_hours_to_ship;' }
];

const task22Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Fulfillment Metrics', description: 'Center, orders, average and P95 processing time', type: 'aggregation' },
  { lineStart: 7, lineEnd: 9, title: 'Data Sources', description: 'Orders, shipments, and fulfillment centers', type: 'source' },
  { lineStart: 10, lineEnd: 11, title: 'Filters', description: 'Last 30 days, sorted by speed', type: 'filter' }
];

const task22TableColumns: TableColumn[] = [
  { key: 'center_name', label: 'Center', align: 'left' },
  { key: 'region', label: 'Region', align: 'left' },
  { key: 'avg_hours_to_ship', label: 'Avg Hours', align: 'right' },
  { key: 'p95_hours', label: 'P95 Hours', align: 'right' }
];

const task22TableData = [
  { center_name: 'Las Vegas FC', region: 'West', avg_hours_to_ship: 4.2, p95_hours: 8.5 },
  { center_name: 'Dallas FC', region: 'Central', avg_hours_to_ship: 5.1, p95_hours: 10.2 },
  { center_name: 'Chicago FC', region: 'Midwest', avg_hours_to_ship: 6.3, p95_hours: 14.8 },
  { center_name: 'New Jersey FC', region: 'East', avg_hours_to_ship: 7.8, p95_hours: 18.4 },
  { center_name: 'Atlanta FC', region: 'Southeast', avg_hours_to_ship: 8.4, p95_hours: 22.1 }
];

const task22Assumptions: Assumption[] = [
  { id: '1', text: 'Processing time = order placed to carrier pickup', includeInMessage: true },
  { id: '2', text: 'Last 30 days of shipment data', includeInMessage: true },
  { id: '3', text: 'P95 = 95th percentile (worst 5% excluded)', includeInMessage: true }
];

const task22ResponseMessage = `**Fulfillment center speed ranking:**\n\n| Center | Avg Hours | P95 Hours |\n|--------|-----------|------------|\n| Las Vegas FC | 4.2 | 8.5 ⭐ |\n| Dallas FC | 5.1 | 10.2 |\n| Chicago FC | 6.3 | 14.8 |\n| New Jersey FC | 7.8 | 18.4 |\n| Atlanta FC | 8.4 | 22.1 ⚠️ |\n\n**Action**: Las Vegas FC is benchmark at 4.2 hrs avg. Investigate Atlanta FC bottlenecks - P95 of 22 hours is impacting customer experience.`;


// Task 23: Gift Card Redemption Patterns
const task23: Task = {
  id: 'retail-23',
  title: 'Gift Card Usage Analysis',
  requestor: 'Nancy Thompson, Finance',
  status: 'ingesting',
  timestamp: new Date(Date.now() - 1000 * 60 * 7),
  priority: 'low',
  description: 'What is the average time to redeem gift cards and typical order value?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 93
};

const task23Messages: ChatMessage[] = [
  { id: 'retail-23-msg-1', sender: 'user', content: 'What is the average time to redeem gift cards and typical order value?', timestamp: new Date(Date.now() - 1000 * 60 * 16), type: 'text' },
  { id: 'retail-23-msg-2', sender: 'agent', content: 'Analyzing gift card redemption patterns including time to use and order characteristics.', timestamp: new Date(Date.now() - 1000 * 60 * 7), type: 'action', assumptions: ['Redemption = gift card used as payment', 'Time from purchase to first use', 'All gift card denominations'] }
];

const task23Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    gc.denomination_bucket,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(*) AS cards_redeemed,' },
  { lineNumber: 4, type: 'unchanged', content: '    ROUND(AVG(DATEDIFF(gc.first_use_date, gc.purchase_date)), 0) AS avg_days_to_redeem,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(AVG(o.order_total), 2) AS avg_order_value,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(AVG(o.order_total - gc.amount_used), 2) AS avg_additional_spend' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM gift_cards gc' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN orders o ON gc.redemption_order_id = o.order_id' },
  { lineNumber: 9, type: 'unchanged', content: 'WHERE gc.first_use_date IS NOT NULL' },
  { lineNumber: 10, type: 'unchanged', content: 'GROUP BY gc.denomination_bucket ORDER BY gc.denomination_bucket;' }
];

const task23Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Redemption Metrics', description: 'Denomination, count, days to redeem, order value, additional spend', type: 'aggregation' },
  { lineStart: 7, lineEnd: 9, title: 'Data Sources', description: 'Gift cards joined with redemption orders', type: 'source' },
  { lineStart: 10, lineEnd: 10, title: 'Grouping', description: 'By gift card denomination', type: 'grouping' }
];

const task23TableColumns: TableColumn[] = [
  { key: 'denomination_bucket', label: 'Value', align: 'left' },
  { key: 'avg_days_to_redeem', label: 'Days to Redeem', align: 'right' },
  { key: 'avg_order_value', label: 'Order Value', align: 'right' },
  { key: 'avg_additional_spend', label: 'Add\'l Spend', align: 'right' }
];

const task23TableData = [
  { denomination_bucket: '$25', avg_days_to_redeem: 18, avg_order_value: '$42.34', avg_additional_spend: '$17.34' },
  { denomination_bucket: '$50', avg_days_to_redeem: 24, avg_order_value: '$78.56', avg_additional_spend: '$28.56' },
  { denomination_bucket: '$100', avg_days_to_redeem: 32, avg_order_value: '$143.67', avg_additional_spend: '$43.67' },
  { denomination_bucket: '$200+', avg_days_to_redeem: 45, avg_order_value: '$267.89', avg_additional_spend: '$67.89' }
];

const task23Assumptions: Assumption[] = [
  { id: '1', text: 'Redemption = gift card applied as payment method', includeInMessage: true },
  { id: '2', text: 'Days calculated from purchase to first use', includeInMessage: true },
  { id: '3', text: 'Additional spend = order total minus card value used', includeInMessage: true }
];

const task23ResponseMessage = `**Gift Card Redemption Patterns:**\n\n| Card Value | Days to Redeem | Avg Order | Uplift |\n|------------|----------------|-----------|--------|\n| $25 | 18 days | $42 | +$17 (69%) |\n| $50 | 24 days | $79 | +$29 (57%) |\n| $100 | 32 days | $144 | +$44 (44%) |\n\n**Key Insight**: Gift card recipients spend **44-69% above card value**. Consider promoting $50 cards - best balance of redemption speed and uplift.`;


// Task 24: Competitor Price Comparison
const task24: Task = {
  id: 'retail-24',
  title: 'Competitive Pricing Analysis',
  requestor: 'Mark Stevens, Competitive Intel',
  status: 'asserting',
  timestamp: new Date(Date.now() - 1000 * 60 * 14),
  priority: 'high',
  description: 'How do our prices compare to competitors on top-selling items?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: true, vip: false },
  confidence: 81
};

const task24Messages: ChatMessage[] = [
  { id: 'retail-24-msg-1', sender: 'user', content: 'How do our prices compare to competitors on top-selling items?', timestamp: new Date(Date.now() - 1000 * 60 * 24), type: 'text' },
  { id: 'retail-24-msg-2', sender: 'agent', content: 'Comparing our pricing to competitor data for top 50 SKUs by revenue.', timestamp: new Date(Date.now() - 1000 * 60 * 14), type: 'action', assumptions: ['Competitor prices from price monitoring service', 'Top 50 SKUs by our revenue', 'Latest competitor prices (within 24 hours)'] }
];

const task24Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    p.product_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    p.our_price,' },
  { lineNumber: 4, type: 'unchanged', content: '    AVG(cp.competitor_price) AS avg_competitor_price,' },
  { lineNumber: 5, type: 'unchanged', content: '    MIN(cp.competitor_price) AS lowest_competitor,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND((p.our_price - AVG(cp.competitor_price)) / AVG(cp.competitor_price) * 100, 1) AS price_diff_pct' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM products p' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN competitor_prices cp ON p.product_id = cp.matched_product_id' },
  { lineNumber: 9, type: 'unchanged', content: 'WHERE p.product_id IN (SELECT product_id FROM top_50_revenue)' },
  { lineNumber: 10, type: 'unchanged', content: '    AND cp.scraped_at >= CURRENT_TIMESTAMP - INTERVAL 24 HOUR' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY p.product_name, p.our_price ORDER BY price_diff_pct DESC;' }
];

const task24Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Price Comparison', description: 'Our price, competitor average/min, and difference', type: 'selection' },
  { lineStart: 7, lineEnd: 8, title: 'Data Sources', description: 'Products matched with competitor prices', type: 'source' },
  { lineStart: 9, lineEnd: 11, title: 'Filters', description: 'Top 50 SKUs, fresh competitor data', type: 'filter' }
];

const task24TableColumns: TableColumn[] = [
  { key: 'product_name', label: 'Product', align: 'left' },
  { key: 'our_price', label: 'Our Price', align: 'right' },
  { key: 'avg_competitor_price', label: 'Comp Avg', align: 'right' },
  { key: 'price_diff_pct', label: 'Diff %', align: 'right' }
];

const task24TableData = [
  { product_name: 'TechPro Wireless Mouse', our_price: '$34.99', avg_competitor_price: '$29.99', price_diff_pct: '+16.7%' },
  { product_name: 'EcoSmart Water Filter', our_price: '$45.99', avg_competitor_price: '$41.99', price_diff_pct: '+9.5%' },
  { product_name: 'FlexBand Fitness Tracker', our_price: '$89.99', avg_competitor_price: '$94.99', price_diff_pct: '-5.3%' },
  { product_name: 'PureGlow Face Serum', our_price: '$28.99', avg_competitor_price: '$32.99', price_diff_pct: '-12.1%' },
  { product_name: 'ComfortCloud Pillow', our_price: '$49.99', avg_competitor_price: '$54.99', price_diff_pct: '-9.1%' }
];

const task24Assumptions: Assumption[] = [
  { id: '1', text: 'Competitor prices from automated price monitoring', includeInMessage: true },
  { id: '2', text: 'Top 50 SKUs by our revenue selected', includeInMessage: true },
  { id: '3', text: 'Competitor prices within last 24 hours', includeInMessage: false }
];

const task24ResponseMessage = `**Competitive pricing position on top SKUs:**\n\n**Above Market (opportunity to lower):**\n- TechPro Wireless Mouse: +16.7% vs competitors\n- EcoSmart Water Filter: +9.5% vs competitors\n\n**Below Market (margin opportunity):**\n- PureGlow Face Serum: -12.1% vs competitors\n- ComfortCloud Pillow: -9.1% vs competitors\n\n**Recommendations**: Consider price match on TechPro Mouse. Raise PureGlow Serum price by 5-8% to improve margins.`;


// Task 25: Subscription Box Retention
const task25: Task = {
  id: 'retail-25',
  title: 'Subscription Box Churn Analysis',
  requestor: 'Kelly Johnson, Subscription',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 45),
  priority: 'high',
  description: 'What is the retention curve for our subscription box by cohort?',
  source: 'meeting',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: true, vip: true },
  confidence: 88
};

const task25Messages: ChatMessage[] = [
  { id: 'retail-25-msg-1', sender: 'user', content: 'What is the retention curve for our subscription box by cohort?', timestamp: new Date(Date.now() - 1000 * 60 * 55), type: 'text' },
  { id: 'retail-25-msg-2', sender: 'agent', content: 'Building cohort retention analysis for subscription box customers by signup month.', timestamp: new Date(Date.now() - 1000 * 60 * 45), type: 'action', assumptions: ['Cohort = signup month', 'Retention = still active subscriber', 'Monthly retention snapshots'] }
];

const task25Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH cohorts AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT customer_id, DATE_TRUNC(\'month\', signup_date) AS cohort_month FROM subscriptions' },
  { lineNumber: 3, type: 'unchanged', content: ')' },
  { lineNumber: 4, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 5, type: 'unchanged', content: '    c.cohort_month,' },
  { lineNumber: 6, type: 'unchanged', content: '    COUNT(DISTINCT CASE WHEN months_active >= 1 THEN c.customer_id END) * 100.0 / COUNT(DISTINCT c.customer_id) AS m1_retention,' },
  { lineNumber: 7, type: 'unchanged', content: '    COUNT(DISTINCT CASE WHEN months_active >= 3 THEN c.customer_id END) * 100.0 / COUNT(DISTINCT c.customer_id) AS m3_retention,' },
  { lineNumber: 8, type: 'unchanged', content: '    COUNT(DISTINCT CASE WHEN months_active >= 6 THEN c.customer_id END) * 100.0 / COUNT(DISTINCT c.customer_id) AS m6_retention' },
  { lineNumber: 9, type: 'unchanged', content: 'FROM cohorts c' },
  { lineNumber: 10, type: 'unchanged', content: 'JOIN subscription_activity sa ON c.customer_id = sa.customer_id' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY c.cohort_month ORDER BY c.cohort_month;' }
];

const task25Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 3, title: 'Cohorts CTE', description: 'Grouping customers by signup month', type: 'filter' },
  { lineStart: 4, lineEnd: 8, title: 'Retention Rates', description: 'Calculating retention at 1, 3, and 6 months', type: 'aggregation' },
  { lineStart: 9, lineEnd: 11, title: 'Data & Grouping', description: 'Joining with activity, grouped by cohort', type: 'source' }
];

const task25TableColumns: TableColumn[] = [
  { key: 'cohort_month', label: 'Cohort', align: 'left' },
  { key: 'm1_retention', label: 'M1', align: 'right' },
  { key: 'm3_retention', label: 'M3', align: 'right' },
  { key: 'm6_retention', label: 'M6', align: 'right' }
];

const task25TableData = [
  { cohort_month: 'Jul 2024', m1_retention: '92%', m3_retention: '71%', m6_retention: '54%' },
  { cohort_month: 'Aug 2024', m1_retention: '89%', m3_retention: '68%', m6_retention: '51%' },
  { cohort_month: 'Sep 2024', m1_retention: '94%', m3_retention: '75%', m6_retention: '58%' },
  { cohort_month: 'Oct 2024', m1_retention: '91%', m3_retention: '72%', m6_retention: '-' },
  { cohort_month: 'Nov 2024', m1_retention: '93%', m3_retention: '-', m6_retention: '-' }
];

const task25Assumptions: Assumption[] = [
  { id: '1', text: 'Cohort = month of subscription signup', includeInMessage: true },
  { id: '2', text: 'Retention = subscription still active at month end', includeInMessage: true },
  { id: '3', text: 'Months with "-" have incomplete data', includeInMessage: true }
];

const task25ResponseMessage = `**Subscription Box Retention by Cohort:**\n\n| Cohort | M1 | M3 | M6 |\n|--------|-----|-----|-----|\n| Jul 2024 | 92% | 71% | 54% |\n| Aug 2024 | 89% | 68% | 51% |\n| Sep 2024 | 94% | 75% | 58% ⭐ |\n\n**Insights:**\n- Biggest drop: M1→M3 (21 pts avg)\n- Sep cohort outperforms - investigate what changed\n- 6-month retention of ~54% is solid but leaves room for improvement\n\n**Recommendation**: Focus on M2-M3 engagement to reduce the steepest drop-off point.`;


// Task 26: Wishlist to Purchase Conversion
const task26: Task = {
  id: 'retail-26',
  title: 'Wishlist to Purchase Conversion Rate',
  requestor: 'Emma Davis, Product Manager',
  status: 'review',
  timestamp: new Date(Date.now() - 1000 * 60 * 18),
  priority: 'medium',
  description: 'What percentage of wishlist items convert to purchases within 30 days?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 89
};

const task26Messages: ChatMessage[] = [
  { id: 'retail-26-msg-1', sender: 'user', content: 'What percentage of wishlist items convert to purchases within 30 days?', timestamp: new Date(Date.now() - 1000 * 60 * 28), type: 'text' },
  { id: 'retail-26-msg-2', sender: 'agent', content: 'Analyzing wishlist-to-purchase funnel with 30-day conversion window by category.', timestamp: new Date(Date.now() - 1000 * 60 * 18), type: 'action', assumptions: ['30-day window from wishlist add date', 'Only counting first purchase of item', 'Active wishlists only'] }
];

const task26Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH wishlist_items AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT w.customer_id, w.product_id, w.added_date, p.category' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM wishlists w JOIN products p ON w.product_id = p.product_id' },
  { lineNumber: 4, type: 'unchanged', content: '    WHERE w.added_date >= CURRENT_DATE - 60' },
  { lineNumber: 5, type: 'unchanged', content: ')' },
  { lineNumber: 6, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 7, type: 'unchanged', content: '    wi.category,' },
  { lineNumber: 8, type: 'unchanged', content: '    COUNT(*) AS wishlist_adds,' },
  { lineNumber: 9, type: 'unchanged', content: '    COUNT(oi.order_id) AS conversions,' },
  { lineNumber: 10, type: 'unchanged', content: '    ROUND(COUNT(oi.order_id) * 100.0 / COUNT(*), 1) AS conversion_rate' },
  { lineNumber: 11, type: 'unchanged', content: 'FROM wishlist_items wi' },
  { lineNumber: 12, type: 'unchanged', content: 'LEFT JOIN order_items oi ON wi.customer_id = oi.customer_id' },
  { lineNumber: 13, type: 'unchanged', content: '    AND wi.product_id = oi.product_id' },
  { lineNumber: 14, type: 'unchanged', content: '    AND oi.order_date BETWEEN wi.added_date AND wi.added_date + 30' },
  { lineNumber: 15, type: 'unchanged', content: 'GROUP BY wi.category ORDER BY conversion_rate DESC;' }
];

const task26Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Wishlist CTE', description: 'Collecting wishlist items with category from last 60 days', type: 'filter' },
  { lineStart: 6, lineEnd: 10, title: 'Conversion Metrics', description: 'Calculating adds, conversions, and rate by category', type: 'aggregation' },
  { lineStart: 11, lineEnd: 14, title: '30-Day Window Join', description: 'Matching purchases within 30 days of wishlist add', type: 'source' }
];

const task26TableColumns: TableColumn[] = [
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'wishlist_adds', label: 'Adds', align: 'right' },
  { key: 'conversions', label: 'Conversions', align: 'right' },
  { key: 'conversion_rate', label: 'Rate', align: 'right' }
];

const task26TableData = [
  { category: 'Electronics', wishlist_adds: 3420, conversions: 1026, conversion_rate: '30.0%' },
  { category: 'Home Goods', wishlist_adds: 2156, conversions: 582, conversion_rate: '27.0%' },
  { category: 'Apparel', wishlist_adds: 4891, conversions: 1076, conversion_rate: '22.0%' },
  { category: 'Beauty', wishlist_adds: 1834, conversions: 349, conversion_rate: '19.0%' },
  { category: 'Sports', wishlist_adds: 987, conversions: 138, conversion_rate: '14.0%' }
];

const task26Assumptions: Assumption[] = [
  { id: '1', text: '30-day conversion window from wishlist add date', includeInMessage: true },
  { id: '2', text: 'Counting first purchase only (no duplicates)', includeInMessage: true },
  { id: '3', text: 'Excludes deleted wishlist items', includeInMessage: false }
];

const task26ResponseMessage = `**Wishlist to Purchase Conversion (30-day window):**\n\n| Category | Adds | Conversions | Rate |\n|----------|------|-------------|------|\n| Electronics | 3,420 | 1,026 | 30.0% ⭐ |\n| Home Goods | 2,156 | 582 | 27.0% |\n| Apparel | 4,891 | 1,076 | 22.0% |\n| Beauty | 1,834 | 349 | 19.0% |\n| Sports | 987 | 138 | 14.0% |\n\n**Key Insights:**\n- Electronics converts best (30%) - high intent category\n- Sports underperforms at 14% - consider price drop alerts\n- Apparel has highest volume but moderate conversion`;


// Task 27: Flash Sale Performance Analysis
const task27: Task = {
  id: 'retail-27',
  title: 'Flash Sale Revenue Impact',
  requestor: 'Tom Harrison, Marketing VP',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 3),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 22),
  priority: 'high',
  description: 'How did our 4-hour flash sale perform compared to normal same-day sales?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: false, vip: true },
  confidence: 94
};

const task27Messages: ChatMessage[] = [
  { id: 'retail-27-msg-1', sender: 'user', content: 'How did our 4-hour flash sale perform compared to normal same-day sales?', timestamp: new Date(Date.now() - 1000 * 60 * 32), type: 'text' },
  { id: 'retail-27-msg-2', sender: 'agent', content: 'Comparing flash sale window (2-6pm) revenue to previous 4 weeks same time slot.', timestamp: new Date(Date.now() - 1000 * 60 * 22), type: 'action', assumptions: ['Flash sale window: 2pm-6pm yesterday', 'Baseline = average of same 4-hour window over past 4 weeks', 'Same day of week comparison'] }
];

const task27Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH flash_sales AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT SUM(total_amount) AS flash_revenue, COUNT(*) AS flash_orders' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM orders WHERE order_date = CURRENT_DATE - 1' },
  { lineNumber: 4, type: 'unchanged', content: '        AND EXTRACT(HOUR FROM order_time) BETWEEN 14 AND 17' },
  { lineNumber: 5, type: 'unchanged', content: '),' },
  { lineNumber: 6, type: 'unchanged', content: 'baseline AS (' },
  { lineNumber: 7, type: 'unchanged', content: '    SELECT AVG(daily_rev) AS avg_revenue, AVG(daily_orders) AS avg_orders FROM (' },
  { lineNumber: 8, type: 'unchanged', content: '        SELECT DATE(order_date) AS d, SUM(total_amount) AS daily_rev, COUNT(*) AS daily_orders' },
  { lineNumber: 9, type: 'unchanged', content: '        FROM orders WHERE EXTRACT(HOUR FROM order_time) BETWEEN 14 AND 17' },
  { lineNumber: 10, type: 'unchanged', content: '            AND order_date BETWEEN CURRENT_DATE - 29 AND CURRENT_DATE - 2 GROUP BY 1' },
  { lineNumber: 11, type: 'unchanged', content: '    )' },
  { lineNumber: 12, type: 'unchanged', content: ')' },
  { lineNumber: 13, type: 'unchanged', content: 'SELECT flash_revenue, flash_orders, avg_revenue, avg_orders,' },
  { lineNumber: 14, type: 'unchanged', content: '    ROUND((flash_revenue - avg_revenue) / avg_revenue * 100, 1) AS revenue_lift' },
  { lineNumber: 15, type: 'unchanged', content: 'FROM flash_sales, baseline;' }
];

const task27Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Flash Sale Window', description: 'Summing revenue from 2-6pm yesterday', type: 'filter' },
  { lineStart: 6, lineEnd: 12, title: 'Baseline Period', description: 'Average same-hour revenue over past 4 weeks', type: 'aggregation' },
  { lineStart: 13, lineEnd: 15, title: 'Lift Calculation', description: 'Percentage improvement vs baseline', type: 'aggregation' }
];

const task27TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'flash_sale', label: 'Flash Sale', align: 'right' },
  { key: 'baseline', label: 'Baseline', align: 'right' },
  { key: 'change', label: 'Change', align: 'right' }
];

const task27TableData = [
  { metric: 'Revenue', flash_sale: '$127,450', baseline: '$34,200', change: '+272.7%' },
  { metric: 'Orders', flash_sale: '2,847', baseline: '612', change: '+365.0%' },
  { metric: 'AOV', flash_sale: '$44.77', baseline: '$55.88', change: '-19.9%' },
  { metric: 'Units Sold', flash_sale: '8,541', baseline: '1,428', change: '+498.1%' }
];

const task27Assumptions: Assumption[] = [
  { id: '1', text: 'Flash sale window: 2pm-6pm yesterday', includeInMessage: true },
  { id: '2', text: 'Baseline = 4-week average for same time slot', includeInMessage: true },
  { id: '3', text: 'Same day of week used for comparison', includeInMessage: false }
];

const task27ResponseMessage = `**Flash Sale Performance (2-6pm window):**\n\n🚀 **+272.7% revenue lift** vs baseline\n\n| Metric | Flash Sale | Baseline | Change |\n|--------|------------|----------|--------|\n| Revenue | $127,450 | $34,200 | +272.7% |\n| Orders | 2,847 | 612 | +365.0% |\n| AOV | $44.77 | $55.88 | -19.9% |\n| Units | 8,541 | 1,428 | +498.1% |\n\n**Analysis:**\n- Massive order volume increase drove revenue despite lower AOV\n- AOV drop expected with flash sale discounts\n- Unit velocity suggests strong inventory clearance`;


// Task 28: Size Availability Impact on Conversions
const task28: Task = {
  id: 'retail-28',
  title: 'Size Out-of-Stock Conversion Impact',
  requestor: 'Kelly Martinez, Merchandising Director',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 35),
  priority: 'high',
  description: 'How much revenue are we losing from size stockouts on top apparel items?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: true, vip: false },
  confidence: 86
};

const task28Messages: ChatMessage[] = [
  { id: 'retail-28-msg-1', sender: 'user', content: 'How much revenue are we losing from size stockouts on top apparel items?', timestamp: new Date(Date.now() - 1000 * 60 * 45), type: 'text' },
  { id: 'retail-28-msg-2', sender: 'agent', content: 'Estimating lost revenue by analyzing size selection attempts on out-of-stock items for top 20 apparel SKUs.', timestamp: new Date(Date.now() - 1000 * 60 * 35), type: 'action', assumptions: ['Lost sale = size click when size unavailable', 'Using 15% estimated conversion rate for available sizes', 'Top 20 apparel by revenue last 30 days'] }
];

const task28Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH oos_clicks AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT p.product_id, p.product_name, sc.size, COUNT(*) AS oos_attempts' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM size_clicks sc' },
  { lineNumber: 4, type: 'unchanged', content: '    JOIN products p ON sc.product_id = p.product_id' },
  { lineNumber: 5, type: 'unchanged', content: '    JOIN inventory i ON p.product_id = i.product_id AND sc.size = i.size' },
  { lineNumber: 6, type: 'unchanged', content: '    WHERE i.quantity = 0 AND p.category = \'Apparel\'' },
  { lineNumber: 7, type: 'unchanged', content: '    GROUP BY 1, 2, 3' },
  { lineNumber: 8, type: 'unchanged', content: ')' },
  { lineNumber: 9, type: 'unchanged', content: 'SELECT product_name, size, oos_attempts,' },
  { lineNumber: 10, type: 'unchanged', content: '    ROUND(oos_attempts * 0.15 * p.price, 2) AS estimated_lost_revenue' },
  { lineNumber: 11, type: 'unchanged', content: 'FROM oos_clicks oc JOIN products p ON oc.product_id = p.product_id' },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY estimated_lost_revenue DESC LIMIT 10;' }
];

const task28Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 8, title: 'OOS Clicks CTE', description: 'Tracking size selection attempts on zero-stock items', type: 'filter' },
  { lineStart: 9, lineEnd: 12, title: 'Lost Revenue Estimate', description: 'Applying 15% conversion rate to estimate lost sales', type: 'aggregation' }
];

const task28TableColumns: TableColumn[] = [
  { key: 'product_name', label: 'Product', align: 'left' },
  { key: 'size', label: 'Size', align: 'center' },
  { key: 'oos_attempts', label: 'OOS Clicks', align: 'right' },
  { key: 'estimated_lost_revenue', label: 'Est. Lost Rev', align: 'right' }
];

const task28TableData = [
  { product_name: 'Premium Denim Jeans', size: 'M', oos_attempts: 847, estimated_lost_revenue: '$11,432' },
  { product_name: 'Cotton Crew Neck Tee', size: 'L', oos_attempts: 1234, estimated_lost_revenue: '$4,626' },
  { product_name: 'Athletic Joggers', size: 'S', oos_attempts: 623, estimated_lost_revenue: '$4,205' },
  { product_name: 'Premium Denim Jeans', size: 'L', oos_attempts: 412, estimated_lost_revenue: '$5,562' },
  { product_name: 'Fleece Hoodie', size: 'XL', oos_attempts: 389, estimated_lost_revenue: '$3,501' }
];

const task28Assumptions: Assumption[] = [
  { id: '1', text: 'Lost sale = customer clicked unavailable size', includeInMessage: true },
  { id: '2', text: 'Applied 15% conversion rate based on available sizes', includeInMessage: true },
  { id: '3', text: 'Analysis covers last 30 days of click data', includeInMessage: true }
];

const task28ResponseMessage = `**Estimated Revenue Lost to Size Stockouts (30 days):**\n\n**Total Est. Lost Revenue: $29,326**\n\n| Product | Size | OOS Clicks | Est. Lost |\n|---------|------|------------|------------|\n| Premium Denim Jeans | M | 847 | $11,432 |\n| Premium Denim Jeans | L | 412 | $5,562 |\n| Cotton Crew Tee | L | 1,234 | $4,626 |\n| Athletic Joggers | S | 623 | $4,205 |\n| Fleece Hoodie | XL | 389 | $3,501 |\n\n**Priority Actions:**\n1. Premium Denim Jeans M & L urgently need restock\n2. Consider size curve adjustment for popular items\n3. Set up low-stock alerts for high-velocity sizes`;


// Task 29: Repeat Purchase Frequency
const task29: Task = {
  id: 'retail-29',
  title: 'Category Repeat Purchase Interval',
  requestor: 'David Chen, Customer Insights',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 48),
  priority: 'medium',
  description: 'What is the average time between repeat purchases by product category?',
  source: 'meeting',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 92
};

const task29Messages: ChatMessage[] = [
  { id: 'retail-29-msg-1', sender: 'user', content: 'What is the average time between repeat purchases by product category?', timestamp: new Date(Date.now() - 1000 * 60 * 58), type: 'text' },
  { id: 'retail-29-msg-2', sender: 'agent', content: 'Calculating average days between consecutive purchases per customer by category.', timestamp: new Date(Date.now() - 1000 * 60 * 48), type: 'action', assumptions: ['Repeat = 2+ purchases in same category', 'Using customer-level purchase dates', 'Last 12 months of data'] }
];

const task29Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH purchase_gaps AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT customer_id, category,' },
  { lineNumber: 3, type: 'unchanged', content: '        order_date - LAG(order_date) OVER (PARTITION BY customer_id, category ORDER BY order_date) AS days_between' },
  { lineNumber: 4, type: 'unchanged', content: '    FROM orders o JOIN order_items oi ON o.order_id = oi.order_id' },
  { lineNumber: 5, type: 'unchanged', content: '    JOIN products p ON oi.product_id = p.product_id' },
  { lineNumber: 6, type: 'unchanged', content: '    WHERE order_date >= CURRENT_DATE - 365' },
  { lineNumber: 7, type: 'unchanged', content: ')' },
  { lineNumber: 8, type: 'unchanged', content: 'SELECT category, ROUND(AVG(days_between), 0) AS avg_days_between,' },
  { lineNumber: 9, type: 'unchanged', content: '    COUNT(DISTINCT customer_id) AS repeat_customers' },
  { lineNumber: 10, type: 'unchanged', content: 'FROM purchase_gaps WHERE days_between IS NOT NULL' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY category ORDER BY avg_days_between;' }
];

const task29Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 7, title: 'Purchase Gaps CTE', description: 'Using LAG to calculate days between consecutive purchases', type: 'filter' },
  { lineStart: 8, lineEnd: 11, title: 'Category Averages', description: 'Average gap and repeat customer count by category', type: 'aggregation' }
];

const task29TableColumns: TableColumn[] = [
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'avg_days_between', label: 'Avg Days', align: 'right' },
  { key: 'repeat_customers', label: 'Repeat Customers', align: 'right' }
];

const task29TableData = [
  { category: 'Beauty', avg_days_between: 28, repeat_customers: 12847 },
  { category: 'Grocery/Consumables', avg_days_between: 21, repeat_customers: 8923 },
  { category: 'Pet Supplies', avg_days_between: 35, repeat_customers: 4521 },
  { category: 'Home Goods', avg_days_between: 67, repeat_customers: 6234 },
  { category: 'Electronics', avg_days_between: 124, repeat_customers: 3892 },
  { category: 'Apparel', avg_days_between: 52, repeat_customers: 9456 }
];

const task29Assumptions: Assumption[] = [
  { id: '1', text: 'Repeat = customer made 2+ category purchases', includeInMessage: true },
  { id: '2', text: 'Analysis covers last 12 months', includeInMessage: true },
  { id: '3', text: 'Days calculated between consecutive orders', includeInMessage: false }
];

const task29ResponseMessage = `**Average Days Between Repeat Purchases by Category:**\n\n| Category | Avg Days | Repeat Customers |\n|----------|----------|------------------|\n| Grocery/Consumables | 21 | 8,923 |\n| Beauty | 28 | 12,847 |\n| Pet Supplies | 35 | 4,521 |\n| Apparel | 52 | 9,456 |\n| Home Goods | 67 | 6,234 |\n| Electronics | 124 | 3,892 |\n\n**Replenishment Opportunity:**\n- Beauty & Grocery: Set up subscription/auto-replenish\n- Send reminders at 75% of avg interval\n- Electronics long cycle suggests upgrade campaigns instead`;


// Task 30: Referral Program Attribution
const task30: Task = {
  id: 'retail-30',
  title: 'Referral Program Revenue Attribution',
  requestor: 'Nina Patel, Growth Marketing',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 62),
  priority: 'high',
  description: 'What is the total revenue attributable to our referral program this quarter?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: true },
  confidence: 91
};

const task30Messages: ChatMessage[] = [
  { id: 'retail-30-msg-1', sender: 'user', content: 'What is the total revenue attributable to our referral program this quarter?', timestamp: new Date(Date.now() - 1000 * 60 * 72), type: 'text' },
  { id: 'retail-30-msg-2', sender: 'agent', content: 'Calculating referral-attributed revenue including both referrer and referee orders.', timestamp: new Date(Date.now() - 1000 * 60 * 62), type: 'action', assumptions: ['Q4 2024 (Oct-Dec)', 'Includes referee first order + referrer bonus orders', '90-day attribution window'] }
];

const task30Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    \'Referee First Orders\' AS source,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(DISTINCT o.order_id) AS orders,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(o.total_amount) AS revenue' },
  { lineNumber: 5, type: 'unchanged', content: 'FROM orders o' },
  { lineNumber: 6, type: 'unchanged', content: 'JOIN referrals r ON o.customer_id = r.referee_id AND o.is_first_order = TRUE' },
  { lineNumber: 7, type: 'unchanged', content: 'WHERE o.order_date BETWEEN \'2024-10-01\' AND \'2024-12-31\'' },
  { lineNumber: 8, type: 'unchanged', content: 'UNION ALL' },
  { lineNumber: 9, type: 'unchanged', content: 'SELECT \'Referrer Reward Orders\', COUNT(DISTINCT order_id), SUM(total_amount)' },
  { lineNumber: 10, type: 'unchanged', content: 'FROM orders WHERE promo_code LIKE \'REF%\'' },
  { lineNumber: 11, type: 'unchanged', content: '    AND order_date BETWEEN \'2024-10-01\' AND \'2024-12-31\';' }
];

const task30Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 7, title: 'Referee Orders', description: 'First orders from referred customers', type: 'filter' },
  { lineStart: 8, lineEnd: 11, title: 'Referrer Orders', description: 'Orders using referral reward codes', type: 'filter' }
];

const task30TableColumns: TableColumn[] = [
  { key: 'source', label: 'Revenue Source', align: 'left' },
  { key: 'orders', label: 'Orders', align: 'right' },
  { key: 'revenue', label: 'Revenue', align: 'right' },
  { key: 'pct', label: '% of Total', align: 'right' }
];

const task30TableData = [
  { source: 'Referee First Orders', orders: 4823, revenue: '$412,450', pct: '68.2%' },
  { source: 'Referrer Reward Orders', orders: 2156, revenue: '$192,340', pct: '31.8%' },
  { source: 'Total Referral Program', orders: 6979, revenue: '$604,790', pct: '100%' }
];

const task30Assumptions: Assumption[] = [
  { id: '1', text: 'Q4 2024 timeframe (Oct 1 - Dec 31)', includeInMessage: true },
  { id: '2', text: 'Referee = first order from referred customer', includeInMessage: true },
  { id: '3', text: 'Referrer = orders using REF* promo codes', includeInMessage: true }
];

const task30ResponseMessage = `**Q4 2024 Referral Program Revenue:**\n\n**Total: $604,790** across 6,979 orders\n\n| Source | Orders | Revenue | % |\n|--------|--------|---------|---|\n| Referee First Orders | 4,823 | $412,450 | 68.2% |\n| Referrer Rewards | 2,156 | $192,340 | 31.8% |\n\n**Key Metrics:**\n- Avg Referee Order: $85.53\n- Avg Referrer Reward Order: $89.21\n- Program CAC: ~$25 (vs $45 paid channels)\n\n**Recommendation:** Increase referrer reward to drive more viral growth - current economics support higher payouts.`;


// Task 31: Mobile App vs Mobile Web Performance
const task31: Task = {
  id: 'retail-31',
  title: 'Mobile App vs Mobile Web Conversion',
  requestor: 'Chris Wong, Digital Product',
  status: 'review',
  timestamp: new Date(Date.now() - 1000 * 60 * 15),
  priority: 'medium',
  description: 'How do conversion rates compare between our mobile app and mobile web?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: true, vip: false },
  confidence: 93
};

const task31Messages: ChatMessage[] = [
  { id: 'retail-31-msg-1', sender: 'user', content: 'How do conversion rates compare between our mobile app and mobile web?', timestamp: new Date(Date.now() - 1000 * 60 * 25), type: 'text' },
  { id: 'retail-31-msg-2', sender: 'agent', content: 'Comparing funnel metrics between mobile app and mobile web sessions for last 30 days.', timestamp: new Date(Date.now() - 1000 * 60 * 15), type: 'action', assumptions: ['Last 30 days of data', 'Session-based conversion calculation', 'Excludes tablet traffic'] }
];

const task31Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    platform,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(DISTINCT session_id) AS sessions,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(DISTINCT CASE WHEN added_to_cart THEN session_id END) AS cart_sessions,' },
  { lineNumber: 5, type: 'unchanged', content: '    COUNT(DISTINCT CASE WHEN purchased THEN session_id END) AS purchase_sessions,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(COUNT(DISTINCT CASE WHEN purchased THEN session_id END) * 100.0 /' },
  { lineNumber: 7, type: 'unchanged', content: '          COUNT(DISTINCT session_id), 2) AS conversion_rate' },
  { lineNumber: 8, type: 'unchanged', content: 'FROM sessions' },
  { lineNumber: 9, type: 'unchanged', content: 'WHERE platform IN (\'mobile_app\', \'mobile_web\')' },
  { lineNumber: 10, type: 'unchanged', content: '    AND session_date >= CURRENT_DATE - 30' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY platform;' }
];

const task31Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 7, title: 'Funnel Metrics', description: 'Session counts at each funnel stage with conversion rate', type: 'aggregation' },
  { lineStart: 8, lineEnd: 11, title: 'Platform Filter', description: 'Mobile app vs mobile web, last 30 days', type: 'filter' }
];

const task31TableColumns: TableColumn[] = [
  { key: 'platform', label: 'Platform', align: 'left' },
  { key: 'sessions', label: 'Sessions', align: 'right' },
  { key: 'cart_rate', label: 'Cart Rate', align: 'right' },
  { key: 'conversion_rate', label: 'CVR', align: 'right' }
];

const task31TableData = [
  { platform: 'Mobile App', sessions: '245,892', cart_rate: '18.4%', conversion_rate: '4.2%' },
  { platform: 'Mobile Web', sessions: '412,456', cart_rate: '11.2%', conversion_rate: '1.8%' },
  { platform: 'Difference', sessions: '-40%', cart_rate: '+64%', conversion_rate: '+133%' }
];

const task31Assumptions: Assumption[] = [
  { id: '1', text: 'Session-based conversion (not user-based)', includeInMessage: true },
  { id: '2', text: 'Last 30 days of traffic data', includeInMessage: true },
  { id: '3', text: 'Excludes tablet and desktop', includeInMessage: false }
];

const task31ResponseMessage = `**Mobile App vs Mobile Web (Last 30 Days):**\n\n| Metric | App | Mobile Web | Difference |\n|--------|-----|------------|------------|\n| Sessions | 245,892 | 412,456 | -40% |\n| Cart Rate | 18.4% | 11.2% | +64% |\n| **Conversion Rate** | **4.2%** | **1.8%** | **+133%** |\n\n**Key Insights:**\n- App converts 2.3x better than mobile web\n- Lower session volume but much higher quality\n- Cart-to-purchase also higher on app (22.8% vs 16.1%)\n\n**Recommendation:** Invest in app download campaigns - the LTV math strongly favors app users.`;


// Task 32: Bundle Performance Analysis
const task32: Task = {
  id: 'retail-32',
  title: 'Product Bundle Sales Performance',
  requestor: 'Amanda Foster, Category Manager',
  status: 'sent',
  sentAt: new Date(Date.now() - 1000 * 60 * 4),
  sentStatus: 'pending',
  timestamp: new Date(Date.now() - 1000 * 60 * 28),
  priority: 'medium',
  description: 'Which product bundles are performing best this month?',
  source: 'meeting',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 90
};

const task32Messages: ChatMessage[] = [
  { id: 'retail-32-msg-1', sender: 'user', content: 'Which product bundles are performing best this month?', timestamp: new Date(Date.now() - 1000 * 60 * 38), type: 'text' },
  { id: 'retail-32-msg-2', sender: 'agent', content: 'Analyzing bundle sales by units sold, revenue, and margin for current month.', timestamp: new Date(Date.now() - 1000 * 60 * 28), type: 'action', assumptions: ['January 2025 MTD', 'Active bundles only', 'Compared to individual item pricing'] }
];

const task32Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    b.bundle_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(oi.quantity) AS units_sold,' },
  { lineNumber: 4, type: 'unchanged', content: '    SUM(oi.line_total) AS revenue,' },
  { lineNumber: 5, type: 'unchanged', content: '    AVG(b.discount_pct) AS avg_discount,' },
  { lineNumber: 6, type: 'unchanged', content: '    SUM(oi.line_total - oi.cost) AS margin' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM order_items oi' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN bundles b ON oi.bundle_id = b.bundle_id' },
  { lineNumber: 9, type: 'unchanged', content: 'JOIN orders o ON oi.order_id = o.order_id' },
  { lineNumber: 10, type: 'unchanged', content: 'WHERE o.order_date >= DATE_TRUNC(\'month\', CURRENT_DATE)' },
  { lineNumber: 11, type: 'unchanged', content: '    AND b.is_active = TRUE' },
  { lineNumber: 12, type: 'unchanged', content: 'GROUP BY b.bundle_name ORDER BY revenue DESC LIMIT 10;' }
];

const task32Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Bundle Metrics', description: 'Units, revenue, discount, and margin per bundle', type: 'aggregation' },
  { lineStart: 7, lineEnd: 12, title: 'Data Filters', description: 'Current month, active bundles, top 10 by revenue', type: 'filter' }
];

const task32TableColumns: TableColumn[] = [
  { key: 'bundle_name', label: 'Bundle', align: 'left' },
  { key: 'units_sold', label: 'Units', align: 'right' },
  { key: 'revenue', label: 'Revenue', align: 'right' },
  { key: 'margin_pct', label: 'Margin %', align: 'right' }
];

const task32TableData = [
  { bundle_name: 'Complete Skincare Set', units_sold: 1247, revenue: '$124,700', margin_pct: '42%' },
  { bundle_name: 'Home Office Essentials', units_sold: 892, revenue: '$98,120', margin_pct: '38%' },
  { bundle_name: 'Fitness Starter Pack', units_sold: 756, revenue: '$75,600', margin_pct: '45%' },
  { bundle_name: 'Kitchen Basics Bundle', units_sold: 634, revenue: '$63,400', margin_pct: '35%' },
  { bundle_name: 'Tech Accessories Kit', units_sold: 521, revenue: '$52,100', margin_pct: '48%' }
];

const task32Assumptions: Assumption[] = [
  { id: '1', text: 'January 2025 month-to-date', includeInMessage: true },
  { id: '2', text: 'Only active bundles included', includeInMessage: true },
  { id: '3', text: 'Margin = revenue minus product cost', includeInMessage: false }
];

const task32ResponseMessage = `**Top Performing Bundles - January 2025 MTD:**\n\n| Bundle | Units | Revenue | Margin |\n|--------|-------|---------|--------|\n| Complete Skincare Set | 1,247 | $124,700 | 42% |\n| Home Office Essentials | 892 | $98,120 | 38% |\n| Fitness Starter Pack | 756 | $75,600 | 45% |\n| Kitchen Basics | 634 | $63,400 | 35% |\n| Tech Accessories Kit | 521 | $52,100 | 48% ⭐ |\n\n**Insights:**\n- Skincare bundle leads in revenue but Tech has best margin\n- Combined bundle revenue: $413,920 (12% of total)\n- Average bundle discount: 15% but maintains healthy margins`;


// Task 33: Customer Review Sentiment by Product
const task33: Task = {
  id: 'retail-33',
  title: 'Product Review Sentiment Analysis',
  requestor: 'Jessica Lee, Customer Experience',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 42),
  priority: 'medium',
  description: 'Which products have the most negative review sentiment this month?',
  source: 'slack',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 87
};

const task33Messages: ChatMessage[] = [
  { id: 'retail-33-msg-1', sender: 'user', content: 'Which products have the most negative review sentiment this month?', timestamp: new Date(Date.now() - 1000 * 60 * 52), type: 'text' },
  { id: 'retail-33-msg-2', sender: 'agent', content: 'Analyzing review sentiment scores and common negative themes for products with 5+ reviews this month.', timestamp: new Date(Date.now() - 1000 * 60 * 42), type: 'action', assumptions: ['Sentiment from NLP analysis on review text', 'Minimum 5 reviews for significance', 'Negative = sentiment score < 0.4'] }
];

const task33Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    p.product_name,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(*) AS review_count,' },
  { lineNumber: 4, type: 'unchanged', content: '    ROUND(AVG(r.sentiment_score), 2) AS avg_sentiment,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(AVG(r.rating), 1) AS avg_rating,' },
  { lineNumber: 6, type: 'unchanged', content: '    MODE() WITHIN GROUP (ORDER BY r.negative_theme) AS top_complaint' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM reviews r' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN products p ON r.product_id = p.product_id' },
  { lineNumber: 9, type: 'unchanged', content: 'WHERE r.review_date >= DATE_TRUNC(\'month\', CURRENT_DATE)' },
  { lineNumber: 10, type: 'unchanged', content: '    AND r.sentiment_score < 0.4' },
  { lineNumber: 11, type: 'unchanged', content: 'GROUP BY p.product_name HAVING COUNT(*) >= 5' },
  { lineNumber: 12, type: 'unchanged', content: 'ORDER BY avg_sentiment ASC LIMIT 10;' }
];

const task33Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Review Metrics', description: 'Sentiment score, rating, and top complaint theme', type: 'aggregation' },
  { lineStart: 7, lineEnd: 12, title: 'Negative Filter', description: 'This month, sentiment < 0.4, min 5 reviews', type: 'filter' }
];

const task33TableColumns: TableColumn[] = [
  { key: 'product_name', label: 'Product', align: 'left' },
  { key: 'review_count', label: 'Reviews', align: 'right' },
  { key: 'avg_sentiment', label: 'Sentiment', align: 'right' },
  { key: 'top_complaint', label: 'Top Issue', align: 'left' }
];

const task33TableData = [
  { product_name: 'Wireless Earbuds Pro', review_count: 47, avg_sentiment: 0.18, top_complaint: 'Battery life' },
  { product_name: 'Smart Water Bottle', review_count: 23, avg_sentiment: 0.22, top_complaint: 'App connectivity' },
  { product_name: 'Yoga Mat Premium', review_count: 18, avg_sentiment: 0.28, top_complaint: 'Durability' },
  { product_name: 'USB-C Hub 7-in-1', review_count: 31, avg_sentiment: 0.31, top_complaint: 'Overheating' },
  { product_name: 'Insulated Tumbler', review_count: 12, avg_sentiment: 0.35, top_complaint: 'Lid leaking' }
];

const task33Assumptions: Assumption[] = [
  { id: '1', text: 'Sentiment score from NLP analysis (0-1 scale)', includeInMessage: true },
  { id: '2', text: 'Negative threshold = sentiment < 0.4', includeInMessage: true },
  { id: '3', text: 'Minimum 5 reviews for statistical significance', includeInMessage: true }
];

const task33ResponseMessage = `**Products with Most Negative Sentiment - January 2025:**\n\n| Product | Reviews | Sentiment | Top Issue |\n|---------|---------|-----------|------------|\n| Wireless Earbuds Pro | 47 | 0.18 🔴 | Battery life |\n| Smart Water Bottle | 23 | 0.22 🔴 | App connectivity |\n| Yoga Mat Premium | 18 | 0.28 | Durability |\n| USB-C Hub 7-in-1 | 31 | 0.31 | Overheating |\n| Insulated Tumbler | 12 | 0.35 | Lid leaking |\n\n**Urgent Action Items:**\n1. Wireless Earbuds - investigate battery complaints, high volume\n2. Smart Water Bottle - app team needs to address connectivity\n3. Consider supplier discussions for Yoga Mat durability`;


// Task 34: Checkout Abandonment by Step
const task34: Task = {
  id: 'retail-34',
  title: 'Checkout Funnel Drop-off Analysis',
  requestor: 'Mark Thompson, UX Lead',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 55),
  priority: 'high',
  description: 'Where in the checkout flow are we losing the most customers?',
  source: 'email',
  industry: 'retail-ecommerce',
  flags: { urgency: true, humanRequested: true, vip: false },
  confidence: 95
};

const task34Messages: ChatMessage[] = [
  { id: 'retail-34-msg-1', sender: 'user', content: 'Where in the checkout flow are we losing the most customers?', timestamp: new Date(Date.now() - 1000 * 60 * 65), type: 'text' },
  { id: 'retail-34-msg-2', sender: 'agent', content: 'Analyzing step-by-step checkout funnel to identify highest drop-off points.', timestamp: new Date(Date.now() - 1000 * 60 * 55), type: 'action', assumptions: ['Last 30 days of checkout sessions', '5-step checkout flow', 'Excludes guest vs account split'] }
];

const task34Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    checkout_step,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(DISTINCT session_id) AS sessions,' },
  { lineNumber: 4, type: 'unchanged', content: '    LAG(COUNT(DISTINCT session_id)) OVER (ORDER BY step_order) AS prev_step_sessions,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND((1 - COUNT(DISTINCT session_id)::FLOAT /' },
  { lineNumber: 6, type: 'unchanged', content: '           LAG(COUNT(DISTINCT session_id)) OVER (ORDER BY step_order)) * 100, 1) AS drop_off_pct' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM checkout_events' },
  { lineNumber: 8, type: 'unchanged', content: 'WHERE event_date >= CURRENT_DATE - 30' },
  { lineNumber: 9, type: 'unchanged', content: 'GROUP BY checkout_step, step_order' },
  { lineNumber: 10, type: 'unchanged', content: 'ORDER BY step_order;' }
];

const task34Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Funnel Metrics', description: 'Session counts and drop-off rate using LAG', type: 'aggregation' },
  { lineStart: 7, lineEnd: 10, title: 'Time Filter', description: 'Last 30 days, ordered by checkout step', type: 'filter' }
];

const task34TableColumns: TableColumn[] = [
  { key: 'checkout_step', label: 'Step', align: 'left' },
  { key: 'sessions', label: 'Sessions', align: 'right' },
  { key: 'drop_off_pct', label: 'Drop-off', align: 'right' },
  { key: 'cumulative', label: 'Cumulative', align: 'right' }
];

const task34TableData = [
  { checkout_step: '1. Cart Review', sessions: '89,245', drop_off_pct: '-', cumulative: '100%' },
  { checkout_step: '2. Shipping Info', sessions: '67,432', drop_off_pct: '24.4%', cumulative: '75.6%' },
  { checkout_step: '3. Shipping Method', sessions: '58,921', drop_off_pct: '12.6%', cumulative: '66.0%' },
  { checkout_step: '4. Payment Info', sessions: '41,234', drop_off_pct: '30.0% 🔴', cumulative: '46.2%' },
  { checkout_step: '5. Order Confirm', sessions: '38,456', drop_off_pct: '6.7%', cumulative: '43.1%' }
];

const task34Assumptions: Assumption[] = [
  { id: '1', text: 'Last 30 days of checkout sessions', includeInMessage: true },
  { id: '2', text: 'Drop-off = % lost between consecutive steps', includeInMessage: true },
  { id: '3', text: 'Session = unique checkout attempt', includeInMessage: false }
];

const task34ResponseMessage = `**Checkout Funnel Drop-off Analysis (Last 30 Days):**\n\n| Step | Sessions | Drop-off | Cumulative |\n|------|----------|----------|------------|\n| Cart Review | 89,245 | - | 100% |\n| Shipping Info | 67,432 | 24.4% | 75.6% |\n| Shipping Method | 58,921 | 12.6% | 66.0% |\n| **Payment Info** | **41,234** | **30.0%** 🔴 | 46.2% |\n| Order Confirm | 38,456 | 6.7% | 43.1% |\n\n**Critical Finding:**\nPayment step has highest drop-off at **30%**\n\n**Recommendations:**\n1. Add more payment options (Apple Pay, PayPal)\n2. Review payment error rates\n3. Simplify payment form fields\n4. Add trust badges near payment entry`;


// Task 35: First-Time vs Returning Customer AOV
const task35: Task = {
  id: 'retail-35',
  title: 'New vs Returning Customer AOV Trends',
  requestor: 'Robert Kim, Finance Director',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 68),
  priority: 'medium',
  description: 'How does average order value compare between first-time and returning customers over the past 6 months?',
  source: 'meeting',
  industry: 'retail-ecommerce',
  flags: { urgency: false, humanRequested: false, vip: true },
  confidence: 94
};

const task35Messages: ChatMessage[] = [
  { id: 'retail-35-msg-1', sender: 'user', content: 'How does average order value compare between first-time and returning customers over the past 6 months?', timestamp: new Date(Date.now() - 1000 * 60 * 78), type: 'text' },
  { id: 'retail-35-msg-2', sender: 'agent', content: 'Calculating monthly AOV trends segmented by customer type for July 2024 - January 2025.', timestamp: new Date(Date.now() - 1000 * 60 * 68), type: 'action', assumptions: ['First-time = is_first_order flag', '6 months = Jul 2024 - Jan 2025', 'Excludes cancelled orders'] }
];

const task35Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    DATE_TRUNC(\'month\', order_date) AS month,' },
  { lineNumber: 3, type: 'unchanged', content: '    CASE WHEN is_first_order THEN \'First-Time\' ELSE \'Returning\' END AS customer_type,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(*) AS orders,' },
  { lineNumber: 5, type: 'unchanged', content: '    ROUND(AVG(total_amount), 2) AS aov' },
  { lineNumber: 6, type: 'unchanged', content: 'FROM orders' },
  { lineNumber: 7, type: 'unchanged', content: 'WHERE order_date >= CURRENT_DATE - INTERVAL \'6 months\'' },
  { lineNumber: 8, type: 'unchanged', content: '    AND status != \'cancelled\'' },
  { lineNumber: 9, type: 'unchanged', content: 'GROUP BY 1, 2' },
  { lineNumber: 10, type: 'unchanged', content: 'ORDER BY month, customer_type;' }
];

const task35Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 5, title: 'Monthly AOV by Type', description: 'Aggregating orders and AOV by month and customer type', type: 'aggregation' },
  { lineStart: 6, lineEnd: 10, title: 'Time & Status Filter', description: 'Last 6 months, excluding cancelled', type: 'filter' }
];

const task35TableColumns: TableColumn[] = [
  { key: 'month', label: 'Month', align: 'left' },
  { key: 'first_time_aov', label: 'First-Time AOV', align: 'right' },
  { key: 'returning_aov', label: 'Returning AOV', align: 'right' },
  { key: 'gap', label: 'Gap', align: 'right' }
];

const task35TableData = [
  { month: 'Jul 2024', first_time_aov: '$67.23', returning_aov: '$94.56', gap: '+40.7%' },
  { month: 'Aug 2024', first_time_aov: '$65.89', returning_aov: '$98.12', gap: '+48.9%' },
  { month: 'Sep 2024', first_time_aov: '$71.45', returning_aov: '$102.34', gap: '+43.2%' },
  { month: 'Oct 2024', first_time_aov: '$74.12', returning_aov: '$108.67', gap: '+46.6%' },
  { month: 'Nov 2024', first_time_aov: '$82.56', returning_aov: '$124.89', gap: '+51.3%' },
  { month: 'Dec 2024', first_time_aov: '$89.34', returning_aov: '$142.67', gap: '+59.7%' }
];

const task35Assumptions: Assumption[] = [
  { id: '1', text: 'First-time identified by is_first_order flag', includeInMessage: true },
  { id: '2', text: 'Timeframe: July 2024 - December 2024', includeInMessage: true },
  { id: '3', text: 'Cancelled orders excluded', includeInMessage: false }
];

const task35ResponseMessage = `**First-Time vs Returning Customer AOV (6-Month Trend):**\n\n| Month | First-Time | Returning | Gap |\n|-------|------------|-----------|-----|\n| Jul 2024 | $67.23 | $94.56 | +40.7% |\n| Aug 2024 | $65.89 | $98.12 | +48.9% |\n| Sep 2024 | $71.45 | $102.34 | +43.2% |\n| Oct 2024 | $74.12 | $108.67 | +46.6% |\n| Nov 2024 | $82.56 | $124.89 | +51.3% |\n| Dec 2024 | $89.34 | $142.67 | +59.7% |\n\n**Key Insights:**\n- Returning customers consistently spend 40-60% more\n- Gap widened during holiday season (Nov-Dec)\n- Both segments showed healthy AOV growth\n\n**Opportunity:** Focus on converting first-time buyers to repeat purchasers - significant AOV uplift potential.`;


// Export all tasks and task data
export const retailEcommerceTasks: Task[] = [
  task1, task2, task3, task4, task5, task6, task7, task8, task9, task10,
  task11, task12, task13, task14, task15, task16, task17, task18, task19, task20,
  task21, task22, task23, task24, task25, task26, task27, task28, task29, task30,
  task31, task32, task33, task34, task35
];

export const retailEcommerceTaskData: Record<string, TaskData> = {
  'retail-1': { messages: task1Messages, code: task1Code, annotations: task1Annotations, tableColumns: task1TableColumns, tableData: task1TableData, assumptions: task1Assumptions, responseMessage: task1ResponseMessage, knowledgeUpdate: 'PRODUCT_TREND_QUERY: Use DATE() for daily grouping' },
  'retail-2': { messages: task2Messages, code: task2Code, annotations: task2Annotations, tableColumns: task2TableColumns, tableData: task2TableData, assumptions: task2Assumptions, responseMessage: task2ResponseMessage, knowledgeUpdate: 'STOCKOUT_DEFINITION: on_hand = 0 indicates sold out' },
  'retail-3': { messages: task3Messages, code: task3Code, annotations: task3Annotations, tableColumns: task3TableColumns, tableData: task3TableData, assumptions: task3Assumptions, responseMessage: task3ResponseMessage, knowledgeUpdate: 'BROWSE_ABANDONMENT: Use NOT IN for exclusion' },
  'retail-4': { messages: task4Messages, code: task4Code, annotations: task4Annotations, tableColumns: task4TableColumns, tableData: task4TableData, assumptions: task4Assumptions, responseMessage: task4ResponseMessage, knowledgeUpdate: 'BASKET_ANALYSIS: Calculate totals for containing orders' },
  'retail-5': { messages: task5Messages, code: task5Code, annotations: task5Annotations, tableColumns: task5TableColumns, tableData: task5TableData, assumptions: task5Assumptions, responseMessage: task5ResponseMessage, knowledgeUpdate: 'HOURLY_PATTERN: Use EXTRACT(HOUR) for time analysis' },
  'retail-6': { messages: task6Messages, code: task6Code, annotations: task6Annotations, tableColumns: task6TableColumns, tableData: task6TableData, assumptions: task6Assumptions, responseMessage: task6ResponseMessage, knowledgeUpdate: 'CART_ABANDONMENT: Device type affects conversion significantly' },
  'retail-7': { messages: task7Messages, code: task7Code, annotations: task7Annotations, tableColumns: task7TableColumns, tableData: task7TableData, assumptions: task7Assumptions, responseMessage: task7ResponseMessage, knowledgeUpdate: 'PROMO_ANALYSIS: Redemption rate = orders/distributions' },
  'retail-8': { messages: task8Messages, code: task8Code, annotations: task8Annotations, tableColumns: task8TableColumns, tableData: task8TableData, assumptions: task8Assumptions, responseMessage: task8ResponseMessage, knowledgeUpdate: 'CROSS_SELL: Self-join order_items for co-occurrence' },
  'retail-9': { messages: task9Messages, code: task9Code, annotations: task9Annotations, tableColumns: task9TableColumns, tableData: task9TableData, assumptions: task9Assumptions, responseMessage: task9ResponseMessage, knowledgeUpdate: 'CAC_CALCULATION: Spend / new customers by channel' },
  'retail-10': { messages: task10Messages, code: task10Code, annotations: task10Annotations, tableColumns: task10TableColumns, tableData: task10TableData, assumptions: task10Assumptions, responseMessage: task10ResponseMessage, knowledgeUpdate: 'RETURN_ANALYSIS: MODE() for top reason by product' },
  'retail-11': { messages: task11Messages, code: task11Code, annotations: task11Annotations, tableColumns: task11TableColumns, tableData: task11TableData, assumptions: task11Assumptions, responseMessage: task11ResponseMessage, knowledgeUpdate: 'SEASONAL_PATTERN: Average same months across years' },
  'retail-12': { messages: task12Messages, code: task12Code, annotations: task12Annotations, tableColumns: task12TableColumns, tableData: task12TableData, assumptions: task12Assumptions, responseMessage: task12ResponseMessage, knowledgeUpdate: 'PRICE_ELASTICITY: %demand/%price from events' },
  'retail-13': { messages: task13Messages, code: task13Code, annotations: task13Annotations, tableColumns: task13TableColumns, tableData: task13TableData, assumptions: task13Assumptions, responseMessage: task13ResponseMessage, knowledgeUpdate: 'LTV_SEGMENTATION: RFM-based customer segments' },
  'retail-14': { messages: task14Messages, code: task14Code, annotations: task14Annotations, tableColumns: task14TableColumns, tableData: task14TableData, assumptions: task14Assumptions, responseMessage: task14ResponseMessage, knowledgeUpdate: 'INVENTORY_TURNOVER: COGS / Avg Inventory' },
  'retail-15': { messages: task15Messages, code: task15Code, annotations: task15Annotations, tableColumns: task15TableColumns, tableData: task15TableData, assumptions: task15Assumptions, responseMessage: task15ResponseMessage, knowledgeUpdate: 'SHIPPING_IMPACT: Checkout completion by option' },
  'retail-16': { messages: task16Messages, code: task16Code, annotations: task16Annotations, tableColumns: task16TableColumns, tableData: task16TableData, assumptions: task16Assumptions, responseMessage: task16ResponseMessage, knowledgeUpdate: 'EMAIL_ATTRIBUTION: 7-day click window' },
  'retail-17': { messages: task17Messages, code: task17Code, annotations: task17Annotations, tableColumns: task17TableColumns, tableData: task17TableData, assumptions: task17Assumptions, responseMessage: task17ResponseMessage, knowledgeUpdate: 'LAUNCH_VELOCITY: 30-day sell-through rate' },
  'retail-18': { messages: task18Messages, code: task18Code, annotations: task18Annotations, tableColumns: task18TableColumns, tableData: task18TableData, assumptions: task18Assumptions, responseMessage: task18ResponseMessage, knowledgeUpdate: 'COMPLAINT_ANALYSIS: Top reason by category' },
  'retail-19': { messages: task19Messages, code: task19Code, annotations: task19Annotations, tableColumns: task19TableColumns, tableData: task19TableData, assumptions: task19Assumptions, responseMessage: task19ResponseMessage, knowledgeUpdate: 'PLATFORM_COMPARISON: App vs web metrics' },
  'retail-20': { messages: task20Messages, code: task20Code, annotations: task20Annotations, tableColumns: task20TableColumns, tableData: task20TableData, assumptions: task20Assumptions, responseMessage: task20ResponseMessage, knowledgeUpdate: 'LOYALTY_ROI: Member vs non-member spend' },
  'retail-21': { messages: task21Messages, code: task21Code, annotations: task21Annotations, tableColumns: task21TableColumns, tableData: task21TableData, assumptions: task21Assumptions, responseMessage: task21ResponseMessage, knowledgeUpdate: 'SEARCH_ANALYSIS: Zero-result query patterns' },
  'retail-22': { messages: task22Messages, code: task22Code, annotations: task22Annotations, tableColumns: task22TableColumns, tableData: task22TableData, assumptions: task22Assumptions, responseMessage: task22ResponseMessage, knowledgeUpdate: 'FULFILLMENT_SPEED: Order to ship time by center' },
  'retail-23': { messages: task23Messages, code: task23Code, annotations: task23Annotations, tableColumns: task23TableColumns, tableData: task23TableData, assumptions: task23Assumptions, responseMessage: task23ResponseMessage, knowledgeUpdate: 'GIFT_CARD: Redemption patterns and uplift' },
  'retail-24': { messages: task24Messages, code: task24Code, annotations: task24Annotations, tableColumns: task24TableColumns, tableData: task24TableData, assumptions: task24Assumptions, responseMessage: task24ResponseMessage, knowledgeUpdate: 'COMPETITIVE_PRICING: Our price vs market avg' },
  'retail-25': { messages: task25Messages, code: task25Code, annotations: task25Annotations, tableColumns: task25TableColumns, tableData: task25TableData, assumptions: task25Assumptions, responseMessage: task25ResponseMessage, knowledgeUpdate: 'SUBSCRIPTION_RETENTION: Cohort-based churn' },
  'retail-26': { messages: task26Messages, code: task26Code, annotations: task26Annotations, tableColumns: task26TableColumns, tableData: task26TableData, assumptions: task26Assumptions, responseMessage: task26ResponseMessage, knowledgeUpdate: 'WISHLIST_CONVERSION: 30-day window analysis' },
  'retail-27': { messages: task27Messages, code: task27Code, annotations: task27Annotations, tableColumns: task27TableColumns, tableData: task27TableData, assumptions: task27Assumptions, responseMessage: task27ResponseMessage, knowledgeUpdate: 'FLASH_SALE: Time-window baseline comparison' },
  'retail-28': { messages: task28Messages, code: task28Code, annotations: task28Annotations, tableColumns: task28TableColumns, tableData: task28TableData, assumptions: task28Assumptions, responseMessage: task28ResponseMessage, knowledgeUpdate: 'SIZE_STOCKOUT: Lost revenue estimation method' },
  'retail-29': { messages: task29Messages, code: task29Code, annotations: task29Annotations, tableColumns: task29TableColumns, tableData: task29TableData, assumptions: task29Assumptions, responseMessage: task29ResponseMessage, knowledgeUpdate: 'REPEAT_PURCHASE: LAG for interval calculation' },
  'retail-30': { messages: task30Messages, code: task30Code, annotations: task30Annotations, tableColumns: task30TableColumns, tableData: task30TableData, assumptions: task30Assumptions, responseMessage: task30ResponseMessage, knowledgeUpdate: 'REFERRAL_ATTRIBUTION: Referee + referrer revenue' },
  'retail-31': { messages: task31Messages, code: task31Code, annotations: task31Annotations, tableColumns: task31TableColumns, tableData: task31TableData, assumptions: task31Assumptions, responseMessage: task31ResponseMessage, knowledgeUpdate: 'APP_VS_WEB: Session-based conversion comparison' },
  'retail-32': { messages: task32Messages, code: task32Code, annotations: task32Annotations, tableColumns: task32TableColumns, tableData: task32TableData, assumptions: task32Assumptions, responseMessage: task32ResponseMessage, knowledgeUpdate: 'BUNDLE_PERFORMANCE: Revenue and margin analysis' },
  'retail-33': { messages: task33Messages, code: task33Code, annotations: task33Annotations, tableColumns: task33TableColumns, tableData: task33TableData, assumptions: task33Assumptions, responseMessage: task33ResponseMessage, knowledgeUpdate: 'SENTIMENT_ANALYSIS: NLP score thresholds' },
  'retail-34': { messages: task34Messages, code: task34Code, annotations: task34Annotations, tableColumns: task34TableColumns, tableData: task34TableData, assumptions: task34Assumptions, responseMessage: task34ResponseMessage, knowledgeUpdate: 'CHECKOUT_FUNNEL: Step-by-step drop-off analysis' },
  'retail-35': { messages: task35Messages, code: task35Code, annotations: task35Annotations, tableColumns: task35TableColumns, tableData: task35TableData, assumptions: task35Assumptions, responseMessage: task35ResponseMessage, knowledgeUpdate: 'NEW_VS_RETURNING: Customer type AOV trends' }
};
