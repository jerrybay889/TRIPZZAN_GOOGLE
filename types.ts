/**
 * @fileoverview types.ts
 * Global TypeScript types, interfaces, and enums shared across the application.
 */

/**
 * ChatMessage 인터페이스는 채팅 메시지의 구조를 정의합니다.
 * @property {string} role - 메시지를 보낸 주체 ('user' 또는 'model').
 * @property {string} content - 메시지 내용.
 */
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

/**
 * TravelPlan 인터페이스는 사용자의 초기 여행 계획 정보를 정의합니다.
 * @property {string} destination - 목적지 (국가/도시).
 * @property {string} travelDates - 여행 기간 (언제부터 언제까지).
 * @property {number} travelers - 함께 여행할 인원수.
 * @property {number} totalBudget - 총 예산 (숫자).
 * @property {string} travelStyle - 선호하는 여행 스타일 (예: '배낭여행', '중급', '럭셔리한 저가여행').
 * @property {string} specialInterests - 특별한 관심사 (예: '음식', '문화', '자연').
 */
export interface TravelPlan {
  destination: string;
  travelDates: string;
  travelers: number;
  totalBudget: number;
  travelStyle: string;
  specialInterests: string;
}

/**
 * Question 인터페이스는 초기 질문의 구조를 정의합니다.
 * @property {string} id - 질문의 고유 ID.
 * @property {string} text - 사용자에게 표시될 질문 텍스트.
 * @property {string} type - 사용자 입력 필드의 타입 (예: 'text', 'number').
 * @property {string} key - TravelPlan 인터페이스에서 해당 질문에 대한 답변이 저장될 키.
 */
export interface Question {
  id: string;
  text: string;
  type: 'text' | 'number';
  key: keyof TravelPlan;
}