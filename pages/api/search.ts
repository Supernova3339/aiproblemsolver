import {NextApiRequest, NextApiResponse} from 'next';
import openai from 'openai';
import {parse} from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method Not Allowed'});
    }

    const {searchQuery} = req.body;

    // Retrieve API key and model from cookies
    const cookies = parse(req.headers.cookie || '');
    const apiKey = cookies.openaiApiKey || null;
    const apiModel = cookies.openaiApiModel || 'gpt-3.5-turbo';

    // Trigger error if API key is null or undefined
    if (!apiKey || apiKey === 'null' || apiKey === 'undefined') {
        return res.status(400).json({error: 'API key is missing or invalid'});
    }

    // Trigger error if API model is null or undefined
    if (!apiModel || apiModel === 'null' || apiKey === 'undefined') {
        return res.status(400).json({error: 'API model is missing or invalid'});
    }

    if (!searchQuery) {
        return res.status(400).json({error: 'Missing searchQuery parameter'});
    }

    if (searchQuery.length > 200) {
        return res.status(400).json({error: 'Search exceeds 200 characters'});
    }

    try {
        const prompt = `Always format as markdown. Answer the following question: ${searchQuery}`;
        const openaiInstance = new openai.OpenAI({
            apiKey,
        });

        const completion = await openaiInstance.chat.completions.create({
            messages: [{role: 'system', content: prompt}],
            model: apiModel,
            stream: true,
        });

        let answer = '';

        for await (const chunk of completion) {
            answer += chunk.choices[0]?.delta?.content || "";
        }

        return res.status(200).json({answer});
    } catch (error: any) {
        console.error('Error calling OpenAI API:', error.message);
        return res.status(500).json({error: 'Error processing request'});
    }
}
