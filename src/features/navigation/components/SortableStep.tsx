import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StepButton } from './StepButton';

interface SortableStepProps {
  step: {
    id: string;
    label: string;
    icon?: string;
  };
  isActive: boolean;
  onClick: () => void;
  onOptionsClick: (x: number, y: number) => void;
}

export const SortableStep: React.FC<SortableStepProps> = ({
  step,
  isActive,
  onClick,
  onOptionsClick
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : undefined,
        opacity: isDragging ? 0.7 : 1,
        userSelect: "none",
        boxSizing: 'border-box',
      }}
      tabIndex={-1}
    >
      <StepButton
        step={step}
        isActive={isActive}
        onClick={onClick}
        onOptionsClick={onOptionsClick}
        dragHandleProps={{
          ...attributes,
          ...listeners
        }}
      />
    </div>
  );
}; 