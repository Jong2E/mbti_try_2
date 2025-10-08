import { apiClient } from './apiClient';
import {
  ChatSession,
  ChatMessage,
  SendMessageRequest,
  CreateSessionRequest,
  HealthCheckResponse,
} from '../types/chat';

export class ChatService {
  // 헬스 체크
  static async healthCheck(): Promise<HealthCheckResponse> {
    const response = await apiClient.get<HealthCheckResponse>('/chat/health');
    return response.data;
  }

  // 새 세션 생성
  static async createSession(data: CreateSessionRequest): Promise<ChatSession> {
    const response = await apiClient.post<ChatSession>('/chat/session', data);
    return response.data;
  }

  // 세션 정보 가져오기
  static async getSession(sessionId: string): Promise<ChatSession> {
    const response = await apiClient.get<ChatSession>(`/chat/session/${sessionId}`);
    return response.data;
  }

  // 메시지 전송
  static async sendMessage(data: SendMessageRequest): Promise<ChatMessage> {
    const response = await apiClient.post<ChatMessage>('/chat/message', data);
    return response.data;
  }

  // 세션 삭제
  static async deleteSession(sessionId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/chat/session/${sessionId}`);
    return response.data;
  }
}

// API 연결 테스트 함수
export const testApiConnection = async (): Promise<boolean> => {
  try {
    await ChatService.healthCheck();
    console.log('✅ 백엔드 API 연결 성공');
    return true;
  } catch (error) {
    console.error('❌ 백엔드 API 연결 실패:', error);
    return false;
  }
};