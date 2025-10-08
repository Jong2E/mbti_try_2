import { GoogleGenerativeAI } from '@google/generative-ai';
export declare class FirebaseService {
    private app;
    private remoteConfig;
    private genAI;
    private isInitialized;
    constructor();
    private initializeFirebase;
    getGeminiApiKey(): Promise<string>;
    getGenerativeAI(): Promise<GoogleGenerativeAI>;
    refreshApiKey(): Promise<GoogleGenerativeAI>;
}
