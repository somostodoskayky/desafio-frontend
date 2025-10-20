import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { VideoItem, VideoState } from "../../types/youtube";
import {
  fetchPopularVideos,
  fetchPopularVideosPaginated,
  getVideoDetails,
  getRelatedVideos,
} from "../../api/youtube";

const initialState: VideoState = {
  popularVideos: [],
  currentVideo: null,
  loading: false,
  error: null,
  nextPageToken: undefined,
};

export const fetchPopularVideosAsync = createAsyncThunk(
  "video/fetchPopularVideos",
  async (maxResults: number = 25) => {
    const { videos, nextPageToken } = await fetchPopularVideos(maxResults);
    return { videos, nextPageToken };
  }
);

export const fetchPopularVideosNextPageAsync = createAsyncThunk(
  "video/fetchPopularVideosNextPage",
  async (args: { pageToken?: string; maxResults?: number }) => {
    const { videos, nextPageToken } = await fetchPopularVideosPaginated(
      args.pageToken,
      args.maxResults || 25
    );
    return { videos, nextPageToken };
  }
);

export const fetchVideoDetailsAsync = createAsyncThunk(
  "video/fetchVideoDetails",
  async (videoId: string) => {
    const video = await getVideoDetails(videoId);
    return video;
  }
);

export const fetchRelatedVideosAsync = createAsyncThunk(
  "video/fetchRelatedVideos",
  async (videoId: string) => {
    const videos = await getRelatedVideos(videoId);
    return videos;
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setCurrentVideo: (state, action: PayloadAction<VideoItem | null>) => {
      state.currentVideo = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularVideosAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularVideosAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.popularVideos = action.payload.videos;
        state.nextPageToken = action.payload.nextPageToken;
      })
      .addCase(fetchPopularVideosAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch popular videos";
      })
      .addCase(fetchPopularVideosNextPageAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularVideosNextPageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.popularVideos = [
          ...state.popularVideos,
          ...action.payload.videos,
        ];
        state.nextPageToken = action.payload.nextPageToken;
      })
      .addCase(fetchPopularVideosNextPageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load more videos";
      })
      .addCase(fetchVideoDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch video details";
      })
      .addCase(fetchRelatedVideosAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedVideosAsync.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(fetchRelatedVideosAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch related videos";
      });
  },
});

export const { setCurrentVideo, clearError, clearCurrentVideo } =
  videoSlice.actions;
export default videoSlice.reducer;
