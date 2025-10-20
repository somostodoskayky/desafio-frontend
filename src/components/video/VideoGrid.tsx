import React from 'react';
import type { VideoItem } from '../../types/youtube';
import VideoCard from './VideoCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import { AiOutlineWarning, AiOutlineVideoCamera } from 'react-icons/ai';

interface VideoGridProps {
    videos: VideoItem[];
    loading?: boolean;
    error?: string | null;
    className?: string;
    loadingMore?: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({
    videos,
    loading = false,
    error = null,
    className = '',
    loadingMore = false
}) => {
    if (loading) {
        return (
            <div className={`flex justify-center items-center py-12 ${className}`}>
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-400">Loading videos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex justify-center items-center py-12 ${className}`}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AiOutlineWarning className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">Something went wrong</h3>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className={`flex justify-center items-center py-12 ${className}`}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-youtube-lightGray rounded-full flex items-center justify-center mx-auto mb-4">
                        <AiOutlineVideoCamera className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">No videos found</h3>
                    <p className="text-gray-400">Try adjusting your search or browse popular videos</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
                {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>

            {loadingMore && (
                <div className="flex justify-center items-center py-8">
                    <div className="flex items-center space-x-3">
                        <LoadingSpinner size="md" />
                        <span className="text-gray-400">Loading more videos...</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoGrid;
