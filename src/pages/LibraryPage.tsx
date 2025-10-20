import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { AiOutlineHistory, AiOutlineCloudUpload, AiOutlineHeart, AiOutlineClockCircle, AiOutlinePlaySquare } from 'react-icons/ai';

const LibraryPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const libraryItems = [
        {
            icon: AiOutlineHistory,
            title: 'History',
            description: 'Videos you\'ve watched',
            path: '/history',
            color: 'text-blue-500',
            requiresAuth: false,
        },
        {
            icon: AiOutlineCloudUpload,
            title: 'My Videos',
            description: 'Your uploaded videos',
            path: '/my-videos',
            color: 'text-youtube-red',
            requiresAuth: true,
        },
        {
            icon: AiOutlineClockCircle,
            title: 'Watch Later',
            description: 'Videos saved for later',
            path: '/watch-later',
            color: 'text-purple-500',
            requiresAuth: false,
        },
        {
            icon: AiOutlineHeart,
            title: 'Liked Videos',
            description: 'Videos you\'ve liked',
            path: '/liked',
            color: 'text-pink-500',
            requiresAuth: true,
        },
        {
            icon: AiOutlinePlaySquare,
            title: 'Playlists',
            description: 'Your playlists',
            path: '/playlists',
            color: 'text-green-500',
            requiresAuth: true,
        },
    ];

    const handleNavigate = (item: typeof libraryItems[0]) => {
        if (item.requiresAuth && !isAuthenticated) {
            alert('Please sign in to access this feature');
            return;
        }
        navigate(item.path);
    };

    return (
        <div className="min-h-screen bg-youtube-dark p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-white text-3xl font-bold mb-2">Library</h1>
                    <p className="text-gray-400">Access your videos, history, and playlists</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraryItems.map((item, index) => {
                        const Icon = item.icon;
                        const isDisabled = item.requiresAuth && !isAuthenticated;

                        return (
                            <div
                                key={index}
                                onClick={() => !isDisabled && handleNavigate(item)}
                                className={`bg-youtube-gray border border-youtube-lightGray rounded-xl p-6 transition-all ${isDisabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-youtube-lightGray cursor-pointer hover:scale-105'
                                    }`}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 bg-youtube-dark rounded-lg ${item.color}`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white text-xl font-semibold mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">{item.description}</p>
                                        {isDisabled && (
                                            <p className="text-yellow-500 text-xs mt-2">Sign in required</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {isAuthenticated && (
                    <div className="mt-12 bg-youtube-gray border border-youtube-lightGray rounded-xl p-6">
                        <h2 className="text-white text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/upload')}
                                className="flex items-center space-x-2 bg-youtube-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                <AiOutlineCloudUpload className="w-5 h-5" />
                                <span>Upload Video</span>
                            </button>
                            <button
                                onClick={() => navigate('/my-videos')}
                                className="flex items-center space-x-2 bg-youtube-lightGray text-white px-6 py-3 rounded-lg hover:bg-youtube-dark transition-colors font-medium"
                            >
                                <AiOutlinePlaySquare className="w-5 h-5" />
                                <span>Manage Videos</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryPage;
