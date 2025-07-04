
import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="App Logo"
    >
      <g className="text-[#E31F26] dark:text-white">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h-3A2.5 2.5 0 0 1 4 4.5v0A2.5 2.5 0 0 1 6.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v0A2.5 2.5 0 0 0 14.5 7h3A2.5 2.5 0 0 0 20 4.5v0A2.5 2.5 0 0 0 17.5 2Z" />
        <path d="M6.5 22A2.5 2.5 0 0 1 4 19.5v0A2.5 2.5 0 0 1 6.5 17h3A2.5 2.5 0 0 1 12 19.5v0A2.5 2.5 0 0 1 9.5 22Z" />
        <path d="M17.5 22A2.5 2.5 0 0 0 20 19.5v0A2.5 2.5 0 0 0 17.5 17h-3A2.5 2.5 0 0 0 12 19.5v0A2.5 2.5 0 0 0 14.5 22Z" />
        <path d="M12 7v10" />
        <path d="M9.5 7A2.5 2.5 0 0 1 7 9.5" />
        <path d="m14.5 7 a2.5 2.5 0 0 0 2.5 2.5" />
        <path d="M9.5 17a2.5 2.5 0 0 0-2.5-2.5" />
        <path d="m14.5 17 a2.5 2.5 0 0 1 2.5-2.5" />
      </g>
    </svg>
  );
};
