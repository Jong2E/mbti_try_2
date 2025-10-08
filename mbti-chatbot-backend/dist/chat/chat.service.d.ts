import { FirebaseService } from '../config/firebase/firebase.service';
import { SendMessageDto, CreateSessionDto, ChatResponseDto, SessionDto } from './dto/chat-message.dto';
export declare class ChatService {
    private readonly firebaseService;
    private sessions;
    constructor(firebaseService: FirebaseService);
    createSession(createSessionDto: CreateSessionDto): SessionDto;
    getSession(sessionId: string): SessionDto | null;
    sendMessage(sendMessageDto: SendMessageDto): Promise<ChatResponseDto>;
    private generateAIResponse;
    private getISTPPrompt;
    private getFallbackResponse;
    deleteSession(sessionId: string): boolean;
    getAllSessions(): SessionDto[];
}
