import React from 'react';

const SkeletonMessage = ({ isSender }: { isSender?: boolean }) => (
    <div className={`flex items-start gap-3 my-4 ${isSender ? 'flex-row-reverse' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className={`flex-1 space-y-2 ${isSender ? 'items-end' : ''}`}>
            <div className={`h-4 rounded-md bg-gray-200 animate-pulse ${isSender ? 'w-24 ml-auto' : 'w-1/8'}`}></div>
            <div className={`h-10 rounded-lg bg-gray-200 animate-pulse ${isSender ? 'w-2/3 ml-auto' : 'w-2/3'}`}></div>
        </div>
    </div>
);

export const MessagesSkeleton = () => {
    return (
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-xs text-center text-gray-400 mb-4 bg-gray-100 rounded-full px-3 py-1 inline-block">
                Loading conversation...
            </div>
            <SkeletonMessage isSender />
            <SkeletonMessage />
            <SkeletonMessage isSender />
            <SkeletonMessage isSender />
            <SkeletonMessage />
            <SkeletonMessage isSender />
        </div>
    );
}; 