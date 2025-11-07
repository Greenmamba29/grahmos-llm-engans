import { mentionToolConfig } from '@/app/tools/mentionToolConfig';
// @mentionFunctions 
import { streamChatCompletion } from '@/app/tools/mentionFunctions/streamChatCompletion';
import { portKeyAIGateway } from '@/app/tools/mentionFunctions/portKeyAIGateway';
import { portKeyAIGatewayTogetherAI } from '@/app/tools/mentionFunctions/portKeyAIGatewayTogetherAI';
import { falAiStableDiffusion3Medium } from '@/app/tools/mentionFunctions/falAiStableDiffusion3Medium';
import { brightDataWebScraper } from '@/app/tools/mentionFunctions/structuredUnlockSummarize';

type MentionFunctions = {
    [key: string]: (mentionTool: string, userMessage: string, streamable: any) => Promise<void>;
};

export const mentionFunctions: MentionFunctions = {
    streamChatCompletion,
    portKeyAIGateway,
    portKeyAIGatewayTogetherAI,
    falAiStableDiffusion3Medium,
    brightDataWebScraper,
};

export async function lookupTool(mentionTool: string, userMessage: string, streamable: any, file?: string): Promise<void> {
    const toolInfo = mentionToolConfig.mentionTools.find(tool => tool.id === mentionTool);
    if (toolInfo) {
        if (file) {
            const decodedFile = await Buffer.from(file, 'base64').toString('utf-8').replace(/^data:image\/\w+;base64,/, '');
            await mentionFunctions[toolInfo.functionName](mentionTool, userMessage + "File Content: " + decodedFile, streamable);
        } else {
            await mentionFunctions[toolInfo.functionName](mentionTool, userMessage, streamable);
        }
    }
}