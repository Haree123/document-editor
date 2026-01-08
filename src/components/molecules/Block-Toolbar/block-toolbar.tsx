import React from "react";

import { AIActionButtons } from "../index";
import { Button, Icon, Badge } from "@components/atoms";
import type { AIAction, Block } from "@customTypes/index";

interface BlockToolbarProps {
  block: Block;
  isEditing: boolean;
  commentCount: number;
  showComments: boolean;
  onEdit: () => void;
  onToggleComments: () => void;
  onAIAction: (blockId: string, action: AIAction) => Promise<void>;
}

export const BlockToolbar: React.FC<BlockToolbarProps> = ({
  block,
  isEditing,
  commentCount,
  showComments,
  onEdit,
  onToggleComments,
  onAIAction,
}) => {
  const canUseAI = block.type === "paragraph" || block.type === "heading";

  return (
    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
      <div className="flex items-center gap-2">
        {block.isEditable ? (
          <Badge variant="success">
            <Icon name="unlock" size="xs" className="mr-1" />
            Editable
          </Badge>
        ) : (
          <Badge variant="default">
            <Icon name="lock" size="xs" className="mr-1" />
            Read-only
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        {block.isEditable && !isEditing && (
          <>
            <Button variant="ghost" size="xs" onClick={onEdit} title="Edit">
              <Icon name="edit" size="xs" />
              <span className="hidden sm:inline ml-1">Edit</span>
            </Button>
            {canUseAI && (
              <AIActionButtons blockId={block.id} onAIAction={onAIAction} />
            )}
          </>
        )}

        <Button
          variant="ghost"
          size="xs"
          onClick={onToggleComments}
          title={showComments ? "Hide comments" : "Show comments"}
          className={showComments ? "bg-blue-100 text-blue-700" : ""}
        >
          <Icon name="comment" size="xs" />
          <span className="ml-1">{commentCount}</span>
        </Button>
      </div>
    </div>
  );
};
