import { useState, useCallback, useRef, useEffect } from "react";

import type { DocumentState, AIAction } from "@customTypes/index";
import { getDefaultDocument, generateId } from "@utils/index";
import { DEFAULT_DEBOUNCE_DELAY } from "@constants/index";

const MAX_HISTORY = 200;
interface UseDocumentProps {
  initialDocument?: DocumentState;
}

interface UseDocumentReturn {
  document: DocumentState;
  handleBlockUpdate: (blockId: string, content: string) => void;
  handleAddComment: (blockId: string, content: string, author: string) => void;
  handleDeleteComment: (blockId: string, commentId: string) => void;
  handleAIAction: (blockId: string, action: AIAction) => Promise<void>;
  redo: () => void;
  undo: () => void;
}

export const useDocument = ({
  initialDocument,
}: UseDocumentProps = {}): UseDocumentReturn => {
  const [state, setState] = useState(() => ({
    document: initialDocument || getDefaultDocument(),
    past: [] as DocumentState[],
    present: [] as DocumentState[],
  }));
  console.log(state);
  const document = state.document;
  const isUndoRedoRef = useRef(false);
  const updateTimeoutRef = useRef<number | null>(null);

  const cancelPendingUpdate = () => {
    if (updateTimeoutRef.current !== null) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
  };

  const commit = useCallback(
    (next: DocumentState) => {
      cancelPendingUpdate();

      setState((prev) => {
        const newPast = [...prev.past, prev.document];

        return {
          document: next,
          past: newPast.slice(-MAX_HISTORY),
          present: [],
        };
      });
    },
    [cancelPendingUpdate]
  );

  const debouncedUpdate = useCallback((blockId: string, content: string) => {
    if (updateTimeoutRef.current !== null) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = window.setTimeout(() => {
      setState((prev) => {
        const block = prev.document.blocks[blockId];
        if (!block || !block.isEditable) return prev;

        let updatedBlock = block;

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

        const next: DocumentState = {
          ...prev.document,
          blocks: {
            ...prev.document.blocks,
            [blockId]: updatedBlock,
          },
        };

        return {
          document: next,
          past: [...prev.past, prev.document].slice(-MAX_HISTORY),
          present: [],
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

      commit({
        ...state.document,
        comments: {
          ...state.document.comments,
          [blockId]: [...(state.document.comments[blockId] || []), newComment],
        },
      });
    },
    [state.document, commit]
  );

  const handleDeleteComment = useCallback(
    (blockId: string, commentId: string) => {
      commit({
        ...state.document,
        comments: {
          ...state.document.comments,
          [blockId]: (state.document.comments[blockId] || []).filter(
            (c) => c.id !== commentId
          ),
        },
      });
    },
    [state.document, commit]
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

  const undo = useCallback(() => {
    cancelPendingUpdate();
    isUndoRedoRef.current = true;

    setState((prev) => {
      if (!prev.past.length) return prev;

      const previous = prev.past[prev.past.length - 1];

      return {
        document: previous,
        past: prev.past.slice(0, -1),
        present: [prev.document, ...prev.present],
      };
    });
  }, [cancelPendingUpdate]);

  const redo = useCallback(() => {
    cancelPendingUpdate();
    isUndoRedoRef.current = true;

    setState((prev) => {
      if (prev.present.length === 0) return prev;

      const next = prev.present[0];
      const newPresent = prev.present.slice(1);

      return {
        document: next,
        past: [...prev.past, prev.document].slice(-MAX_HISTORY),
        present: newPresent,
      };
    });
  }, [cancelPendingUpdate]);

  useEffect(() => {
    isUndoRedoRef.current = false;
  }, [state.document]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "y" || (e.shiftKey && e.key === "z")) {
          e.preventDefault();
          redo();
          return;
        }

        if (e.key === "z") {
          e.preventDefault();
          undo();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [redo, undo]);

  useEffect(() => {
    cancelPendingUpdate();

    setState({
      document: initialDocument || getDefaultDocument(),
      past: [],
      present: [],
    });
  }, [initialDocument]);

  return {
    document,
    handleBlockUpdate,
    handleAddComment,
    handleDeleteComment,
    handleAIAction,
    redo,
    undo,
  };
};
