import React from 'react';

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Tooltip = ({ children }: { children: React.ReactNode }) => {
    return <div className="relative inline-block group">{children}</div>;
};

export const TooltipTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={`cursor-help ${className || ''}`}>{children}</div>;
};

export const TooltipContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`absolute z-50 invisible group-hover:visible bg-black dark:bg-gray-900 border border-transparent dark:border-gray-800 text-white text-xs rounded p-2 -mt-2 transform -translate-y-full left-1/2 -translate-x-1/2 w-max max-w-xs shadow-lg transition-all ${className || ''}`}>
            {children}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black dark:border-t-gray-900"></div>
        </div>
    );
};
