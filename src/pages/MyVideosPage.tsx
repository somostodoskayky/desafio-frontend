import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { getMyVideos } from '../api/youtube';
import type { VideoItem } from '../types/youtube';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { AiOutlineEdit, AiOutlineEye, AiOutlineCloudUpload } from 'react-icons/ai';

const MyVideosPage: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
        fetchVideos();
    }, [isAuthenticated, navigate]);

    const fetchVideos = async () => {
        setLoading(true);
        setError(null);
        try {
            const myVideos = await getMyVideos();
            setVideos(myVideos);
        } catch (err: any) {
            setError(err.message || 'Failed to load videos');
        } finally {
            setLoading(false);
        }
    };



    const formatViews = (views?: string) => {
        if (!views) return '0 views';
        const num = parseInt(views);
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
        return `${num} views`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-youtube-dark">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-youtube-dark p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-white text-3xl font-bold mb-2">My Videos</h1>
                        <p className="text-gray-400">Manage your uploaded videos</p>
                    </div>
                    <button
                        onClick={() => navigate('/upload')}
                        className="flex items-center space-x-2 bg-youtube-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                        <AiOutlineCloudUpload className="w-5 h-5" />
                        <span>Upload Video</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                        {error}
                    </div>
                )}
                {videos.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mb-4">
                            <AiOutlineCloudUpload className="w-24 h-24 text-gray-600 mx-auto" />
                        </div>
                        <h2 className="text-white text-2xl font-semibold mb-2">No videos yet</h2>
                        <p className="text-gray-400 mb-6">Upload your first video to get started</p>
                        <button
                            onClick={() => navigate('/upload')}
                            className="bg-youtube-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                            Upload Video
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="bg-youtube-gray border border-youtube-lightGray rounded-lg p-4 hover:bg-youtube-lightGray transition-colors"
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={video.thumbnail.url}
                                            alt={video.title}
                                            className="w-48 h-27 object-cover rounded cursor-pointer"
                                            onClick={() => navigate(`/watch/${video.id}`)}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className="text-white text-lg font-semibold mb-2 cursor-pointer hover:text-youtube-red line-clamp-2"
                                            onClick={() => navigate(`/watch/${video.id}`)}
                                        >
                                            {video.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                            {video.description || 'No description'}
                                        </p>
                                        <div className="flex items-center space-x-4 text-gray-400 text-sm">
                                            <span>{formatViews(video.viewCount)}</span>
                                            <span>•</span>
                                            <span>{formatDate(video.publishedAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => navigate(`/watch/${video.id}`)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-youtube-lightGray text-white rounded hover:bg-youtube-dark transition-colors"
                                            title="View"
                                        >
                                            <AiOutlineEye className="w-4 h-4" />
                                            <span className="text-sm">View</span>
                                        </button>
                                        <button
                                            onClick={() => window.open(`https://studio.youtube.com/video/${video.id}/edit`, '_blank')}
                                            className="flex items-center space-x-2 px-4 py-2 bg-youtube-lightGray text-white rounded hover:bg-youtube-dark transition-colors"
                                            title="Edit on YouTube Studio"
                                        >
                                            <AiOutlineEdit className="w-4 h-4" />
                                            <span className="text-sm">Edit</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyVideosPage;
