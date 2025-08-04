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
