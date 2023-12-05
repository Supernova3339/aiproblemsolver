import React from 'react';
import SearchBar from '../components/SearchBar';
import {useModal} from "@/hooks/use-modal-store";
import {Button} from "@/components/ui/button";
import {Settings} from "lucide-react";
import Layout from "@/components/Layout";

const Home: React.FC = () => {
    const {onOpen} = useModal();

    return (
        <Layout>
            <div className="fixed top-4 right-4">
                <Button onClick={() => onOpen("settings")} variant="outline" size="icon">
                    <Settings className="h-4 w-4"/>
                </Button>
            </div>
            <SearchBar/>
        </Layout>
    );
};

export default Home;
