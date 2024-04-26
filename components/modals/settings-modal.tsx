import React, {useEffect, useState} from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '@/components/ui/label';
import { ModeToggle } from '@/components/mode-toggle';
import {GithubStar} from "@/components/github-star";
import {SetKey} from "@/components/set-key";
import {SetAIModel} from "@/components/set-ai-model";

const SettingsModal = () => {
    const { isOpen, onClose, type} = useModal();
    const isModalOpen = isOpen && type === "settings";
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);


    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <h2 className="text-lg font-medium">
                        My settings
                    </h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>Appearance</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Customize how AI Problem Solver looks on your device
                        </span>
                    </div>
                    <ModeToggle />
                </div>
                {/* divider */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>API Key</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Manage your OpenAI API Key Here
                        </span>
                    </div>
                    <SetKey />
                </div>
                {/* divider */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>AI Model</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Manage your OpenAI API Model Here
                        </span>
                    </div>
                    <SetAIModel />
                </div>
                {/* divider */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>Open Source</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Star AI Problem Solver on GitHub
                        </span>
                    </div>
                    <GithubStar />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;