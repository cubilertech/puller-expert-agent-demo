 # Puller AI Command Center
 
 Expert-in-the-Loop AI system for data analytics task management.
 
 ## Overview
 
 The Puller AI Command Center is an interactive demonstration of an AI-powered data analytics pipeline. It showcases how human experts can supervise, validate, and refine AI-generated responses to data queries from business stakeholders.
 
 ## Features
 
 - **Real-time Task Pipeline**: 6-stage processing workflow (Ingesting → Asserting → Planning → Building → Validating → Generating → Review)
 - **Interactive Artifact Editor**: SQL query viewer with inline annotations explaining each query section
 - **Context Graph**: Knowledge visualization showing learned rules and relationships
 - **Context Hub**: Multi-source knowledge management (Upload, Chat, API, Screen Record)
 - **Multi-Industry Demo Data**: 6 verticals with 30 pre-configured scenarios
 - **Task Simulation**: Automated ghost tasks demonstrating system behavior
 
 ## Tech Stack
 
 | Technology | Purpose |
 |------------|---------|
 | React 18 | UI Framework |
 | TypeScript | Type Safety |
 | Vite | Build System |
 | Tailwind CSS | Styling |
 | shadcn/ui | Component Library |
 | Framer Motion | Animations |
 | React Query | State Management |
 | Zod | Validation |
 
 ## Getting Started
 
 ```bash
 # Install dependencies
 npm install
 
 # Start development server
 npm run dev
 
 # Build for production
 npm run build
 
 # Preview production build
 npm run preview
 ```
 
 ## Demo Credentials
 
 ⚠️ **For demonstration purposes only**
 
 - **Email**: zac@puller.ai
 - **Password**: 123456
 
 > Note: This uses session-based demo authentication. See `src/hooks/useAuth.ts` for implementation notes.
 
 ## Project Structure
 
 ```
 src/
 ├── components/           # UI components
 │   ├── ui/              # shadcn/ui primitives
 │   ├── inputs/          # Context Hub input components
 │   ├── ArtifactEditor   # SQL viewer with annotations
 │   ├── ContextThread    # AI reasoning display
 │   ├── TaskFeed         # Task pipeline sidebar
 │   └── ...
 ├── data/                 # Demo data and configurations
 │   ├── demoData.ts      # Core demo content
 │   ├── demoConfig.ts    # Simulation settings
 │   └── industries/      # Industry-specific scenarios
 ├── hooks/                # Custom React hooks
 │   ├── useSimulation    # Task pipeline simulation
 │   ├── useContextHub    # Context management
 │   └── useAuth          # Demo authentication
 ├── pages/                # Route pages
 │   ├── Index.tsx        # Main command center
 │   ├── Login.tsx        # Authentication screen
 │   └── NotFound.tsx     # 404 page
 ├── types/                # TypeScript definitions
 └── lib/                  # Utilities
 ```
 
 ## Key Components
 
 ### TaskFeed
 Displays the task pipeline with three sections:
 - **Incoming**: Tasks in processing stages
 - **Active**: Tasks sent to requestors, awaiting feedback
 - **Learned**: Completed tasks that updated the knowledge base
 
 ### ContextThread
 Shows AI reasoning with:
 - Thinking steps with expandable details
 - Assumption tracking
 - Result visualization
 
 ### ArtifactEditor
 Interactive SQL viewer featuring:
 - Syntax-highlighted code display
 - Inline annotations with explanations
 - Editable response message
 - Assumption management with checkboxes
 
 ### Context Hub
 Multi-source knowledge input:
 - File upload (PDF, CSV, JSON, etc.)
 - Natural language chat input
 - API endpoint configuration
 - Screen recording capture
 
 ## Industry Verticals
 
 The demo includes pre-configured scenarios for:
 1. Retail & E-commerce
 2. Grocery & Mass Merchandise
 3. CPG & Consumer Brands
 4. Hospitality & Restaurants
 5. Fashion & Footwear
 6. Media & Entertainment
 
 ## Known Limitations
 
 - Authentication is demo-only (not production-ready)
 - File uploads are simulated (no backend storage)
 - API connections are mock implementations
 - Screen recording uses browser MediaRecorder API
 
 ## Development Notes
 
 - All colors use CSS custom properties via Tailwind
 - Components follow shadcn/ui patterns
 - Animations use Framer Motion with consistent easing
 - TypeScript strict mode enabled
 
 ## License
 
 UNLICENSED - Proprietary software
