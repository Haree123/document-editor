export type BlockType = "heading" | "paragraph" | "list" | "table";

export interface BaseBlock {
  id: string;
  type: BlockType;
  isEditable: boolean;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  content: string;
}

export interface ListBlock extends BaseBlock {
  type: "list";
  items: string[];
  ordered: boolean;
}

export interface TableBlock extends BaseBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

export type Block = HeadingBlock | ParagraphBlock | ListBlock | TableBlock;

export interface DocComment {
  id: string;
  blockId: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface DocumentState {
  id: string;
  title: string;
  blocks: Record<string, Block>;
  blockOrder: string[];
  comments: Record<string, DocComment[]>;
}

export type AIAction = "improve" | "summarize";
