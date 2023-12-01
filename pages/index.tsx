import React from 'react';
import SearchBar from '../components/SearchBar';
import {useSettings} from "@/hooks/use-settings";
import {Button} from "@/components/ui/button";
import {Settings} from "lucide-react";
import Layout from "@/components/Layout";

const Home: React.FC = () => {
    const settings = useSettings();

  return (
      <Layout>
          <div className="fixed top-4 right-4">
              <Button onClick={settings.onOpen} variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
              </Button>
          </div>
        <SearchBar />
      </Layout>
  );
};

export default Home;
