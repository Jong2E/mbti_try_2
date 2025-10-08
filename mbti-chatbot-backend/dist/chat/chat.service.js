"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../config/firebase/firebase.service");
const chat_message_dto_1 = require("./dto/chat-message.dto");
const uuid_1 = require("uuid");
let ChatService = class ChatService {
    firebaseService;
    sessions = new Map();
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    createSession(createSessionDto) {
        const sessionId = (0, uuid_1.v4)();
        const session = {
            sessionId,
            counselorGender: createSessionDto.counselorGender,
            createdAt: new Date(),
            messages: [],
        };
        this.sessions.set(sessionId, session);
        return session;
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId) || null;
    }
    async sendMessage(sendMessageDto) {
        const session = this.getSession(sendMessageDto.sessionId);
        if (!session) {
            throw new Error('세션을 찾을 수 없습니다.');
        }
        const userMessage = {
            message: sendMessageDto.message,
            sessionId: sendMessageDto.sessionId,
            timestamp: new Date(),
            isFromBot: false,
            counselorGender: sendMessageDto.counselorGender,
        };
        session.messages.push(userMessage);
        const aiResponse = await this.generateAIResponse(sendMessageDto);
        const botMessage = {
            message: aiResponse,
            sessionId: sendMessageDto.sessionId,
            timestamp: new Date(),
            isFromBot: true,
            counselorGender: sendMessageDto.counselorGender,
        };
        session.messages.push(botMessage);
        return botMessage;
    }
    async generateAIResponse(sendMessageDto) {
        try {
            const genAI = await this.firebaseService.getGenerativeAI();
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const systemPrompt = this.getISTPPrompt(sendMessageDto.counselorGender);
            const userMessage = sendMessageDto.message;
            const prompt = `${systemPrompt}\n\n사용자 질문: ${userMessage}`;
            await new Promise(resolve => setTimeout(resolve, 12000));
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('AI 응답 생성 실패:', error);
            return this.getFallbackResponse(sendMessageDto.counselorGender);
        }
    }
    getISTPPrompt(gender) {
        const genderText = gender === chat_message_dto_1.Gender.MALE ? '남성' : '여성';
        return `당신은 MBTI ISTP 유형에 대한 전문 상담사입니다. ${genderText} 상담사로서 따뜻하고 친근한 톤으로 상담을 진행합니다.

ISTP (잇팁, 만능재주꾼) 특징:
- 실용적이고 현실적인 접근을 선호
- 논리적이고 분석적인 사고
- 독립적이고 자율성을 중시
- 문제 해결 능력이 뛰어남
- 새로운 경험과 도전을 좋아함
- 감정 표현보다는 행동으로 보여주는 경향
- 즉흥적이고 유연한 대처 능력
- 혼자만의 시간이 필요함

상담 가이드라인:
1. 구체적이고 실용적인 조언 제공
2. 감정적인 어필보다는 논리적인 설명
3. 직접적이고 간결한 소통
4. 상대방의 독립성과 자율성 존중
5. 실제 경험과 사례 중심의 대화
6. 강요하지 않고 선택권 제공

답변은 200자 이내로 간결하게 작성하되, 공감과 이해를 바탕으로 실질적인 도움이 되는 조언을 해주세요.`;
    }
    getFallbackResponse(gender) {
        const responses = [
            '죄송합니다. 잠시 생각할 시간이 필요해요. 조금 더 구체적으로 말씀해 주실 수 있나요?',
            'ISTP 유형의 특성상 실용적인 해결책을 찾는 것이 중요하겠네요. 어떤 부분이 가장 궁금하신가요?',
            '현실적인 관점에서 접근해보면 좋을 것 같아요. 더 자세한 상황을 알려주시면 도움을 드릴 수 있을 것 같습니다.',
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    deleteSession(sessionId) {
        return this.sessions.delete(sessionId);
    }
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], ChatService);
//# sourceMappingURL=chat.service.js.map