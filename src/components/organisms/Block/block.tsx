import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import type {
  Block as BlockType,
  DocComment,
  AIAction,
} from "@customTypes/index";
import { BlockToolbar } from "@components/molecules";
import { BlockContent } from "../Block-Content";
import { CommentSection } from "../Comment-Section";

interface BlockProps {
  block: BlockType;
  comments: DocComment[];
  onUpdate: (blockId: string, content: string) => void;
  onAddComment: (blockId: string, content: string, author: string) => void;
  onDeleteComment?: (blockId: string, commentId: string) => void;
  onAIAction: (blockId: string, action: AIAction) => Promise<void>;
  onEditingChange?: (blockId: string, isEditing: boolean) => void;
  onCommentsToggle?: (blockId: string, isOpen: boolean) => void;
  onContentChange?: () => void;
}

const getEditableContent = (block: BlockType): string => {
  if (block.type === "paragraph" || block.type === "heading") {
    return block.content;
  } else if (block.type === "list") {
    return block.items.join("\n");
  } else if (block.type === "table") {
    return JSON.stringify(
      { headers: block.headers, rows: block.rows },
      null,
      2
    );
  }
  return "";
};

const BlockComponent: React.FC<BlockProps> = ({
  block,
  comments,
  onUpdate,
  onAddComment,
  onDeleteComment,
  onAIAction,
  onEditingChange,
  onCommentsToggle,
  onContentChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(() =>
    getEditableContent(block)
  );
  const [showComments, setShowComments] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  // Sync editContent when block changes (after save)
  useEffect(() => {
    if (!isEditing) {
      setEditContent(getEditableContent(block));
    }
  }, [block, isEditing]);

  // Notify parent when editing state changes
  useEffect(() => {
    onEditingChange?.(block.id, isEditing);
  }, [isEditing, block.id, onEditingChange]);

  // Notify parent when comments are toggled
  useEffect(() => {
    onCommentsToggle?.(block.id, showComments);
  }, [showComments, block.id, onCommentsToggle]);

  const handleEdit = useCallback(() => {
    if (block.isEditable && !isEditing) {
      setIsEditing(true);
      setEditContent(getEditableContent(block));
    }
  }, [block, isEditing]);

  const handleSave = useCallback(() => {
    if (editContent.trim()) {
      onUpdate(block.id, editContent);
      setIsEditing(false);
    }
  }, [block.id, editContent, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditContent(getEditableContent(block));
    setIsEditing(false);
  }, [block]);

  const handleFinishEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleToggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  // Handle content change for textarea/editors
  const handleEditContentChange = useCallback(
    (content: string) => {
      setEditContent(content);
      // Measure after content change
      requestAnimationFrame(() => {
        onContentChange?.();
      });
    },
    [onContentChange]
  );

  // Handle height change from comment section
  const handleCommentHeightChange = useCallback(() => {
    requestAnimationFrame(() => {
      onContentChange?.();
    });
  }, [onContentChange]);

  // Handle add comment with height recalculation
  const handleAddComment = useCallback(
    (blockId: string, content: string, author: string) => {
      onAddComment(blockId, content, author);
      // Recalculate height after adding comment
      setTimeout(() => {
        onContentChange?.();
      }, 100);
    },
    [onAddComment, onContentChange]
  );

  // Handle delete comment with height recalculation
  const handleDeleteComment = useCallback(
    (blockId: string, commentId: string) => {
      onDeleteComment?.(blockId, commentId);
      // Recalculate height after deleting comment
      setTimeout(() => {
        onContentChange?.();
      }, 100);
    },
    [onDeleteComment, onContentChange]
  );

  return (
    <div
      ref={blockRef}
      className={`
        bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200
        ${!block.isEditable ? "bg-gray-50/50" : ""}
        ${isEditing ? "ring-2 ring-blue-500" : ""}
      `}
    >
      <BlockToolbar
        block={block}
        isEditing={isEditing}
        commentCount={comments.length}
        showComments={showComments}
        onEdit={handleEdit}
        onToggleComments={handleToggleComments}
        onAIAction={onAIAction}
      />
      <BlockContent
        block={block}
        isEditing={isEditing}
        editContent={editContent}
        onEditContentChange={handleEditContentChange}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onUpdate={onUpdate}
        onFinishEditing={handleFinishEditing}
      />
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <CommentSection
            blockId={block.id}
            comments={comments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onHeightChange={handleCommentHeightChange}
          />
        </div>
      )}
    </div>
  );
};

export const Block = memo(BlockComponent, (prevProps, nextProps) => {
  const prevBlock = prevProps.block;
  const nextBlock = nextProps.block;

  if (
    prevBlock.id !== nextBlock.id ||
    prevBlock.type !== nextBlock.type ||
    prevBlock.isEditable !== nextBlock.isEditable
  ) {
    return false;
  }

  if (prevBlock.type === "list" && nextBlock.type === "list") {
    const itemsChanged =
      prevBlock.items.length !== nextBlock.items.length ||
      prevBlock.items.some((item, i) => item !== nextBlock.items[i]);
    if (itemsChanged) return false;
  } else if (prevBlock.type === "table" && nextBlock.type === "table") {
    const headersChanged =
      prevBlock.headers.length !== nextBlock.headers.length ||
      prevBlock.headers.some((h, i) => h !== nextBlock.headers[i]);
    const rowsChanged =
      prevBlock.rows.length !== nextBlock.rows.length ||
      prevBlock.rows.some(
        (row, i) =>
          row.length !== nextBlock.rows[i]?.length ||
          row.some((cell, j) => cell !== nextBlock.rows[i][j])
      );
    if (headersChanged || rowsChanged) return false;
  } else if (
    (prevBlock.type === "paragraph" && nextBlock.type === "paragraph") ||
    (prevBlock.type === "heading" && nextBlock.type === "heading")
  ) {
    if (prevBlock.content !== nextBlock.content) return false;
  }

  if (prevProps.comments.length !== nextProps.comments.length) {
    return false;
  }

  return true;
});
