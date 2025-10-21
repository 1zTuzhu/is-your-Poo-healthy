import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { CameraScreen } from './components/CameraScreen';
import { AnalysisScreen } from './components/AnalysisScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Toaster } from './components/ui/sonner';

export interface AnalysisResult {
  id: string;
  imageUrl: string;
  date: Date;
  bristolType: number;
  color: string;
  shape: string;
  health: 'healthy' | 'attention' | 'concern';
  issues: string[];
  recommendations: string[];
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [username, setUsername] = useState('');
  const [currentScreen, setCurrentScreen] = useState<'camera' | 'analysis' | 'history' | 'profile'>('camera');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  const handleLogin = (username: string, isGuestMode: boolean = false) => {
    setIsLoggedIn(true);
    setIsGuest(isGuestMode);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
    setUsername('');
    setCurrentScreen('camera');
    setCurrentImage(null);
    setCurrentAnalysis(null);
    // 游客模式下清空数据
    if (isGuest) {
      setAnalysisResults([]);
    }
  };

  const handlePhotoTaken = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setCurrentScreen('analysis');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    // 游客模式下不保存到历史记录
    if (!isGuest) {
      setAnalysisResults([result, ...analysisResults]);
    }
    setCurrentAnalysis(result);
  };

  const handleBackToCamera = () => {
    setCurrentScreen('camera');
    setCurrentImage(null);
    setCurrentAnalysis(null);
  };

  const handleViewHistory = () => {
    setCurrentScreen('history');
  };

  const handleViewProfile = () => {
    setCurrentScreen('profile');
  };

  const handleViewHistoryItem = (result: AnalysisResult) => {
    setCurrentAnalysis(result);
    setCurrentImage(result.imageUrl);
    setCurrentScreen('analysis');
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'camera' && (
        <CameraScreen 
          onPhotoTaken={handlePhotoTaken}
          onViewHistory={handleViewHistory}
          onViewProfile={handleViewProfile}
          onLogout={handleLogout}
          isGuest={isGuest}
        />
      )}
      
      {currentScreen === 'analysis' && currentImage && (
        <AnalysisScreen
          imageUrl={currentImage}
          analysis={currentAnalysis}
          onAnalysisComplete={handleAnalysisComplete}
          onBackToCamera={handleBackToCamera}
          onViewHistory={handleViewHistory}
          onViewProfile={handleViewProfile}
          isGuest={isGuest}
        />
      )}
      
      {currentScreen === 'history' && (
        <HistoryScreen
          results={analysisResults}
          onBackToCamera={handleBackToCamera}
          onViewItem={handleViewHistoryItem}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          username={username}
          results={analysisResults}
          onBackToCamera={handleBackToCamera}
          onLogout={handleLogout}
        />
      )}
      
      <Toaster />
    </div>
  );
}

export default App;