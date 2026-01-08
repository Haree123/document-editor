import React, { memo } from "react";
import { Icon } from "@components/atoms";

interface CollapsibleSectionProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  blockCount?: number;
}

const CollapsibleSectionComponent: React.FC<CollapsibleSectionProps> = ({
  title,
  isCollapsed,
  onToggle,
  children,
  blockCount,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Icon
            name={isCollapsed ? "chevronRight" : "chevronDown"}
            size="sm"
            className="text-gray-500"
          />
          <span className="font-medium text-gray-800">{title}</span>
          {blockCount !== undefined && (
            <span className="text-sm text-gray-500">
              ({blockCount} block{blockCount !== 1 ? "s" : ""})
            </span>
          )}
        </div>
      </button>
      {!isCollapsed && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
};

export const CollapsibleSection = memo(CollapsibleSectionComponent);
