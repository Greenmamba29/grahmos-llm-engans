# Tools Directory

This directory contains all the tools and utilities used by the LLM Answer Engine.

## Directory Structure

```
tools/
├── mentionFunctions/       # Custom mention tools (@mention functionality)
│   ├── streamChatCompletion.ts
│   ├── portKeyAIGateway.ts
│   ├── portKeyAIGatewayTogetherAI.ts
│   ├── falAiStableDiffusion3Medium.ts
│   └── structuredUnlockSummarize.ts
├── contentProcessing.tsx   # Content scraping and vectorization
├── generateRelevantQuestions.tsx  # Follow-up question generation
├── mentionToolConfig.tsx   # Configuration for mention tools
├── mentionTools.tsx        # Mention tool orchestration
├── rateLimiting.tsx        # Upstash rate limiting integration
├── searchProviders.tsx     # Search provider implementations (Brave, Serper, Google)
├── semanticCache.tsx       # Upstash semantic caching
└── streamingChatCompletion.tsx  # LLM streaming chat completion
```

## Core Modules

### Search Providers
- **Brave Search**: Privacy-focused search API
- **Serper API**: Google Search API wrapper
- **Google Custom Search**: Direct Google integration

### Content Processing
- Web scraping with Cheerio
- Text chunking and vectorization
- Similarity search with embeddings

### Caching & Rate Limiting
- Semantic caching with Upstash
- Redis-based rate limiting
- Configurable limits per user/IP

### Mention Tools
Custom functionality triggered by @mentions:
- **Stream Chat Completion**: Direct LLM streaming
- **Portkey AI Gateway**: Multi-model gateway access
- **Fal AI Stable Diffusion**: Image generation
- **Bright Data Web Scraper**: Advanced web scraping

## Configuration

All tools respect the configuration in `/app/config.tsx`:
- Search provider selection
- Model configuration
- Feature flags (function calling, rate limiting, semantic cache)
- RAG parameters (chunk size, similarity results, pages to scan)

## Usage

Import tools using absolute paths:
```typescript
import { getSearchResults } from '@/app/tools/searchProviders';
import { checkRateLimit } from '@/app/tools/rateLimiting';
import { lookupTool } from '@/app/tools/mentionTools';
```
