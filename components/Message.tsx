import Markdown from 'react-markdown';
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {prism} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeStringify from "rehype-stringify";
import {toast} from "@/hooks/use-toast";

interface MessageProps {
    response: string;
    onClear: () => void;
}

const Message: React.FC<MessageProps> = ({response, onClear}) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(response);
            toast({
                title: "Copied",
                description: "The response has been copied to your clipboard",
                variant: "success",
            })
        } catch (err) {
            toast({
                title: "Error",
                description: "Unable to copy text",
                variant: "destructive",
            })
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="mt-4 text-gray-800 dark:text-white">
            <Card className=" p-4 rounded-md my-4 flex items-center">
                <CardContent>
                    <Markdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex, rehypeStringify]}
                        components={{
                            code({node, inline, className, children, ...props}: any) {
                                const match = /language-(\w+)/.exec(className || '');

                                return !inline && match ? (
                                    <SyntaxHighlighter style={prism} PreTag="div" language={match[1]} {...props}>
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {response}
                    </Markdown>
                </CardContent>
            </Card>
            <div className="space-y-4">
                <Button className="flex content-center w-full" onClick={handleCopy}>Copy Result</Button>
                <Button className="flex content-center w-full" onClick={onClear}>Clear Search</Button>
            </div>
        </div>
    );
};

export default Message;