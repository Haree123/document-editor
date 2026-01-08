import React, { useState } from "react";

import { DocumentPage } from "@pages/index";
import type { DocumentState } from "@customTypes/index";
import {
  getMockDocumentWithAllBlockTypes,
  getLargeDocument,
} from "@utils/index";

const App: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<
    "default" | "all-types" | "small" | "medium" | "large" | "xl" | "xxl"
  >("default");

  const getDocument = (): DocumentState | undefined => {
    switch (selectedDoc) {
      case "all-types":
        return getMockDocumentWithAllBlockTypes();
      case "small":
        return getLargeDocument(100);
      case "medium":
        return getLargeDocument(500);
      case "large":
        return getLargeDocument(1000);
      case "xl":
        return getLargeDocument(5000);
      case "xxl":
        return getLargeDocument(10000);
      default:
        return undefined;
    }
  };

  const getButtonLabel = () => {
    switch (selectedDoc) {
      case "all-types": return "All Block Types";
      case "small": return "100 Blocks";
      case "medium": return "500 Blocks";
      case "large": return "1,000 Blocks";
      case "xl": return "5,000 Blocks";
      case "xxl": return "10,000 Blocks";
      default: return "Default";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-3">
            <h1 className="text-xl font-bold mb-1">Compliance Document Editor</h1>
            <p className="text-sm text-gray-400">Performance Test - Virtualized Rendering</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            <button
              onClick={() => setSelectedDoc("default")}
              className={`
                px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  selectedDoc === "default"
                    ? "bg-blue-600 shadow-lg ring-2 ring-blue-400"
                    : "bg-gray-700 hover:bg-gray-600"
                }
              `}
            >
              Default
            </button>
            
            <button
              onClick={() => setSelectedDoc("all-types")}
              className={`
                px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  selectedDoc === "all-types"
                    ? "bg-blue-600 shadow-lg ring-2 ring-blue-400"
                    : "bg-gray-700 hover:bg-gray-600"
                }
              `}
            >
              All Types
            </button>
            
            <button
              onClick={() => setSelectedDoc("small")}
              className={`
                px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  selectedDoc === "small"
                    ? "bg-green-600 shadow-lg ring-2 ring-green-400"
                    : "bg-gray-700 hover:bg-gray-600"
                }
              `}
            >
              100 📄
            </button>
            
            <button
              onClick={() => setSelectedDoc("medium")}
              className={`
                px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  selectedDoc === "medium"
                    ? "bg-yellow-600 shadow-lg ring-2 ring-yellow-400"
                    : "bg-gray-700 hover:bg-gray-600"
                }
              `}
            >
              500 📚
            </button>
            
            <button
              onClick={() => setSelectedDoc("large")}
              className={`
                px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  selectedDoc === "large"
                    ? "bg-orange-600 shadow-lg ring-2 ring-orange-400"
                    : "bg-gray-700 hover:bg-gray-600"
                }
              `}
            >
              1K 📦
            </button>
            
            <button
              onClick={() => setSelectedDoc("xl")}
              className={`
                px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  selectedDoc === "xl"
                    ? "bg-red-600 shadow-lg ring-2 ring-red-400"
                    : "bg-gray-700 hover:bg-gray-600"
                }
              `}
            >
              5K 🚀
            </button>
            
            <button
              onClick={() => setSelectedDoc("xxl")}
              className={`
                px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  selectedDoc === "xxl"
                    ? "bg-purple-600 shadow-lg ring-2 ring-purple-400"
                    : "bg-gray-700 hover:bg-gray-600"
                }
              `}
            >
              10K 🔥
            </button>
          </div>
          
          <div className="mt-3 text-xs text-gray-400">
            Currently viewing: <span className="font-semibold text-white">{getButtonLabel()}</span>
          </div>
        </div>
      </div>
      
      <DocumentPage key={selectedDoc} initialDocument={getDocument()} />
    </div>
  );
};

export default App;
