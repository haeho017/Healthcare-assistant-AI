
export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

export interface FollowUpOption {
  text: string;
  value: string;
}

export interface FollowUpQuestion {
  question: string;
  options?: FollowUpOption[];
  isInput?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  followUp?: FollowUpQuestion;
}
