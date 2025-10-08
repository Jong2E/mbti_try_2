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
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const app_1 = require("firebase/app");
const remote_config_1 = require("firebase/remote-config");
const generative_ai_1 = require("@google/generative-ai");
let FirebaseService = class FirebaseService {
    app;
    remoteConfig;
    genAI;
    isInitialized = false;
    constructor() {
        this.initializeFirebase();
    }
    async initializeFirebase() {
        try {
            const firebaseConfig = {
                apiKey: process.env.FIREBASE_API_KEY,
                authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                projectId: process.env.FIREBASE_PROJECT_ID,
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.FIREBASE_APP_ID,
            };
            this.app = (0, app_1.initializeApp)(firebaseConfig);
            this.remoteConfig = (0, remote_config_1.getRemoteConfig)(this.app);
            this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
            this.remoteConfig.defaultConfig = {
                gemini_api_key: '',
            };
            this.isInitialized = true;
        }
        catch (error) {
            console.warn('Firebase 초기화 실패:', error.message);
            this.isInitialized = false;
        }
    }
    async getGeminiApiKey() {
        try {
            if (this.isInitialized) {
                await (0, remote_config_1.fetchAndActivate)(this.remoteConfig);
                const apiKey = (0, remote_config_1.getValue)(this.remoteConfig, 'gemini_api_key').asString();
                if (apiKey) {
                    return apiKey;
                }
            }
            return process.env.GEMINI_API_KEY || '';
        }
        catch (error) {
            console.warn('Gemini API 키 가져오기 실패:', error.message);
            return process.env.GEMINI_API_KEY || '';
        }
    }
    async getGenerativeAI() {
        if (!this.genAI) {
            const apiKey = await this.getGeminiApiKey();
            if (!apiKey) {
                throw new Error('Gemini API 키가 설정되지 않았습니다.');
            }
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
        return this.genAI;
    }
    async refreshApiKey() {
        this.genAI = undefined;
        return this.getGenerativeAI();
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map