/**
 * @fileoverview components/ChatInput.tsx
 * Provides an input field and a send button for users to send messages in the chat.
 */

import React, { useState } from 'react';

/**
 * ChatInput 컴포넌트의 props 인터페이스.
 * @property {(message: string) => void} onSendMessage - 메시지 전송 시 호출될 콜백 함수.
 * @property {boolean} isLoading - 메시지 전송 중인지 여부 (입력 필드 및 버튼 비활성화).
 */
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

/**
 * ChatInput 컴포넌트는 사용자가 메시지를 입력하고 전송할 수 있는 UI를 제공합니다.
 * 메시지 전송 중에는 입력 필드와 전송 버튼이 비활성화됩니다.
 * @param {ChatInputProps} props - onSendMessage 및 isLoading 속성을 포함합니다.
 */
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState<string>('');

  /**
   * 메시지를 전송하는 핸들러 함수입니다.
   * 입력 필드가 비어있지 않고, 현재 로딩 중이 아닐 때만 메시지를 전송합니다.
   * @param {React.FormEvent} e - 폼 제출 이벤트.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput(''); // 입력 필드 초기화
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700 flex items-center shadow-lg">
      <textarea
        className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isLoading ? '응답 생성 중...' : '메시지를 입력하세요...'}
        rows={1}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        className={`ml-3 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? '전송 중...' : '전송'}
      </button>
    </form>
  );
};

export default ChatInput;