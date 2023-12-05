"use client";

import { useEffect, useState } from "react";

import SettingsModal from "@/components/modals/settings-modal";
import ApiKeyModal from "@/components/modals/apikey-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <SettingsModal />
            <ApiKeyModal />
        </>
    )
}