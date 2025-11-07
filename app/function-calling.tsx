// @ts-nocheck
import { OpenAI } from 'openai';
import { config } from './config';
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const client = new OpenAI({
    baseURL: config.nonOllamaBaseURL,
    apiKey: config.inferenceAPIKey
});
const MODEL = config.inferenceModel;

const api = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID as string,
    process.env.SPOTIFY_CLIENT_SECRET as string
);

export async function searchPlaces(query: string, location: string) {
    try {
        const response = await fetch('https://google.serper.dev/places', {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.SERPER_API,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: query, location: location }),
        });
        const data = await response.json();
        const normalizedData = {
            type: 'places',
            places: data.places.map(place => ({
                position: place.position,
                title: place.title,
                address: place.address,
                latitude: place.latitude,
                longitude: place.longitude,
                rating: place.rating,
                ratingCount: place.ratingCount,
                category: place.category,
                phoneNumber: place.phoneNumber,
                website: place.website,
                cid: place.cid
            }))
        };
        return JSON.stringify(normalizedData);
    } catch (error) {
        console.error('Error searching for places:', error);
        return JSON.stringify({ error: 'Failed to search for places' });
    }
}
export async function goShopping(message: string) {
    const url = 'https://google.serper.dev/shopping';
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'X-API-KEY': process.env.SERPER_API as string,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "q": message })
    };
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            console.error(`Failed to fetch ${url}. Status: ${response.status}`);
            return JSON.stringify({ error: 'Failed to fetch shopping data' });
        }
        const responseData = await response.json();
        const shoppingData = {
            type: 'shopping',
            shopping: responseData.shopping
        };
        return JSON.stringify(shoppingData);
    } catch (error) {
        console.error('Error fetching shopping data:', error);
        return JSON.stringify({ error: 'Failed to fetch shopping data' });
    }
}
export async function getTickers(ticker: string) {
    // Normalize ticker format: ensure it's in EXCHANGE:SYMBOL format
    const normalizedTicker = ticker.trim().toUpperCase();
    
    // Validate ticker format (should contain exchange prefix like NYSE:, NASDAQ:, etc.)
    if (!normalizedTicker.includes(':')) {
        // If no exchange prefix, try to infer or use default format
        // For now, we'll return as-is but log a warning
        console.warn(`Ticker "${ticker}" may be missing exchange prefix (e.g., NYSE:, NASDAQ:)`);
    }
    
    return JSON.stringify({ type: 'ticker', data: normalizedTicker });
}
export async function searchSong(query: string): Promise<string> {
    const items = await api.search(query, ["track"]);
    const track = items.tracks.items[0];
    if (track) {
        const trackId = track.uri.replace('spotify:track:', '');
        return JSON.stringify({ trackId: trackId });
    } else {
        return JSON.stringify({ error: "No matching song found." });
    }
}
export async function functionCalling(query: string) {
    try {
        const messages = [
            { role: "system", content: "You are a function calling agent. You will be given a query and a list of functions. Your task is to call the appropriate function based on the query and return the result in JSON format. ONLY CALL A FUNCTION IF YOU ARE HIGHLY CONFIDENT IT WILL BE USED" },
            { role: "user", content: query },
        ];
        const tools = [
            {
                type: "function",
                function: {
                    name: "getTickers",
                    description: "Get a single market name and stock ticker if the user mentions a public company",
                    parameters: {
                        type: "object",
                        properties: {
                            ticker: {
                                type: "string",
                                description: "The stock ticker symbol and market name, example NYSE:K or NASDAQ:AAPL",
                            },
                        },
                        required: ["ticker"],
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "searchPlaces",
                    description: "ONLY SEARCH for places using the given query and location",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The search query for places",
                            },
                            location: {
                                type: "string",
                                description: "The location to search for places",
                            },
                        },
                        required: ["query", "location"],
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "goShopping",
                    description: "Search for shopping items using the given query",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The search query for shopping items",
                            },
                        },
                        required: ["query"],
                    },
                }
            },
            {
                type: "function",
                function: {
                    name: "searchSong",
                    description: "Searches for a song on Spotify based on the provided search query and returns the track ID.",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The search query to find a song on Spotify, such as the song title or artist name.",
                            },
                        },
                        required: ["query"],
                    },
                },
            },
        ];
        const response = await client.chat.completions.create({
            model: MODEL,
            messages: messages,
            tools: tools,
            tool_choice: "auto",
            max_tokens: 4096,
        });
        const responseMessage = response.choices[0].message;
        const toolCalls = responseMessage.tool_calls;
        if (toolCalls && toolCalls.length > 0) {
            const availableFunctions = {
                getTickers: getTickers,
                searchPlaces: searchPlaces,
                goShopping: goShopping,
                searchSong: searchSong,
            };
            messages.push(responseMessage);
            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionToCall = availableFunctions[functionName];
                
                if (!functionToCall) {
                    console.error(`Unknown function: ${functionName}`);
                    return { error: `Unknown function: ${functionName}` };
                }
                
                const functionArgs = JSON.parse(toolCall.function.arguments);
                let functionResponse;
                try {
                    if (functionName === 'getTickers') {
                        functionResponse = await functionToCall(functionArgs.ticker);
                    } else if (functionName === 'searchPlaces') {
                        functionResponse = await functionToCall(functionArgs.query, functionArgs.location);
                    } else if (functionName === 'goShopping') {
                        functionResponse = await functionToCall(functionArgs.query);
                    } else if (functionName === 'searchSong') {
                        functionResponse = await functionToCall(functionArgs.query);
                    }
                    
                    // Parse and return consistent object structure
                    const parsedResponse = JSON.parse(functionResponse);
                    return parsedResponse;
                } catch (error) {
                    console.error(`Error calling function ${functionName}:`, error);
                    return { error: `Failed to call function ${functionName}` };
                }
            }
        }
        // Return undefined when no tool calls are made (consistent with expected behavior)
        return undefined;
    } catch (error) {
        console.error('Error in functionCalling:', error);
        return { error: 'An error occurred during function calling' };
    }
}