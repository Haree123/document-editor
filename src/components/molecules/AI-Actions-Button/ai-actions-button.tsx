import React, { useState, useCallback } from "react";
import { Button, Icon } from "@components/atoms";
import type { AIAction } from "@customTypes/index";

interface AIActionButtonsProps {
  blockId: string;
  onAIAction: (blockId: string, action: AIAction) => Promise<void>;
  disabled?: boolean;
}

export const AIActionButtons: React.FC<AIActionButtonsProps> = ({
  blockId,
  onAIAction,
  disabled = false,
}) => {
  const [processingAction, setProcessingAction] = useState<AIAction | null>(
    null
  );

  const handleAction = useCallback(
    async (action: AIAction) => {
      setProcessingAction(action);
      try {
        await onAIAction(blockId, action);
      } finally {
        setProcessingAction(null);
      }
    },
    [blockId, onAIAction]
  );

  const isProcessing = processingAction !== null;

  return (
    <div className="flex gap-1">
      <Button
        variant="ai"
        size="xs"
        onClick={() => handleAction("improve")}
        disabled={disabled || isProcessing}
        isLoading={processingAction === "improve"}
        title="AI: Improve content"
      >
        <Icon name="sparkles" size="xs" />
        <span className="hidden sm:inline">Improve</span>
      </Button>
      <Button
        variant="ai"
        size="xs"
        onClick={() => handleAction("summarize")}
        disabled={disabled || isProcessing}
        isLoading={processingAction === "summarize"}
        title="AI: Summarize content"
      >
        <Icon name="compress" size="xs" />
        <span className="hidden sm:inline">Summarize</span>
      </Button>
    </div>
  );
};
