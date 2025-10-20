import axios from "axios";
import type {
  VideoItem,
  PopularVideosResponse,
  VideoDetailsResponse,
} from "../types/youtube";
import { YOUTUBE_API_KEY } from "../utils";
import { oauthService } from "../services/oauthService";

const API_BASE_URL = "https://www.googleapis.com/youtube/v3";

const youtubeAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const API_KEY = YOUTUBE_API_KEY;

const transformVideoItem = (item: any): VideoItem => ({
  id: item.id,
  title: item.snippet.title,
  description: item.snippet.description,
  thumbnail: {
    url:
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default?.url,
    width: item.snippet.thumbnails.high?.width || 480,
    height: item.snippet.thumbnails.high?.height || 360,
  },
  channelTitle: item.snippet.channelTitle,
  publishedAt: item.snippet.publishedAt,
  duration: item.contentDetails?.duration,
  viewCount: item.statistics?.viewCount,
});

export const fetchPopularVideos = async (
  maxResults: number = 25
): Promise<{ videos: VideoItem[]; nextPageToken?: string }> => {
  try {
    const response = await youtubeAPI.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        chart: "mostPopular",
        regionCode: "US",
        maxResults,
        key: API_KEY,
      },
    });

    const data: PopularVideosResponse = response.data;
    return {
      videos: data.items.map(transformVideoItem),
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    throw new Error("Failed to fetch popular videos");
  }
};

export const fetchPopularVideosPaginated = async (
  pageToken?: string,
  maxResults: number = 25
): Promise<{ videos: VideoItem[]; nextPageToken?: string }> => {
  try {
    const response = await youtubeAPI.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        chart: "mostPopular",
        regionCode: "US",
        maxResults,
        key: API_KEY,
        pageToken,
      },
    });

    const data: PopularVideosResponse = response.data;
    return {
      videos: data.items.map(transformVideoItem),
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    throw new Error("Failed to fetch popular videos");
  }
};

export const searchVideos = async (
  query: string,
  maxResults: number = 25
): Promise<VideoItem[]> => {
  try {
    const response = await youtubeAPI.get("/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults,
        key: API_KEY,
      },
    });

    const data: any = response.data;

    const videoIds = data.items
      .map((item: any) => (item.id?.videoId ? item.id.videoId : item.id))
      .join(",");

    if (videoIds) {
      const detailsResponse = await youtubeAPI.get("/videos", {
        params: {
          part: "snippet,statistics,contentDetails",
          id: videoIds,
          key: API_KEY,
        },
      });

      return detailsResponse.data.items.map(transformVideoItem);
    }

    return [];
  } catch (error) {
    throw new Error("Failed to search videos");
  }
};

export const searchVideosPaginated = async (
  query: string,
  pageToken?: string,
  maxResults: number = 25
): Promise<{ videos: VideoItem[]; nextPageToken?: string }> => {
  try {
    const response = await youtubeAPI.get("/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults,
        key: API_KEY,
        pageToken,
      },
    });

    const data: any = response.data;
    const videoIds = data.items
      .map((item: any) => (item.id?.videoId ? item.id.videoId : item.id))
      .join(",");

    if (videoIds) {
      const detailsResponse = await youtubeAPI.get("/videos", {
        params: {
          part: "snippet,statistics,contentDetails",
          id: videoIds,
          key: API_KEY,
        },
      });

      return {
        videos: detailsResponse.data.items.map(transformVideoItem),
        nextPageToken: data.nextPageToken,
      };
    }

    return { videos: [], nextPageToken: data.nextPageToken };
  } catch (error) {
    throw new Error("Failed to search videos");
  }
};

export const getVideoDetails = async (
  videoId: string
): Promise<VideoItem | null> => {
  try {
    const response = await youtubeAPI.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoId,
        key: API_KEY,
      },
    });

    const data: VideoDetailsResponse = response.data;

    if (data.items.length > 0) {
      return transformVideoItem(data.items[0]);
    }

    return null;
  } catch (error) {
    throw new Error("Failed to fetch video details");
  }
};

export const getRelatedVideos = async (
  videoId: string,
  maxResults: number = 10
): Promise<VideoItem[]> => {
  try {
    const response = await youtubeAPI.get("/search", {
      params: {
        part: "snippet",
        relatedToVideoId: videoId,
        type: "video",
        maxResults,
        key: API_KEY,
      },
    });

    const data: any = response.data;

    const videoIds = data.items
      .map((item: any) => (item.id?.videoId ? item.id.videoId : item.id))
      .join(",");

    if (videoIds) {
      const detailsResponse = await youtubeAPI.get("/videos", {
        params: {
          part: "snippet,statistics,contentDetails",
          id: videoIds,
          key: API_KEY,
        },
      });

      return detailsResponse.data.items.map(transformVideoItem);
    }

    return [];
  } catch (error) {
    throw new Error("Failed to fetch related videos");
  }
};

export const uploadVideo = async (
  file: File,
  title: string,
  description: string,
  privacyStatus: "public" | "unlisted" | "private" = "unlisted"
): Promise<string> => {
  const accessToken =
    oauthService.getAccessToken() || (await oauthService.refreshAccessToken());
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const metadata = {
    snippet: {
      title,
      description,
    },
    status: {
      privacyStatus,
    },
  };

  const boundary = "====YouTubeUploadBoundary";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: "application/json; charset=UTF-8",
  });
  const multipartBody = new Blob([
    delimiter,
    "Content-Type: application/json; charset=UTF-8\r\n\r\n",
    metadataBlob,
    "\r\n",
    `--${boundary}\r\n`,
    "Content-Type: video/*\r\n\r\n",
    file,
    closeDelimiter,
  ]);

  const uploadResponse = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );

  if (!uploadResponse.ok) {
    const errText = await uploadResponse.text();
    throw new Error(`Video upload failed: ${errText}`);
  }

  const json = await uploadResponse.json();
  return json.id as string;
};

export const getRecommendedFeed = async (
  maxResults: number = 25,
  pageToken?: string
): Promise<{ videos: VideoItem[]; nextPageToken?: string }> => {
  const accessToken =
    oauthService.getAccessToken() || (await oauthService.refreshAccessToken());

  if (!accessToken) {
    throw new Error(
      "Not authenticated. Please sign in to see your personalized feed."
    );
  }

  try {
    const activitiesUrl = `https://www.googleapis.com/youtube/v3/activities?part=snippet,contentDetails&mine=true&maxResults=50${
      pageToken ? `&pageToken=${pageToken}` : ""
    }`;
    const activitiesResponse = await fetch(activitiesUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!activitiesResponse.ok) {
      return await getSubscriptionsFeed(maxResults, pageToken);
    }

    const activitiesData = await activitiesResponse.json();

    const videoIds = activitiesData.items
      .filter(
        (item: any) =>
          item.kind === "youtube#activity" &&
          item.contentDetails?.upload?.videoId
      )
      .map((item: any) => item.contentDetails.upload.videoId)
      .slice(0, maxResults);

    if (videoIds.length === 0) {
      return await getSubscriptionsFeed(maxResults, pageToken);
    }

    const response = await youtubeAPI.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoIds.join(","),
        key: API_KEY,
      },
    });

    return {
      videos: response.data.items.map(transformVideoItem),
      nextPageToken: activitiesData.nextPageToken,
    };
  } catch (error) {
    try {
      return await getSubscriptionsFeed(maxResults, pageToken);
    } catch (subError) {
      throw new Error(
        "Unable to load personalized feed. Please try again later."
      );
    }
  }
};

export const getSubscriptionsFeed = async (
  maxResults: number = 25,
  pageToken?: string
): Promise<{ videos: VideoItem[]; nextPageToken?: string }> => {
  const accessToken =
    oauthService.getAccessToken() || (await oauthService.refreshAccessToken());

  if (!accessToken) {
    return await fetchPopularVideos(maxResults);
  }

  try {
    const subsUrl = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50${
      pageToken ? `&pageToken=${pageToken}` : ""
    }`;
    const subsResponse = await fetch(subsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!subsResponse.ok) {
      return await fetchPopularVideos(maxResults);
    }

    const subsData = await subsResponse.json();
    const channelIds = subsData.items
      .map((item: any) => item.snippet.resourceId.channelId)
      .slice(0, 10);

    if (channelIds.length === 0) {
      return await fetchPopularVideos(maxResults);
    }

    const searchPromises = channelIds.map((channelId: string) =>
      youtubeAPI.get("/search", {
        params: {
          part: "snippet",
          channelId: channelId,
          maxResults: 3,
          order: "date",
          type: "video",
          key: API_KEY,
        },
      })
    );

    const searchResults = await Promise.all(searchPromises);
    const videoIds = searchResults
      .flatMap((result) => result.data.items)
      .map((item: any) => item.id.videoId)
      .filter(Boolean)
      .slice(0, maxResults);

    if (videoIds.length === 0) {
      return await fetchPopularVideos(maxResults);
    }

    const response = await youtubeAPI.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoIds.join(","),
        key: API_KEY,
      },
    });

    return {
      videos: response.data.items.map(transformVideoItem),
      nextPageToken: subsData.nextPageToken,
    };
  } catch (error) {
    return await fetchPopularVideos(maxResults);
  }
};

export const getMyVideos = async (): Promise<VideoItem[]> => {
  const accessToken =
    oauthService.getAccessToken() || (await oauthService.refreshAccessToken());
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  try {
    const channelResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!channelResponse.ok) {
      throw new Error("Failed to fetch channel information");
    }

    const channelData = await channelResponse.json();
    if (!channelData.items || channelData.items.length === 0) {
      return [];
    }

    const uploadsPlaylistId =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!playlistResponse.ok) {
      throw new Error("Failed to fetch videos");
    }

    const playlistData = await playlistResponse.json();
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(",");

    if (!videoIds) {
      return [];
    }

    const response = await youtubeAPI.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoIds,
        key: API_KEY,
      },
    });

    return response.data.items.map(transformVideoItem);
  } catch (error) {
    throw new Error("Failed to fetch your videos");
  }
};

export const deleteVideo = async (videoId: string): Promise<void> => {
  const accessToken =
    oauthService.getAccessToken() || (await oauthService.refreshAccessToken());
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete video");
  }
};

export const uploadVideoWithProgress = async (
  file: File,
  metadata: {
    title: string;
    description: string;
    tags?: string[];
    categoryId?: string;
    privacyStatus: "public" | "unlisted" | "private";
  },
  onProgress?: (progress: number) => void
): Promise<string> => {
  const accessToken =
    oauthService.getAccessToken() || (await oauthService.refreshAccessToken());
  if (!accessToken) {
    throw new Error("Not authenticated. Please sign in to upload videos.");
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(Math.min(percentComplete, 99));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (onProgress) onProgress(100);
          resolve(response.id as string);
        } catch (error) {
          reject(new Error("Failed to parse upload response"));
        }
      } else {
        reject(
          new Error(
            `Upload failed with status ${xhr.status}: ${xhr.responseText}`
          )
        );
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled"));
    });

    const boundary = "====YouTubeUploadBoundary" + Date.now();
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const videoMetadata = {
      snippet: {
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags || [],
        categoryId: metadata.categoryId || "22",
      },
      status: {
        privacyStatus: metadata.privacyStatus,
      },
    };

    const metadataBlob = new Blob([JSON.stringify(videoMetadata)], {
      type: "application/json; charset=UTF-8",
    });

    const multipartBody = new Blob([
      delimiter,
      "Content-Type: application/json; charset=UTF-8\r\n\r\n",
      metadataBlob,
      "\r\n",
      `--${boundary}\r\n`,
      "Content-Type: video/*\r\n\r\n",
      file,
      closeDelimiter,
    ]);

    xhr.open(
      "POST",
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status"
    );
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader(
      "Content-Type",
      `multipart/related; boundary=${boundary}`
    );
    xhr.send(multipartBody);
  });
};
