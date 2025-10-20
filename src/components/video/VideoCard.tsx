import React from 'react';
import { Link } from 'react-router-dom';
import type { VideoItem } from '../../types/youtube';
import Card from '../ui/Card';

interface VideoCardProps {
    video: VideoItem;
    className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, className = '' }) => {
    const formatViewCount = (count: string | undefined): string => {
        if (!count) return '';
        const num = parseInt(count);
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M views`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K views`;
        }
        return `${num} views`;
    };

    const formatPublishedDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    };

    return (
        <Card className={`p-0 overflow-hidden ${className}`} hover>
            <Link to={`/watch/${video.id}`} className="block">
                <div className="relative aspect-video bg-youtube-lightGray">
                    <img
                        src={video.thumbnail.url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                            {video.duration}
                        </div>
                    )}
                </div>

                <div className="p-3">
                    <h3 className="text-white font-medium text-sm line-clamp-2 mb-2">
                        {video.title}
                    </h3>

                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-youtube-red rounded-full flex-shrink-0 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                {video.channelTitle.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-gray-300 text-xs truncate">
                                {video.channelTitle}
                            </p>
                            <div className="flex items-center space-x-2 text-gray-400 text-xs mt-1">
                                <span>{formatViewCount(video.viewCount)}</span>
                                <span>•</span>
                                <span>{formatPublishedDate(video.publishedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    );
};

export default VideoCard;
