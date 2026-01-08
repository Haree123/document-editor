import React, { useState, useCallback, memo, useEffect } from "react";

import { Button, Icon } from "@components/atoms";
import { CommentItem, CommentForm } from "@components/molecules";
import type { DocComment } from "@customTypes/index";

interface CommentSectionProps {
  blockId: string;
  comments: DocComment[];
  onAddComment: (blockId: string, content: string, author: string) => void;
  onDeleteComment?: (blockId: string, commentId: string) => void;
  onHeightChange?: () => void;
}

const CommentSectionComponent: React.FC<CommentSectionProps> = ({
  blockId,
  comments,
  onAddComment,
  onDeleteComment,
  onHeightChange,
}) => {
  const [showForm, setShowForm] = useState(false);

  // Notify parent when form visibility changes
  useEffect(() => {
    if (onHeightChange) {
      const timer = setTimeout(() => {
        onHeightChange();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showForm, onHeightChange]);

  // Notify parent when comments change
  useEffect(() => {
    if (onHeightChange) {
      const timer = setTimeout(() => {
        onHeightChange();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [comments.length, onHeightChange]);

  const handleSubmit = useCallback(
    (content: string, author: string) => {
      onAddComment(blockId, content, author);
      setShowForm(false);
    },
    [blockId, onAddComment]
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
  }, []);

  const handleShowForm = useCallback(() => {
    setShowForm(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          Comments ({comments.length})
        </h4>
        {!showForm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowForm}
            className="text-blue-600 hover:text-blue-700"
          >
            <Icon name="plus" size="sm" className="mr-1" />
            Add Comment
          </Button>
        )}
      </div>

      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={
                onDeleteComment
                  ? () => onDeleteComment(blockId, comment.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {showForm && (
        <CommentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onHeightChange={onHeightChange}
        />
      )}

      {!showForm && comments.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No comments yet. Be the first to add one!
        </p>
      )}
    </div>
  );
};

export const CommentSection = memo(CommentSectionComponent);
