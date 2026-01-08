import React, { memo } from "react";

import type { Block } from "@customTypes/index";
import { Button, Icon } from "@components/atoms";
import { TableEditor, ListEditor } from "@components/molecules";

interface BlockContentProps {
  block: Block;
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onUpdate: (blockId: string, content: string) => void;
  onFinishEditing: () => void;
}

const BlockContentComponent: React.FC<BlockContentProps> = ({
  block,
  isEditing,
  editContent,
  onEditContentChange,
  onSave,
  onCancel,
  onEdit,
  onUpdate,
  onFinishEditing,
}) => {
  // Handle table save - save directly and close editing
  const handleTableSave = (headers: string[], rows: string[][]) => {
    const tableData = JSON.stringify({ headers, rows }, null, 2);
    onUpdate(block.id, tableData);
    onFinishEditing();
  };

  // Handle list save - save directly and close editing
  const handleListSave = (items: string[]) => {
    const listContent = items.join("\n");
    onUpdate(block.id, listContent);
    onFinishEditing();
  };

  // Render table editor - use block data directly
  if (isEditing && block.type === "table") {
    return (
      <TableEditor
        headers={block.headers}
        rows={block.rows}
        onSave={handleTableSave}
        onCancel={onCancel}
      />
    );
  }

  // Render list editor - use block data directly
  if (isEditing && block.type === "list") {
    return (
      <ListEditor
        items={block.items}
        ordered={block.ordered}
        onSave={handleListSave}
        onCancel={onCancel}
      />
    );
  }

  // Render text editor for paragraphs and headings
  if (isEditing && (block.type === "paragraph" || block.type === "heading")) {
    return (
      <div className="space-y-3">
        <textarea
          value={editContent}
          onChange={(e) => onEditContentChange(e.target.value)}
          className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter content..."
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onSave}>
            <Icon name="save" size="xs" className="mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (block.type) {
      case "heading": {
        const HeadingTag =
          `h${block.level}` as keyof React.JSX.IntrinsicElements;
        const headingSizes: Record<number, string> = {
          1: "text-4xl",
          2: "text-3xl",
          3: "text-2xl",
          4: "text-xl",
          5: "text-lg",
          6: "text-base",
        };
        return (
          <HeadingTag
            className={`font-bold text-gray-900 ${
              headingSizes[block.level]
            } leading-tight`}
          >
            {block.content}
          </HeadingTag>
        );
      }
      case "paragraph":
        return (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {block.content}
          </p>
        );
      case "list": {
        const ListTag = block.ordered ? "ol" : "ul";
        return (
          <ListTag
            className={`${
              block.ordered ? "list-decimal" : "list-disc"
            } pl-6 space-y-2`}
          >
            {block.items.map((item, index) => (
              <li key={index} className="text-gray-700 leading-relaxed">
                {item}
              </li>
            ))}
          </ListTag>
        );
      }
      case "table":
        return (
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {block.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {block.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        ${
          block.isEditable
            ? "cursor-pointer hover:bg-gray-50 p-3 rounded-md transition-all"
            : "p-1"
        }
      `}
      onClick={block.isEditable ? onEdit : undefined}
      role={block.isEditable ? "button" : undefined}
      tabIndex={block.isEditable ? 0 : undefined}
      onKeyDown={
        block.isEditable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onEdit();
              }
            }
          : undefined
      }
    >
      {renderContent()}
    </div>
  );
};

export const BlockContent = memo(BlockContentComponent);
