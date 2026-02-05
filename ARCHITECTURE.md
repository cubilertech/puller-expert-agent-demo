 # Puller AI Command Center - Architecture
 
 This document describes the system architecture and data flow of the Puller AI Command Center.
 
 ## System Overview
 
 ```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                           COMMAND CENTER                                │
 ├─────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  ┌─────────────┐   ┌──────────────────┐   ┌──────────────────────────┐ │
 │  │             │   │                  │   │                          │ │
 │  │  TaskFeed   │   │  ContextThread   │   │    ArtifactEditor        │ │
 │  │  (Sidebar)  │   │  (AI Reasoning)  │   │    (SQL + Response)      │ │
 │  │             │   │                  │   │                          │ │
 │  └─────┬───────┘   └────────┬─────────┘   └────────────┬─────────────┘ │
 │        │                    │                          │               │
 │        └────────────────────┼──────────────────────────┘               │
 │                             │                                          │
 │                    ┌────────▼────────┐                                 │
 │                    │   Index.tsx     │                                 │
 │                    │  (Orchestrator) │                                 │
 │                    └────────┬────────┘                                 │
 │                             │                                          │
 │        ┌────────────────────┼────────────────────┐                     │
 │        │                    │                    │                     │
 │  ┌─────▼─────┐      ┌───────▼──────┐    ┌───────▼───────┐             │
 │  │useSimu-   │      │useContextHub │    │ KnowledgeNode │             │
 │  │lation     │      │              │    │    State      │             │
 │  └───────────┘      └──────────────┘    └───────────────┘             │
 │                                                                        │
 └────────────────────────────────────────────────────────────────────────┘
 ```
 
 ## Core Data Flow
 
 ### 1. Task Pipeline Flow
 
 ```
 External Request (Email/Slack/Meeting)
          │
          ▼
 ┌──────────────────┐
 │   INGESTING      │  ← Parse incoming request
 └────────┬─────────┘
          ▼
 ┌──────────────────┐
 │   ASSERTING      │  ← Validate against known rules
 └────────┬─────────┘
          ▼
 ┌──────────────────┐
 │   PLANNING       │  ← Determine query strategy
 └────────┬─────────┘
          ▼
 ┌──────────────────┐
 │   BUILDING       │  ← Generate SQL query
 └────────┬─────────┘
          ▼
 ┌──────────────────┐
 │   VALIDATING     │  ← Check query correctness
 └────────┬─────────┘
          ▼
 ┌──────────────────┐
 │   GENERATING     │  ← Create response artifacts
 └────────┬─────────┘
          ▼
 ┌──────────────────┐
 │   REVIEW         │  ← Human expert review
 └────────┬─────────┘
          │
     ┌────┴────┐
     ▼         ▼
 [Approve]  [Override]
     │         │
     ▼         ▼
 ┌──────────────────┐
 │   SENT           │  ← Response sent to requestor
 └────────┬─────────┘
          ▼
 ┌──────────────────┐
 │   APPROVED       │  ← Requestor confirms
 └────────┬─────────┘
          ▼
 ┌──────────────────┐
 │   LEARNING       │  ← Update knowledge base
 └──────────────────┘
 ```
 
 ### 2. Knowledge Graph Flow
 
 ```
 ┌─────────────────┐
 │  Context Hub    │
 │  - Uploads      │
 │  - Chat Input   │──────┐
 │  - API Connect  │      │
 │  - Screen Rec   │      │
 └─────────────────┘      │
                          ▼
                 ┌──────────────────┐
                 │  useContextHub   │
                 │  (State Manager) │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ convertToNode()  │
                 └────────┬─────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │       KnowledgeNode[]         │
          │  (React State in Index.tsx)   │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │     ContextGraphCanvas        │
          │     (SVG Visualization)       │
          └───────────────────────────────┘
 ```
 
 ## Component Hierarchy
 
 ```
 App.tsx
 └── Routes
     ├── Login.tsx
     ├── Index.tsx (Main Command Center)
     │   ├── ControlTowerHeader
     │   │   ├── ContextGraphHeader ──→ ContextHubPanel (Sheet)
     │   │   │                           ├── ContextLog
     │   │   │                           └── ContextInputHub
     │   │   │                               ├── ContextUploader
     │   │   │                               ├── ContextChat
     │   │   │                               ├── ContextApiConnect
     │   │   │                               └── ContextScreenRecord
     │   │   └── ContextGraphModal
     │   │       └── ContextGraphCanvas
     │   ├── TaskFeed
     │   ├── ContextThread
     │   │   └── CommentThread (floating)
     │   ├── ArtifactEditor
     │   └── FlyingArtifact (animation)
     └── NotFound.tsx
 ```
 
 ## State Management
 
 ### Primary State (Index.tsx)
 
 | State Variable | Type | Purpose |
 |----------------|------|---------|
 | `tasks` | `Task[]` | All tasks in pipeline |
 | `selectedTaskId` | `string \| null` | Currently viewed task |
 | `knowledgeNodes` | `KnowledgeNode[]` | Graph nodes |
 | `isApproving` | `boolean` | Approval animation state |
 | `isLearning` | `boolean` | Learning animation state |
 | `learningSignal` | `LearningSignal \| null` | Toast notification |
 
 ### useSimulation Hook
 
 Manages automatic task progression:
 - Generates "ghost tasks" at intervals
 - Advances tasks through pipeline stages
 - Triggers auto-complete for non-review tasks
 
 ### useContextHub Hook
 
 Manages Context Hub state:
 - Panel open/close state
 - Context items list
 - Add/convert operations
 
 ## Type Definitions
 
 ### Task
 ```typescript
 interface Task {
   id: string;
   title: string;
   requestor: string;
   status: TaskStatus;  // Pipeline stage
   timestamp: Date;
   priority: 'low' | 'medium' | 'high';
   description: string;
   source: 'email' | 'slack' | 'meeting';
   flags: TaskFlags;
   confidence: number;  // 0-100
   industry?: IndustryVertical;
 }
 ```
 
 ### KnowledgeNode
 ```typescript
 interface KnowledgeNode {
   id: string;
   label: string;
   type: 'fact' | 'rule' | 'entity';
   x: number;
   y: number;
   isNew?: boolean;
   connections: string[];
 }
 ```
 
 ### ContextItem
 ```typescript
 interface ContextItem {
   id: string;
   type: 'entity' | 'rule' | 'fact';
   source: 'upload' | 'chat' | 'api' | 'screen-record';
   content: string;
   metadata?: Record<string, unknown>;
   timestamp: Date;
   status: 'pending' | 'processed' | 'error';
 }
 ```
 
 ## Demo Data Structure
 
 ```
 src/data/
 ├── demoData.ts          # Core demo content
 │   ├── initialTasks     # Starting task list
 │   ├── allTaskData      # Task-specific content
 │   └── ghostTasks       # Simulation tasks
 ├── demoConfig.ts        # Timing/interval settings
 └── industries/          # Industry scenarios
     ├── retailEcommerce.ts
     ├── groceryMassMerch.ts
     ├── cpgConsumerBrands.ts
     ├── hospitalityRestaurants.ts
     ├── fashionShoes.ts
     └── mediaEntertainment.ts
 ```
 
 ## Animation System
 
 All animations use Framer Motion with consistent patterns:
 
 | Animation | Trigger | Duration |
 |-----------|---------|----------|
 | Task stage pulse | Status change | 2s loop |
 | Flying artifact | Approval | 0.8s |
 | Graph node entrance | New node | 0.5s |
 | Panel slide | Open/close | 0.3s |
 | Skeleton pulse | Loading | 1s loop |
 
 ## Security Considerations
 
 ⚠️ **Demo-Only Implementation**
 
 The current authentication system is for demonstration purposes:
 
 - Credentials are hardcoded in `Login.tsx`
 - Session state stored in `sessionStorage`
 - No token refresh or expiration
 - No backend validation
 
 For production, implement:
 - Secure authentication service (Supabase Auth, Auth0)
 - HTTP-only cookies for sessions
 - Proper CSRF protection
 - Rate limiting on login attempts