import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { parse } from 'cookie';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const parseForm = async (req: NextApiRequest) => {
    const form = formidable({
        maxFileSize: 10 * 1024 * 1024, // 10 MB
        multiples: true,
    });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
            }
            resolve({ fields, files });
        });
    });
};

const systemPrompt = `You are an AI problem solver assistant. Your role is to:
1. Carefully analyze the user's question and any provided context
2. Break down complex problems into manageable steps
3. Provide clear, actionable solutions
4. Include relevant code examples when appropriate
5. Consider edge cases and potential issues
6. Explain your reasoning clearly

If code files are provided:
1. Analyze the code structure and purpose
2. Identify potential improvements or issues
3. Consider security implications
4. Suggest optimizations and best practices

Format your response in markdown with clear sections:
- Analysis (if applicable)
- Solution
- Implementation Steps (if applicable)
- Code Examples (if applicable)
- Additional Considerations

Always aim to be thorough yet concise, and focus on practical, implementable solutions.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const cookies = parse(req.headers.cookie || '');
        const apiKey = cookies.openaiApiKey || null;
        const apiModel = cookies.openaiApiModel || 'gpt-4-turbo-preview';

        if (!apiKey || apiKey === 'null' || apiKey === 'undefined') {
            return res.status(400).json({ error: 'API key is missing or invalid' });
        }

        const { fields, files }: any = await parseForm(req);
        const { message, history } = fields;

        if (!message) {
            return res.status(400).json({ error: 'Missing message' });
        }

        if (message.length > 4000) {
            return res.status(400).json({ error: 'Message exceeds 4000 characters' });
        }

        const openaiInstance = new OpenAI({
            apiKey,
        });

        let messages: Message[] = [
            { role: 'system', content: systemPrompt },
        ];

        if (history) {
            try {
                const parsedHistory = JSON.parse(history);
                messages = messages.concat(parsedHistory.map((msg: any) => ({
                    role: msg.role,
                    content: msg.content,
                })));
            } catch (error) {
                console.error('Error parsing conversation history:', error);
            }
        }

        messages.push({ role: 'user', content: message[0] });

        if (files.files) {
            let fileContents = '';
            const fileList = Array.isArray(files.files) ? files.files : [files.files];

            for (const file of fileList) {
                fileContents += `\nFile: ${file.originalFilename}\n\`\`\`\n${file.filepath}\n\`\`\`\n`;
            }

            if (fileContents) {
                messages.push({
                    role: 'user',
                    content: `Here are the file contents:${fileContents}`,
                });
            }
        }

        const completion = await openaiInstance.chat.completions.create({
            messages,
            model: apiModel,
            temperature: 0.7,
            stream: true,
            max_tokens: 4000,
        });

        let answer = '';
        for await (const chunk of completion) {
            if (chunk.choices[0]?.delta?.content) {
                answer += chunk.choices[0].delta.content;
                res.write(chunk.choices[0].delta.content);
            }
        }

        res.end(); // End the stream after processing
    } catch (error: any) {
        console.error('Error processing request:', error);
        return res.status(500).json({
            error: 'Error processing request',
            details: error.message,
        });
    }
}
