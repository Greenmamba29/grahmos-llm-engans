export async function grahmosWebflow(mentionTool: string, userMessage: string, streamable: any): Promise<void> {
    const WEBFLOW_API_KEY = process.env.WEBFLOW_API_KEY || '4ad349b8f15c0f11be17a513aa46fe834c7697c2c7ccbe6bbf117e0dbf3c8d48';
    const WEBFLOW_SITE_ID = process.env.WEBFLOW_SITE_ID || '690c15ada42ec08cfbdf7127';
    const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';

    try {
        // Parse user message to determine action
        const lowerMessage = userMessage.toLowerCase();
        
        // Initialize response
        let responseText = `# GrahmOS - Webflow Integration\n\n`;
        
        // Handle different types of requests
        if (lowerMessage.includes('list') || lowerMessage.includes('get') || lowerMessage.includes('show')) {
            // Check if user wants to list items from a collection
            const itemsMatch = lowerMessage.match(/items?\s+(?:from|in)\s+([a-zA-Z0-9\s-]+)/i);
            if (itemsMatch && (lowerMessage.includes('item') || lowerMessage.includes('items'))) {
                const collectionName = itemsMatch[1].trim();
                
                // First, get all collections to find the matching one
                const collectionsResponse = await fetch(`${WEBFLOW_API_BASE}/sites/${WEBFLOW_SITE_ID}/collections`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
                        'accept-version': '1.0.0',
                        'Content-Type': 'application/json'
                    }
                });

                if (collectionsResponse.ok) {
                    const collections = await collectionsResponse.json();
                    const matchingCollection = collections.find((col: any) => 
                        col.displayName?.toLowerCase().includes(collectionName.toLowerCase()) ||
                        col.name?.toLowerCase().includes(collectionName.toLowerCase()) ||
                        col.slug?.toLowerCase().includes(collectionName.toLowerCase())
                    );

                    if (matchingCollection) {
                        // Get items from the collection
                        const itemsResponse = await fetch(`${WEBFLOW_API_BASE}/collections/${matchingCollection.id}/items`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
                                'accept-version': '1.0.0',
                                'Content-Type': 'application/json'
                            }
                        });

                        if (itemsResponse.ok) {
                            const itemsData = await itemsResponse.json();
                            const items = itemsData.items || [];
                            responseText += `## Items from "${matchingCollection.displayName || matchingCollection.name}"\n\n`;
                            
                            if (items.length > 0) {
                                items.slice(0, 20).forEach((item: any, index: number) => {
                                    responseText += `${index + 1}. **Item ID**: \`${item.id}\`\n`;
                                    if (item.fieldData) {
                                        Object.entries(item.fieldData).forEach(([key, value]: [string, any]) => {
                                            if (value && typeof value === 'string' && value.length < 100) {
                                                responseText += `   - ${key}: ${value}\n`;
                                            }
                                        });
                                    }
                                    if (item.isDraft !== undefined) {
                                        responseText += `   - Status: ${item.isDraft ? 'Draft' : 'Published'}\n`;
                                    }
                                    responseText += `\n`;
                                });
                                if (items.length > 20) {
                                    responseText += `*Showing first 20 of ${items.length} items*\n\n`;
                                }
                            } else {
                                responseText += `No items found in this collection.\n\n`;
                            }
                        } else {
                            const error = await itemsResponse.text();
                            responseText += `Error fetching items: ${error}\n\n`;
                        }
                    } else {
                        responseText += `Collection "${collectionName}" not found. Use "list collections" to see available collections.\n\n`;
                    }
                } else {
                    const error = await collectionsResponse.text();
                    responseText += `Error fetching collections: ${error}\n\n`;
                }
            } else if (lowerMessage.includes('collection') || lowerMessage.includes('collections')) {
                // Get collections for the site
                const collectionsResponse = await fetch(`${WEBFLOW_API_BASE}/sites/${WEBFLOW_SITE_ID}/collections`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
                        'accept-version': '1.0.0',
                        'Content-Type': 'application/json'
                    }
                });

                if (collectionsResponse.ok) {
                    const collections = await collectionsResponse.json();
                    responseText += `## Collections\n\n`;
                    if (collections && collections.length > 0) {
                        collections.forEach((collection: any, index: number) => {
                            responseText += `${index + 1}. **${collection.displayName || collection.name}**\n`;
                            responseText += `   - ID: \`${collection.id}\`\n`;
                            responseText += `   - Slug: \`${collection.slug}\`\n`;
                            if (collection.singularName) {
                                responseText += `   - Singular Name: ${collection.singularName}\n`;
                            }
                            responseText += `\n`;
                        });
                    } else {
                        responseText += `No collections found.\n\n`;
                    }
                } else {
                    const error = await collectionsResponse.text();
                    responseText += `Error fetching collections: ${error}\n\n`;
                }
            } else if (lowerMessage.includes('site') || lowerMessage.includes('sites')) {
                // Get site information
                const siteResponse = await fetch(`${WEBFLOW_API_BASE}/sites/${WEBFLOW_SITE_ID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
                        'accept-version': '1.0.0',
                        'Content-Type': 'application/json'
                    }
                });

                if (siteResponse.ok) {
                    const site = await siteResponse.json();
                    responseText += `## Site Information\n\n`;
                    responseText += `- **Name**: ${site.displayName || site.name}\n`;
                    responseText += `- **ID**: \`${site.id}\`\n`;
                    responseText += `- **Short Name**: ${site.shortName || 'N/A'}\n`;
                    if (site.lastPublished) {
                        responseText += `- **Last Published**: ${new Date(site.lastPublished).toLocaleString()}\n`;
                    }
                    responseText += `\n`;
                } else {
                    const error = await siteResponse.text();
                    responseText += `Error fetching site: ${error}\n\n`;
                }
            } else {
                // Default: Get site info
                const siteResponse = await fetch(`${WEBFLOW_API_BASE}/sites/${WEBFLOW_SITE_ID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
                        'accept-version': '1.0.0',
                        'Content-Type': 'application/json'
                    }
                });

                if (siteResponse.ok) {
                    const site = await siteResponse.json();
                    responseText += `## Site Information\n\n`;
                    responseText += `- **Name**: ${site.displayName || site.name}\n`;
                    responseText += `- **ID**: \`${site.id}\`\n`;
                    responseText += `- **Short Name**: ${site.shortName || 'N/A'}\n`;
                    if (site.lastPublished) {
                        responseText += `- **Last Published**: ${new Date(site.lastPublished).toLocaleString()}\n`;
                    }
                    responseText += `\n`;
                } else {
                    const error = await siteResponse.text();
                    responseText += `Error fetching site: ${error}\n\n`;
                }
            }
        } else {
            // Default response with available commands
            responseText += `## Available Commands\n\n`;
            responseText += `- **List Collections**: Ask to "list collections" or "get collections"\n`;
            responseText += `- **Get Site Info**: Ask to "get site info" or "show site information"\n`;
            responseText += `- **List Items**: Ask to "list items from [collection name]"\n\n`;
            responseText += `## Site ID\n\`${WEBFLOW_SITE_ID}\`\n\n`;
            responseText += `*GrahmOS is ready to interact with your Webflow site.*\n\n`;
        }

        // Stream the response
        const words = responseText.split(' ');
        for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? '' : ' ') + words[i];
            streamable.update({ 'llmResponse': chunk });
            // Small delay for streaming effect
            await new Promise(resolve => setTimeout(resolve, 20));
        }

        streamable.done({ 'llmResponseEnd': true });
    } catch (error: any) {
        const errorMessage = `Error in GrahmOS Webflow: ${error.message || 'Unknown error'}\n\n`;
        streamable.update({ 'llmResponse': errorMessage });
        streamable.done({ 'llmResponseEnd': true });
    }

    return;
}
