import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { SearchState } from "../../types/youtube";
import { searchVideos, searchVideosPaginated } from "../../api/youtube";

const initialState: SearchState = {
  searchResults: [],
  searchHistory: [],
  loading: false,
  error: null,
  nextPageToken: undefined,
};

export const searchVideosAsync = createAsyncThunk(
  "search/searchVideos",
  async (query: string) => {
    const videos = await searchVideos(query);
    return { videos, query };
  }
);

export const searchVideosNextPageAsync = createAsyncThunk(
  "search/searchVideosNextPage",
  async (args: { query: string; pageToken?: string }) => {
    const { videos, nextPageToken } = await searchVideosPaginated(
      args.query,
      args.pageToken
    );
    return { videos, query: args.query, nextPageToken };
  }
);

const loadSearchHistory = (): string[] => {
  try {
    const history = localStorage.getItem("youtube-search-history");
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error loading search history:", error);
    return [];
  }
};

const saveSearchHistory = (history: string[]): void => {
  try {
    localStorage.setItem("youtube-search-history", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving search history:", error);
  }
};

const searchSlice = createSlice({
  name: "search",
  initialState: {
    ...initialState,
    searchHistory: loadSearchHistory(),
  },
  reducers: {
    addSearchQuery: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query);
        if (state.searchHistory.length > 10) {
          state.searchHistory = state.searchHistory.slice(0, 10);
        }
        saveSearchHistory(state.searchHistory);
      }
    },
    removeSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(
        (query) => query !== action.payload
      );
      saveSearchHistory(state.searchHistory);
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      saveSearchHistory(state.searchHistory);
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVideosAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVideosAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.videos;
        state.nextPageToken = undefined;
        const query = action.payload.query.trim();
        if (query && !state.searchHistory.includes(query)) {
          state.searchHistory.unshift(query);
          if (state.searchHistory.length > 10) {
            state.searchHistory = state.searchHistory.slice(0, 10);
          }
          saveSearchHistory(state.searchHistory);
        }
      })
      .addCase(searchVideosAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search videos";
      })
      .addCase(searchVideosNextPageAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVideosNextPageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = [
          ...state.searchResults,
          ...action.payload.videos,
        ];
        state.nextPageToken = action.payload.nextPageToken;
      })
      .addCase(searchVideosNextPageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load more videos";
      });
  },
});

export const {
  addSearchQuery,
  removeSearchQuery,
  clearSearchHistory,
  clearSearchResults,
  clearError,
} = searchSlice.actions;
export default searchSlice.reducer;
