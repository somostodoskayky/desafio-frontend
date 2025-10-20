import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import {
    AiOutlineHome,
    AiOutlineFire,
    AiOutlineBook,
    AiOutlineHistory,
    AiOutlineCloudUpload,
    AiOutlinePlaySquare
} from 'react-icons/ai';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const mainMenuItems = [
        { icon: <AiOutlineHome className="w-5 h-5" />, label: 'Home', path: '/' },
        { icon: <AiOutlineFire className="w-5 h-5" />, label: 'Trending', path: '/trending' },
        { icon: <AiOutlineBook className="w-5 h-5" />, label: 'Library', path: '/library' },
    ];

    const libraryItems = [
        { icon: <AiOutlineHistory className="w-5 h-5" />, label: 'History', path: '/history', requiresAuth: false }
    ];

    const userItems = isAuthenticated ? [
        { icon: <AiOutlinePlaySquare className="w-5 h-5" />, label: 'My Videos', path: '/my-videos' },
        { icon: <AiOutlineCloudUpload className="w-5 h-5" />, label: 'Upload', path: '/upload' },
    ] : [];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <aside className="w-64 bg-youtube-dark h-screen sticky top-16 overflow-y-auto border-r border-youtube-gray">
            <nav className="p-4">
                <ul className="space-y-1 mb-4">
                    {mainMenuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                                    ? 'bg-youtube-lightGray text-white'
                                    : 'text-gray-300 hover:bg-youtube-gray hover:text-white'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <hr className="border-youtube-gray my-4" />
                {isAuthenticated && userItems.length > 0 && (
                    <>
                        <div className="px-3 mb-2">
                            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">You</h3>
                        </div>
                        <ul className="space-y-1 mb-4">
                            {userItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                                            ? 'bg-youtube-lightGray text-white'
                                            : 'text-gray-300 hover:bg-youtube-gray hover:text-white'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <hr className="border-youtube-gray my-4" />
                    </>
                )}

                <div className="px-3 mb-2">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Library</h3>
                </div>
                <ul className="space-y-1">
                    {libraryItems.map((item) => {
                        const isDisabled = item.requiresAuth && !isAuthenticated;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                                        ? 'bg-youtube-lightGray text-white'
                                        : isDisabled
                                            ? 'text-gray-600 cursor-not-allowed'
                                            : 'text-gray-300 hover:bg-youtube-gray hover:text-white'
                                        }`}
                                    onClick={(e) => {
                                        if (isDisabled) {
                                            e.preventDefault();
                                            alert('Please sign in to access this feature');
                                        }
                                    }}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {!isAuthenticated && (
                    <div className="mt-6 p-4 bg-youtube-gray rounded-lg">
                        <p className="text-gray-300 text-sm mb-3">
                            Sign in to upload videos, like, and comment.
                        </p>
                        <Link
                            to="/"
                            className="text-youtube-red text-sm font-medium hover:underline"
                        >
                            Sign In
                        </Link>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
