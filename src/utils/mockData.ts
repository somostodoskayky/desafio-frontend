import type { VideoItem } from "../types/youtube";

export const mockPersonalizedVideos: VideoItem[] = [
  {
    id: "mock1",
    title: "Your Personalized Video 1 - React Tutorial",
    description: "Learn React from scratch with this comprehensive tutorial",
    thumbnail: {
      url: "https://picsum.photos/seed/react1/480/360",
      width: 480,
      height: 360,
    },
    channelTitle: "Tech Channel",
    publishedAt: new Date().toISOString(),
    duration: "PT15M30S",
    viewCount: "1234567",
  },
  {
    id: "mock2",
    title: "Your Personalized Video 2 - JavaScript Tips",
    description: "Advanced JavaScript tips and tricks for developers",
    thumbnail: {
      url: "https://picsum.photos/seed/js1/480/360",
      width: 480,
      height: 360,
    },
    channelTitle: "Code Masters",
    publishedAt: new Date().toISOString(),
    duration: "PT20M15S",
    viewCount: "987654",
  },
  {
    id: "mock3",
    title: "Your Personalized Video 3 - TypeScript Guide",
    description: "Complete TypeScript guide for beginners",
    thumbnail: {
      url: "https://picsum.photos/seed/ts1/480/360",
      width: 480,
      height: 360,
    },
    channelTitle: "Dev Academy",
    publishedAt: new Date().toISOString(),
    duration: "PT25M45S",
    viewCount: "2345678",
  },
  {
    id: "mock4",
    title: "Your Personalized Video 4 - Web Development",
    description: "Modern web development best practices",
    thumbnail: {
      url: "https://picsum.photos/seed/web1/480/360",
      width: 480,
      height: 360,
    },
    channelTitle: "Web Dev Pro",
    publishedAt: new Date().toISOString(),
    duration: "PT18M20S",
    viewCount: "3456789",
  },
  {
    id: "mock5",
    title: "Your Personalized Video 5 - CSS Animations",
    description: "Create stunning CSS animations",
    thumbnail: {
      url: "https://picsum.photos/seed/css1/480/360",
      width: 480,
      height: 360,
    },
    channelTitle: "Design Hub",
    publishedAt: new Date().toISOString(),
    duration: "PT12M30S",
    viewCount: "876543",
  },
];

export const mockPopularVideos: VideoItem[] = [
  {
    id: "popular1",
    title: "Trending Video 1 - Viral Content",
    description: "This is trending right now!",
    thumbnail: {
      url: "https://picsum.photos/seed/viral1/480/360",
      width: 480,
      height: 360,
    },
    channelTitle: "Viral Channel",
    publishedAt: new Date().toISOString(),
    duration: "PT10M15S",
    viewCount: "10000000",
  },
  {
    id: "popular2",
    title: "Trending Video 2 - Popular Music",
    description: "Top music video of the week",
    thumbnail: {
      url: "https://picsum.photos/seed/music1/480/360",
      width: 480,
      height: 360,
    },
    channelTitle: "Music Station",
    publishedAt: new Date().toISOString(),
    duration: "PT4M30S",
    viewCount: "50000000",
  },
  {
    id: "popular3",
    title: "Trending Video 3 - Gaming Highlights",
    description: "Best gaming moments compilation",
    thumbnail: {
      url: "https://picsum.photos/seed/game1/480/360",
      width: 480,
      height: 360,
    },
    channelTitle: "Gaming Pro",
    publishedAt: new Date().toISOString(),
    duration: "PT15M45S",
    viewCount: "25000000",
  },
];

export const generateMockVideos = (
  count: number,
  prefix: string
): VideoItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    title: `${prefix} Video ${i + 1} - Sample Content`,
    description: `This is a mock video for testing purposes. Video number ${
      i + 1
    }.`,
    thumbnail: {
      url: `https://picsum.photos/seed/${prefix}${i}/480/360`,
      width: 480,
      height: 360,
    },
    channelTitle: `Channel ${(i % 5) + 1}`,
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
    duration: `PT${10 + (i % 20)}M${30 + (i % 30)}S`,
    viewCount: String(Math.floor(Math.random() * 10000000)),
  }));
};
