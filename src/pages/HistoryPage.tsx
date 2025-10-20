import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VideoItem } from '../types/youtube';
import VideoCard from '../components/video/VideoCard';
import { AiOutlineHistory, AiOutlineDelete } from 'react-icons/ai';

const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<VideoItem[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const savedHistory = localStorage.getItem('watch_history');
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                setHistory(parsed.reverse());
            } catch (error) {
                console.error('Failed to load history:', error);
            }
        }
    };

    const clearHistory = () => {
        if (confirm('Are you sure you want to clear your watch history?')) {
            localStorage.removeItem('watch_history');
            setHistory([]);
        }
    };

    const removeFromHistory = (videoId: string) => {
        const updatedHistory = history.filter(v => v.id !== videoId);
        setHistory(updatedHistory);
        localStorage.setItem('watch_history', JSON.stringify(updatedHistory.reverse()));
    };

    return (
        <div className="min-h-screen bg-youtube-dark p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <AiOutlineHistory className="w-8 h-8 text-youtube-red" />
                        <div>
                            <h1 className="text-white text-3xl font-bold">Watch History</h1>
                            <p className="text-gray-400 mt-1">{history.length} videos</p>
                        </div>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="flex items-center space-x-2 px-4 py-2 bg-youtube-lightGray text-white rounded-lg hover:bg-youtube-gray transition-colors"
                        >
                            <AiOutlineDelete className="w-5 h-5" />
                            <span>Clear History</span>
                        </button>
                    )}
                </div>
                {history.length === 0 ? (
                    <div className="text-center py-16">
                        <AiOutlineHistory className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-white text-2xl font-semibold mb-2">No watch history</h2>
                        <p className="text-gray-400 mb-6">Videos you watch will appear here</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-youtube-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                            Explore Videos
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((video) => (
                            <div key={video.id} className="flex gap-4 bg-youtube-gray p-4 rounded-lg hover:bg-youtube-lightGray transition-colors">
                                <div className="flex-shrink-0">
                                    <VideoCard video={video} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className="text-white text-lg font-semibold mb-2 cursor-pointer hover:text-youtube-red line-clamp-2"
                                        onClick={() => navigate(`/watch/${video.id}`)}
                                    >
                                        {video.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-2">{video.channelTitle}</p>
                                    <p className="text-gray-500 text-sm line-clamp-2">{video.description}</p>
                                </div>
                                <button
                                    onClick={() => removeFromHistory(video.id)}
                                    className="flex-shrink-0 px-3 py-2 text-gray-400 hover:text-white hover:bg-youtube-dark rounded transition-colors"
                                    title="Remove from history"
                                >
                                    <AiOutlineDelete className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
