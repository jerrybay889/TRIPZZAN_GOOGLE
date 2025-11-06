/**
 * @fileoverview geminiService.ts
 * Service layer for interacting with the Google Gemini API.
 * Handles API initialization and sending messages to the model.
 */

import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from '../constants';
import { ChatMessage } from '../types';

let currentChat: Chat | null = null;
let currentAiInstance: GoogleGenAI | null = null;

/**
 * Gemini API 키를 환경 변수에서 가져옵니다.
 * 이 앱은 API 키가 `process.env.API_KEY`에 설정되어 있다고 가정합니다.
 */
const API_KEY = process.env.API_KEY;

/**
 * GoogleGenAI 인스턴스를 초기화하고 새로운 채팅 세션을 생성합니다.
 * 시스템 지시사항을 설정하여 AI의 역할을 정의합니다.
 * @returns {Promise<Chat>} 초기화된 채팅 세션 인스턴스.
 * @throws {Error} API 키가 없거나 Gemini 서비스 초기화에 실패할 경우 에러를 발생시킵니다.
 */
export const initGeminiChat = async (): Promise<Chat> => {
  if (!API_KEY) {
    throw new Error('Gemini API Key is not set in environment variables.');
  }

  // 매번 새로운 인스턴스를 생성하여 최신 API 키를 사용하도록 보장합니다.
  currentAiInstance = new GoogleGenAI({ apiKey: API_KEY });

  // 기존 채팅 인스턴스가 있다면 닫고 새로 생성
  if (currentChat) {
    // Note: The @google/genai library does not provide a direct 'close' method for Chat sessions.
    // Reassigning `currentChat = null` effectively resets the session for a new conversation.
    currentChat = null;
  }

  currentChat = currentAiInstance.chats.create({
    model: GEMINI_MODEL,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.9, // 창의적인 응답을 위해 온도 설정
      topP: 0.95,       // 응답 다양성 제어
      topK: 64,         // 응답 다양성 제어
    },
  });
  console.log('Gemini chat session initialized.');
  return currentChat;
};

/**
 * Gemini 채팅 세션을 통해 메시지를 보내고 응답을 받습니다.
 * 스트리밍 방식으로 응답을 처리하여 점진적으로 메시지를 표시합니다.
 * @param {string} message - 사용자 또는 시스템이 보낼 메시지.
 * @param {ChatMessage[]} history - 현재까지의 대화 기록 (모델의 컨텍스트 유지용).
 * @param {(chunk: string) => void} onChunkReceived - 스트리밍 청크를 받을 때마다 호출될 콜백 함수.
 * @returns {Promise<string>} 모델로부터의 최종 응답 텍스트.
 * @throws {Error} 채팅 세션이 초기화되지 않았거나 메시지 전송에 실패할 경우 에러를 발생시킵니다.
 */
export const sendMessage = async (
  message: string,
  history: ChatMessage[],
  onChunkReceived: (chunk: string) => void,
): Promise<string> => {
  if (!currentChat) {
    throw new Error('Gemini chat session is not initialized. Please call initGeminiChat first.');
  }

  try {
    // `sendMessageStream`은 현재 대화 기록을 자동으로 컨텍스트에 포함합니다.
    // 따라서 history 배열을 직접 넘겨줄 필요는 없으며, Chat 인스턴스가 내부적으로 관리합니다.
    // 하지만 API의 `contents`는 객체 배열을 기대하므로, 간단한 텍스트 메시지를 위해 `message` 속성을 사용합니다.
    const responseStream = await currentChat.sendMessageStream({ message: message });

    let fullResponse = '';
    for await (const chunk of responseStream) {
      const textChunk = chunk.text;
      if (textChunk) {
        fullResponse += textChunk;
        onChunkReceived(textChunk); // UI에 실시간 업데이트
      }
    }
    return fullResponse;
  } catch (error: any) {
    console.error('Failed to send message to Gemini:', error);
    // 특정 오류 메시지에 따라 API 키 선택을 유도할 수 있습니다.
    if (error.message && error.message.includes("Requested entity was not found.")) {
      console.warn("API key might be invalid or project is not configured. Prompting user to select API key.");
      // Assuming window.aistudio.openSelectKey() exists in the environment
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        throw new Error('API key might be invalid or project not configured. Please try again after selecting API key.');
      }
    }
    throw new Error(`Failed to get response from Gemini: ${error.message || 'Unknown error'}`);
  }
};
