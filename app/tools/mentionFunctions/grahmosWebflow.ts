const WEBFLOW_API_KEY = process.env.WEBFLOW_API_KEY || '4ad349b8f15c0f11be17a513aa46fe834c7697c2c7ccbe6bbf117e0dbf3c8d48';
const WEBFLOW_SITE_ID = process.env.WEBFLOW_SITE_ID || '690c15ada42ec08cfbdf7127';
const WEBFLOW_API_BASE_URL = 'https://api.webflow.com/v2';

interface WebflowCollection {
    id: string;
    displayName: string;
    singularName: string;
    slug: string;
}

interface WebflowCMSItem {
    id: string;
    cmsLocaleId: string;
    lastPublished: string;
    lastUpdated: string;
    createdOn: string;
    isArchived: boolean;
    isDraft: boolean;
    fieldData: Record<string, any>;
}

async function fetchWebflowAPI(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const url = `${WEBFLOW_API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
        'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
        'accept-version': '2.0.0',
        'Content-Type': 'application/json',
    };

    const options: RequestInit = {
        method,
        headers,
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Webflow API Error:', error);
        throw error;
    }
}

async function getSiteInfo(): Promise<any> {
    return await fetchWebflowAPI(`/sites/${WEBFLOW_SITE_ID}`);
}

async function getCollections(): Promise<{ collections: WebflowCollection[] }> {
    return await fetchWebflowAPI(`/sites/${WEBFLOW_SITE_ID}/collections`);
}

async function getCollectionItems(collectionId: string): Promise<{ items: WebflowCMSItem[] }> {
    return await fetchWebflowAPI(`/collections/${collectionId}/items`);
}

async function searchCollectionItems(collectionId: string, query: string): Promise<{ items: WebflowCMSItem[] }> {
    // Webflow API doesn't have a direct search endpoint, so we'll get all items and filter
    const result = await getCollectionItems(collectionId);
    const searchLower = query.toLowerCase();
    const filteredItems = result.items.filter(item => {
        const fieldDataStr = JSON.stringify(item.fieldData).toLowerCase();
        return fieldDataStr.includes(searchLower);
    });
    return { items: filteredItems };
}

export async function grahmosWebflow(mentionTool: string, userMessage: string, streamable: any): Promise<void> {
    try {
        let responseText = '';
        
        // Parse user message to understand what they want
        const messageLower = userMessage.toLowerCase();
        
        // Get site information
        const siteInfo = await getSiteInfo();
        responseText += `# GrahmOS Webflow Integration\n\n`;
        responseText += `**Site:** ${siteInfo.displayName || siteInfo.name}\n`;
        responseText += `**Site ID:** ${siteInfo.id}\n`;
        responseText += `**Short Name:** ${siteInfo.shortName}\n`;
        responseText += `**Last Published:** ${siteInfo.lastPublished || 'Not published'}\n\n`;

        // Get collections
        const collectionsResult = await getCollections();
        responseText += `## Collections (${collectionsResult.collections.length})\n\n`;
        
        if (collectionsResult.collections.length > 0) {
            for (const collection of collectionsResult.collections.slice(0, 10)) {
                responseText += `- **${collection.displayName}** (${collection.singularName})\n`;
                responseText += `  - ID: \`${collection.id}\`\n`;
                responseText += `  - Slug: \`${collection.slug}\`\n`;
                
                // Check if user wants details about this collection
                if (messageLower.includes(collection.displayName.toLowerCase()) || 
                    messageLower.includes(collection.singularName.toLowerCase()) ||
                    messageLower.includes(collection.slug.toLowerCase())) {
                    
                    const itemsResult = await getCollectionItems(collection.id);
                    responseText += `  - Items: ${itemsResult.items.length}\n`;
                    
                    if (itemsResult.items.length > 0) {
                        responseText += `  - Sample Items:\n`;
                        for (const item of itemsResult.items.slice(0, 5)) {
                            responseText += `    - ${item.id}\n`;
                            if (item.fieldData && Object.keys(item.fieldData).length > 0) {
                                const fields = Object.entries(item.fieldData).slice(0, 3);
                                fields.forEach(([key, value]) => {
                                    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
                                    responseText += `      - ${key}: ${valueStr.substring(0, 50)}${valueStr.length > 50 ? '...' : ''}\n`;
                                });
                            }
                        }
                    }
                }
                responseText += `\n`;
            }
        } else {
            responseText += `No collections found.\n\n`;
        }

        // Check if user wants to search for specific items
        if (messageLower.includes('search') || messageLower.includes('find') || messageLower.includes('items')) {
            responseText += `## Searching Collections\n\n`;
            
            // Extract search query from user message
            const searchMatch = userMessage.match(/(?:search|find|items?)\s+(?:for\s+)?(.+)/i);
            const searchQuery = searchMatch ? searchMatch[1].trim() : userMessage;
            
            for (const collection of collectionsResult.collections.slice(0, 5)) {
                const searchResult = await searchCollectionItems(collection.id, searchQuery);
                if (searchResult.items.length > 0) {
                    responseText += `### Found ${searchResult.items.length} items in "${collection.displayName}":\n\n`;
                    for (const item of searchResult.items.slice(0, 10)) {
                        responseText += `- **Item ID:** \`${item.id}\`\n`;
                        if (item.fieldData) {
                            Object.entries(item.fieldData).forEach(([key, value]) => {
                                const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
                                responseText += `  - ${key}: ${valueStr}\n`;
                            });
                        }
                        responseText += `\n`;
                    }
                }
            }
        }

        responseText += `\n---\n`;
        responseText += `*Powered by GrahmOS Webflow Integration*\n`;

        // Stream the response
        const chunks = responseText.split('\n');
        for (const chunk of chunks) {
            streamable.update({ 'llmResponse': chunk + '\n' });
            // Small delay to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        streamable.done({ 'llmResponseEnd': true });
    } catch (error: any) {
        const errorMessage = `Error accessing Webflow API: ${error.message}`;
        streamable.update({ 'llmResponse': errorMessage });
        streamable.done({ 'llmResponseEnd': true });
    }
    
    return;
}
