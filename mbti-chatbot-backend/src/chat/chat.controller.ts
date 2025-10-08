import { Controller, Post, Get, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto, CreateSessionDto, ChatResponseDto, SessionDto } from './dto/chat-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('session')
  createSession(@Body() createSessionDto: CreateSessionDto): SessionDto {
    try {
      return this.chatService.createSession(createSessionDto);
    } catch (error) {
      throw new HttpException('세션 생성에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('session/:sessionId')
  getSession(@Param('sessionId') sessionId: string): SessionDto {
    const session = this.chatService.getSession(sessionId);
    if (!session) {
      throw new HttpException('세션을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  @Post('message')
  async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<ChatResponseDto> {
    try {
      return await this.chatService.sendMessage(sendMessageDto);
    } catch (error) {
      if (error.message === '세션을 찾을 수 없습니다.') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('메시지 전송에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('session/:sessionId')
  deleteSession(@Param('sessionId') sessionId: string): { success: boolean } {
    const success = this.chatService.deleteSession(sessionId);
    if (!success) {
      throw new HttpException('세션을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }

  @Get('health')
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
