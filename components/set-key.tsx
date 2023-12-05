"use client"

import * as React from "react"
import { Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import {useModal} from "@/hooks/use-modal-store";

export function SetKey() {
    const { onOpen } = useModal();

    return (
        <div>
            <Button onClick={() => {onOpen("api")}}  variant="outline" size="icon">
                <Key className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                <span className="sr-only">Set API Key</span>
            </Button>
        </div>
    )
}