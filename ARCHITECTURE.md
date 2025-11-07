# Grahmos LLM Answer Engine - Architecture

## Project Overview

Grahmos is a Perplexity-inspired LLM answer engine built with Next.js, leveraging multiple AI providers and search APIs to deliver comprehensive, source-backed answers with streaming responses.

## Technology Stack

### Core Framework
- **Next.js 14.1.2** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety

### AI & LLM
- **Groq** - Fast inference (Mixtral, Llama models)
- **OpenAI** - Embeddings and GPT models
- **Langchain.js** - Text processing and RAG
- **Vercel AI SDK** - Streaming responses
- **Portkey AI** - Multi-model gateway (optional)

### Search & Data
- **Brave Search API** - Privacy-focused search
- **Serper API** - Google search wrapper
- **Cheerio** - HTML parsing
- **Spotify API** - Music integration
- **Serper Places** - Location data

### Caching & Performance
- **Upstash Redis** - Rate limiting
- **Upstash Semantic Cache** - Response caching
- **Upstash Vector** - Vector storage

### UI Components
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Shadcn/ui** - Component library
- **React Markdown** - Response rendering
- **Recharts** - Data visualization
- **Leaflet** - Maps integration

## Project Structure

```
/workspace/
├── app/                      # Next.js app directory
│   ├── action.tsx           # Server actions (main orchestrator)
│   ├── config.tsx           # Global configuration
│   ├── function-calling.tsx # Dynamic UI functions (maps, shopping, etc.)
│   ├── page.tsx             # Main chat interface
│   ├── layout.tsx           # Root layout
│   └── tools/               # Core functionality modules
│       ├── contentProcessing.tsx
│       ├── searchProviders.tsx
│       ├── streamingChatCompletion.tsx
│       ├── generateRelevantQuestions.tsx
│       ├── semanticCache.tsx
│       ├── rateLimiting.tsx
│       ├── mentionTools.tsx
│       ├── mentionToolConfig.tsx
│       └── mentionFunctions/
├── components/              # React components
│   ├── answer/             # Answer display components
│   │   ├── LLMResponseComponent.tsx
│   │   ├── SearchResultsComponent.tsx
│   │   ├── FollowUpComponent.tsx
│   │   ├── Map.tsx
│   │   ├── ShoppingComponent.tsx
│   │   ├── FinancialChart.tsx
│   │   └── ...
│   ├── ui/                 # Shadcn/ui components
│   ├── header.tsx
│   └── providers.tsx
├── lib/                    # Utilities and types
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── constants/         # Constants and enums
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── index.tsx
│   │   └── tool-definition.ts
│   └── hooks/             # React hooks
│       ├── use-at-bottom.tsx
│       ├── use-enter-submit.tsx
│       └── chat-scroll-anchor.tsx
└── express-api/           # Optional Express backend

```

## Data Flow

### 1. User Input
```
User enters query → page.tsx → handleUserMessageSubmission()
```

### 2. Server Action Processing
```
myAction() in action.tsx:
├── checkRateLimit()
├── initializeSemanticCache()
├── getFromSemanticCache() [if cached, return]
├── lookupTool() [if @mention used]
└── Parallel execution:
    ├── getImages()
    ├── getSearchResults()
    ├── getVideos()
    └── functionCalling()
```

### 3. Content Processing
```
get10BlueLinksContents() → scrape web pages
└── processAndVectorizeContent() → create embeddings
    └── similarity search against query
```

### 4. LLM Streaming
```
streamingChatCompletion():
├── Build context from vectorized content
├── Stream tokens from LLM
└── Update streamable value
```

### 5. Follow-up Questions
```
relevantQuestions() → generate 3 follow-up questions
└── Cache complete response
```

## Key Features

### 1. Semantic Search
- Vector embeddings for content similarity
- RAG (Retrieval Augmented Generation)
- Configurable chunk size and overlap

### 2. Function Calling (Beta)
Dynamic UI components based on query:
- **Maps** - Location searches
- **Shopping** - Product searches
- **Financial Charts** - Stock data (TradingView)
- **Spotify** - Music player integration

### 3. @Mention Tools
Special functionality via @mentions:
- `@portkey` - AI Gateway access
- `@fal-ai` - Image generation
- `@bright-data` - Web scraping
- Custom tools configurable in `mentionToolConfig.tsx`

### 4. Multi-Provider Support
- **Search**: Brave, Serper, Google
- **LLM**: Groq, OpenAI, Ollama (partial)
- **Embeddings**: OpenAI, Ollama

### 5. Performance Optimizations
- Semantic caching (Upstash)
- Rate limiting (Upstash Redis)
- Parallel API calls
- Streaming responses

## Configuration

See `app/config.tsx` for all configurable options:

```typescript
{
  useOllamaInference: false,      // Use local Ollama
  searchProvider: 'serper',       // brave|serper|google
  inferenceModel: 'llama-3.1-70b-versatile',
  embeddingsModel: 'text-embedding-3-small',
  textChunkSize: 800,
  textChunkOverlap: 200,
  numberOfSimilarityResults: 4,
  numberOfPagesToScan: 10,
  useFunctionCalling: true,       // Enable dynamic UI
  useRateLimiting: false,         // Upstash rate limits
  useSemanticCache: false,        // Upstash caching
  usePortkey: false               // AI Gateway
}
```

## Environment Variables

Required:
```bash
GROQ_API_KEY=          # Groq API key
BRAVE_SEARCH_API_KEY=  # Brave Search API
SERPER_API=            # Serper API key
OPENAI_API_KEY=        # OpenAI API (for embeddings)
```

Optional:
```bash
UPSTASH_REDIS_REST_URL=       # Rate limiting
UPSTASH_REDIS_REST_TOKEN=     # Rate limiting
UPSTASH_VECTOR_REST_URL=      # Semantic cache
UPSTASH_VECTOR_REST_TOKEN=    # Semantic cache
PORTKEY_API_KEY=              # AI Gateway
FAL_KEY=                      # Image generation
SPOTIFY_CLIENT_ID=            # Spotify integration
SPOTIFY_CLIENT_SECRET=        # Spotify integration
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker-compose up -d
```

### Local Development
```bash
npm install
npm run dev
```

## Recent Structural Improvements

1. **Centralized Types** - All TypeScript interfaces moved to `lib/types/`
2. **Consistent Imports** - Standardized to use `@/` prefix for absolute imports
3. **Constants Extraction** - Magic strings moved to `lib/constants/`
4. **Documentation** - Added README files for major directories
5. **Removed Empty Directories** - Cleaned up `llm-answer-engine/` folder

## Future Enhancements

- [ ] Document upload + RAG for document search
- [ ] Settings UI for runtime configuration
- [ ] Full Ollama support with follow-up questions
- [ ] Additional function calling capabilities
- [ ] Enhanced semantic caching strategies
