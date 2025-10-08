import { ChatService } from './chat.service';
import { SendMessageDto, CreateSessionDto, ChatResponseDto, SessionDto } from './dto/chat-message.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createSession(createSessionDto: CreateSessionDto): SessionDto;
    getSession(sessionId: string): SessionDto;
    sendMessage(sendMessageDto: SendMessageDto): Promise<ChatResponseDto>;
    deleteSession(sessionId: string): {
        success: boolean;
    };
    healthCheck(): {
        status: string;
        timestamp: string;
    };
}
