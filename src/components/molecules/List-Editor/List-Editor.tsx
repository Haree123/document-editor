import React, { useState } from "react";

import { Button, Icon } from "@components/atoms";

interface ListEditorProps {
  items: string[];
  ordered: boolean;
  onSave: (items: string[]) => void;
  onCancel: () => void;
}

export const ListEditor: React.FC<ListEditorProps> = ({
  items: initialItems,
  ordered,
  onSave,
  onCancel,
}) => {
  const [items, setItems] = useState<string[]>(() => 
    initialItems.length > 0 ? [...initialItems] : [""]
  );

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, ""]);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    const filteredItems = items.filter((item) => item.trim() !== "");
    if (filteredItems.length > 0) {
      onSave(filteredItems);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-lg border border-gray-300 bg-blue-50/30">
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <span className="text-sm text-gray-500 font-medium min-w-[24px]">
              {ordered ? `${index + 1}.` : "•"}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter list item..."
              autoFocus={index === 0}
            />
            <button
              onClick={() => handleDeleteItem(index)}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 p-1.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete item"
              disabled={items.length === 1}
            >
              <Icon name="trash" size="xs" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <Button variant="secondary" size="sm" onClick={handleAddItem}>
          <Icon name="plus" size="sm" className="mr-1" />
          Add Item
        </Button>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Icon name="save" size="sm" className="mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
