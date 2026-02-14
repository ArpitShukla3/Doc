import {type TextBlockType } from '@myTypes/globalTypes';
import { api } from './axios';
import useSocketStore from '@stores/socketStore';
async function runCode(block: TextBlockType, input?: string): Promise<void> {
    console.log("Running code with input:", (useSocketStore.getState() as { socketId: string }).socketId);
    try {
        if (!(useSocketStore.getState() as { socketId: string }).socketId) {
            throw new Error("WebSocket not connected");
        }
        await api.post('/api/run', block);
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error running code");
    }
}
export { runCode };