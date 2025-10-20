import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { fetchVideoDetailsAsync } from '../redux/slices/videoSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const WatchPage: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentVideo, loading, error } = useSelector((state: RootState) => state.video);

    useEffect(() => {
        if (videoId) {
            dispatch(fetchVideoDetailsAsync(videoId) as any);
        }
    }, [dispatch, videoId]);
    useEffect(() => {
        if (currentVideo) {
            const history = localStorage.getItem('watch_history');
            let historyArray = history ? JSON.parse(history) : [];

            historyArray = historyArray.filter((v: any) => v.id !== currentVideo.id);

            historyArray.unshift(currentVideo);
            if (historyArray.length > 50) {
                historyArray = historyArray.slice(0, 50);
            }

            localStorage.setItem('watch_history', JSON.stringify(historyArray));
        }
    }, [currentVideo]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-400">Loading video...</p>
                </div>
            </div>
        );
    }

    if (error || !currentVideo) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">Video not found</h3>
                    <p className="text-gray-400 mb-4">{error || 'The video you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-youtube-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                            title={currentVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                    <div className="bg-youtube-gray rounded-lg p-4">
                        <h1 className="text-xl font-bold text-white mb-2">{currentVideo.title}</h1>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-youtube-red rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">
                                        {currentVideo.channelTitle.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">{currentVideo.channelTitle}</p>
                                    <p className="text-gray-400 text-sm">
                                        {currentVideo.viewCount ? `${parseInt(currentVideo.viewCount).toLocaleString()} views` : 'Views not available'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="bg-youtube-lightGray text-white px-4 py-2 rounded-full hover:bg-youtube-gray transition-colors">
                                    👍 Like
                                </button>
                                <button className="bg-youtube-lightGray text-white px-4 py-2 rounded-full hover:bg-youtube-gray transition-colors">
                                    👎 Dislike
                                </button>
                                <button className="bg-youtube-lightGray text-white px-4 py-2 rounded-full hover:bg-youtube-gray transition-colors">
                                    📤 Share
                                </button>
                            </div>
                        </div>

                        <div className="bg-youtube-lightGray rounded-lg p-3">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {currentVideo.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <h3 className="text-white font-bold mb-4">Related Videos</h3>
                    <div className="space-y-4">
                        <div className="text-center py-8">
                            <p className="text-gray-400">Related videos would appear here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchPage;
