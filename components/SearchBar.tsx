import React, {useState} from 'react';
import Message from './Message';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useModal} from "@/hooks/use-modal-store";
import {parse} from "cookie";

const SearchBar: React.FC = () => {
    const [searchDisabled, setSearchDisabled] = React.useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<string | null>(null);
    const [showSearch, setShowSearch] = useState<boolean>(true);
    const { onOpen } = useModal();

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Retrieve API key from cookies
            const cookies = parse(document.cookie);
            const apiKey = cookies.openaiApiKey || null;

            if (!apiKey) {
                // Open the API modal if the API Key is not present.
                setIsLoading(false);
                onOpen("api");
                return;
            }
            setSearchDisabled(true)
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({searchQuery}),
            });

            if (res.ok) {
                const data = await res.json();
                setResponse(data.answer);
                setShowSearch(false);
            } else {
                console.error('Error calling API:', res.status, res.statusText);
                setResponse('Error processing your request');
            }
        } catch (error) {
            console.error('Error calling API:', error);
            setResponse('Error processing your request');
        } finally {
            setIsLoading(false);
            setSearchDisabled(false);
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        setResponse(null);
        setShowSearch(true);
    };

    return (
        <div className="h-screen flex flex-col pb-6 bg-background">
            {showSearch && (
                <div className="h-full flex flex-col justify-center">
                    <div className="max-w-4xl w-full text-center mx-auto px-4 sm:px-6 lg:px-8">
                        <svg className="w-28 h-auto mx-auto mb-4" width="116" height="32" viewBox="0 0 116 32"
                             fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* SVG content */}
                        </svg>

                        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
                            AI <span
                            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Problem Solver</span>
                            {/*<span className="pl-2 items-center text-center"><Badge variant={"success"}>Plus</Badge></span>*/}
                        </h1>
                        <p className="mt-3 text-gray-600 dark:text-neutral-400">
                            Your AI-powered solution finder for your problems
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mt-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <input
                                    disabled={searchDisabled}
                                    type="text"
                                    className="p-4 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-primary disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-primary"
                                    placeholder="Solve anything..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute top-1/2 end-2 -translate-y-1/2 flex items-center gap-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    disabled={true}
                                                    className="cursor-not-allowed pr-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:text-gray-800 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-white"
                                                >
                                                    <svg className="flex-shrink-0 size-4"
                                                         xmlns="http://www.w3.org/2000/svg"
                                                         width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round">
                                                        <path
                                                            d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                                                        <path d="M12 12v9"/>
                                                        <path d="m16 16-4-4-4 4"/>
                                                    </svg>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Uploading files is not available yet</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {/*<button*/}
                                    {/*    type="button"*/}
                                    {/*    className="pr-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:text-gray-800 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-white"*/}
                                    {/*>*/}
                                    {/*    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg"*/}
                                    {/*         width="24" height="24" viewBox="0 0 24 24" fill="none"*/}
                                    {/*         stroke="currentColor" strokeWidth="2" strokeLinecap="round"*/}
                                    {/*         strokeLinejoin="round">*/}
                                    {/*        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>*/}
                                    {/*        <path d="M12 12v9"/>*/}
                                    {/*        <path d="m16 16-4-4-4 4"/>*/}
                                    {/*    </svg>*/}
                                    {/*</button>*/}
                                    {/*<button*/}
                                    {/*    type="button"*/}
                                    {/*    className="inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:text-gray-800 bg-gray-100 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-white dark:bg-neutral-800"*/}
                                    {/*>*/}
                                    {/*    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg"*/}
                                    {/*         width="24" height="24" viewBox="0 0 24 24" fill="none"*/}
                                    {/*         stroke="currentColor" strokeWidth="2" strokeLinecap="round"*/}
                                    {/*         strokeLinejoin="round">*/}
                                    {/*        <path stroke-linecap="round" stroke-linejoin="round"*/}
                                    {/*              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"></path>*/}
                                    {/*    </svg>*/}
                                    {/*</button>*/}
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* End Search */}
                </div>
            )}

            {/* Result display section */}
            {response && !showSearch && (
                <div className="h-screen flex flex-col pb-6">
                    <div className="h-full flex flex-col justify-center"> {/* Add flex container */}
                        <div className="mt-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                            <Message response={response} onClear={handleClear}/>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
                <div className="mt-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center">Please Wait</p>
                </div>
            )}

            <footer className="mt-auto max-w-4xl text-center mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-xs text-gray-600 dark:text-neutral-500">© {new Date().getFullYear()} . Made with <span className="text-destructive animate-heartbeat">love</span> by <a
                        className="text-gray-800 decoration-2 hover:underline font-semibold dark:text-neutral-300"
                        href="http://superdev.one/" target="_blank">Supernova3339</a>.</p>
            </footer>
        </div>
    );
};

export default SearchBar;