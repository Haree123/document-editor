import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import "react-virtualized/styles.css";

import { Badge } from "@components/atoms";
import { Block } from "@components/organisms";
import type { DocumentState, AIAction } from "@customTypes/index";

interface DocumentTemplateProps {
  document: DocumentState;
  onBlockUpdate: (blockId: string, content: string) => void;
  onAddComment: (blockId: string, content: string, author: string) => void;
  onDeleteComment?: (blockId: string, commentId: string) => void;
  onAIAction: (blockId: string, action: AIAction) => Promise<void>;
}

export const DocumentTemplate: React.FC<DocumentTemplateProps> = ({
  document,
  onBlockUpdate,
  onAddComment,
  onDeleteComment,
  onAIAction,
}) => {
  const [renderTime, setRenderTime] = useState(0);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const listRef = useRef<List>(null);
  const measurerRefs = useRef<Map<number, () => void>>(new Map());

  // Create cache inside component to reset when document changes
  const cacheRef = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 200,
      minHeight: 100,
    })
  );

  const startTime = performance.now();

  const blocks = useMemo(() => {
    return document.blockOrder.map((blockId) => document.blocks[blockId]);
  }, [document.blocks, document.blockOrder]);

  const editableCount = useMemo(
    () => blocks.filter((b) => b.isEditable).length,
    [blocks]
  );

  const totalComments = useMemo(
    () =>
      Object.values(document.comments).reduce(
        (sum, comments) => sum + comments.length,
        0
      ),
    [document.comments]
  );

  useEffect(() => {
    const endTime = performance.now();
    setRenderTime(endTime - startTime);
  }, [blocks.length, startTime]);

  // Reset cache when document changes
  useEffect(() => {
    cacheRef.current.clearAll();
    listRef.current?.recomputeRowHeights();
  }, [document.id]);

  // Recalculate row height helper
  const recalculateRowHeight = useCallback(
    (blockId: string) => {
      const blockIndex = blocks.findIndex((b) => b.id === blockId);
      if (blockIndex !== -1) {
        // Clear cache for this row
        cacheRef.current.clear(blockIndex, 0);

        // Call measure function if available
        const measure = measurerRefs.current.get(blockIndex);
        if (measure) {
          measure();
        }

        // Recompute row heights
        requestAnimationFrame(() => {
          listRef.current?.recomputeRowHeights(blockIndex);
        });
      }
    },
    [blocks]
  );

  // Handle editing state change
  const handleEditingChange = useCallback(
    (blockId: string, isEditing: boolean) => {
      setExpandedBlocks((prev) => {
        const next = new Set(prev);
        if (isEditing) {
          next.add(`edit-${blockId}`);
        } else {
          next.delete(`edit-${blockId}`);
        }
        return next;
      });

      // Delay to allow DOM to update
      setTimeout(() => {
        recalculateRowHeight(blockId);
      }, 50);
    },
    [recalculateRowHeight]
  );

  // Handle comments toggle
  const handleCommentsToggle = useCallback(
    (blockId: string, isOpen: boolean) => {
      setExpandedBlocks((prev) => {
        const next = new Set(prev);
        if (isOpen) {
          next.add(`comments-${blockId}`);
        } else {
          next.delete(`comments-${blockId}`);
        }
        return next;
      });

      // Delay to allow DOM to update
      setTimeout(() => {
        recalculateRowHeight(blockId);
      }, 50);
    },
    [recalculateRowHeight]
  );

  // Handle block update
  const handleBlockUpdate = useCallback(
    (blockId: string, content: string) => {
      onBlockUpdate(blockId, content);

      // Recalculate after state update
      setTimeout(() => {
        recalculateRowHeight(blockId);
      }, 100);
    },
    [onBlockUpdate, recalculateRowHeight]
  );

  // Handle add comment
  const handleAddComment = useCallback(
    (blockId: string, content: string, author: string) => {
      onAddComment(blockId, content, author);

      // Recalculate after comment is added
      setTimeout(() => {
        recalculateRowHeight(blockId);
      }, 100);
    },
    [onAddComment, recalculateRowHeight]
  );

  // Row renderer for virtualized list
  const rowRenderer = useCallback(
    ({
      index,
      key,
      parent,
      style,
    }: {
      index: number;
      key: string;
      parent: any;
      style: React.CSSProperties;
    }) => {
      const block = blocks[index];

      return (
        <CellMeasurer
          key={key}
          cache={cacheRef.current}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {({ measure, registerChild }) => {
            // Store measure function for later use
            measurerRefs.current.set(index, measure);

            return (
              <div
                ref={(el) => registerChild?.(el as Element)}
                style={{
                  ...style,
                  paddingBottom: "24px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                <Block
                  block={block}
                  comments={document.comments[block.id] || []}
                  onUpdate={handleBlockUpdate}
                  onAddComment={handleAddComment}
                  onDeleteComment={onDeleteComment}
                  onAIAction={onAIAction}
                  onEditingChange={handleEditingChange}
                  onCommentsToggle={handleCommentsToggle}
                  onContentChange={measure}
                />
              </div>
            );
          }}
        </CellMeasurer>
      );
    },
    [
      blocks,
      expandedBlocks,
      handleBlockUpdate,
      handleAddComment,
      onDeleteComment,
      onAIAction,
      handleEditingChange,
      handleCommentsToggle,
      document.comments,
    ]
  );

  const isVirtualized = blocks.length > 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {document.title}
              </h1>
              {isVirtualized && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  ⚡ Virtualized rendering enabled for optimal performance
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="default">
                {blocks.length.toLocaleString()} blocks
              </Badge>
              <Badge variant="success">{editableCount} editable</Badge>
              <Badge variant="primary">{totalComments} comments</Badge>
              {renderTime > 0 && (
                <Badge variant="info">{renderTime.toFixed(2)}ms render</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isVirtualized ? (
          <div
            style={{ height: "calc(100vh - 250px)", minHeight: "600px" }}
            className="bg-white rounded-lg shadow-sm"
          >
            <AutoSizer>
              {({ width, height }) => (
                <List
                  ref={listRef}
                  width={width}
                  height={height}
                  rowCount={blocks.length}
                  rowHeight={cacheRef.current.rowHeight}
                  rowRenderer={rowRenderer}
                  deferredMeasurementCache={cacheRef.current}
                  overscanRowCount={3}
                />
              )}
            </AutoSizer>
          </div>
        ) : (
          <div className="space-y-6">
            {blocks.map((block) => (
              <Block
                key={block.id}
                block={block}
                comments={document.comments[block.id] || []}
                onUpdate={onBlockUpdate}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
                onAIAction={onAIAction}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mt-12 py-6 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          Compliance Editor - Demonstrating virtualized rendering with{" "}
          {blocks.length.toLocaleString()} blocks
        </div>
      </footer>
    </div>
  );
};
