import React, { memo } from "react";

import type { DocComment } from "@customTypes/index";
import { Button, Icon } from "@components/atoms";
import { formatTimestamp } from "@utils/index";

interface CommentItemProps {
  comment: DocComment;
  onDelete?: (commentId: string) => void;
}

const CommentItemComponent: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 group hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-700 text-sm">
            {comment.author}
          </span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-gray-500 text-xs">
            {formatTimestamp(comment.timestamp)}
          </span>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onDelete(comment.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Delete comment"
          >
            <Icon name="trash" size="xs" />
          </Button>
        )}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {comment.content}
      </p>
    </div>
  );
};

export const CommentItem = memo(CommentItemComponent);
