import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import GoogleAuth from '../auth/GoogleAuth';
import { AiOutlineSearch, AiFillYoutube } from 'react-icons/ai';

const Header: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const navigate = useNavigate();

    const { searchHistory } = useSelector((state: RootState) => state.search);

    const handleSearch = (query: string = searchQuery) => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            setShowHistory(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleHistoryClick = (query: string) => {
        console.log("Hello")
        setSearchQuery(query.trim());
        handleSearch(query.trim());
    };
    return (
        <>
            <header className="bg-youtube-dark border-b border-youtube-gray sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link to="/" className="flex items-center space-x-2">
                        <AiFillYoutube className="w-8 h-8 text-youtube-red" />
                        <span className="text-white font-bold text-xl">YouTube</span>
                    </Link>
                    <div className="flex-1 max-w-2xl mx-8 relative">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onFocus={() => setShowHistory(true)}
                                onBlur={() => setTimeout(() => setShowHistory(false), 400)}
                                placeholder="Search videos..."
                                className="w-full bg-youtube-gray text-white px-4 py-2 pr-12 rounded-full border border-youtube-lightGray focus:border-youtube-red focus:outline-none"
                            />
                            <button
                                onClick={() => handleSearch()}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-youtube-lightGray hover:bg-youtube-gray px-4 py-1 rounded-full transition-colors"
                            >
                                <AiOutlineSearch className="w-4 h-4 text-white" />
                            </button>
                        </div>
                        {showHistory && searchHistory.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-youtube-gray border border-youtube-lightGray rounded-lg shadow-lg z-50">
                                <div className="p-2">
                                    <div className="text-xs text-gray-400 mb-2">Recent searches</div>
                                    {searchHistory.slice(0, 5).map((query, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleHistoryClick(query)}
                                            className="w-full text-left px-3 py-2 text-white hover:bg-youtube-lightGray rounded flex items-center space-x-2 relative cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{query.trim()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <GoogleAuth />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
