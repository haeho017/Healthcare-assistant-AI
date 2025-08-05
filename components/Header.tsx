import React from 'react';

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const Header: React.FC = () => {
    return (
        <header className="header-bar">
            <HeartIcon />
            <span>서울의원 건강 도우미 AI</span>
        </header>
    );
};

export default Header;
