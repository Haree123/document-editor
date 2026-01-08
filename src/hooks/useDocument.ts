import { useState, useCallback, useRef, useEffect } from "react";

import type { DocumentState, AIAction } from "@customTypes/index";
import { getDefaultDocument, generateId } from "@utils/index";
import { DEFAULT_DEBOUNCE_DELAY } from "@constants/index";

interface UseDocumentProps {
  initialDocument?: DocumentState;
}

interface UseDocumentReturn {
  document: DocumentState;
  handleBlockUpdate: (blockId: string, content: string) => void;
  handleAddComment: (blockId: string, content: string, author: string) => void;
  handleDeleteComment: (blockId: string, commentId: string) => void;
  handleAIAction: (blockId: string, action: AIAction) => Promise<void>;
}

export const useDocument = ({
  initialDocument,
}: UseDocumentProps = {}): UseDocumentReturn => {
  const [document, setDocument] = useState<DocumentState>(
    () => initialDocument || getDefaultDocument()
  );

  const updateTimeoutRef = useRef<number | null>(null);

  const debouncedUpdate = useCallback((blockId: string, content: string) => {
    if (updateTimeoutRef.current !== null) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = window.setTimeout(() => {
      setDocument((prev) => {
        const block = prev.blocks[blockId];
        if (!block || !block.isEditable) return prev;

        let updatedBlock;
        if (block.type === "paragraph" || block.type === "heading") {
          updatedBlock = { ...block, content };
        } else if (block.type === "list") {
          updatedBlock = {
            ...block,
            items: content.split("\n").filter(Boolean),
          };
        } else if (block.type === "table") {
          try {
            const parsed = JSON.parse(content);
            updatedBlock = {
              ...block,
              headers: parsed.headers || block.headers,
              rows: parsed.rows || block.rows,
            };
          } catch {
            return prev;
          }
        } else {
          return prev;
        }

        return {
          ...prev,
          blocks: {
            ...prev.blocks,
            [blockId]: updatedBlock,
          },
        };
      });
    }, DEFAULT_DEBOUNCE_DELAY);
  }, []);

  const handleBlockUpdate = useCallback(
    (blockId: string, content: string) => {
      debouncedUpdate(blockId, content);
    },
    [debouncedUpdate]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current !== null) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const handleAddComment = useCallback(
    (blockId: string, content: string, author: string) => {
      const commentId = generateId();
      const newComment = {
        id: commentId,
        blockId,
        content,
        author,
        timestamp: new Date().toISOString(),
      };

      setDocument((prev) => ({
        ...prev,
        comments: {
          ...prev.comments,
          [blockId]: [...(prev.comments[blockId] || []), newComment],
        },
      }));
    },
    []
  );

  const handleDeleteComment = useCallback(
    (blockId: string, commentId: string) => {
      setDocument((prev) => ({
        ...prev,
        comments: {
          ...prev.comments,
          [blockId]: (prev.comments[blockId] || []).filter(
            (comment) => comment.id !== commentId
          ),
        },
      }));
    },
    []
  );

  const handleAIAction = useCallback(
    async (blockId: string, action: AIAction) => {
      const block = document.blocks[blockId];
      if (!block || !block.isEditable) return;

      if (block.type !== "paragraph" && block.type !== "heading") {
        return;
      }

      let newContent = block.content;

      if (action === "improve") {
        newContent = `[AI Enhanced] ${block.content}\n\nThis content has been improved with better clarity, grammar, and structure for enhanced readability and professionalism.`;
      } else if (action === "summarize") {
        const maxLength = 100;
        newContent =
          block.content.length > maxLength
            ? `[AI Summary] ${block.content.substring(0, maxLength)}...`
            : `[AI Summary] ${block.content}`;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      handleBlockUpdate(blockId, newContent);
    },
    [document.blocks, handleBlockUpdate]
  );

  return {
    document,
    handleBlockUpdate,
    handleAddComment,
    handleDeleteComment,
    handleAIAction,
  };
};
