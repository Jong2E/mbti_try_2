export declare enum Gender {
    MALE = "male",
    FEMALE = "female"
}
export declare class SendMessageDto {
    message: string;
    sessionId: string;
    counselorGender: Gender;
}
export declare class CreateSessionDto {
    counselorGender: Gender;
}
export declare class ChatResponseDto {
    message: string;
    sessionId: string;
    timestamp: Date;
    isFromBot: boolean;
    counselorGender: Gender;
}
export declare class SessionDto {
    sessionId: string;
    counselorGender: Gender;
    createdAt: Date;
    messages: ChatResponseDto[];
}
