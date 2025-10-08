export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface ChatMessage {
  message: string;
  sessionId: string;
  timestamp: Date;
  isFromBot: boolean;
  counselorGender: Gender;
}

export interface ChatSession {
  sessionId: string;
  counselorGender: Gender;
  createdAt: Date;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  message: string;
  sessionId: string;
  counselorGender: Gender;
}

export interface CreateSessionRequest {
  counselorGender: Gender;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
}