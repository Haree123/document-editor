import { generateId } from "./helpers";
import type { DocumentState, Block } from "@customTypes/index";

export const getMockDocumentWithAllBlockTypes = (): DocumentState => ({
  id: "test-doc-all-types",
  title: "Document with All Block Types",
  blocks: {
    "block-1": {
      id: "block-1",
      type: "heading",
      level: 1,
      content: "Main Heading (Level 1)",
      isEditable: true,
    },
    "block-2": {
      id: "block-2",
      type: "heading",
      level: 2,
      content: "Subheading (Level 2) - Read Only",
      isEditable: false,
    },
    "block-3": {
      id: "block-3",
      type: "heading",
      level: 3,
      content: "Section Heading (Level 3)",
      isEditable: true,
    },
    "block-4": {
      id: "block-4",
      type: "paragraph",
      content:
        "This is an editable paragraph. Click to edit or use the AI actions to improve or summarize the content. The AI features are mocked for demonstration purposes.",
      isEditable: true,
    },
    "block-5": {
      id: "block-5",
      type: "paragraph",
      content:
        "This is a read-only paragraph. You cannot edit this content, but you can still add comments to discuss it with your team members.",
      isEditable: false,
    },
    "block-6": {
      id: "block-6",
      type: "list",
      items: [
        "First bullet point - editable list",
        "Second bullet point with more text",
        "Third bullet point",
        "Fourth item in the list",
      ],
      ordered: false,
      isEditable: true,
    },
    "block-7": {
      id: "block-7",
      type: "list",
      items: [
        "First step in the process",
        "Second step to follow",
        "Third and final step",
      ],
      ordered: true,
      isEditable: false,
    },
    "block-8": {
      id: "block-8",
      type: "table",
      headers: ["Name", "Role", "Department", "Status"],
      rows: [
        ["John Doe", "Senior Developer", "Engineering", "Active"],
        ["Jane Smith", "UX Designer", "Design", "Active"],
        ["Bob Johnson", "Product Manager", "Product", "Active"],
        ["Alice Brown", "QA Engineer", "Quality", "Inactive"],
      ],
      isEditable: true,
    },
    "block-9": {
      id: "block-9",
      type: "table",
      headers: ["Quarter", "Revenue", "Growth", "Target"],
      rows: [
        ["Q1 2025", "$1.2M", "15%", "$1.5M"],
        ["Q2 2025", "$1.5M", "25%", "$1.8M"],
        ["Q3 2025", "$1.8M", "20%", "$2.0M"],
      ],
      isEditable: false,
    },
    "block-10": {
      id: "block-10",
      type: "paragraph",
      content:
        "This paragraph has pre-existing comments. Check them out to see how the comment system works!",
      isEditable: true,
    },
  },
  blockOrder: [
    "block-1",
    "block-2",
    "block-3",
    "block-4",
    "block-5",
    "block-6",
    "block-7",
    "block-8",
    "block-9",
    "block-10",
  ],
  comments: {
    "block-4": [
      {
        id: "comment-1",
        blockId: "block-4",
        content:
          "This paragraph needs more detail about the implementation strategy.",
        author: "Sarah Johnson",
        timestamp: new Date("2025-01-07T10:30:00").toISOString(),
      },
      {
        id: "comment-2",
        blockId: "block-4",
        content: "Agreed. Also consider adding concrete examples.",
        author: "Mike Chen",
        timestamp: new Date("2025-01-07T14:15:00").toISOString(),
      },
    ],
    "block-5": [
      {
        id: "comment-3",
        blockId: "block-5",
        content: "Even though this is read-only, we can still discuss it here.",
        author: "Emily Davis",
        timestamp: new Date("2025-01-08T09:00:00").toISOString(),
      },
    ],
    "block-10": [
      {
        id: "comment-4",
        blockId: "block-10",
        content: "Great work on this section!",
        author: "John Reviewer",
        timestamp: new Date("2025-01-08T11:00:00").toISOString(),
      },
      {
        id: "comment-5",
        blockId: "block-10",
        content: "Please add timestamp information.",
        author: "Jane Editor",
        timestamp: new Date("2025-01-08T12:30:00").toISOString(),
      },
      {
        id: "comment-6",
        blockId: "block-10",
        content: "Fixed! Thanks for the feedback.",
        author: "Original Author",
        timestamp: new Date("2025-01-08T13:00:00").toISOString(),
      },
    ],
  },
});

export const getLargeDocument = (blockCount: number = 1000): DocumentState => {
  const blocks: Record<string, Block> = {};
  const blockOrder: string[] = [];
  const comments: Record<string, any[]> = {};

  const blockTypes = ['paragraph', 'heading', 'list', 'table'] as const;
  
  for (let i = 0; i < blockCount; i++) {
    const blockId = generateId();
    const typeIndex = i % blockTypes.length;
    const type = blockTypes[typeIndex];
    
    let block: Block;

    switch (type) {
      case 'heading':
        block = {
          id: blockId,
          type: 'heading',
          level: ((i % 3) + 1) as 1 | 2 | 3 | 4 | 5 | 6,
          content: `Heading ${i + 1}: Performance Test Section`,
          isEditable: i % 3 === 0, // Every 3rd block is editable
        };
        break;
      
      case 'list':
        block = {
          id: blockId,
          type: 'list',
          ordered: i % 2 === 0,
          items: [
            `List item ${i + 1}.1 - Testing virtualization`,
            `List item ${i + 1}.2 - Efficient rendering`,
            `List item ${i + 1}.3 - Smooth scrolling`,
          ],
          isEditable: i % 4 === 0,
        };
        break;
      
      case 'table':
        block = {
          id: blockId,
          type: 'table',
          headers: ['Metric', 'Value', 'Status'],
          rows: [
            [`Block ${i + 1}`, `${Math.floor(Math.random() * 1000)}ms`, 'Optimized'],
            [`Render ${i + 1}`, `${Math.floor(Math.random() * 100)}ms`, 'Fast'],
          ],
          isEditable: i % 5 === 0,
        };
        break;
      
      default: // paragraph
        block = {
          id: blockId,
          type: 'paragraph',
          content: `This is paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. This content demonstrates efficient virtualization with ${blockCount} blocks. Performance remains smooth even with large datasets thanks to react-virtualized.`,
          isEditable: i % 2 === 0,
        };
    }

    blocks[blockId] = block;
    blockOrder.push(blockId);
    
    // Add some comments to random blocks
    if (i % 10 === 0) {
      comments[blockId] = [
        {
          id: generateId(),
          blockId,
          content: `Comment on block ${i + 1}`,
          author: 'Test User',
          timestamp: new Date().toISOString(),
        },
      ];
    }
  }

  return {
    id: 'large-doc',
    title: `Large Document (${blockCount.toLocaleString()} blocks)`,
    blocks,
    blockOrder,
    comments,
  };
};

export const getDefaultDocument = (): DocumentState => ({
  id: generateId(),
  title: "Compliance Document",
  blocks: {
    "block-1": {
      id: "block-1",
      type: "heading",
      level: 1,
      content: "Document Title",
      isEditable: true,
    },
    "block-2": {
      id: "block-2",
      type: "paragraph",
      content:
        "This is an editable paragraph. Click to edit or use AI actions to improve or summarize the content.",
      isEditable: true,
    },
    "block-3": {
      id: "block-3",
      type: "paragraph",
      content:
        "This is a read-only paragraph. You cannot edit this content, but you can still add comments to it.",
      isEditable: false,
    },
  },
  blockOrder: ["block-1", "block-2", "block-3"],
  comments: {},
});
