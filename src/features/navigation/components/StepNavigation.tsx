import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableStep } from './SortableStep';
import { StepInsertionZone } from './StepInsertionZone';
import { StepOptionsMenu } from './StepOptionsMenu';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import { StepConnector } from './StepConnector';

export const StepNavigation: React.FC = () => {
  const {
    steps,
    activeStepId,
    menuPosition,
    selectedStepId,
    handleStepClick,
    handleDragEnd,
    handleAddStep,
    handleOptionsClick,
    handleCloseMenu,
    handleDeleteStep,
    handleRenameStep,
    handleDuplicateStep,
    handleCopyStep,
    handleSetFirstStep
  } = useStepNavigation();

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      handleDragEnd({ active: { id: String(active.id) }, over: { id: String(over.id) } });
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <div className="flex items-center">
          <SortableContext
            items={steps.map((step) => step.id)}
            strategy={horizontalListSortingStrategy}
          >
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <SortableStep
                  step={step}
                  isActive={step.id === activeStepId}
                  onClick={() => handleStepClick(step.id)}
                  onOptionsClick={(x, y) => handleOptionsClick(step.id, x, y)}
                />
                {index < steps.length - 1 && (
                  <div
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="flex items-center"
                    style={{ minHeight: 40 }}
                  >
                    {hoveredIdx === index ? (
                      <StepInsertionZone
                        onInsert={() => handleAddStep(index + 1)}
                        isVisible={true}
                      />
                    ) : (
                      <StepConnector />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </SortableContext>
          <StepConnector />
          <button
            className="ml-2 flex items-center gap-1 px-2.5 h-8 rounded-[8px] border border-[#E3E5EA] bg-white hover:bg-[#F5F6F8] text-sm text-[#464D5B] font-medium transition shadow-sm"
            onClick={() => handleAddStep(steps.length)}
            type="button"
          >
            <PlusIcon className="w-5 h-5 mr-0.5 text-[#000000]" />
            Add page
          </button>
        </div>
      </DndContext>

      {menuPosition && (
        <StepOptionsMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={handleCloseMenu}
          onDelete={handleDeleteStep}
          onRename={handleRenameStep}
          onSetFirst={handleSetFirstStep}
          onDuplicate={handleDuplicateStep}
          onCopy={handleCopyStep}
        />
      )}
    </div>
  );
}; 