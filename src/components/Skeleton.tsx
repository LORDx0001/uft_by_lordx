import React from 'react';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    variant?: 'rectangle' | 'circle' | 'text';
    mode?: 'dark' | 'light';
}

const Skeleton: React.FC<SkeletonProps> = ({
    width,
    height,
    className = '',
    variant = 'rectangle',
    mode = 'dark'
}) => {
    const baseClass = mode === 'dark' ? 'animate-shimmer bg-white/5' : 'animate-shimmer-light bg-gray-100';
    const variantClass = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded' : 'rounded-xl';

    return (
        <div
            className={`${baseClass} ${variantClass} ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height
            }}
        />
    );
};

export default Skeleton;
