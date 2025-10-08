import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { HomePage } from './components/pages/HomePage';
import { GenderSelectionPage } from './components/pages/GenderSelectionPage';
import { ChatPage } from './components/pages/ChatPage';
import { useChat } from './hooks/useChat';
import { Gender } from './types/chat';
import { testApiConnection } from './services/chatService';

type AppState = 'home' | 'gender-selection' | 'chat';

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('home');
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  
  const {
    session,
    isLoading,
    isConnecting,
    error,
    createSession,
    sendMessage,
    endSession,
    clearError,
  } = useChat();

  // 앱 시작 시 API 연결 테스트
  useEffect(() => {
    const checkApiConnection = async () => {
      const connected = await testApiConnection();
      setApiConnected(connected);
    };
    
    checkApiConnection();
  }, []);

  // 세션이 생성되면 채팅 페이지로 이동
  useEffect(() => {
    if (session) {
      setCurrentPage('chat');
    }
  }, [session]);

  const handleStartChat = () => {
    clearError();
    setCurrentPage('gender-selection');
  };

  const handleSelectGender = async (gender: Gender) => {
    clearError();
    await createSession(gender);
  };

  const handleGoBackToHome = () => {
    clearError();
    setCurrentPage('home');
  };

  const handleSendMessage = async (message: string) => {
    clearError();
    await sendMessage(message);
  };

  const handleEndSession = async () => {
    await endSession();
    setCurrentPage('home');
  };

  const handleNewChat = async () => {
    await endSession();
    setCurrentPage('gender-selection');
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <HomePage
            key="home"
            onStartChat={handleStartChat}
          />
        )}
        
        {currentPage === 'gender-selection' && (
          <GenderSelectionPage
            key="gender-selection"
            onSelectGender={handleSelectGender}
            onGoBack={handleGoBackToHome}
            isConnecting={isConnecting}
          />
        )}
        
        {currentPage === 'chat' && session && (
          <ChatPage
            key="chat"
            session={session}
            onSendMessage={handleSendMessage}
            onEndSession={handleEndSession}
            onNewChat={handleNewChat}
            isLoading={isLoading}
            error={error}
          />
        )}
      </AnimatePresence>
      
      {/* API 연결 상태 표시 (개발용) */}
      {process.env.NODE_ENV === 'development' && apiConnected !== null && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: 'white',
          background: apiConnected ? '#27ae60' : '#e74c3c',
          zIndex: 9999,
        }}>
          API: {apiConnected ? '연결됨' : '연결 실패'}
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
