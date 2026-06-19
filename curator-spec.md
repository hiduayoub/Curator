# Project Overview: Curator

You are acting as a Staff-Level Full-Stack Engineer and Lead Product Designer. We are building **Curator**, a premium, self-hosted cross-platform content aggregator. Its purpose is to ingest chaotic saved content from various social media APIs (YouTube, X/Twitter, Reddit, GitHub) and normalize them into a beautiful, lightning-fast, highly structured user interface.

Our primary goal is to build a top-tier open-source repository. The code must be flawless, strictly typed, fully documented, and the UI must mirror the pristine, hyper-minimalist design standards of Apple or Google.

## Tech Stack

- **Frontend & API:** Next.js (App Router) with TypeScript.
- **Styling:** Tailwind CSS (focus on negative space, absolute minimal borders, perfect typography).
- **Database:** PostgreSQL (using Prisma or Drizzle ORM).
- **Queue/Background Jobs:** Redis + BullMQ (for asynchronous API fetching and data normalization).
- **Components:** Radix UI primitives or similar headless libraries (hyper-accessible, keyboard-first).

## Core Architectural Rules

1.  **Data Normalization Engine:** Social media APIs return wild, varying payloads. The core of this system is a strict TypeScript interface (`UnifiedContentModel`) that all incoming data is parsed and mapped into.
2.  **Asynchronous Ingestion:** Saving a link must never block the UI. The client sends a URL/ID, the backend queues a Redis job, returns a 200 OK, and a background worker handles the API fetching and parsing.
3.  **Client Hydration:** The frontend should update asynchronously once the background job completes, replacing a skeleton loader with the parsed media card.
4.  **Design System:** Avoid heavy borders, bright chaotic colors, and visual clutter. Use subtle gray scales, deep blacks for text, and rely on spacing and typography to establish visual hierarchy.

## Execution Plan

Do not build the entire application at once. We will execute this in strict phases. Wait for my approval before moving to the next phase.

### Phase 1: Project Scaffolding & Configuration

- Initialize the Next.js application with TypeScript and Tailwind CSS.
- Set up absolute imports, strict TypeScript compiler options, and ESLint/Prettier with aggressive rules.
- Configure the database ORM and connect it to a local PostgreSQL instance.
- Initialize a `docker-compose.yml` file with PostgreSQL and Redis images for local development.

### Phase 2: The Database & Normalization Schema

- Design a scalable database schema to handle polymorphic relationships. We need a `User`, `Folder/Tag`, and a `SavedItem` model.
- Define the `UnifiedContentModel` in TypeScript. This model must be capable of representing a tweet, a YouTube video (with thumbnail), a GitHub repo, or a text-based Reddit post.
- Write the migration scripts.

### Phase 3: The Background Queue Engine

- Implement the Redis-backed queue system using BullMQ.
- Create the worker function that accepts a raw URL, identifies the platform, and simulates fetching and normalizing the data (we will use mock adapter functions for now before hitting real APIs).
- Implement error handling for rate limits and failed fetches.

### Phase 4: API Routes & Webhooks

- Build the ingestion API endpoint (`POST /api/save`).
- Implement the logic to push jobs to the Redis queue and immediately return a success response to the client.

### Phase 5: The Premium Frontend & UI

- Build the main dashboard layout. Implement a keyboard-first `Ctrl+K` command palette for instant filtering and navigation.
- Build the responsive masonry/grid layout for the content cards.
- Implement skeleton loaders that exactly match the dimensions of the expected content cards.
- Ensure the UI scales flawlessly across different monitor densities.

**Your First Task:**
Acknowledge these instructions. Then, proceed to execute **Phase 1** and output the necessary terminal commands and file structures. Ask me to verify the scaffolding before moving to Phase 2.
