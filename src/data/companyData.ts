import { ServiceItem, ProductItem, ProjectItem, ProcessStep, TechItem } from '../types';

export const COMPANY_INFO = {
  name: 'Newta Tech',
  tagline: 'Building the Future with AI & Software.',
  subtitle: 'Newta Tech builds intelligent software, AI-powered products, automation systems, and digital experiences for modern businesses.',
  motto: 'We turn ambitious ideas into usable digital products.',
  statusIndicator: 'AI • SOFTWARE • INNOVATION',
  year: 2026,
  email: 'mohammadwaizale@gmail.com',
  secondaryEmail: 'awanareeb450@gmail.com',
  emails: ['mohammadwaizale@gmail.com', 'awanareeb450@gmail.com'],
  linkedMailto: 'mailto:mohammadwaizale@gmail.com,awanareeb450@gmail.com?cc=awanareeb450@gmail.com&subject=Project%20Inquiry%20%E2%80%94%20Newta%20Tech',
  location: 'Global Engineering Studio',
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'ai-solutions',
    number: '01',
    title: 'AI Solutions',
    shortDescription: 'AI-powered applications, intelligent assistants, AI integrations, and custom AI workflows.',
    fullDescription: 'We architect and embed state-of-the-art machine intelligence into real production software. From multi-agent pipelines and semantic retrieval (RAG) to custom domain fine-tuning and autonomous tool calling, we ensure your AI architecture is predictable, latency-optimized, and strictly governed.',
    deliverables: [
      'Multi-Agent Workflow Pipelines',
      'Context-Aware LLM & Vision Integrations',
      'Autonomous Semantic Retrieval (RAG)',
      'Enterprise API Integration & Tool Calling'
    ],
    architecturalComponents: [
      'Token Optimization Engine',
      'Streaming Inference Gateway',
      'Evaluation & Guardrail Harness'
    ],
    techStack: ['Gemini 2.5/Flash', 'Python', 'FastAPI', 'LangGraph', 'Vector DBs'],
    iconName: 'Cpu'
  },
  {
    id: 'saas-development',
    number: '02',
    title: 'SaaS Development',
    shortDescription: 'Scalable SaaS products with modern interfaces, authentication, dashboards, databases, subscriptions, and cloud infrastructure.',
    fullDescription: 'End-to-end multi-tenant software engineering engineered for commercial scale. We build complete product foundations: robust RBAC authentication, real-time analytics dashboards, automated billing subscriptions, transactional email pipelines, and resilient cloud architecture.',
    deliverables: [
      'Multi-Tenant Architecture & RBAC',
      'Interactive Analytics & Telemetry Dashboards',
      'Stripe / Lemonsqueezy Subscription Lifecycles',
      'High-Throughput Relational & Document Stores'
    ],
    architecturalComponents: [
      'Event-Driven Background Workers',
      'Zero-Trust Session Management',
      'Distributed Caching & Redis Queues'
    ],
    techStack: ['React', 'Next.js', 'PostgreSQL', 'Node.js', 'Docker', 'Stripe'],
    iconName: 'Layers'
  },
  {
    id: 'web-development',
    number: '03',
    title: 'Web Development',
    shortDescription: 'High-performance, responsive, modern websites and web applications.',
    fullDescription: 'Ultra-fast web platforms engineered with zero bloat. We build responsive, accessible, search-engine-optimized web applications with sub-second page loads, micro-interactions, and pristine typographic hierarchy that convert visitors into loyal clients.',
    deliverables: [
      'Core Web Vitals Optimized Performance (95+ score)',
      'Fully Responsive Cross-Device Viewports',
      'Accessible Semantics & Keyboard Navigation',
      'Comprehensive Technical SEO & OpenGraph Matrix'
    ],
    architecturalComponents: [
      'Edge CDN Caching & SSR Pipelines',
      'Static Asset Delivery Mesh',
      'Fluid Viewport Math & Fluid Scaling'
    ],
    techStack: ['TypeScript', 'Vite', 'Tailwind CSS', 'Next.js', 'Cloudflare'],
    iconName: 'Globe'
  },
  {
    id: 'ai-automation',
    number: '04',
    title: 'AI Automation',
    shortDescription: 'Automate repetitive business processes using AI, APIs, workflows, and intelligent systems.',
    fullDescription: 'Eliminate human bottlenecks in critical operational pipelines. We engineer intelligent orchestrations that parse documents, reconcile datasets across CRMs and ERPs, triage inbound inquiries, and trigger autonomous multi-step business logic.',
    deliverables: [
      'Autonomous Inbound Lead & Document Parsing',
      'Cross-Platform Synchronized API Workflows',
      'Exception Triage & Human-in-the-Loop Safeguards',
      'Event-Triggered Operational Bots'
    ],
    architecturalComponents: [
      'Dead-Letter Queue & Retries',
      'Encrypted Webhook Ingestion Hub',
      'Real-Time Audit Log & Tracing'
    ],
    techStack: ['Python', 'Temporal / Celery', 'Make / Zapier Custom Nodes', 'PostgreSQL'],
    iconName: 'Zap'
  },
  {
    id: 'custom-software',
    number: '05',
    title: 'Custom Software',
    shortDescription: 'Custom software solutions designed around specific business requirements.',
    fullDescription: 'Tailored digital infrastructure built precisely for proprietary operational constraints. When off-the-shelf software fails to fit unique internal workflows, we build bespoke engines, internal tools, ERP modules, and high-security client portals.',
    deliverables: [
      'Proprietary Internal Operations Portals',
      'Complex Data Modeling & Custom Schema Design',
      'Legacy System Modernization & Bridges',
      'Automated Test Suites & High-Fidelity CI/CD'
    ],
    architecturalComponents: [
      'Micro-Service Boundary Isolation',
      'Automated Health Checks & Observability',
      'Strict Type-Safe Contracts (tRPC / OpenAPI)'
    ],
    techStack: ['TypeScript', 'Express / Go', 'PostgreSQL', 'Docker', 'AWS / GCP'],
    iconName: 'Terminal'
  },
  {
    id: 'digital-products',
    number: '06',
    title: 'Digital Products',
    shortDescription: 'Concept, design, development, launch, and iteration of new digital products.',
    fullDescription: 'From initial market insight to shipped MVP and continuous product expansion. We guide founders and corporate innovators through rapid prototyping, user feedback telemetry, scalable component design systems, and iterative product sprints.',
    deliverables: [
      'Product Specification & Technical Architecture',
      'High-Fidelity Interactive Design Systems',
      'Rapid Functional MVP Launch in Weeks',
      'Product Telemetry & Cohort Retention Analytics'
    ],
    architecturalComponents: [
      'Feature Flag & A/B Rollout Engine',
      'In-App Feedback Capture Mechanism',
      'Continuous Deployment Pipeline'
    ],
    techStack: ['Figma', 'React', 'Node.js', 'PostgreSQL', 'Vercel / Cloud Run'],
    iconName: 'Sparkles'
  }
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'newta-portfolio-ai',
    name: 'Newta Portfolio AI',
    tagline: 'Intelligent portfolio builder for the next generation of builders.',
    description: 'An AI-powered portfolio builder that helps engineers, designers, and creators construct high-impact, code-backed online portfolios 10x faster with automated case-study synthesis.',
    status: 'Coming Soon',
    category: 'AI Creative Software',
    features: [
      'Autonomous Project Storyboarding & Copywriting',
      'Live Code Sandbox & Interactive Demos Integration',
      'Instant One-Click Custom Domain & Edge CDN Deploy',
      'Dynamic SEO & OpenGraph Social Card Generator'
    ],
    releaseWindow: 'Q3 2026'
  },
  {
    id: 'newta-flow-ai',
    name: 'Newta Flow AI',
    tagline: 'Agentic orchestration engine for modern operational teams.',
    description: 'Multi-agent coordination system that maps business instructions into deterministic workflow pipelines with built-in human verification gates.',
    status: 'Coming Soon',
    category: 'AI Automation & Agents',
    features: [
      'Visual Canvas for Multi-Model Routing',
      'Zero-Latency Webhook Interceptors',
      'Audited Memory & Context Isolation',
      'Self-Healing Task Execution on Failures'
    ],
    releaseWindow: 'Q4 2026'
  },
  {
    id: 'newta-pulse',
    name: 'Newta Pulse',
    tagline: 'Predictive telemetry and performance radar for cloud services.',
    description: 'Lightweight software instrumentation library that diagnoses database bottlenecks, API latency spikes, and cold-start regressions before users notice.',
    status: 'In Development',
    category: 'Developer Infrastructure',
    features: [
      'Sub-millisecond Micro-Agent Collector',
      'Predictive Anomaly Detection Algorithm',
      'Granular Latency Tracing by Route'
    ],
    releaseWindow: 'Private Alpha'
  },
  {
    id: 'newta-devkit',
    name: 'Newta DevKit',
    tagline: 'Enterprise-grade scaffolding for AI-native web applications.',
    description: 'A modular foundation of battle-tested React and Node primitives designed specifically for streaming LLM outputs, optimistic UI updates, and token budgeting.',
    status: 'Concept Stage',
    category: 'Engineering Tooling',
    features: [
      'Streaming Token Parser with Backpressure Handling',
      'Type-Safe Function Call Dispatchers',
      'Dark-Mode First Accessible Component Kit'
    ],
    releaseWindow: 'Research & Planning'
  }
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'enterprise-saas-dashboard',
    title: 'Nova Cloud SaaS Platform',
    category: 'SaaS Development',
    shortDescription: 'Multi-tenant cloud management platform with real-time telemetry, automated role-based access, and latency-optimized metrics.',
    image: '/src/assets/images/project_saas_platform_1790622881409.jpg',
    technologies: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    metrics: [
      { label: 'Query Latency', value: '< 45ms' },
      { label: 'Architecture', value: 'Multi-Tenant' },
      { label: 'Uptime Standard', value: '99.95%' }
    ],
    challenge: 'Architecting a real-time analytics portal that can ingest high-velocity telemetry streams without freezing client viewports or inducing render thrash.',
    solution: 'Implemented virtualized data grids paired with WebSocket event batches and memoized chart rendering, maintaining 60fps interaction budgets during heavy data streaming.',
    architectureDetails: [
      'Zero-trust JWT authentication with rotating refresh token cookies',
      'Row-Level Security (RLS) policies isolating tenant data partitions',
      'Edge-cached dashboard layouts for near-instant navigation'
    ]
  },
  {
    id: 'ai-automation-platform',
    title: 'Aegis Autonomous Pipeline',
    category: 'AI Automation',
    shortDescription: 'Intelligent multi-step orchestration system handling automated document analysis, schema extraction, and cross-system sync.',
    image: '/src/assets/images/project_ai_automation_1790622893288.jpg',
    technologies: ['Python', 'FastAPI', 'Gemini Models', 'Docker', 'Redis'],
    metrics: [
      { label: 'Extraction Accuracy', value: '99.4%' },
      { label: 'Pipeline Speed', value: '3.2s avg' },
      { label: 'Manual Steps Removed', value: '85%' }
    ],
    challenge: 'Processing non-standardized multi-page vendor documents and receipts with varying formats without manual human triage.',
    solution: 'Engineered an asynchronous pipeline combining multimodal vision models with deterministic JSON schema validators and automated fallback retries.',
    architectureDetails: [
      'Asynchronous task queues powered by Redis and Celery workers',
      'Dual-phase validation: Schema conformity verification + anomaly checking',
      'Comprehensive webhook notification system with exponential backoff'
    ]
  },
  {
    id: 'newta-portfolio-platform',
    title: 'Newta Portfolio Platform',
    category: 'Digital Product',
    shortDescription: 'AI-assisted portfolio creation engine providing dynamic themes, code sandbox embeds, and edge deployment.',
    image: '/src/assets/images/project_portfolio_builder_1790622906342.jpg',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Vite', 'Cloudflare Workers'],
    metrics: [
      { label: 'Build Generation', value: '< 15s' },
      { label: 'Lighthouse Score', value: '98/100' },
      { label: 'Edge Latency', value: '< 20ms' }
    ],
    challenge: 'Enabling non-technical developers and creatives to publish ultra-fast, customized portfolio sites without writing complex build scripts.',
    solution: 'Designed a block-based visual editor that compiles directly into optimized static markup distributed globally across edge networks.',
    architectureDetails: [
      'Static-site generation with on-demand incremental revalidation',
      'Dynamic OpenGraph image synthesis at edge nodes',
      'Zero-config domain binding with automatic SSL certification'
    ]
  },
  {
    id: 'ai-business-intelligence',
    title: 'Cognitive BI Analytics Suite',
    category: 'AI Solutions',
    shortDescription: 'Executive natural language query interface converting plain business queries into optimized SQL and interactive charts.',
    image: '/src/assets/images/hero_cybernetic_core_1790622869180.jpg',
    technologies: ['TypeScript', 'Python', 'PostgreSQL', 'LangChain', 'Tailwind CSS'],
    metrics: [
      { label: 'SQL Accuracy', value: '97.8%' },
      { label: 'Query Generation', value: '1.1s' },
      { label: 'Data Safety', value: 'Read-Only' }
    ],
    challenge: 'Allowing business stakeholders to query company databases in plain English without risk of SQL injection, data exposure, or hallucinated numbers.',
    solution: 'Constructed a sandboxed semantic translation engine with strict AST parsing, read-only transaction scopes, and automated query plan verification.',
    architectureDetails: [
      'Deterministic AST schema verification before query execution',
      'Role-based database user impersonation with query cost limits',
      'Interactive chart synthesis with client-side interactive exports'
    ]
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    summary: 'Understand the problem, audience, requirements, and goals.',
    description: 'We dig deep into the operational reality of your business. We interrogate assumptions, analyze user journeys, audit current infrastructure, and define measurable engineering objectives before writing a single line of code.',
    milestones: [
      'Stakeholder alignment & objective scoping',
      'Technical feasibility audit & API review',
      'User personas & critical journey mapping',
      'Target performance & security criteria'
    ],
    durationEstimate: 'Sprint 1'
  },
  {
    number: '02',
    title: 'Strategy',
    summary: 'Define product direction, features, technology, and execution plan.',
    description: 'We establish the architectural blueprint and delivery roadmap. We select the optimal technology stack, design the database schemas, plan the security boundaries, and prioritize features for a lean, high-impact release.',
    milestones: [
      'System architecture & database schema blueprint',
      'Technology stack selection & library audit',
      'Milestone breakdown & sprint schedule',
      'Risk mitigation & dependency planning'
    ],
    durationEstimate: 'Sprint 2'
  },
  {
    number: '03',
    title: 'Design',
    summary: 'Create the user experience, interface, architecture, and visual system.',
    description: 'We construct an ergonomic, high-craft user experience. From responsive layouts and interactive components to micro-animations and typography scales, every screen is tested for clarity and frictionless operation.',
    milestones: [
      'High-fidelity interactive prototype',
      'Design tokens & reusable component system',
      'Accessibility audit (WCAG AA compliance)',
      'Responsive mobile & desktop viewports'
    ],
    durationEstimate: 'Sprint 3–4'
  },
  {
    number: '04',
    title: 'Build',
    summary: 'Develop, integrate, test, and optimize the product.',
    description: 'Our senior engineers turn architectural designs into production software. We write clean, modular, strictly type-safe code with automated testing, CI/CD pipelines, and rigorous performance profiling.',
    milestones: [
      'Strict TypeScript & backend service implementation',
      'Database migrations & index tuning',
      'End-to-end integration & unit testing',
      'Sub-second latency & Core Web Vitals tuning'
    ],
    durationEstimate: 'Sprint 5–8'
  },
  {
    number: '05',
    title: 'Launch & Improve',
    summary: 'Deploy the product, collect feedback, analyze performance, and continuously improve it.',
    description: 'We coordinate zero-downtime deployment to production cloud infrastructure. Following launch, we monitor real-time telemetry, track user interactions, resolve edge-case exceptions, and iterate continuously.',
    milestones: [
      'Zero-downtime production deployment',
      'Real-time observability & error logging',
      'User engagement telemetry review',
      'Post-launch iteration & maintenance sprints'
    ],
    durationEstimate: 'Ongoing Sprint Cycles'
  }
];

export const TECH_ECOSYSTEM: TechItem[] = [
  { name: 'React 19', category: 'Frontend', role: 'Component architecture & Concurrent UI' },
  { name: 'TypeScript', category: 'Frontend', role: 'Strict end-to-end type safety' },
  { name: 'Next.js', category: 'Frontend', role: 'SSR, Edge caching & API routing' },
  { name: 'Tailwind CSS', category: 'Frontend', role: 'Performant, zero-runtime utility styling' },
  { name: 'Node.js', category: 'Backend & Data', role: 'High-concurrency microservices' },
  { name: 'Python', category: 'AI & Machine Intelligence', role: 'Machine learning pipelines & data processing' },
  { name: 'FastAPI', category: 'Backend & Data', role: 'High-speed asynchronous REST & WebSocket APIs' },
  { name: 'PostgreSQL', category: 'Backend & Data', role: 'Relational data store with JSONB & indexing' },
  { name: 'Supabase', category: 'Backend & Data', role: 'Managed PostgreSQL & realtime subscriptions' },
  { name: 'Firebase', category: 'Backend & Data', role: 'Real-time synchronization & authentication' },
  { name: 'Gemini 2.5 API', category: 'AI & Machine Intelligence', role: 'Multimodal reasoning & structured outputs' },
  { name: 'PyTorch', category: 'AI & Machine Intelligence', role: 'Deep learning & neural model experimentation' },
  { name: 'Docker', category: 'Cloud & Infra', role: 'Hermetic containerization' },
  { name: 'Cloudflare', category: 'Cloud & Infra', role: 'Edge routing, DDoS defense & CDN' },
  { name: 'GitHub Actions', category: 'Cloud & Infra', role: 'Automated CI/CD build & deployment test gates' },
  { name: 'GCP / AWS', category: 'Cloud & Infra', role: 'Scalable cloud infrastructure & storage' }
];

export const ABOUT_PILLARS = [
  {
    title: 'Engineering Rigor',
    description: 'We treat code as mission-critical infrastructure. Every application uses strict type contracts, modular architectures, and zero-compromise testing.'
  },
  {
    title: 'Practical AI Integration',
    description: 'We avoid gimmicks. Our AI implementations solve genuine business bottlenecks with deterministic fallbacks, fast latencies, and predictable costs.'
  },
  {
    title: 'Human-Centered Craft',
    description: 'Software should feel responsive and effortless. We balance aesthetic elegance with sub-150ms interaction budgets and accessible standards.'
  },
  {
    title: 'Built to Scale',
    description: 'Our solutions are architected from day one so that growing from your first 100 users to global operations requires zero structural rewrites.'
  }
];
