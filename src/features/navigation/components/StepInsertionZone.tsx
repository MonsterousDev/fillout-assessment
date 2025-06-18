import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { StepConnector } from './StepConnector';

interface StepInsertionZoneProps {
  onInsert: () => void;
  isVisible: boolean;
}

export const StepInsertionZone: React.FC<StepInsertionZoneProps> = ({ onInsert, isVisible }) => {
  return (
    <div
      className={`group relative flex items-center justify-center min-w-[80px] mx-1`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        pointerEvents: isVisible ? "auto" : "none",
        transition: 'all 0.2s ease-in-out'
      }}
      onMouseDown={e => e.preventDefault()}
    >
      <StepConnector />
      <button
        type="button"
        onClick={onInsert}
        className={`
          bg-white shadow border border-[#E3E5EA] z-10 p-1 rounded-full
          mx-2
          ${isVisible ? 'animate-pop-in' : ''}
          hover:scale-110 transition-transform duration-200
        `}
        style={{
          animation: isVisible ? 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
        }}
        title="Add step"
        tabIndex={-1}
      >
        <PlusIcon className="w-4 h-4 text-black" />
      </button>
      <StepConnector />
      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}; 