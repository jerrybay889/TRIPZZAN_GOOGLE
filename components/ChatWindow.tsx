/**
 * @fileoverview components/ChatWindow.tsx
 * Displays the chat messages, distinguishing between user and AI messages, with a scroll-to-bottom feature.
 */

import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

/**
 * ChatWindow 컴포넌트의 props 인터페이스.
 * @property {ChatMessage[]} messages - 표시할 채팅 메시지 배열.
 */
interface ChatWindowProps {
  messages: ChatMessage[];
}

/**
 * ChatWindow 컴포넌트는 대화 내용을 표시하는 영역입니다.
 * 사용자 메시지와 AI 메시지를 구분하여 보여주며, 메시지가 추가될 때마다 자동으로 스크롤됩니다.
 * @param {ChatWindowProps} props - messages 속성을 포함합니다.
 */
const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지가 업데이트될 때마다 자동으로 최신 메시지로 스크롤합니다.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50 dark:bg-gray-800">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xl px-4 py-2 rounded-lg shadow-md ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {/* 개행 문자를 <br> 태그로 변환하여 텍스트 포맷 유지 */}
            {msg.content.split('\n').map((item, key) => (
              <React.Fragment key={key}>
                {item}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} /> {/* 자동 스크롤을 위한 더미 엘리먼트 */}
    </div>
  );
};

export default ChatWindow;