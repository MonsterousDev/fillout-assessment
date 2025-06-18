import React, { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Replace these with your preferred icon imports
import {
  PlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

type PageItem = { id: string; label: string; icon?: string };

const initialPages: PageItem[] = [
  { id: "info", label: "Info", icon: "/icons/info.png" },
  { id: "details", label: "Details", icon: "/icons/doc.png" },
  { id: "other", label: "Other", icon: "/icons/doc.png" },
  { id: "ending", label: "Ending", icon: "/icons/doc.png" },
];

function DottedConnector() {
  return (
    <svg width="28" height="12" fill="none" className="mx-0">
      <line
        x1="2"
        y1="6"
        x2="26"
        y2="6"
        stroke="#D9D9D9"
        strokeDasharray="3 4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AddBetweenZone({
  onClick,
  show,
}: { onClick: () => void; show: boolean }) {
  return (
    <div
      className={`group relative flex items-center justify-center min-w-[80px] mx-1`}
      style={{ 
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1)' : 'scale(0.8)',
        pointerEvents: show ? "auto" : "none",
        transition: 'all 0.2s ease-in-out'
      }}
      onMouseDown={e => e.preventDefault()}
    >
      <DottedConnector />
      <button
        type="button"
        onClick={onClick}
        className={`
          bg-white shadow border border-[#E3E5EA] z-10 p-1 rounded-full
          mx-2
          ${show ? 'animate-pop-in' : ''}
          hover:scale-110 transition-transform duration-200
        `}
        style={{
          animation: show ? 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
        }}
        title="Add page"
        tabIndex={-1}
      >
        <PlusIcon className="w-4 h-4 text-black" />
      </button>
      <DottedConnector />
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
}

function PageButton({
  page,
  isActive,
  isFocused,
  isHovered,
  onClick,
  onEllipsisClick,
  dragHandleProps,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
}: any) {
  const movedRef = React.useRef(false);
  const ellipsisRef = React.useRef<HTMLDivElement>(null);

  function handlePointerDown(e: React.PointerEvent) {
    // If clicking the ellipsis, don't handle the pointer down
    if ((e.target as HTMLElement).closest('.ellipsis-button')) {
      return;
    }

    movedRef.current = false;

    function onPointerMove() {
      movedRef.current = true;
    }
    function onPointerUp(ev: PointerEvent) {
      if (!movedRef.current && ev.button === 0) {
        onClick();
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Make sure dnd-kit gets its drag handle events as well!
    if (dragHandleProps && dragHandleProps.onPointerDown) {
      dragHandleProps.onPointerDown(e);
    }
  }

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
        ${isFocused ? "ring-2 ring-blue-500" : ""}
        cursor-pointer
        active:bg-white active:text-[#1A1A1A] active:grayscale-0 active:border-[#e1e1e1] active:border-[0.5px] active:shadow-[0_0_0_2px_rgba(52,112,255,0.3)]
      `}
      onPointerDown={handlePointerDown}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {page.icon && (
        <img
          src={page.icon}
          alt=""
          className="w-4 h-4 pointer-events-none"
        />
      )}
      <span>{page.label}</span>
      {isActive && (
        <div
          ref={ellipsisRef}
          className="ellipsis-button flex items-center ml-2 p-1 rounded hover:bg-gray-100 cursor-pointer"
          tabIndex={-1}
          style={{ 
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1000
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onEllipsisClick) {
              const rect = ellipsisRef.current?.getBoundingClientRect();
              if (rect) {
                onEllipsisClick(rect.left, rect.bottom + 4);
              }
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
}

function SortablePageButton({
  page,
  isActive,
  onClick,
  onEllipsisClick,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: page.id });

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
      <PageButton
        page={page}
        isActive={isActive}
        isFocused={undefined}
        isHovered={undefined}
        onClick={onClick}
        onEllipsisClick={onEllipsisClick}
        dragHandleProps={{
          ...attributes,
          ...listeners
        }}
      />
    </div>
  );
}

// Figma-style context menu
function PageMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  React.useEffect(() => {
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
      style={{ 
        position: "fixed", 
        left: x, 
        top: y, 
        zIndex: 1000, 
        minWidth: 240,
        transform: 'translateX(-100%)' // Align to the left of the click point
      }}
      className="bg-white border border-[#edefef] rounded-2xl shadow-xl py-1 px-0"
    >
      <div className="px-5 pt-4 pb-2 border-b border-[#f2f2f2] font-semibold text-[16px] text-[#1F2329]">
        Settings
      </div>
      <button className="flex items-center w-full px-5 py-2 text-left hover:bg-gray-100 text-sm">
        <img src="/icons/flag.png" alt="" className="w-4 h-4 mr-3" />
        Set as first page
      </button>
      <button className="flex items-center w-full px-5 py-2 text-left hover:bg-gray-100 text-sm">
        <img src="/icons/rename.png" alt="" className="w-4 h-4 mr-3" />
        Rename
      </button>
      <button className="flex items-center w-full px-5 py-2 text-left hover:bg-gray-100 text-sm">
        <img src="/icons/duplicate.png" alt="" className="w-4 h-4 mr-3" />
        Duplicate
      </button>
      <div className="border-t border-[#f2f2f2] mx-5 my-2" />
      <button className="flex items-center w-full px-5 py-2 text-left hover:bg-rose-50 text-sm text-rose-600">
        <img src="/icons/delete.png" alt="" className="w-4 h-4 mr-3" />
        Delete
      </button>
    </div>
  );
}

const PageListDraggable: React.FC = () => {
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [activeId, setActiveId] = useState<string>(pages[0]?.id ?? "");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleAddPage(index: number) {
    const newPage: PageItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
      label: `Page ${pages.length + 1}`,
      icon: "/icons/doc.png",
    };
    setPages(prev => {
      const arr = [...prev];
      arr.splice(index, 0, newPage);
      return arr;
    });
    setActiveId(newPage.id);
    setHoveredIdx(null);
  }

  function handlePageClick(pageId: string) {
    console.log("clicked");
    setActiveId(pageId);
    setContextMenu(null); // Close context menu when switching pages
  }

  function handleDragEnd({ active, over }: any) {
    if (active.id !== over?.id) {
      const oldIdx = pages.findIndex(p => p.id === active.id);
      const newIdx = pages.findIndex(p => p.id === over.id);
      setPages(arrayMove(pages, oldIdx, newIdx));
    }
  }

  return (
    <div className="bg-[#fafbfc] border border-[#ebecf0] p-6 rounded-2xl max-w-full w-fit mx-auto relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pages.map(p => p.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex items-center">
            {/* For n pages, there are n+1 gaps */}
            {Array.from({ length: pages.length + 1 }).map((_, gapIdx) => (
              <React.Fragment key={`gap-${gapIdx}`}>
                {/* Render between gaps */}
                <div
                  onMouseEnter={() => setHoveredIdx(gapIdx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex items-center"
                  style={{ minHeight: 40 }}
                >
                  {hoveredIdx === gapIdx && gapIdx !== pages.length ? (
                    <AddBetweenZone show={true} onClick={() => handleAddPage(gapIdx)} />
                  ) : (
                    gapIdx !== 0 && (
                      <span className="mx-2 min-w-[28px] flex justify-center">
                        <DottedConnector />
                      </span>
                    )
                  )}
                </div>
                {/* Render a page button if not last gap */}
                {gapIdx < pages.length && (
                  <SortablePageButton
                    key={pages[gapIdx].id}
                    page={pages[gapIdx]}
                    isActive={activeId === pages[gapIdx].id}
                    onClick={() => handlePageClick(pages[gapIdx].id)}
                    onEllipsisClick={(x: number, y: number) => {
                      setContextMenu({
                        x,
                        y,
                        id: pages[gapIdx].id,
                      });
                    }}
                  />
                )}
              </React.Fragment>
            ))}

            {/* Always show "Add page" button at the end */}
            <button
              className="ml-2 flex items-center gap-1 px-2.5 h-8 rounded-[8px] border border-[#E3E5EA] bg-white hover:bg-[#F5F6F8] text-sm text-[#464D5B] font-medium transition shadow-sm"
              onClick={() => handleAddPage(pages.length)}
              type="button"
            >
              <PlusIcon className="w-5 h-5 mr-0.5 text-[#000000]" />
              Add page
            </button>
          </div>
        </SortableContext>
      </DndContext>

      {/* Context menu for page */}
      {contextMenu && (
        <PageMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} />
      )}
    </div>
  );
};

export default PageListDraggable;