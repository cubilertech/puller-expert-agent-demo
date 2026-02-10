import { CodeDiff, SqlAnnotation, TableColumn, Assumption, TaskData } from '@/types';

// ============================================
// GUIDED DEMO SCENARIO: "Golden Path"
// Retail-1 task updates when user adds retail week context
// ============================================

// Trigger detection: matches if content contains "retail week" + "sunday" or "sun" variations
export const GUIDED_TRIGGER_TASK_ID = 'retail-1';

export function isGuidedTrigger(content: string): boolean {
  const lower = content.toLowerCase();
  const hasRetailWeek = lower.includes('retail week') || lower.includes('business week') || lower.includes('week runs');
  const hasSunday = lower.includes('sunday') || lower.includes('sun-sat') || lower.includes('sun through sat');
  return hasRetailWeek && hasSunday;
}

// The "after" state: SQL now filters Sun-Sat, 7 rows, updated insights
const updatedCode: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    DATE(s.txn_ts) AS sales_date,' },
  { lineNumber: 3, type: 'unchanged', content: '    SUM(s.units) AS units_sold' },
  { lineNumber: 4, type: 'unchanged', content: 'FROM sales s' },
  { lineNumber: 5, type: 'unchanged', content: 'JOIN products p ON p.product_id = s.product_id' },
  { lineNumber: 6, type: 'unchanged', content: "WHERE p.product_name = 'GlowMax Serum'" },
  { lineNumber: 7, type: 'removed', content: "    AND DATE(s.txn_ts) BETWEEN DATE '2025-01-06' AND DATE '2025-01-12'" },
  { lineNumber: 8, type: 'added', content: "    AND DATE(s.txn_ts) BETWEEN DATE '2025-01-05' AND DATE '2025-01-11'" },
  { lineNumber: 9, type: 'unchanged', content: 'GROUP BY DATE(s.txn_ts)' },
  { lineNumber: 10, type: 'unchanged', content: 'ORDER BY sales_date;' },
];

const updatedAnnotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 3, title: 'Column Selection', description: 'Extracting date and aggregating unit sales for daily trend', type: 'selection' },
  { lineStart: 4, lineEnd: 5, title: 'Data Sources', description: 'Joining sales transactions with product dimension', type: 'source' },
  { lineStart: 6, lineEnd: 8, title: 'Product & Date Filter', description: 'Filtering to GlowMax Serum — date range updated to Sunday-Saturday per business rule', type: 'filter' },
  { lineStart: 9, lineEnd: 10, title: 'Grouping & Order', description: 'Daily aggregation sorted chronologically', type: 'grouping' },
];

const updatedTableColumns: TableColumn[] = [
  { key: 'sales_date', label: 'Sales Date', align: 'left' },
  { key: 'units_sold', label: 'Units Sold', align: 'right' },
];

const updatedTableData = [
  { sales_date: '2025-01-05', units_sold: 27 },
  { sales_date: '2025-01-06', units_sold: 42 },
  { sales_date: '2025-01-07', units_sold: 38 },
  { sales_date: '2025-01-08', units_sold: 44 },
  { sales_date: '2025-01-09', units_sold: 63 },
  { sales_date: '2025-01-10', units_sold: 59 },
  { sales_date: '2025-01-11', units_sold: 91 },
];

const updatedAssumptions: Assumption[] = [
  { id: '1', text: '"Last week" = Sunday-Saturday (2025-01-05 to 2025-01-11) per business rule', includeInMessage: true },
  { id: '2', text: 'Simple unit count per day (no revenue calculation)', includeInMessage: true },
  { id: '3', text: 'No seasonal/promotional adjustments applied', includeInMessage: false },
];

const updatedResponseMessage = `Here's the daily sales trend for GlowMax Serum last week (Sun-Sat):

**Key Insight**: Sales peaked at **91 units on Saturday** (Jan 11), with a full 7-day view now including **Sunday's 27 units**.

The updated retail week (Sunday-Saturday) reveals that Sunday starts low at 27 units, builds through the week, and peaks on Saturday. Total weekly units: **364** (vs. 337 previously reported without Sunday). This corrected view better reflects the business's actual weekly cycle.`;

export function getGuidedScenarioUpdate(): TaskData {
  return {
    messages: [
      {
        id: 'retail-1-msg-1',
        sender: 'user',
        content: 'How did sales of "GlowMax Serum" trend by day last week?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        type: 'text',
      },
      {
        id: 'retail-1-msg-2',
        sender: 'agent',
        content: 'Re-analyzed daily sales with updated retail week definition (Sunday-Saturday). Results now include 7 full days.',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        type: 'action',
        assumptions: [
          '"Last week" updated to Sunday-Saturday per business context',
          'Counting units sold per day to show trends',
          'Date range shifted to 2025-01-05 through 2025-01-11',
        ],
      },
    ],
    code: updatedCode,
    annotations: updatedAnnotations,
    tableColumns: updatedTableColumns,
    tableData: updatedTableData,
    knowledgeUpdate: 'RETAIL_WEEK_DEFINITION',
    responseMessage: updatedResponseMessage,
    assumptions: updatedAssumptions,
  };
}
