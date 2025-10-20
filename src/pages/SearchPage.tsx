import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { searchVideosAsync } from '../redux/slices/searchSlice';
import VideoGrid from '../components/video/VideoGrid';

const SearchPage: React.FC = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const { searchResults, loading, error } = useSelector((state: RootState) => state.search);

    useEffect(() => {
        if (query) {
            dispatch(searchVideosAsync(query) as any);
        }
    }, [dispatch, query]);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                    {query ? `Search results for "${query}"` : 'Search Videos'}
                </h1>
                <p className="text-gray-400">
                    {query ? `Found ${searchResults.length} results` : 'Enter a search term to find videos'}
                </p>
            </div>

            <VideoGrid
                videos={searchResults}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default SearchPage;
