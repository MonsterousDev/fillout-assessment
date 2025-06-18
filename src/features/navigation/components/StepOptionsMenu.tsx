import React, { useRef, useEffect } from 'react';

interface StepOptionsMenuProps {
  onClose: () => void;
  onDelete: () => void;
  onRename: () => void;
  onSetFirst: () => void;
  onDuplicate: () => void;
  onCopy: () => void;
  x: number;
  y: number;
}

export const StepOptionsMenu: React.FC<StepOptionsMenuProps> = ({
  onClose,
  onDelete,
  onRename,
  onSetFirst,
  onDuplicate,
  onCopy,
  x,
  y
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as any)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
      style={{
        top: y,
        left: x,
      }}
    >
      <button
        onClick={onSetFirst}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <img src="/icons/flag.png" alt="" className="w-4 h-4" />
        Set as first page
      </button>
      <button
        onClick={onRename}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <img src="/icons/rename.png" alt="" className="w-4 h-4" />
        Rename
      </button>
      <button
        onClick={onCopy}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <img src="/icons/copy.png" alt="" className="w-4 h-4" />
        Copy
      </button>
      <button
        onClick={onDuplicate}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <img src="/icons/duplicate.png" alt="" className="w-4 h-4" />
        Duplicate
      </button>
      <button
        onClick={onDelete}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
      >
        <img src="/icons/delete.png" alt="" className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
}; 