import React, { useEffect, useState } from 'react';
import { fetchPopularVideos } from '../api/youtube';
import type { VideoItem } from '../types/youtube';
import VideoGrid from '../components/video/VideoGrid';

const TrendingPage: React.FC = () => {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadVideos = async () => {
        setLoading(true);
        
        try {
            const result = await fetchPopularVideos(24);
            setVideos(result.videos);
        } catch (err: any) {
            setError(err.message || 'Failed to load trending videos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVideos();
    }, []);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Trending Videos</h1>
                <p className="text-gray-400">Discover the most trending videos on YouTube</p>
            </div>

            <VideoGrid
                videos={videos}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default TrendingPage;
