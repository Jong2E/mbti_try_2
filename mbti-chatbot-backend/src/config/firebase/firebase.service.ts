import { Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class FirebaseService {
  private app;
  private remoteConfig;
  private genAI: GoogleGenerativeAI | undefined;
  private isInitialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private async initializeFirebase() {
    try {
      // Firebase 설정 (환경변수에서 가져오기)
      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      };

      this.app = initializeApp(firebaseConfig);
      this.remoteConfig = getRemoteConfig(this.app);
      
      // Remote Config 설정
      this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1시간

      // 기본값 설정
      this.remoteConfig.defaultConfig = {
        gemini_api_key: '',
      };

      this.isInitialized = true;
    } catch (error) {
      console.warn('Firebase 초기화 실패:', error.message);
      // Firebase 없이도 작동하도록 폴백 설정
      this.isInitialized = false;
    }
  }

  async getGeminiApiKey(): Promise<string> {
    try {
      if (this.isInitialized) {
        // Firebase Remote Config에서 API 키 가져오기
        await fetchAndActivate(this.remoteConfig);
        const apiKey = getValue(this.remoteConfig, 'gemini_api_key').asString();
        if (apiKey) {
          return apiKey;
        }
      }
      
      // 폴백: 환경변수에서 가져오기
      return process.env.GEMINI_API_KEY || '';
    } catch (error) {
      console.warn('Gemini API 키 가져오기 실패:', error.message);
      return process.env.GEMINI_API_KEY || '';
    }
  }

  async getGenerativeAI(): Promise<GoogleGenerativeAI> {
    if (!this.genAI) {
      const apiKey = await this.getGeminiApiKey();
      if (!apiKey) {
        throw new Error('Gemini API 키가 설정되지 않았습니다.');
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  // API 키 갱신 (필요시 호출)
  async refreshApiKey() {
    this.genAI = undefined;
    return this.getGenerativeAI();
  }
}
