import axios from 'axios';
const server = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
axios.defaults.baseURL = server;
import {type TextBlockType } from '@myTypes/globalTypes';
async function runCode(block: TextBlockType, input?: string): Promise<string> {
    try {
        const response = await axios.post('/api/run', block);
        return response.data.output;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error running code");
    }
}
export { runCode };