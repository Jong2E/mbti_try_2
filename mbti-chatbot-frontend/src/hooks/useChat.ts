import { useState, useCallback, useRef } from 'react';
import { ChatService } from '../services/chatService';
import { ChatSession, ChatMessage, Gender } from '../types/chat';

export interface UseChatReturn {
  session: ChatSession | null;
  isLoading: boolean;
  isConnecting: boolean;
  error: string | null;
  createSession: (gender: Gender) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  endSession: () => Promise<void>;
  clearError: () => void;
}

export const useChat = (): UseChatReturn => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 중복 요청 방지용
  const isProcessing = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createSession = useCallback(async (gender: Gender) => {
    if (isProcessing.current) return;
    
    try {
      setIsConnecting(true);
      setError(null);
      isProcessing.current = true;

      const newSession = await ChatService.createSession({ counselorGender: gender });
      setSession(newSession);
      
      console.log('✅ 세션 생성 완료:', newSession.sessionId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '세션 생성에 실패했습니다.';
      setError(errorMessage);
      console.error('❌ 세션 생성 실패:', err);
    } finally {
      setIsConnecting(false);
      isProcessing.current = false;
    }
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!session || isProcessing.current || !message.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      isProcessing.current = true;

      // 사용자 메시지를 즉시 UI에 추가
      const userMessage: ChatMessage = {
        message: message.trim(),
        sessionId: session.sessionId,
        timestamp: new Date(),
        isFromBot: false,
        counselorGender: session.counselorGender,
      };

      setSession(prevSession => {
        if (!prevSession) return null;
        return {
          ...prevSession,
          messages: [...prevSession.messages, userMessage],
        };
      });

      // 백엔드에 메시지 전송 (12초 딜레이 포함)
      const botResponse = await ChatService.sendMessage({
        message: message.trim(),
        sessionId: session.sessionId,
        counselorGender: session.counselorGender,
      });

      // 봇 응답을 UI에 추가
      setSession(prevSession => {
        if (!prevSession) return null;
        return {
          ...prevSession,
          messages: [...prevSession.messages, botResponse],
        };
      });

      console.log('✅ 메시지 전송 완료');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '메시지 전송에 실패했습니다.';
      setError(errorMessage);
      console.error('❌ 메시지 전송 실패:', err);
    } finally {
      setIsLoading(false);
      isProcessing.current = false;
    }
  }, [session]);

  const endSession = useCallback(async () => {
    if (!session) return;

    try {
      await ChatService.deleteSession(session.sessionId);
      setSession(null);
      setError(null);
      console.log('✅ 세션 종료 완료');
    } catch (err) {
      console.warn('⚠️ 세션 삭제 실패 (무시됨):', err);
      // 세션 종료는 실패해도 UI에서는 초기화
      setSession(null);
      setError(null);
    }
  }, [session]);

  return {
    session,
    isLoading,
    isConnecting,
    error,
    createSession,
    sendMessage,
    endSession,
    clearError,
  };
};