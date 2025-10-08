import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsEnum(Gender)
  counselorGender: Gender;
}

export class CreateSessionDto {
  @IsEnum(Gender)
  counselorGender: Gender;
}

export class ChatResponseDto {
  message: string;
  sessionId: string;
  timestamp: Date;
  isFromBot: boolean;
  counselorGender: Gender;
}

export class SessionDto {
  sessionId: string;
  counselorGender: Gender;
  createdAt: Date;
  messages: ChatResponseDto[];
}