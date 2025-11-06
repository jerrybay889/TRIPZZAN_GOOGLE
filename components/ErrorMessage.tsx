/**
 * @fileoverview components/ErrorMessage.tsx
 * A reusable component to display error messages clearly to the user.
 */

import React from 'react';

/**
 * ErrorMessage 컴포넌트의 props 인터페이스.
 * @property {string} message - 사용자에게 표시할 에러 메시지.
 * @property {() => void} [onRetry] - '재시도' 버튼 클릭 시 실행될 콜백 함수 (선택 사항).
 */
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorMessage 컴포넌트는 애플리케이션에서 발생한 오류를 사용자에게 알리고,
 * 필요에 따라 재시도 옵션을 제공합니다.
 * @param {ErrorMessageProps} props - message 및 onRetry 속성을 포함합니다.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mx-auto my-4 max-w-md"
      role="alert"
    >
      <strong className="font-bold">오류 발생! 😭</strong>
      <span className="block sm:inline ml-2">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
        >
          재시도
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;