/**
 * @fileoverview components/LoadingSpinner.tsx
 * A reusable loading spinner component with customizable size and color.
 */

import React from 'react';

/**
 * LoadingSpinner 컴포넌트의 props 인터페이스.
 * @property {string} [size='w-8 h-8'] - 스피너의 크기 (Tailwind CSS 클래스).
 * @property {string} [color='border-blue-500'] - 스피너의 색상 (Tailwind CSS border-color 클래스).
 * @property {string} [text='로딩 중...'] - 스피너 아래에 표시될 텍스트.
 */
interface LoadingSpinnerProps {
  size?: string;
  color?: string;
  text?: string;
}

/**
 * LoadingSpinner 컴포넌트는 데이터를 로딩 중임을 시각적으로 나타냅니다.
 * 원형 스피너와 함께 로딩 텍스트를 표시할 수 있습니다.
 * @param {LoadingSpinnerProps} props - size, color, text 속성을 포함합니다.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'w-8 h-8',
  color = 'border-blue-500',
  text = '로딩 중...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 ${color} ${size}`}
      ></div>
      {text && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;