import { NextRequest, NextResponse } from 'next/server';
import { createStreamableValue } from 'ai/rsc';
import { config } from '@/app/config';
import { functionCalling } from '@/app/function-calling';
import { getSearchResults, getImages, getVideos } from '@/app/tools/searchProviders';
import { get10BlueLinksContents, processAndVectorizeContent } from '@/app/tools/contentProcessing';
import { initializeSemanticCache, getFromSemanticCache, setInSemanticCache } from '@/app/tools/semanticCache';
import { relevantQuestions } from '@/app/tools/generateRelevantQuestions';
import { streamingChatCompletion } from '@/app/tools/streamingChatCompletion';
import { checkRateLimit } from '@/app/tools/rateLimiting';
import { lookupTool } from '@/app/tools/mentionTools';
import { STATUS } from '@/lib/constants';

// Configure for Edge Runtime
export const runtime = 'edge';

// CORS configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://grahmos.webflow.io',
  'https://www.grahmos.com',
  'https://grahmos.com',
  'http://localhost:3000', // Development
];

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];
    
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// Handle OPTIONS preflight request
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

// Main search endpoint
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  try {
    const body = await req.json();
    const { 
      query, 
      mentionTool = null, 
      logo = null, 
      file = '', 
      includeImages = true,
      includeVideos = true 
    } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400, headers }
      );
    }

    // Create encoder for streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Process search in background
    (async () => {
      try {
        // Check semantic cache
        await initializeSemanticCache();
        const cachedData = await getFromSemanticCache(query);
        
        if (cachedData) {
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'cached', 
              data: cachedData 
            })}\n\n`)
          );
          await writer.close();
          return;
        }

        // Handle mention tools
        if (mentionTool) {
          const streamable = createStreamableValue({});
          await lookupTool(mentionTool, query, streamable, file);
          // Send mention tool response
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'mention', 
              data: streamable.value 
            })}\n\n`)
          );
        }

        // Parallel fetch: images, sources, videos, function calling
        const [images, sources, videos, conditionalFunctionCallUI] = await Promise.all([
          includeImages ? getImages(query) : Promise.resolve([]),
          getSearchResults(query),
          includeVideos ? getVideos(query) : Promise.resolve([]),
          config.useFunctionCalling ? functionCalling(query) : Promise.resolve(null),
        ]);

        // Send initial results
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({
            type: 'results',
            searchResults: sources,
            images,
            videos,
            conditionalFunctionCallUI: config.useFunctionCalling ? conditionalFunctionCallUI : undefined
          })}\n\n`)
        );

        // Process content and generate response
        const html = await get10BlueLinksContents(sources);
        const vectorResults = await processAndVectorizeContent(html, query);
        
        // Create streamable for LLM response
        const streamable = createStreamableValue({});
        let accumulatedResponse = '';
        
        // Stream LLM tokens
        const llmResponse = await streamingChatCompletion(query, vectorResults, {
          update: (data: any) => {
            if (data.llmResponse) {
              accumulatedResponse += data.llmResponse;
              writer.write(
                encoder.encode(`data: ${JSON.stringify({
                  type: 'llmToken',
                  token: data.llmResponse
                })}\n\n`)
              );
            }
          },
          done: () => {}
        });

        accumulatedResponse = llmResponse;

        // Generate follow-up questions
        const followUp = await relevantQuestions(sources, query);
        
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({
            type: 'followUp',
            questions: followUp
          })}\n\n`)
        );

        // Cache the complete response
        await setInSemanticCache(query, {
          searchResults: sources,
          images,
          videos,
          conditionalFunctionCallUI: config.useFunctionCalling ? conditionalFunctionCallUI : undefined,
          llmResponse: accumulatedResponse,
          followUp,
          semanticCacheKey: query
        });

        // Send completion
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({
            type: 'complete',
            status: STATUS.DONE
          })}\n\n`)
        );

      } catch (error) {
        console.error('Search error:', error);
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`)
        );
      } finally {
        await writer.close();
      }
    })();

    // Return streaming response
    return new NextResponse(stream.readable, {
      headers: {
        ...headers,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500, headers }
    );
  }
}
