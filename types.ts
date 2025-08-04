
export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
}
