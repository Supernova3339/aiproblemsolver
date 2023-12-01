import Markdown from 'react-markdown';
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";

interface MessageProps {
    response: string;
    onClear: () => void;
}

const Message: React.FC<MessageProps> = ({response, onClear}) => {
    return (
        <div className="mt-4 text-gray-800 dark:text-white">
            <Card className=" p-4 rounded-md my-4 flex items-center">
                <CardContent>
                    <Markdown>{response}</Markdown>
                </CardContent>
            </Card>
            <Button className="flex content-center" onClick={onClear}>Clear Search</Button>
        </div>
    );
};

export default Message;
