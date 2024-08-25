import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { parse, serialize } from 'cookie';

const ApiKeyModal = () => {
    const { onOpen } = useModal();
    const { isOpen, onClose, type } = useModal();
    const isApiModalOpen = isOpen && type === "api";
    const [isMounted, setIsMounted] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);
        // Retrieve API key from cookies when component mounts
        const cookies = parse(document.cookie);
        const savedApiKey = cookies.openaiApiKey || '';
        if (savedApiKey) {
            setApiKey(savedApiKey);
        } else {
            // Something can happen here if the API key is not present
        }
    }, [onOpen]);

    if (!isMounted) {
        return null;
    }

    const handleSave = () => {
        // Check API key is not null
        if (!apiKey) {
            toast({
                title: "API Key Required",
                description: "Please enter a valid API key to continue.",
                variant: "destructive",
            });
            return;
        }

        // Save API key to cookies
        document.cookie = serialize('openaiApiKey', apiKey, { path: '/' });
        toast({
            title: "Saved",
            description: "Your OpenAI API Key has been saved",
            variant: "success",
        })
        onClose();
    }

    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value);
    }

    return (
        <Dialog open={isApiModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <Label htmlFor="apikey">
                    <div className="flex items-center">
                        <Key style={{ marginRight: 10 }} />
                        <span>Your <a className="text-green-600 dark:text-green-500 hover:underline" href="https://platform.openai.com/account/api-keys">OpenAI API Key</a></span>
                    </div>
                </Label>
                <Input
                    id="apikey"
                    type="text"
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                />
                <Button className="block w-full" onClick={handleSave}>
                    Save
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ApiKeyModal;
