export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
}

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  subscriberCount?: string;
}

export interface SearchResponse {
  items: VideoItem[];
  nextPageToken?: string;
  totalResults: number;
}

export interface PopularVideosResponse {
  items: VideoItem[];
  nextPageToken?: string;
}

export interface VideoDetailsResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: {
        high: {
          url: string;
          width: number;
          height: number;
        };
      };
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
    };
    contentDetails: {
      duration: string;
    };
  }>;
}

export interface RootState {
  video: VideoState;
  search: SearchState;
  auth: AuthState;
}

export interface VideoState {
  popularVideos: VideoItem[];
  currentVideo: VideoItem | null;
  loading: boolean;
  error: string | null;
  nextPageToken?: string;
}

export interface SearchState {
  searchResults: VideoItem[];
  searchHistory: string[];
  loading: boolean;
  error: string | null;
  nextPageToken?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    picture: string;
  } | null;
  accessToken: string | null;
}
