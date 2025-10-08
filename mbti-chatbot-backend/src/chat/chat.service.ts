import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../config/firebase/firebase.service';
import { Gender, SendMessageDto, CreateSessionDto, ChatResponseDto, SessionDto } from './dto/chat-message.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  private sessions: Map<string, SessionDto> = new Map();

  constructor(private readonly firebaseService: FirebaseService) {}

  createSession(createSessionDto: CreateSessionDto): SessionDto {
    const sessionId = uuidv4();
    const session: SessionDto = {
      sessionId,
      counselorGender: createSessionDto.counselorGender,
      createdAt: new Date(),
      messages: [],
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): SessionDto | null {
    return this.sessions.get(sessionId) || null;
  }

  async sendMessage(sendMessageDto: SendMessageDto): Promise<ChatResponseDto> {
    const session = this.getSession(sendMessageDto.sessionId);
    if (!session) {
      throw new Error('세션을 찾을 수 없습니다.');
    }

    // 사용자 메시지 저장
    const userMessage: ChatResponseDto = {
      message: sendMessageDto.message,
      sessionId: sendMessageDto.sessionId,
      timestamp: new Date(),
      isFromBot: false,
      counselorGender: sendMessageDto.counselorGender,
    };
    session.messages.push(userMessage);

    // 12초 딜레이 후 AI 응답 생성
    const aiResponse = await this.generateAIResponse(sendMessageDto);
    
    const botMessage: ChatResponseDto = {
      message: aiResponse,
      sessionId: sendMessageDto.sessionId,
      timestamp: new Date(),
      isFromBot: true,
      counselorGender: sendMessageDto.counselorGender,
    };
    session.messages.push(botMessage);

    return botMessage;
  }

  private async generateAIResponse(sendMessageDto: SendMessageDto): Promise<string> {
    try {
      const genAI = await this.firebaseService.getGenerativeAI();
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // ISTP 관련 프롬프트 설정
      const systemPrompt = this.getISTPPrompt(sendMessageDto.counselorGender);
      const userMessage = sendMessageDto.message;

      const prompt = `${systemPrompt}\n\n사용자 질문: ${userMessage}`;

      // 12초 딜레이 추가
      await new Promise(resolve => setTimeout(resolve, 12000));

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI 응답 생성 실패:', error);
      return this.getFallbackResponse(sendMessageDto.counselorGender);
    }
  }

  private getISTPPrompt(gender: Gender): string {
    const genderText = gender === Gender.MALE ? '남성' : '여성';
    
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

  private getFallbackResponse(gender: Gender): string {
    const responses = [
      '죄송합니다. 잠시 생각할 시간이 필요해요. 조금 더 구체적으로 말씀해 주실 수 있나요?',
      'ISTP 유형의 특성상 실용적인 해결책을 찾는 것이 중요하겠네요. 어떤 부분이 가장 궁금하신가요?',
      '현실적인 관점에서 접근해보면 좋을 것 같아요. 더 자세한 상황을 알려주시면 도움을 드릴 수 있을 것 같습니다.',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getAllSessions(): SessionDto[] {
    return Array.from(this.sessions.values());
  }
}
