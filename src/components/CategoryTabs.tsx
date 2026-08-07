import React from "react";
import { LayoutGrid, Download, Wrench, BookOpen } from "lucide-react";
import { CategoryFilter } from "../types";

interface CategoryTabsProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const tabs: { id: CategoryFilter; label: string; icon: React.ReactNode }[] = [
    { id: "All", label: "All", icon: <LayoutGrid className="w-4 h-4" /> },
    { id: "Downloader", label: "Downloader", icon: <Download className="w-4 h-4" /> },
    { id: "Agama", label: "Agama & Islami", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Utility", label: "Tools / Utility", icon: <Wrench className="w-4 h-4" /> },
  ];


  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 flex-shrink-0 ${
              isActive
                ? "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-purple-600/40 border border-pink-400/50"
                : "bg-purple-950/40 text-purple-300 hover:bg-purple-900/40 hover:text-white border border-purple-800/40"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
