
import React, { useMemo, useState } from 'react';
import showdown from 'showdown';
import { ChatMessage, MessageSender } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
  onFollowUpSelect?: (value: string, text: string) => void;
  onFollowUpInput?: (text: string) => void;
}

const converter = new showdown.Converter();

const StethoscopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary flex-shrink-0 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);


const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onFollowUpSelect, onFollowUpInput }) => {
  const [followUpInput, setFollowUpInput] = useState('');
  const isUser = message.sender === MessageSender.USER;

  const bubbleClasses = isUser
    ? 'bg-primary text-white self-end'
    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 self-start';
  
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start items-start gap-3';

  const renderedHtml = useMemo(() => {
    if (!isUser) {
        return converter.makeHtml(message.text);
    }
    return null;
  }, [message.text, isUser]);

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (followUpInput.trim() && onFollowUpInput) {
      onFollowUpInput(followUpInput.trim());
      setFollowUpInput('');
    }
  };

  return (
    <div className={containerClasses}>
       {!isUser && <StethoscopeIcon />}
      <div className={`rounded-xl px-3 py-2 shadow-sm max-w-[90vw] sm:max-w-xl text-[15px] leading-relaxed ${bubbleClasses}`} style={{wordBreak: 'break-word'}}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div
            className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none prose-headings:text-primary-dark prose-headings:font-semibold dark:prose-headings:text-primary-light prose-strong:text-slate-900 dark:prose-strong:text-slate-50 prose-a:text-primary hover:prose-a:text-primary-dark prose-p:my-1 prose-li:my-0 prose-ul:pl-4 prose-ol:pl-4 prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-h1:my-2 prose-h2:my-1 prose-h3:my-1 prose-p:text-[15px] prose-li:text-[15px]"
            style={{lineHeight:1.6, wordBreak:'break-word'}}
            dangerouslySetInnerHTML={{ __html: renderedHtml! }}
          />
        )}
        {!isUser && message.followUp && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">{message.followUp.question}</p>
            {message.followUp.options ? (
              <div className="flex flex-wrap gap-2">
                {message.followUp.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onFollowUpSelect?.(option.value, option.text)}
                    className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : message.followUp.isInput && (
              <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  placeholder="여기에 입력하세요..."
                  className="flex-grow p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-primary-light focus:outline-none dark:bg-slate-700 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!followUpInput.trim()}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-primary-light disabled:cursor-not-allowed transition-colors"
                >
                  전송
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;