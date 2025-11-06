/**
 * @fileoverview App.tsx
 * The main application component for '여행 짠순이'.
 * It orchestrates the initial questions flow and the main chat interface with the Gemini API.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, TravelPlan } from './types';
import { initGeminiChat, sendMessage } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import InitialQuestions from './components/InitialQuestions';
import { INITIAL_PROMPT_TEMPLATE } from './constants';
import { Chat } from '@google/genai';

/**
 * App 컴포넌트는 '여행 짠순이' 애플리케이션의 핵심 로직과 UI를 관리합니다.
 * 초기 질문을 통해 여행 계획을 수집하고, 이를 바탕으로 Gemini AI와 대화하는 기능을 제공합니다.
 */
const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null); // 초기 질문 답변 저장
  const chatRef = useRef<Chat | null>(null); // Gemini Chat 인스턴스를 저장

  /**
   * Gemini API 키가 선택되었는지 확인하고, 필요하다면 선택 다이얼로그를 엽니다.
   * Veo 비디오 생성 모델에서 API 키 선택이 필수적이지만,
   * 일반 텍스트 모델에서도 초기 오류 방지를 위해 구현합니다.
   */
  const ensureApiKeySelected = useCallback(async (): Promise<boolean> => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey && window.aistudio.openSelectKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        console.log("API Key not selected. Opening selection dialog.");
        await window.aistudio.openSelectKey();
        // Race condition: hasSelectedApiKey might not immediately return true after openSelectKey.
        // Assume success for now, actual check will happen on API call.
        return true;
      }
      return true;
    }
    return true; // No aistudio context, assume API_KEY is set via process.env
  }, []);


  /**
   * Gemini Chat 세션을 초기화하고, 초기 질문에 대한 답변을 바탕으로 AI에게 첫 메시지를 보냅니다.
   * @param {TravelPlan} plan - 사용자가 입력한 여행 계획 정보.
   */
  const initializeChatSession = useCallback(async (plan: TravelPlan) => {
    setIsLoading(true);
    setError(null);
    try {
      await ensureApiKeySelected();
      // 매번 새로운 Chat 인스턴스를 생성
      chatRef.current = await initGeminiChat();

      setTravelPlan(plan); // 여행 계획 상태 저장

      // 초기 질문 답변으로 프롬프트 생성
      let initialPrompt = INITIAL_PROMPT_TEMPLATE;
      for (const key in plan) {
        initialPrompt = initialPrompt.replace(`{${key}}`, String(plan[key as keyof TravelPlan]));
      }

      // 사용자에게 초기 메시지를 먼저 표시
      setMessages([{ role: 'user', content: initialPrompt }]);

      let accumulatedContent = '';
      const onChunkReceived = (chunk: string) => {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === 'model') {
            // 모델의 마지막 메시지에 청크 추가
            return prevMessages.map((msg, idx) =>
              idx === prevMessages.length - 1 ? { ...msg, content: msg.content + chunk } : msg
            );
          } else {
            // 모델의 첫 메시지이거나 사용자 메시지 다음에 오는 경우
            return [...prevMessages, { role: 'model', content: chunk }];
          }
        });
      };

      await sendMessage(initialPrompt, [{ role: 'user', content: initialPrompt }], onChunkReceived);

    } catch (err: any) {
      console.error("Failed to initialize chat or send initial message:", err);
      setError(err.message || "채팅 세션을 시작하거나 초기 메시지를 보내는 데 실패했습니다.");
      // API 키 문제일 경우 `travelPlan`을 다시 null로 설정하여 InitialQuestions 화면으로 돌아가게 함
      if (err.message && err.message.includes('API key')) {
        setTravelPlan(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [ensureApiKeySelected]); // useCallback 의존성 배열에 ensureApiKeySelected 추가

  /**
   * 사용자가 메시지를 보낼 때 호출되는 핸들러.
   * @param {string} text - 사용자가 입력한 메시지.
   */
  const handleSendMessage = useCallback(async (text: string) => {
    if (!chatRef.current) {
      setError("채팅 세션이 초기화되지 않았습니다.");
      return;
    }

    const newMessage: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setError(null);

    try {
      let accumulatedContent = '';
      const onChunkReceived = (chunk: string) => {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === 'model') {
            // 모델의 마지막 메시지에 청크 추가
            return prevMessages.map((msg, idx) =>
              idx === prevMessages.length - 1 ? { ...msg, content: msg.content + chunk } : msg
            );
          } else {
            // 모델의 첫 메시지이거나 사용자 메시지 다음에 오는 경우
            return [...prevMessages, { role: 'model', content: chunk }];
          }
        });
      };
      await sendMessage(text, messages, onChunkReceived);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError(err.message || "메시지를 보내는 데 실패했습니다.");
      // API 키 문제일 경우 `travelPlan`을 다시 null로 설정하여 InitialQuestions 화면으로 돌아가게 함
      if (err.message && err.message.includes('API key')) {
        setTravelPlan(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages]); // messages를 의존성 배열에 추가하여 최신 메시지 상태를 반영


  /**
   * 오류 발생 시 재시도 핸들러.
   * `travelPlan`이 있으면 채팅 세션을 다시 초기화하고, 없으면 초기 질문으로 돌아갑니다.
   */
  const handleRetry = useCallback(() => {
    setError(null); // 에러 메시지 초기화
    if (travelPlan) {
      // 기존 여행 계획으로 채팅 재시작
      initializeChatSession(travelPlan);
    } else {
      // 초기 질문으로 돌아가기 (이 경우는 거의 발생하지 않아야 함, 초기화 실패 시)
      setTravelPlan(null);
      setMessages([]);
    }
  }, [travelPlan, initializeChatSession]);

  // 애플리케이션 시작 시 API 키 선택 여부 확인
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ensureApiKeySelected(); // 한 번만 실행
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {travelPlan ? (
        <>
          <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl font-bold">✈️ 여행 짠순이</h1>
            <div className="text-sm mt-2 sm:mt-0 sm:ml-4 text-center">
              <p>목적지: {travelPlan.destination} | 예산: {travelPlan.totalBudget.toLocaleString()}원</p>
            </div>
          </header>

          <main className="flex flex-col flex-1 relative overflow-hidden">
            <ChatWindow messages={messages} />
            {isLoading && (
              <div className="absolute inset-x-0 bottom-24 flex justify-center pb-4">
                <LoadingSpinner />
              </div>
            )}
            {error && <ErrorMessage message={error} onRetry={handleRetry} />}
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </main>
        </>
      ) : (
        <InitialQuestions onQuestionsComplete={initializeChatSession} isLoading={isLoading} />
      )}
    </div>
  );
};

export default App;