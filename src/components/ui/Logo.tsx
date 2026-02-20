import React from 'react';

// Fallback simple logo component if SVG fails to render
const SimpleLogo: React.FC<{ size: string }> = ({ size }) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center`}>
        <span className="text-white font-bold text-lg">♥</span>
    </div>
);

interface LogoProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = true }) => {
    const [mounted, setMounted] = React.useState(false);
    const id = React.useId();
    const gradientId = `logoGradient-${id.replace(/:/g, '')}`;
    const glowId = `logoGlow-${id.replace(/:/g, '')}`;

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const sizeClasses = {
        xs: 'w-5 h-5',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-20 h-20'
    };

    const textClasses = {
        xs: 'text-sm',
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-3xl',
        xl: 'text-5xl'
    };

    // Prevent hydration mismatch by not rendering complex SVG until mounted
    if (!mounted) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <SimpleLogo size={sizeClasses[size]} />
                {showText && (
                    <span className={`${textClasses[size]} font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                        Astro Marriage
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`relative ${sizeClasses[size]} group`}>
                {/* Outer Orbital Ring - more visible */}
                <div className="absolute inset-0 border-2 border-indigo-500/50 dark:border-indigo-400/40 rounded-full animate-spin-slow" />

                {/* Nested Orbital Ring */}
                <div className="absolute inset-1 border-2 border-purple-400/40 dark:border-purple-500/30 rounded-full animate-spin-slow [animation-direction:reverse] [animation-duration:6s]" />

                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full drop-shadow-lg"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} /> {/* indigo-500 */}
                            <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} /> {/* purple-500 */}
                        </linearGradient>
                        <filter id={glowId}>
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Abstract Cosmic Heart / Union */}
                    <path
                        d="M50 85 C20 65, 10 45, 10 30 A20 20 0 0 1 50 30 A20 20 0 0 1 90 30 C90 45, 80 65, 50 85"
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{ filter: `url(#${glowId})` }}
                    />

                    {/* Central Star */}
                    <path
                        d="M50 25 L54 42 L70 42 L58 52 L62 70 L50 60 L38 70 L42 52 L30 42 L46 42 Z"
                        fill={`url(#${gradientId})`}
                        className="animate-pulse-slow"
                    />

                    {/* Sparkles */}
                    <circle cx="25" cy="25" r="2" fill="#fbbf24" className="animate-pulse" />
                    <circle cx="75" cy="75" r="2" fill="#fbbf24" className="animate-pulse [animation-delay:1s]" />
                    <circle cx="85" cy="35" r="1.5" fill="#f59e0b" className="animate-pulse [animation-delay:0.5s]" />
                </svg>
            </div>

            {showText && (
                <span className={`${textClasses[size]} font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 transition-colors duration-500`}>
                    Astro Marriage
                </span>
            )}
        </div>
    );
};
