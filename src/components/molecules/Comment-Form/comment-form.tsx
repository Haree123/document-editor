import React, { useState, useCallback, memo, useEffect } from "react";

import { Button, Icon } from "@components/atoms";
import { DEFAULT_AUTHOR } from "@constants/index";

interface CommentFormProps {
  onSubmit: (content: string, author: string) => void;
  onCancel: () => void;
  onHeightChange?: () => void;
}

const CommentFormComponent: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  onHeightChange,
}) => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  // Notify parent when content changes (textarea might grow)
  useEffect(() => {
    if (onHeightChange) {
      const timer = setTimeout(() => {
        onHeightChange();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [content, onHeightChange]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (content.trim()) {
        onSubmit(content.trim(), author.trim() || DEFAULT_AUTHOR);
        setContent("");
        setAuthor("");
      }
    },
    [content, author, onSubmit]
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    []
  );

  const handleAuthorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAuthor(e.target.value);
    },
    []
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-gray-50 p-4 rounded-lg"
    >
      <div>
        <input
          type="text"
          value={author}
          onChange={handleAuthorChange}
          placeholder="Your name (optional)"
          className="w-full px-3 py-2 text-sm bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your comment..."
          rows={3}
          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          autoFocus
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!content.trim()}
        >
          <Icon name="send" size="sm" className="mr-1" />
          Post Comment
        </Button>
      </div>
    </form>
  );
};

export const CommentForm = memo(CommentFormComponent);
