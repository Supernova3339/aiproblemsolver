// components/SearchBar.tsx
import { useState } from 'react';
import Message from './Message';

const SearchBar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [, setIsLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<string | null>(null);

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchQuery }),
            });

            if (res.ok) {
                const data = await res.json();
                setResponse(data.answer);
            } else {
                console.error('Error calling API:', res.status, res.statusText);
                setResponse('Error processing your request');
            }
        } catch (error) {
            console.error('Error calling API:', error);
            setResponse('Error processing your request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        setResponse(null);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-200 dark:bg-gray-950">
            <div className="w-full max-w-md">
                <div className="flex flex-1 flex-col items-center justify-center px-2 lg:ml-6 lg:justify-end">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
                        AI <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Problem Solver</span>
                    </h1>
                    {response ? (
                        <Message response={response} onClear={handleClear} />
                    ) : (
                        <div className="w-full max-w-lg lg:max-w-xs">
                            <form onSubmit={handleSearch}>
                                <label htmlFor="search" className="sr-only">
                                    Search for your problem
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        id="search"
                                        name="q"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="dark:placeholder-text-gray-200 block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-900 dark:focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Search for your problem"
                                        type="search"
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
