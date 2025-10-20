import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { getSubscriptionsFeed } from '../api/youtube';
import { fetchPopularVideosAsync } from '../redux/slices/videoSlice';
import type { VideoItem } from '../types/youtube';
import VideoGrid from '../components/video/VideoGrid';
import { mockPersonalizedVideos } from '../utils/mockData';

const HomePage: React.FC = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { popularVideos, loading: reduxLoading, error: reduxError } = useSelector((state: RootState) => state.video);

    const [personalVideos, setPersonalVideos] = useState<VideoItem[]>([]);
    const [personalLoading, setPersonalLoading] = useState(false);
    const [personalError, setPersonalError] = useState<string | null>(null);

    const loadPersonalFeed = async () => {
        setPersonalLoading(true);
        setPersonalError(null);

        try {
            const result = await getSubscriptionsFeed(24);
            setPersonalVideos(result.videos);
        } catch (err: any) {
            if (err.message?.includes('403') || err.message?.includes('quota') || err.message?.includes('Unable to load')) {
                setPersonalVideos(mockPersonalizedVideos.slice(0, 24));
                setPersonalError('⚠️ Using demo data - YouTube API quota exceeded. Real feed will load after quota resets.');
            } else {
                setPersonalError(err.message || 'Failed to load personalized feed');
            }
        } finally {
            setPersonalLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadPersonalFeed();
        } else {
            if (popularVideos.length === 0) {
                dispatch(fetchPopularVideosAsync(25) as any);
            }
        }
    }, [isAuthenticated]);

    return (
        <div className="p-6">
            <VideoGrid
                videos={isAuthenticated ? personalVideos : popularVideos}
                loading={isAuthenticated ? personalLoading : reduxLoading}
                error={isAuthenticated ? personalError : reduxError}
            />
        </div>
    );
};

export default HomePage;