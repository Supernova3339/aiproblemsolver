import React from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useSettings } from '@/hooks/use-settings';
import { Label } from '@/components/ui/label';
import { ModeToggle } from '@/components/mode-toggle';
import {GithubStar} from "@/components/github-star";

const SettingsModal = () => {
    const settings = useSettings();

    return (
        <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
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
                {/* hi */}
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