import React from "react";

import { useDocument } from "@hooks/index";
import type { DocumentState } from "@customTypes/index";
import { DocumentTemplate } from "@components/templates";

interface DocumentPageProps {
  initialDocument?: DocumentState;
}

export const DocumentPage: React.FC<DocumentPageProps> = ({
  initialDocument,
}) => {
  const {
    document,
    handleBlockUpdate,
    handleAddComment,
    handleDeleteComment,
    handleAIAction,
  } = useDocument({ initialDocument });

  return (
    <DocumentTemplate
      document={document}
      onBlockUpdate={handleBlockUpdate}
      onAddComment={handleAddComment}
      onDeleteComment={handleDeleteComment}
      onAIAction={handleAIAction}
    />
  );
};
