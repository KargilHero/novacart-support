# NovaCart AI Support Agent

A production-grade AI customer support refund agent built with Next.js 15, LangGraph, and the Vercel AI SDK.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│        Next.js 15 App Router           │
│  (Landing, Chat, Admin Dashboard)      │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│    SSE Streaming / API Routes           │
│  - /api/chat (streaming responses)      │
│  - /api/agent/process (execution)       │
│  - /api/admin/* (analytics)             │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│   Agent Orchestration (LangGraph)       │
│  - State machine for decisions          │
│  - Tool invocation + logging            │
│  - Structured reasoning                 │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│    Modular Tools & Services             │
│  - Customer lookup                      │
│  - Order validation                     │
│  - Policy matching                      │
│  - Fraud detection                      │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│    Data Layer (SQLite + Prisma)        │
│  - Conversations                        │
│  - Execution logs                       │
│  - Mock CRM (Customers, Orders)         │
└─────────────────────────────────────────┘
```

## Features

✅ **Real-time Agent Execution** - SSE streaming of tool calls and decisions
✅ **Conversation Persistence** - SQLite + Prisma for storing chat history
✅ **Admin Dashboard** - Live execution timeline, metrics, and conversation replay
✅ **Intelligent Retry Logic** - Recoverable failures trigger automatic retries
✅ **Policy Engine** - 12+ refund policy rules with extensible architecture
✅ **Mock CRM** - 15 realistic customer profiles with order history
✅ **Production UX** - Streaming responses, typing animations, error boundaries
✅ **Type-Safe** - 100% TypeScript with no `any` types

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+
- **AI/LLM**: Vercel AI SDK + OpenAI
- **Agent**: LangGraph
- **Database**: SQLite + Prisma ORM
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Streaming**: Server-Sent Events (SSE)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/KargilHero/novacart-support.git
cd novacart-support

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your OpenAI API key

# Initialize database
npx prisma db push
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
novacart-support/
├── app/                    # Next.js App Router
│   ├── (landing)/         # Landing page
│   ├── chat/              # Chat interface
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── chat/              # Chat UI components
│   ├── admin/             # Admin dashboard components
│   ├── landing/           # Landing page components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities
│   ├── llm/               # LLM provider abstraction
│   ├── utils.ts           # Helper functions
│   └── constants.ts       # App constants
├── hooks/                 # React hooks
├── services/              # Business logic
├── agents/                # Agent orchestration
│   └── tools/             # Agent tools
├── types/                 # TypeScript types
├── data/                  # Mock data
├── prisma/                # Database schema
└── config/                # Configuration
```

## Phase 1: Complete ✅

- ✅ TypeScript configuration
- ✅ TailwindCSS setup
- ✅ Type definitions (Agent, Customer, Order, Product, Policy)
- ✅ Mock data (15 customers, 20 products, dynamic orders)
- ✅ Refund policy rules (12 rules)
- ✅ Utility functions
- ✅ Project structure

## Next Steps

**Phase 2**: Agent orchestration with LangGraph, tool definitions, and SSE streaming
**Phase 3**: Chat API with Vercel AI SDK
**Phase 4**: Landing page
**Phase 5**: Admin dashboard
**Phase 6**: Polish and edge cases

## License

MIT
