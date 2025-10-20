import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './redux/store';
import type { RootState } from './redux/store';
import { oauthService } from './services/oauthService';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import TrendingPage from './pages/TrendingPage';
import SearchPage from './pages/SearchPage';
import WatchPage from './pages/WatchPage';
import AuthCallback from './pages/AuthCallback';
import UploadPage from './pages/UploadPage';
import MyVideosPage from './pages/MyVideosPage';
import HistoryPage from './pages/HistoryPage';
import LibraryPage from './pages/LibraryPage';

function AppContent() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      oauthService.reloadTokensFromStorage();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-youtube-dark">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/watch/:videoId" element={<WatchPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/my-videos" element={<MyVideosPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;