import React, { useState } from 'react';

interface InputFieldProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const InputField: React.FC<InputFieldProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 shadow-lg">
      <div className="input-bar">
        <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "AI가 답변을 준비중입니다..." : "여기에 질문을 입력하세요..."}
            disabled={isLoading}
            className="flex-grow p-3 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-primary-light focus:outline-none dark:bg-slate-700 dark:text-white transition duration-200 text-base shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary text-white p-3 rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary-light disabled:cursor-not-allowed transition duration-200 flex-shrink-0 shadow-md"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputField;
