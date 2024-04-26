"use client"

import * as React from "react"
import { BotIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {useModal} from "@/hooks/use-modal-store";

export function SetAIModel() {
    const { onOpen } = useModal();

    return (
        <div>
            <Button onClick={() => {onOpen("aimodel")}}  variant="outline" size="icon">
                <BotIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                <span className="sr-only">Set AI Model</span>
            </Button>
        </div>
    )
}