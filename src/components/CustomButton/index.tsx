import React, { forwardRef } from 'react';

type CustomButtonProps = {
  active?: boolean;
  focused?: boolean;
  text: string;
  icon?: string;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
  // dnd-kit props:
  draggableProps?: any;
  dragHandleProps?: any;
};

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      active = false,
      focused = false,
      text,
      icon,
      onClick,
      onContextMenu,
      children,
      className = "",
      draggableProps = {},
      dragHandleProps = {},
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={`flex items-center h-8 px-2.5 py-1 rounded-[8px] text-sm transition gap-2 font-[inter] bg-[#9DA4B226] text-[#677289]
          active:filter-none active:bg-white active:text-[#1A1A1A] active:border-blue-400 active:border-[0.5px]
          active:shadow-[0_0_0_2px_rgba(52,112,255,0.3)]
          ${active ? "filter-none bg-white text-[#1A1A1A] border-[#e1e1e1] border-[0.5px]" : "grayscale hover:bg-[#9DA4B259]"}
          ${focused ? "ring-2 ring-blue-500" : ""}
          cursor-pointer select-none
          ${className}
        `}
        {...draggableProps}
        {...dragHandleProps}
      >
        {icon && <img src={icon} alt="" className="w-4 h-4" />}
        <span>{text}</span>
        {children}
      </button>
    );
  }
);

export default CustomButton;