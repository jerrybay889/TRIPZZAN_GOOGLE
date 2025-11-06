/**
 * @fileoverview components/InitialQuestions.tsx
 * A component to guide the user through initial questions to gather travel plan details.
 */

import React, { useState } from 'react';
import { TravelPlan, Question } from '../types';
import { INITIAL_QUESTIONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

/**
 * InitialQuestions 컴포넌트의 props 인터페이스.
 * @property {(plan: TravelPlan) => void} onQuestionsComplete - 모든 질문에 답변 완료 시 호출될 콜백 함수.
 * @property {boolean} isLoading - 현재 로딩 중인지 여부 (버튼 비활성화).
 */
interface InitialQuestionsProps {
  onQuestionsComplete: (plan: TravelPlan) => void;
  isLoading: boolean;
}

/**
 * InitialQuestions 컴포넌트는 사용자로부터 초기 여행 정보를 수집하기 위한 대화형 질문 흐름을 제공합니다.
 * @param {InitialQuestionsProps} props - onQuestionsComplete 및 isLoading 속성을 포함합니다.
 */
const InitialQuestions: React.FC<InitialQuestionsProps> = ({ onQuestionsComplete, isLoading }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Partial<TravelPlan>>({});
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const currentQuestion: Question = INITIAL_QUESTIONS[currentQuestionIndex];

  /**
   * 사용자 입력 변경을 처리하는 핸들러.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - 입력 변경 이벤트.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    setError(null); // 입력 시 에러 메시지 초기화
  };

  /**
   * 다음 질문으로 넘어가거나 모든 질문 완료 시 콜백을 호출하는 핸들러.
   */
  const handleNextQuestion = () => {
    const trimmedInput = inputValue.trim();

    // 입력 유효성 검사
    if (!trimmedInput) {
      setError('답변을 입력해주세요.');
      return;
    }
    if (currentQuestion.type === 'number') {
      const numValue = parseInt(trimmedInput, 10);
      if (isNaN(numValue) || numValue <= 0) {
        setError('유효한 숫자를 입력해주세요.');
        return;
      }
      setAnswers((prev) => ({ ...prev, [currentQuestion.key]: numValue }));
    } else {
      setAnswers((prev) => ({ ...prev, [currentQuestion.key]: trimmedInput }));
    }

    // 다음 질문으로 이동하거나 완료 처리
    if (currentQuestionIndex < INITIAL_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setInputValue(''); // 다음 질문을 위해 입력 필드 초기화
    } else {
      // 모든 질문 완료
      onQuestionsComplete(answers as TravelPlan);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-6">
          <span role="img" aria-label="airplane">✈️</span> 여행 짠순이 <span role="img" aria-label="piggy bank">🐷</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-8">
          당신의 꿈같은 여행을 위한 <span className="font-bold text-blue-500">최저가</span> 플랜을 세워드릴게요!
        </p>

        {isLoading ? (
          <LoadingSpinner text="여행 짠순이가 플랜을 짜고 있어요!" />
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {currentQuestion.text}
            </h2>
            <input
              type={currentQuestion.type}
              value={inputValue}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNextQuestion();
                }
              }}
              className={`w-full p-3 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="여기에 입력하세요..."
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              onClick={handleNextQuestion}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              disabled={isLoading}
            >
              {currentQuestionIndex < INITIAL_QUESTIONS.length - 1 ? '다음 질문' : '여행 계획 시작!'}
            </button>
          </div>
        )}
      </div>
      <p className="mt-8 text-gray-600 dark:text-gray-400 text-sm">
        API 키는 `process.env.API_KEY` 환경 변수를 통해 자동 주입됩니다.
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
        API 키 선택이 필요한 경우: <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Gemini API Billing</a>
      </p>
    </div>
  );
};

export default InitialQuestions;