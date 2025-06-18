import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

export interface Step {
  id: string;
  label: string;
  icon?: string;
}

const initialSteps: Step[] = [
  { id: "info", label: "Info", icon: "/icons/info.png" },
  { id: "details", label: "Details", icon: "/icons/doc.png" },
  { id: "other", label: "Other", icon: "/icons/doc.png" },
  { id: "ending", label: "Ending", icon: "/icons/ending.png" },
];

export const useStepNavigation = () => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [activeStepId, setActiveStepId] = useState<string>(initialSteps[0].id);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  const handleStepClick = useCallback((stepId: string) => {
    setActiveStepId(stepId);
  }, []);

  const handleDragEnd = useCallback(({ active, over }: { active: { id: string }; over: { id: string } | null }) => {
    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleAddStep = useCallback((index: number) => {
    try {
      const newStep: Step = {
        id: `step-${Date.now()}`,
        label: `New Step ${steps.length + 1}`,
        icon: "/icons/doc.png"
      };
      setSteps((current) => {
        const newSteps = [...current];
        newSteps.splice(index, 0, newStep);
        return newSteps;
      });
    } catch (error) {
      console.error('Error adding new step:', error);
    }
  }, [steps.length]);

  const handleOptionsClick = useCallback((stepId: string, x: number, y: number) => {
    try {
      setSelectedStepId(stepId);
      setMenuPosition({ x, y });
    } catch (error) {
      console.error('Error opening options menu:', error);
    }
  }, []);

  const handleCloseMenu = useCallback(() => {
    try {
      setMenuPosition(null);
      setSelectedStepId(null);
    } catch (error) {
      console.error('Error closing menu:', error);
    }
  }, []);

  const handleDeleteStep = useCallback(() => {
    try {
      if (selectedStepId) {
        setSteps((current) => current.filter((step) => step.id !== selectedStepId));
        if (activeStepId === selectedStepId) {
          const remainingSteps = steps.filter((step) => step.id !== selectedStepId);
          setActiveStepId(remainingSteps[0]?.id || '');
        }
        handleCloseMenu();
      }
    } catch (error) {
      console.error('Error deleting step:', error);
    }
  }, [selectedStepId, activeStepId, steps, handleCloseMenu]);

  const handleRenameStep = useCallback(() => {
    try {
      // Implement rename functionality
      handleCloseMenu();
    } catch (error) {
      console.error('Error renaming step:', error);
    }
  }, [handleCloseMenu]);

  const handleDuplicateStep = useCallback(() => {
    try {
      if (selectedStepId) {
        const stepToDuplicate = steps.find(step => step.id === selectedStepId);
        if (stepToDuplicate) {
          const newStep: Step = {
            id: `step-${Date.now()}`,
            label: `${stepToDuplicate.label} (Copy)`,
            icon: stepToDuplicate.icon
          };
          const currentIndex = steps.findIndex(step => step.id === selectedStepId);
          setSteps(current => {
            const newSteps = [...current];
            newSteps.splice(currentIndex + 1, 0, newStep);
            return newSteps;
          });
          setActiveStepId(newStep.id);
        }
        handleCloseMenu();
      }
    } catch (error) {
      console.error('Error duplicating step:', error);
    }
  }, [selectedStepId, steps, handleCloseMenu]);

  const handleCopyStep = useCallback(() => {
    try {
      if (selectedStepId) {
        const stepToCopy = steps.find(step => step.id === selectedStepId);
        if (stepToCopy) {
          const newStep: Step = {
            id: `step-${Date.now()}`,
            label: `${stepToCopy.label} (Copy)`,
            icon: stepToCopy.icon
          };
          setSteps(current => [...current, newStep]);
          setActiveStepId(newStep.id);
        }
        handleCloseMenu();
      }
    } catch (error) {
      console.error('Error copying step:', error);
    }
  }, [selectedStepId, steps, handleCloseMenu]);

  const handleSetFirstStep = useCallback(() => {
    try {
      if (selectedStepId) {
        const stepToMove = steps.find(step => step.id === selectedStepId);
        if (stepToMove) {
          setSteps(current => {
            const otherSteps = current.filter(step => step.id !== selectedStepId);
            return [stepToMove, ...otherSteps];
          });
        }
        handleCloseMenu();
      }
    } catch (error) {
      console.error('Error setting step as first:', error);
    }
  }, [selectedStepId, steps, handleCloseMenu]);

  return {
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
  };
}; 