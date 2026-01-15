import { Task, ChatMessage, CodeDiff, SqlAnnotation, TableColumn, Assumption, TaskData } from '@/types';

// ============================================
// MEDIA & ENTERTAINMENT DEMO DATA
// 5 Complete Tasks with Full Data
// ============================================

// Task 1: EcoLife Nature Show Daily Streams
const task1: Task = {
  id: 'media-1',
  title: 'EcoLife Nature Show Daily Streams',
  requestor: 'Alex Thompson, Content Analytics',
  status: 'review',
  timestamp: new Date(Date.now() - 1000 * 60 * 8),
  priority: 'medium',
  description: 'How many unique daily streams does EcoLife Nature Show average?',
  source: 'email',
  industry: 'media-entertainment',
  flags: { urgency: false, humanRequested: false, vip: true },
  confidence: 90
};

const task1Messages: ChatMessage[] = [
  {
    id: 'media-1-msg-1',
    sender: 'user',
    content: 'How many unique daily streams does EcoLife Nature Show average?',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    type: 'text'
  },
  {
    id: 'media-1-msg-2',
    sender: 'agent',
    content: 'Calculated average daily unique streams for EcoLife Nature Show over the last 30 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    type: 'action',
    assumptions: [
      'Unique stream = one user viewing at least 30 seconds',
      'Daily = calendar day in UTC',
      'Last 30 days of streaming data'
    ]
  }
];

const task1Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH daily_streams AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT DATE(stream_start) AS stream_date,' },
  { lineNumber: 3, type: 'unchanged', content: '           COUNT(DISTINCT user_id) AS unique_viewers' },
  { lineNumber: 4, type: 'unchanged', content: '    FROM streams s' },
  { lineNumber: 5, type: 'unchanged', content: '    JOIN content c ON s.content_id = c.content_id' },
  { lineNumber: 6, type: 'unchanged', content: "    WHERE c.title = 'EcoLife Nature Show'" },
  { lineNumber: 7, type: 'unchanged', content: '        AND s.watch_duration >= 30' },
  { lineNumber: 8, type: 'unchanged', content: '        AND s.stream_start >= CURRENT_DATE - 30' },
  { lineNumber: 9, type: 'unchanged', content: '    GROUP BY DATE(stream_start)' },
  { lineNumber: 10, type: 'unchanged', content: ')' },
  { lineNumber: 11, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 12, type: 'unchanged', content: '    AVG(unique_viewers) AS avg_daily_streams,' },
  { lineNumber: 13, type: 'unchanged', content: '    MIN(unique_viewers) AS min_daily,' },
  { lineNumber: 14, type: 'unchanged', content: '    MAX(unique_viewers) AS max_daily,' },
  { lineNumber: 15, type: 'unchanged', content: '    SUM(unique_viewers) AS total_streams' },
  { lineNumber: 16, type: 'unchanged', content: 'FROM daily_streams;' }
];

const task1Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 10, title: 'Daily Streams CTE', description: 'Counting unique viewers per day with minimum watch time', type: 'aggregation' },
  { lineStart: 11, lineEnd: 16, title: 'Summary Statistics', description: 'Average, min, max, and total streams', type: 'selection' }
];

const task1TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'value', label: 'Value', align: 'right' }
];

const task1TableData = [
  { metric: 'Average Daily Streams', value: 45230 },
  { metric: 'Minimum Daily', value: 32156 },
  { metric: 'Maximum Daily', value: 67892 },
  { metric: 'Total (30 days)', value: 1356900 }
];

const task1Assumptions: Assumption[] = [
  { id: '1', text: 'Unique stream = user watched at least 30 seconds', includeInMessage: true },
  { id: '2', text: 'Calendar day in UTC timezone', includeInMessage: true },
  { id: '3', text: 'Last 30 days of streaming data', includeInMessage: true }
];

const task1ResponseMessage = `**EcoLife Nature Show** averages **45,230 unique daily streams**.

**30-Day Performance:**
- Average: 45,230 streams/day
- Peak Day: 67,892 streams
- Low Day: 32,156 streams
- Total: 1.36M streams

**Insight**: Strong consistent viewership with 2x variation between peak and low days, suggesting opportunity to boost off-peak promotion.`;


// Task 2: PlayVerse Originals Trailer Conversion
const task2: Task = {
  id: 'media-2',
  title: 'PlayVerse Originals Trailer-to-Trial Conversion',
  requestor: 'Sarah Kim, Acquisition Marketing',
  status: 'review',
  timestamp: new Date(Date.now() - 1000 * 60 * 15),
  priority: 'high',
  description: 'What percentage of users who watch a PlayVerse Originals trailer start a free trial?',
  source: 'slack',
  industry: 'media-entertainment',
  flags: { urgency: true, humanRequested: false, vip: false },
  confidence: 84
};

const task2Messages: ChatMessage[] = [
  {
    id: 'media-2-msg-1',
    sender: 'user',
    content: 'What percentage of users who watch a PlayVerse Originals trailer start a free trial?',
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
    type: 'text'
  },
  {
    id: 'media-2-msg-2',
    sender: 'agent',
    content: 'Calculating trailer-to-trial conversion funnel for PlayVerse Originals content.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'action',
    assumptions: [
      'Trailer view = watched trailer content type',
      'Trial start = subscription started within 7 days of trailer view',
      'Last 60 days of funnel data'
    ]
  }
];

const task2Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH trailer_viewers AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT DISTINCT s.user_id, MIN(s.stream_start) AS first_trailer_view' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM streams s' },
  { lineNumber: 4, type: 'unchanged', content: '    JOIN content c ON s.content_id = c.content_id' },
  { lineNumber: 5, type: 'unchanged', content: "    WHERE c.content_type = 'trailer'" },
  { lineNumber: 6, type: 'unchanged', content: "        AND c.series_name = 'PlayVerse Originals'" },
  { lineNumber: 7, type: 'unchanged', content: '        AND s.stream_start >= CURRENT_DATE - 60' },
  { lineNumber: 8, type: 'unchanged', content: '    GROUP BY s.user_id' },
  { lineNumber: 9, type: 'unchanged', content: '),' },
  { lineNumber: 10, type: 'unchanged', content: 'trial_starts AS (' },
  { lineNumber: 11, type: 'unchanged', content: '    SELECT tv.user_id' },
  { lineNumber: 12, type: 'unchanged', content: '    FROM trailer_viewers tv' },
  { lineNumber: 13, type: 'unchanged', content: '    JOIN subscriptions sub ON tv.user_id = sub.user_id' },
  { lineNumber: 14, type: 'unchanged', content: "    WHERE sub.subscription_type = 'free_trial'" },
  { lineNumber: 15, type: 'unchanged', content: '        AND sub.start_date BETWEEN tv.first_trailer_view AND tv.first_trailer_view + INTERVAL 7 DAY' },
  { lineNumber: 16, type: 'unchanged', content: ')' },
  { lineNumber: 17, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 18, type: 'unchanged', content: '    COUNT(DISTINCT tv.user_id) AS trailer_viewers,' },
  { lineNumber: 19, type: 'unchanged', content: '    COUNT(DISTINCT ts.user_id) AS trial_starts,' },
  { lineNumber: 20, type: 'unchanged', content: '    ROUND(COUNT(DISTINCT ts.user_id) * 100.0 / COUNT(DISTINCT tv.user_id), 1) AS conversion_rate' },
  { lineNumber: 21, type: 'unchanged', content: 'FROM trailer_viewers tv' },
  { lineNumber: 22, type: 'unchanged', content: 'LEFT JOIN trial_starts ts ON tv.user_id = ts.user_id;' }
];

const task2Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 9, title: 'Trailer Viewers CTE', description: 'Users who watched PlayVerse Originals trailers', type: 'filter' },
  { lineStart: 10, lineEnd: 16, title: 'Trial Starts CTE', description: 'Trailer viewers who started trial within 7 days', type: 'filter' },
  { lineStart: 17, lineEnd: 22, title: 'Conversion Calculation', description: 'Funnel metrics and conversion rate', type: 'aggregation' }
];

const task2TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Funnel Stage', align: 'left' },
  { key: 'value', label: 'Count', align: 'right' },
  { key: 'rate', label: 'Rate', align: 'right' }
];

const task2TableData = [
  { metric: 'Trailer Viewers', value: 234567, rate: '100%' },
  { metric: 'Started Free Trial', value: 28148, rate: '12.0%' },
  { metric: 'Industry Benchmark', value: '-', rate: '8.5%' }
];

const task2Assumptions: Assumption[] = [
  { id: '1', text: 'Trailer view = any PlayVerse Originals trailer watched', includeInMessage: true },
  { id: '2', text: 'Trial start = free trial subscription within 7 days of trailer', includeInMessage: true },
  { id: '3', text: 'Last 60 days of funnel data analyzed', includeInMessage: true }
];

const task2ResponseMessage = `**Trailer-to-trial conversion** for PlayVerse Originals: **12.0%**

**Funnel Performance:**
- Trailer Viewers: 234,567
- Started Free Trial: 28,148
- Conversion Rate: 12.0%
- Industry Benchmark: 8.5%

**Insight**: PlayVerse Originals trailers are **41% above benchmark** in driving trial starts. Consider increasing trailer inventory in ad campaigns.`;


// Task 3: StreamMax Premium Device Views
const task3: Task = {
  id: 'media-3',
  title: 'StreamMax Premium Device Distribution',
  requestor: 'David Chen, Product Analytics',
  status: 'building',
  timestamp: new Date(Date.now() - 1000 * 60 * 33),
  priority: 'medium',
  description: 'What devices do StreamMax Premium subscribers use most for viewing?',
  source: 'email',
  industry: 'media-entertainment',
  flags: { urgency: false, humanRequested: true, vip: false },
  confidence: 91
};

const task3Messages: ChatMessage[] = [
  {
    id: 'media-3-msg-1',
    sender: 'user',
    content: 'What devices do StreamMax Premium subscribers use most for viewing?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    type: 'text'
  },
  {
    id: 'media-3-msg-2',
    sender: 'agent',
    content: 'Analyzing device usage distribution for StreamMax Premium subscribers.',
    timestamp: new Date(Date.now() - 1000 * 60 * 33),
    type: 'action',
    assumptions: [
      'Premium = "StreamMax Premium" subscription tier',
      'Device from stream metadata',
      'Last 30 days of viewing data'
    ]
  }
];

const task3Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 2, type: 'unchanged', content: '    s.device_type,' },
  { lineNumber: 3, type: 'unchanged', content: '    COUNT(*) AS stream_count,' },
  { lineNumber: 4, type: 'unchanged', content: '    COUNT(DISTINCT s.user_id) AS unique_users,' },
  { lineNumber: 5, type: 'unchanged', content: '    SUM(s.watch_duration) / 3600 AS total_hours,' },
  { lineNumber: 6, type: 'unchanged', content: '    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) AS pct_of_streams' },
  { lineNumber: 7, type: 'unchanged', content: 'FROM streams s' },
  { lineNumber: 8, type: 'unchanged', content: 'JOIN subscriptions sub ON s.user_id = sub.user_id' },
  { lineNumber: 9, type: 'unchanged', content: "WHERE sub.subscription_tier = 'StreamMax Premium'" },
  { lineNumber: 10, type: 'unchanged', content: '    AND sub.status = \'active\'' },
  { lineNumber: 11, type: 'unchanged', content: '    AND s.stream_start >= CURRENT_DATE - 30' },
  { lineNumber: 12, type: 'unchanged', content: 'GROUP BY s.device_type' },
  { lineNumber: 13, type: 'unchanged', content: 'ORDER BY stream_count DESC;' }
];

const task3Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 6, title: 'Device Metrics', description: 'Device, streams, users, hours, and percentage', type: 'selection' },
  { lineStart: 7, lineEnd: 8, title: 'Data Sources', description: 'Streams joined with subscriptions', type: 'source' },
  { lineStart: 9, lineEnd: 11, title: 'Filters', description: 'Premium tier, active, last 30 days', type: 'filter' },
  { lineStart: 12, lineEnd: 13, title: 'Grouping', description: 'By device, ordered by stream count', type: 'grouping' }
];

const task3TableColumns: TableColumn[] = [
  { key: 'device_type', label: 'Device', align: 'left' },
  { key: 'stream_count', label: 'Streams', align: 'right' },
  { key: 'total_hours', label: 'Hours', align: 'right' },
  { key: 'pct_of_streams', label: '% of Streams', align: 'right' }
];

const task3TableData = [
  { device_type: 'Smart TV', stream_count: 456789, total_hours: '234,567', pct_of_streams: '42.3%' },
  { device_type: 'Mobile', stream_count: 287654, total_hours: '98,234', pct_of_streams: '26.6%' },
  { device_type: 'Tablet', stream_count: 187234, total_hours: '78,456', pct_of_streams: '17.3%' },
  { device_type: 'Desktop', stream_count: 98765, total_hours: '45,678', pct_of_streams: '9.1%' },
  { device_type: 'Game Console', stream_count: 50234, total_hours: '28,123', pct_of_streams: '4.7%' }
];

const task3Assumptions: Assumption[] = [
  { id: '1', text: 'Premium = "StreamMax Premium" subscription tier', includeInMessage: true },
  { id: '2', text: 'Device type from stream session metadata', includeInMessage: true },
  { id: '3', text: 'Last 30 days of viewing data', includeInMessage: true }
];

const task3ResponseMessage = `**Device distribution** for StreamMax Premium subscribers:

| Device | % of Streams | Watch Hours |
|--------|--------------|-------------|
| Smart TV | 42.3% | 234.6K hrs |
| Mobile | 26.6% | 98.2K hrs |
| Tablet | 17.3% | 78.5K hrs |
| Desktop | 9.1% | 45.7K hrs |
| Game Console | 4.7% | 28.1K hrs |

**Insight**: Smart TV dominates with highest engagement (234K hours). Mobile has high stream count but lower watch time, suggesting shorter sessions.`;


// Task 4: MegaSports Live Episode Intervals
const task4: Task = {
  id: 'media-4',
  title: 'MegaSports Live Episode Watch Intervals',
  requestor: 'Chris Wilson, Sports Programming',
  status: 'validating',
  timestamp: new Date(Date.now() - 1000 * 60 * 50),
  priority: 'low',
  description: "What's the typical time between episodes watched for MegaSports Live viewers?",
  source: 'meeting',
  industry: 'media-entertainment',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 88
};

const task4Messages: ChatMessage[] = [
  {
    id: 'media-4-msg-1',
    sender: 'user',
    content: 'What\'s the typical time between episodes watched for MegaSports Live viewers?',
    timestamp: new Date(Date.now() - 1000 * 60 * 63),
    type: 'text'
  },
  {
    id: 'media-4-msg-2',
    sender: 'agent',
    content: 'Calculating inter-episode viewing intervals for MegaSports Live audience.',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    type: 'action',
    assumptions: [
      'Episode = distinct episode_id for MegaSports Live',
      'Interval = days between consecutive episode views',
      'Minimum 2 episodes watched to calculate'
    ]
  }
];

const task4Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH episode_views AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT user_id,' },
  { lineNumber: 3, type: 'unchanged', content: '           DATE(stream_start) AS view_date,' },
  { lineNumber: 4, type: 'unchanged', content: '           LAG(DATE(stream_start)) OVER (PARTITION BY user_id ORDER BY stream_start) AS prev_view,' },
  { lineNumber: 5, type: 'unchanged', content: '           DATEDIFF(DATE(stream_start), LAG(DATE(stream_start)) OVER (PARTITION BY user_id ORDER BY stream_start)) AS days_gap' },
  { lineNumber: 6, type: 'unchanged', content: '    FROM streams s' },
  { lineNumber: 7, type: 'unchanged', content: '    JOIN content c ON s.content_id = c.content_id' },
  { lineNumber: 8, type: 'unchanged', content: "    WHERE c.series_name = 'MegaSports Live'" },
  { lineNumber: 9, type: 'unchanged', content: ')' },
  { lineNumber: 10, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 11, type: 'unchanged', content: '    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_gap) AS median_days,' },
  { lineNumber: 12, type: 'unchanged', content: '    AVG(days_gap) AS avg_days,' },
  { lineNumber: 13, type: 'unchanged', content: '    MODE() WITHIN GROUP (ORDER BY days_gap) AS mode_days' },
  { lineNumber: 14, type: 'unchanged', content: 'FROM episode_views' },
  { lineNumber: 15, type: 'unchanged', content: 'WHERE days_gap IS NOT NULL AND days_gap > 0;' }
];

const task4Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 9, title: 'Episode Views CTE', description: 'Using LAG to find days between episode views', type: 'aggregation' },
  { lineStart: 10, lineEnd: 13, title: 'Interval Statistics', description: 'Median, average, and mode of viewing gaps', type: 'selection' },
  { lineStart: 14, lineEnd: 15, title: 'Filter', description: 'Excluding first views and same-day binges', type: 'filter' }
];

const task4TableColumns: TableColumn[] = [
  { key: 'metric', label: 'Metric', align: 'left' },
  { key: 'value', label: 'Days', align: 'right' }
];

const task4TableData = [
  { metric: 'Median Interval', value: 7 },
  { metric: 'Average Interval', value: 8.3 },
  { metric: 'Most Common Interval', value: 7 },
  { metric: 'Release Schedule', value: 'Weekly' }
];

const task4Assumptions: Assumption[] = [
  { id: '1', text: 'Episode = distinct content within MegaSports Live series', includeInMessage: true },
  { id: '2', text: 'Interval = days between consecutive episode views per user', includeInMessage: true },
  { id: '3', text: 'Same-day views excluded (binge behavior filtered)', includeInMessage: false }
];

const task4ResponseMessage = `**Episode viewing interval** for MegaSports Live: **7 days** (median)

**Distribution:**
- Median: 7 days (matches weekly release)
- Average: 8.3 days
- Most Common: 7 days

**Insight**: Viewers are well-aligned with the weekly release schedule. The 7-day mode confirms appointment viewing behavior - these are engaged fans watching on release day.`;


// Task 5: KiddoPlay Adventures Content Affinity
const task5: Task = {
  id: 'media-5',
  title: 'KiddoPlay Adventures Content Affinity',
  requestor: 'Lauren Park, Kids Programming',
  status: 'planning',
  timestamp: new Date(Date.now() - 1000 * 60 * 70),
  priority: 'medium',
  description: 'What other shows do KiddoPlay Adventures viewers watch most?',
  source: 'slack',
  industry: 'media-entertainment',
  flags: { urgency: false, humanRequested: false, vip: false },
  confidence: 89
};

const task5Messages: ChatMessage[] = [
  {
    id: 'media-5-msg-1',
    sender: 'user',
    content: 'What other shows do KiddoPlay Adventures viewers watch most?',
    timestamp: new Date(Date.now() - 1000 * 60 * 82),
    type: 'text'
  },
  {
    id: 'media-5-msg-2',
    sender: 'agent',
    content: 'Analyzing content affinity for KiddoPlay Adventures audience segment.',
    timestamp: new Date(Date.now() - 1000 * 60 * 70),
    type: 'action',
    assumptions: [
      'KiddoPlay viewer = watched at least 1 episode',
      'Other shows = distinct series excluding KiddoPlay',
      'Last 90 days of viewing data'
    ]
  }
];

const task5Code: CodeDiff[] = [
  { lineNumber: 1, type: 'unchanged', content: 'WITH kiddoplay_viewers AS (' },
  { lineNumber: 2, type: 'unchanged', content: '    SELECT DISTINCT user_id' },
  { lineNumber: 3, type: 'unchanged', content: '    FROM streams s' },
  { lineNumber: 4, type: 'unchanged', content: '    JOIN content c ON s.content_id = c.content_id' },
  { lineNumber: 5, type: 'unchanged', content: "    WHERE c.series_name = 'KiddoPlay Adventures'" },
  { lineNumber: 6, type: 'unchanged', content: '        AND s.stream_start >= CURRENT_DATE - 90' },
  { lineNumber: 7, type: 'unchanged', content: ')' },
  { lineNumber: 8, type: 'unchanged', content: 'SELECT' },
  { lineNumber: 9, type: 'unchanged', content: '    c.series_name,' },
  { lineNumber: 10, type: 'unchanged', content: '    c.genre,' },
  { lineNumber: 11, type: 'unchanged', content: '    COUNT(DISTINCT s.user_id) AS overlapping_viewers,' },
  { lineNumber: 12, type: 'unchanged', content: '    ROUND(COUNT(DISTINCT s.user_id) * 100.0 / (SELECT COUNT(*) FROM kiddoplay_viewers), 1) AS affinity_pct' },
  { lineNumber: 13, type: 'unchanged', content: 'FROM streams s' },
  { lineNumber: 14, type: 'unchanged', content: 'JOIN content c ON s.content_id = c.content_id' },
  { lineNumber: 15, type: 'unchanged', content: 'WHERE s.user_id IN (SELECT user_id FROM kiddoplay_viewers)' },
  { lineNumber: 16, type: 'unchanged', content: "    AND c.series_name != 'KiddoPlay Adventures'" },
  { lineNumber: 17, type: 'unchanged', content: 'GROUP BY c.series_name, c.genre' },
  { lineNumber: 18, type: 'unchanged', content: 'ORDER BY overlapping_viewers DESC' },
  { lineNumber: 19, type: 'unchanged', content: 'LIMIT 10;' }
];

const task5Annotations: SqlAnnotation[] = [
  { lineStart: 1, lineEnd: 7, title: 'KiddoPlay Viewers CTE', description: 'Identifying users who watch KiddoPlay Adventures', type: 'filter' },
  { lineStart: 8, lineEnd: 12, title: 'Affinity Metrics', description: 'Series, genre, overlap count, and affinity percentage', type: 'selection' },
  { lineStart: 13, lineEnd: 19, title: 'Other Content', description: 'What else these viewers watch, top 10', type: 'filter' }
];

const task5TableColumns: TableColumn[] = [
  { key: 'series_name', label: 'Show', align: 'left' },
  { key: 'genre', label: 'Genre', align: 'left' },
  { key: 'overlapping_viewers', label: 'Shared Viewers', align: 'right' },
  { key: 'affinity_pct', label: 'Affinity', align: 'right' }
];

const task5TableData = [
  { series_name: 'Dino Discovery Kids', genre: 'Educational', overlapping_viewers: 45678, affinity_pct: '67.8%' },
  { series_name: 'Rainbow Friends', genre: 'Animation', overlapping_viewers: 42345, affinity_pct: '62.9%' },
  { series_name: 'Space Explorers Jr', genre: 'Sci-Fi Kids', overlapping_viewers: 38976, affinity_pct: '57.9%' },
  { series_name: 'Animal Planet Babies', genre: 'Nature', overlapping_viewers: 34567, affinity_pct: '51.3%' },
  { series_name: 'Music Time Funhouse', genre: 'Music', overlapping_viewers: 28934, affinity_pct: '43.0%' }
];

const task5Assumptions: Assumption[] = [
  { id: '1', text: 'KiddoPlay viewer = watched at least 1 episode in 90 days', includeInMessage: true },
  { id: '2', text: 'Affinity % = % of KiddoPlay viewers who also watch this show', includeInMessage: true },
  { id: '3', text: 'Excludes KiddoPlay Adventures itself from results', includeInMessage: false }
];

const task5ResponseMessage = `**Content affinity** for KiddoPlay Adventures viewers:

**Top 5 Affinities:**
| Show | Genre | Affinity |
|------|-------|----------|
| Dino Discovery Kids | Educational | 67.8% |
| Rainbow Friends | Animation | 62.9% |
| Space Explorers Jr | Sci-Fi Kids | 57.9% |
| Animal Planet Babies | Nature | 51.3% |

**Insight**: Strong affinity with educational content (68%). Consider cross-promotion with Dino Discovery Kids and programming blocks that pair these shows.`;


// Export all tasks and task data
export const mediaEntertainmentTasks: Task[] = [task1, task2, task3, task4, task5];

export const mediaEntertainmentTaskData: Record<string, TaskData> = {
  'media-1': {
    messages: task1Messages,
    code: task1Code,
    annotations: task1Annotations,
    tableColumns: task1TableColumns,
    tableData: task1TableData,
    assumptions: task1Assumptions,
    responseMessage: task1ResponseMessage,
    knowledgeUpdate: 'STREAM_METRICS: Use watch_duration >= 30 for valid stream count'
  },
  'media-2': {
    messages: task2Messages,
    code: task2Code,
    annotations: task2Annotations,
    tableColumns: task2TableColumns,
    tableData: task2TableData,
    assumptions: task2Assumptions,
    responseMessage: task2ResponseMessage,
    knowledgeUpdate: 'FUNNEL_ANALYSIS: Use CTEs for each stage, INTERVAL for conversion window'
  },
  'media-3': {
    messages: task3Messages,
    code: task3Code,
    annotations: task3Annotations,
    tableColumns: task3TableColumns,
    tableData: task3TableData,
    assumptions: task3Assumptions,
    responseMessage: task3ResponseMessage,
    knowledgeUpdate: 'DEVICE_DISTRIBUTION: Join streams with subscriptions for tier filtering'
  },
  'media-4': {
    messages: task4Messages,
    code: task4Code,
    annotations: task4Annotations,
    tableColumns: task4TableColumns,
    tableData: task4TableData,
    assumptions: task4Assumptions,
    responseMessage: task4ResponseMessage,
    knowledgeUpdate: 'VIEWING_INTERVAL: Use LAG() for sequential analysis, filter same-day'
  },
  'media-5': {
    messages: task5Messages,
    code: task5Code,
    annotations: task5Annotations,
    tableColumns: task5TableColumns,
    tableData: task5TableData,
    assumptions: task5Assumptions,
    responseMessage: task5ResponseMessage,
    knowledgeUpdate: 'CONTENT_AFFINITY: Use audience overlap to find related content'
  }
};
