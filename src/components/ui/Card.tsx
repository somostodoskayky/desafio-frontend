import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
    const baseClasses = 'bg-youtube-gray rounded-lg border border-youtube-lightGray';
    const hoverClasses = hover ? 'hover:bg-youtube-lightGray transition-colors cursor-pointer' : '';

    return (
        <div className={`${baseClasses} ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
