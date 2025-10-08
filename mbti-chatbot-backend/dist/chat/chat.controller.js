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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_message_dto_1 = require("./dto/chat-message.dto");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    createSession(createSessionDto) {
        try {
            return this.chatService.createSession(createSessionDto);
        }
        catch (error) {
            throw new common_1.HttpException('세션 생성에 실패했습니다.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getSession(sessionId) {
        const session = this.chatService.getSession(sessionId);
        if (!session) {
            throw new common_1.HttpException('세션을 찾을 수 없습니다.', common_1.HttpStatus.NOT_FOUND);
        }
        return session;
    }
    async sendMessage(sendMessageDto) {
        try {
            return await this.chatService.sendMessage(sendMessageDto);
        }
        catch (error) {
            if (error.message === '세션을 찾을 수 없습니다.') {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('메시지 전송에 실패했습니다.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    deleteSession(sessionId) {
        const success = this.chatService.deleteSession(sessionId);
        if (!success) {
            throw new common_1.HttpException('세션을 찾을 수 없습니다.', common_1.HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }
    healthCheck() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('session'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_message_dto_1.CreateSessionDto]),
    __metadata("design:returntype", chat_message_dto_1.SessionDto)
], ChatController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('session/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", chat_message_dto_1.SessionDto)
], ChatController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Delete)('session/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], ChatController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ChatController.prototype, "healthCheck", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map