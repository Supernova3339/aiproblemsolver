import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { parse } from 'cookie';
import formidable from 'formidable';
import fs from 'fs/promises';

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
    console.log('Parsing form data...');
    const form = formidable({
        maxFileSize: 10 * 1024 * 1024, // 10 MB
        multiples: true,
    });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                reject(err);
            }
            console.log('Form data parsed successfully.');
            resolve({ fields, files });
        });
    });
};

const readFileContent = async (path: string): Promise<string> => {
    console.log(`Reading file content from: ${path}`);
    try {
        const content = await fs.readFile(path, 'utf-8');
        console.log(`File content read successfully: ${path}`);
        return content;
    } catch (error) {
        console.error(`Error reading file at ${path}:`, error);
        return '';
    }
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
    console.log('Request received:', { method: req.method, headers: req.headers });

    if (req.method !== 'POST') {
        console.error('Invalid request method:', req.method);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        console.log('Parsing cookies...');
        const cookies = parse(req.headers.cookie || '');
        const apiKey = cookies.openaiApiKey || null;
        const apiModel = cookies.openaiApiModel || 'gpt-4-turbo-preview';

        console.log('Parsed cookies:', { apiKey, apiModel });

        if (!apiKey || apiKey === 'null' || apiKey === 'undefined') {
            console.error('Missing or invalid API key.');
            return res.status(400).json({ error: 'API key is missing or invalid' });
        }

        console.log('Parsing form data...');
        const { fields, files }: any = await parseForm(req);
        console.log('Parsed fields:', fields);
        console.log('Parsed files:', files);

        const { message, history } = fields;

        if (!message) {
            console.error('Missing message in request.');
            return res.status(400).json({ error: 'Missing message' });
        }

        if (message.length > 4000) {
            console.error('Message exceeds maximum allowed length.');
            return res.status(400).json({ error: 'Message exceeds 4000 characters' });
        }

        console.log('Initializing OpenAI instance...');
        const openaiInstance = new OpenAI({
            apiKey,
        });

        let messages: Message[] = [
            {
                role: 'system',
                content: systemPrompt,
            },
        ];

        try {
            if (history) {
                console.log('Parsing conversation history...');
                const parsedHistory = JSON.parse(history);
                messages = messages.concat(parsedHistory.map((msg: any) => ({
                    role: msg.role,
                    content: msg.content,
                })));
                console.log('Parsed conversation history:', parsedHistory);
            }
        } catch (error) {
            console.error('Error parsing conversation history:', error);
        }

        messages.push({
            role: 'user',
            content: message[0],
        });

        if (files.files) {
            console.log('Processing uploaded files...');
            const fileList = Array.isArray(files.files) ? files.files : [files.files];
            let fileContents = '';

            for (const file of fileList) {
                console.log(`Reading file: ${file.originalFilename}`);
                const content = await readFileContent(file.filepath);
                fileContents += `\nFile: ${file.originalFilename}\n\`\`\`\n${content}\n\`\`\`\n`;
            }

            if (fileContents) {
                messages.push({
                    role: 'user',
                    content: `Here are the file contents:${fileContents}`,
                });
                console.log('File contents added to messages.');
            }
        }

        console.log('Sending messages to OpenAI API:', messages);
        const completion = await openaiInstance.chat.completions.create({
            messages,
            model: apiModel,
            temperature: 0.7,
            stream: true,
            max_tokens: 4000,
        });

        console.log('Processing OpenAI response...');
        let answer = '';
        for await (const chunk of completion) {
            if (chunk.choices[0]?.delta?.content) {
                answer += chunk.choices[0].delta.content;
            }
        }

        console.log('OpenAI response processed successfully.');

        if (files.files) {
            console.log('Cleaning up uploaded files...');
            const fileList = Array.isArray(files.files) ? files.files : [files.files];
            for (const file of fileList) {
                await fs.unlink(file.filepath).catch((err) => console.error('Error deleting file:', err));
            }
            console.log('Uploaded files cleaned up.');
        }

        console.log('Responding with answer:', answer);
        return res.status(200).json({ answer });
    } catch (error: any) {
        console.error('Error processing request:', error);
        return res.status(500).json({
            error: 'Error processing request',
            details: error.message,
        });
    }
}