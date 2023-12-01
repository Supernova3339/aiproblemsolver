// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from 'next';
import openai from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { searchQuery } = req.body;

    if (!searchQuery) {
        return res.status(400).json({ error: 'Missing searchQuery parameter' });
    }

    try {
        const prompt = `Your response must be formatted as markdown. Answer the following question: ${searchQuery}`;
        const openaiInstance = new openai.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openaiInstance.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        });

        const answer = completion.choices[0]?.message?.content || 'No response from OpenAI';

        if (answer.length > 200) {
            return res.status(400).json({ error: 'Response exceeds 200 characters' });
        }

        return res.status(200).json({ answer });
    } catch (error: any) {
        console.error('Error calling OpenAI API:', error.message);
        return res.status(500).json({ error: 'Error processing request' });
    }
}
