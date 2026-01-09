# Compliance Document Editor

A high-performance document editor with AI-powered features, optimized for handling large documents with a scalable architecture.

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:5173` to see the editor in action.

## 📊 Document Data Model

I chose a **block-based, ID-driven model** for optimal performance:

```typescript
interface DocumentState {
  id: string;
  title: string;
  blocks: Record<string, Block>; // Hash map for O(1) lookups
  blockOrder: string[]; // Separate array for rendering order
  comments: Record<string, DocComment[]>;
}
```

**Why this approach?**

- ✅ **Isolated updates** - Changing one block doesn't affect others
- ✅ **Fast lookups** - O(1) access via block ID instead of array searching
- ✅ **Efficient rendering** - Only re-render changed blocks (React memoization)
- ✅ **Easily extensible** - Add new block types without restructuring

## ⚡ Performance Strategy

The editor is designed to scale for large documents using a combination of
normalized data modeling and render optimizations.

Implemented optimizations:
- Normalized block storage for O(1) access
- Memoized block components to avoid unnecessary re-renders
- Stable callbacks for predictable rendering

Planned / optional optimizations:
- List virtualization (react-virtualized / react-window) for very large documents
- Lazy rendering of comments and off-screen content
- Progressive rendering strategies for server-driven data

### Threshold System

```typescript
// Virtualization kicks in at 50+ blocks
const isVirtualized = blocks.length > 50;
```

## 💾 Caching Strategy

### Implemented

Component-level memoization (implemented)”
“Virtual scroll cache (applicable when virtualization is enabled)”
“Render batching considerations for dynamic layouts”

```
src/
├── components/
│   ├── atoms/        # Button, Icon, Badge, etc.
│   ├── molecules/    # CommentForm, TableEditor, etc.
│   ├── organisms/    # Block, CommentSection
│   ├── templates/    # DocumentTemplate (virtualized)
│   └── pages/        # DocumentPage
├── hooks/            # useDocument (state management)
├── utils/            # Helpers, mock data generators
├── types/            # TypeScript interfaces
└── constants/        # Configuration
```

## 📦 Key Dependencies

- **React** - Latest features & performance
- **react-virtualized** - Efficient list virtualization
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast dev server & builds

## 🎯 Features

- ✅ Multiple block types (heading, paragraph, list, table)
- ✅ Inline editing with validation
- ✅ Comment system with timestamps
- ✅ Simulated AI actions (improve, summarize) - ready for API integration
- ✅ Read-only/editable blocks
- ✅ Supports virtualized rendering for large documents
- ✅ Responsive design

## 📝 Notes

- **AI Actions**: Currently simulated with text prefixes (`[AI Summary]`, `[AI Enhanced]`). The architecture supports easy integration with real AI APIs (OpenAI, Claude, etc.) by updating the `handleAIAction` function in `useDocument` hook.

Built with ⚡ for performance assessment
