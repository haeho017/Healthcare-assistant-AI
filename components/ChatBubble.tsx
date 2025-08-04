
import React, { useMemo } from 'react';
import showdown from 'showdown';
import { ChatMessage, MessageSender } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

const converter = new showdown.Converter();

const StethoscopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary flex-shrink-0 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);


const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
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
      </div>
    </div>
  );
};

export default ChatBubble;