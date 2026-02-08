import axios from 'axios';
const server = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
axios.defaults.baseURL = server;
async function runCode(code: string, language: string, input?: string): Promise<string> {
    try {
        const response = await axios.post('/api/run', {
            code,
            language,
            input
        });
        return response.data.output;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error running code");
    }
}
export { runCode };