// Vite 환경변수 타입 선언 (없을 경우)
interface ImportMeta {
  env: {
    VITE_API_KEY: string;
    [key: string]: any;
  };
}

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AI_SYSTEM_PROMPT } from '../constants';


const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
  throw new Error("VITE_API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey });

export const getAIResponse = async (userMessage: string): Promise<string> => {
  // 서울의원 관련 질문이면 공식 홈페이지 정보로 우선 답변
  if (/서울의원|서울 의원|seoul medical clinic|seoul\s*uiwon/i.test(userMessage)) {
    return `서울의원은 경기도 고양시 덕양구 통일로 774에 위치한 종합 의료기관으로,\n내과, 외과, 정형외과, 소아청소년과, 피부과, 신경외과 등 다양한 진료과목을 갖추고 있습니다.\n\n- 진료시간\n  - 평일: 09:00 ~ 18:00\n  - 토요일: 08:30 ~ 13:00\n  - 점심시간: 12:30 ~ 13:30\n  - 일요일/공휴일: 휴진\n- 문의전화: 031-964-1300\n- 주요 서비스: 건강검진, 내과/외과/정형외과/소아과/피부과/신경외과 진료, 최신 의료장비, 쾌적한 환경, 전문 의료진\n- 홈페이지: https://seoul-medical-clinic.vercel.app/\n\n더 자세한 정보나 의료진, 시설, 오시는 길 등은 서울의원 공식 홈페이지를 참고해 주세요.`;
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: AI_SYSTEM_PROMPT,
        temperature: 0.5,
        topK: 32,
        topP: 1,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
};
