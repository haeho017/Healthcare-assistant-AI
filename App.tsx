import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, MessageSender } from './types';
import { getAIResponse } from './services/geminiService';
import { AI_WELCOME_MESSAGE } from './constants';
import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import InputField from './components/InputField';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'initial-welcome',
        text: AI_WELCOME_MESSAGE,
        sender: MessageSender.AI,
      },
    ]);
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: MessageSender.USER,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseText = await getAIResponse(text);
      let messageText = aiResponseText;
      let followUp = undefined;
      try {
        const codeBlockRegex = /```json[\s\S]*?```/g;
        const codeBlockMatch = aiResponseText.match(codeBlockRegex);
        if (codeBlockMatch) {
          for (const block of codeBlockMatch) {
            const jsonMatch = block.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
              const parsed = JSON.parse(jsonMatch[1]);
              if (parsed.followUp) {
                followUp = parsed.followUp;
              }
            }
            messageText = messageText.replace(block, '').trim();
          }
        } else {
          const jsonInlineRegex = /\{\s*"followUp"[\s\S]*?\}\s*$/;
          const inlineMatch = aiResponseText.match(jsonInlineRegex);
          if (inlineMatch) {
            try {
              const parsed = JSON.parse(inlineMatch[0]);
              if (parsed.followUp) {
                followUp = parsed.followUp;
              }
            } catch {}
            messageText = messageText.replace(jsonInlineRegex, '').trim();
          }
        }
      } catch (e) {
        console.error('Error parsing follow-up:', e);
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: messageText,
        sender: MessageSender.AI,
        followUp,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        sender: MessageSender.AI,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{background: 'var(--background)'}}>
      <Header />
      <main id="chat-area">
        {messages.map((msg) => (
        <ChatBubble 
          key={msg.id} 
          message={msg}
          onFollowUpSelect={(_value, text) => handleSendMessage(text)}
          onFollowUpInput={(text) => handleSendMessage(text)}
        />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="card">
                <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>
      <InputField onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
