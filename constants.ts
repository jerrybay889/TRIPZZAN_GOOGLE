/**
 * @fileoverview constants.ts
 * Global constants shared across the application, including Gemini model details and initial chat prompts.
 */

import { Question } from './types';

/**
 * GEMINI_MODEL은 Gemini API 호출에 사용될 모델 이름을 정의합니다.
 * 본 앱은 텍스트 기반의 대화형 작업을 수행하므로 'gemini-2.5-flash' 모델을 사용합니다.
 */
export const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * SYSTEM_INSTRUCTION은 Gemini 모델에게 부여할 시스템 지시사항입니다.
 * '여행 짠순이' AI 어시스턴트의 역할, 특징, 대화 스타일 등을 정의합니다.
 */
export const SYSTEM_INSTRUCTION = `당신은 여행 비용 절감 전문 AI 어시스턴트 '여행 짠순이'입니다.

역할: 사용자가 계획 중인 여행에서 최대한 비용을 절감하면서도 만족도 높은 여행 경험을 제공하기 위해 전략적 조언을 합니다.

핵심 특징:
1. 예산 친화적 여행 팁 제공
2. 저비용 항공편, 숙소, 식사, 활동 추천
3. 여행 시즌별 가격 분석
4. 쿠폰, 할인, 프로모션 정보 활용
5. 숨겨진 보석 같은 무료/저가 명소 추천

대화 스타일:
- 친근하고 긍정적인 톤
- 실용적이고 구체적인 조언
- 사용자의 예산 범위 존중
- 때로는 유머와 함께 비용 절감 꿀팁 제공

제공할 정보:
- 항공권 구매 시기 및 방법
- 숙소 선택 가이드 (게스트하우스, 에어비앤비, 예산 호텔)
- 현지 교통 활용법 (대중교통, 야간버스 등)
- 현지 음식 vs 관광지 음식 비용 비교
- 무료/저가 관광지 리스트
- 월별, 시즌별 가격 변동 정보
- 환율 및 물가 정보
- 비자 비용 최소화 팁
- 여행보험 선택 가이드

주의사항:
- 안전과 건강은 절대 타협하지 않음
- 사기나 불안전한 옵션은 절대 추천하지 않음
- 지속 가능한 여행과 현지 문화 존중 강조
- 특정 브랜드나 서비스 과도한 홍보 금지`;

/**
 * INITIAL_QUESTIONS는 사용자로부터 여행 정보를 수집하기 위한 초기 질문 목록입니다.
 * 각 질문은 `Question` 인터페이스를 따릅니다.
 */
export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '어디로 여행을 떠나고 싶으신가요? (국가/도시)',
    type: 'text',
    key: 'destination',
  },
  {
    id: 'q2',
    text: '언제부터 언제까지 여행할 계획이신가요? (예: 2024년 10월 1일 ~ 10월 7일)',
    type: 'text',
    key: 'travelDates',
  },
  {
    id: 'q3',
    text: '함께 여행할 인원수는 몇 명인가요?',
    type: 'number',
    key: 'travelers',
  },
  {
    id: 'q4',
    text: '여행의 총 예산은 얼마로 생각하고 계신가요? (원화 기준, 숫자만 입력)',
    type: 'number',
    key: 'totalBudget',
  },
  {
    id: 'q5',
    text: '선호하는 여행 스타일은 무엇인가요? (예: 배낭여행, 중급, 럭셔리한 저가여행)',
    type: 'text',
    key: 'travelStyle',
  },
  {
    id: 'q6',
    text: '특별히 관심 있는 분야가 있으신가요? (예: 음식, 문화, 자연, 액티비티)',
    type: 'text',
    key: 'specialInterests',
  },
];

/**
 * INITIAL_PROMPT_TEMPLATE는 초기 질문 답변을 바탕으로 Gemini에 보낼 프롬프트 템플릿입니다.
 * placeholder는 TravelPlan 인터페이스의 키와 일치해야 합니다.
 */
export const INITIAL_PROMPT_TEMPLATE = `제가 계획 중인 여행 정보는 다음과 같습니다:
- 목적지: {destination}
- 여행 기간: {travelDates}
- 인원수: {travelers}명
- 총 예산: {totalBudget}원
- 여행 스타일: {travelStyle}
- 특별 관심사: {specialInterests}

이 정보를 바탕으로, 제가 이 여행에서 최대한 비용을 절감하면서도 만족도 높은 경험을 할 수 있도록 구체적이고 실용적인 조언을 해주세요. 항공권, 숙소, 식사, 활동, 현지 교통 등 전반적인 예산 절감 팁과 함께, 추천할 만한 무료/저가 명소도 알려주시면 감사하겠습니다.`;
