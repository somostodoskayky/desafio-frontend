# YouTube Video Platform

A modern, responsive video platform interface built with React, TypeScript, Redux Toolkit, and Tailwind CSS. This application fetches data directly from the YouTube Data API v3 and manages all state on the client side.

## 🚀 Features

- **Popular Videos**: Browse trending and popular videos on the home page
- **Video Search**: Search for videos with debounced input and search history
- **Video Player**: Watch videos with embedded YouTube player
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Centralized state management with Redux Toolkit
- **Type Safety**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **API**: YouTube Data API v3

## 📁 Project Structure

```
src/
├── api/                 # API service layer
│   └── youtube.ts      # YouTube API functions
├── components/         # Reusable UI components
│   ├── layout/        # Header, Sidebar
│   ├── ui/           # Button, Card, LoadingSpinner
│   └── video/        # VideoCard, VideoGrid
├── hooks/            # Custom React hooks
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── SearchPage.tsx
│   └── WatchPage.tsx
├── redux/            # Redux store and slices
│   ├── store.ts
│   └── slices/      # videoSlice, searchSlice, authSlice
├── types/            # TypeScript type definitions
│   └── youtube.d.ts
└── styles/           # Global styles
    └── index.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- YouTube Data API v3 key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd youtube-video-platform
```

2. Install dependencies:

```bash
npm install
```

3. Set up your API keys:

   - Get a YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/)
   - Get a Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/)
   - Create a `.env` file in the root directory
   - Add your API keys:

   ```
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. Configure Google OAuth:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" → "Credentials"
   - Create OAuth 2.0 Client ID (Web application)
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback` (for development)
     - `https://yourdomain.com/auth/callback` (for production)
   - Enable the following APIs:
     - YouTube Data API v3
     - Google+ API (for user profile)

5. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Features Overview

### Home Page

- Displays popular videos fetched from YouTube API
- Responsive grid layout
- Loading states and error handling

### Search Functionality

- Real-time search with debouncing
- Search history with localStorage persistence
- Search results page with video grid

### Video Player

- Embedded YouTube player
- Video details and metadata
- Related videos section (placeholder)

### Responsive Design

- Mobile-first approach
- YouTube-inspired dark theme
- Smooth transitions and hover effects

## 🎨 Styling

The application uses Tailwind CSS with a custom YouTube-inspired color palette:

- `youtube-red`: #FF0000
- `youtube-dark`: #0F0F0F
- `youtube-gray`: #272727
- `youtube-lightGray`: #3F3F3F

## 🔒 API Configuration

The application requires a YouTube Data API v3 key. Make sure to:

1. Enable the YouTube Data API v3 in Google Cloud Console
2. Create credentials (API key)
3. Set appropriate restrictions for security
4. Add the key to your `.env` file

## 🚀 Deployment

To deploy the application:

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
