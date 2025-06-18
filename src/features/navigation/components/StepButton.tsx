import React, { useRef } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface StepButtonProps {
  step: {
    id: string;
    label: string;
    icon?: string;
  };
  isActive: boolean;
  onClick: () => void;
  onOptionsClick: (x: number, y: number) => void;
  dragHandleProps?: any;
}

export const StepButton: React.FC<StepButtonProps> = ({
  step,
  isActive,
  onClick,
  onOptionsClick,
  dragHandleProps
}) => {
  const movedRef = useRef(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.options-button')) {
      return;
    }

    movedRef.current = false;

    const onPointerMove = () => {
      movedRef.current = true;
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (!movedRef.current && ev.button === 0) {
        onClick();
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    if (dragHandleProps?.onPointerDown) {
      dragHandleProps.onPointerDown(e);
    }
  };

  return (
    <button
      type="button"
      {...dragHandleProps}
      className={`
        flex items-center gap-2 px-2.5 h-8 rounded-[8px]
        font-[inter] text-sm transition select-none outline-none
        ${isActive 
          ? "bg-white text-[#1A1A1A] border-[#e1e1e1] border-[0.5px]" 
          : "bg-[#9DA4B226] text-[#677289] grayscale hover:bg-[#9DA4B259]"
        }
        cursor-pointer
        active:bg-white active:text-[#1A1A1A] active:grayscale-0 active:border-[#e1e1e1] active:border-[0.5px] active:shadow-[0_0_0_2px_rgba(52,112,255,0.3)]
      `}
      onPointerDown={handlePointerDown}
      tabIndex={0}
    >
      {step.icon && (
        <img
          src={step.icon}
          alt=""
          className="w-4 h-4 pointer-events-none"
        />
      )}
      <span>{step.label}</span>
      {isActive && (
        <div
          ref={optionsRef}
          className="options-button flex items-center ml-2 p-1 rounded hover:bg-gray-100 cursor-pointer"
          tabIndex={-1}
          style={{ 
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1000
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = optionsRef.current?.getBoundingClientRect();
            if (rect) {
              onOptionsClick(rect.left, rect.bottom + 4);
            }
          }}
        >
          <EllipsisVerticalIcon 
            className="w-4 h-4 text-[#677289]"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      )}
    </button>
  );
}; 