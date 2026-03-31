"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

interface TagFilterProps {
  availableTags: string[];
  availableTypes: string[];
  availableProjects: string[];
}

const typeStyles: Record<string, string> = {
  html: "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30",
  react: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30",
  svg: "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30",
  mermaid: "bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30",
  code: "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30",
  markdown: "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30",
  json: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30",
  css: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30",
  text: "bg-slate-500/20 text-slate-400 border-slate-500/30 hover:bg-slate-500/30",
  python: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30",
  typescript: "bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/30",
  javascript: "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30",
  shell: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30",
};

export function TagFilter({
  availableTags,
  availableTypes,
  availableProjects,
}: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type");
  const currentTag = searchParams.get("tag");
  const currentProject = searchParams.get("project");

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/");
  };

  const hasFilters = currentType || currentTag || currentProject;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-8 px-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
        >
          <X className="h-3.5 w-3.5 mr-1.5" />
          Clear filters
        </Button>
      )}

      {currentType && (
        <Badge
          variant="outline"
          className={`${typeStyles[currentType] || typeStyles.code} gap-1.5 px-3 py-1.5 rounded-lg border`}
        >
          Type: {currentType}
          <button
            onClick={() => updateFilter("type", null)}
            className="ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {currentTag && (
        <Badge
          variant="outline"
          className="bg-white/5 text-white/70 border-white/10 gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10"
        >
          Tag: {currentTag}
          <button
            onClick={() => updateFilter("tag", null)}
            className="ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {currentProject && (
        <Badge
          variant="outline"
          className="bg-white/5 text-white/70 border-white/10 gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10"
        >
          Project: {currentProject}
          <button
            onClick={() => updateFilter("project", null)}
            className="ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {!hasFilters && availableTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTypes.slice(0, 6).map((type) => (
            <Badge
              key={type}
              variant="outline"
              className={`${typeStyles[type] || typeStyles.code} cursor-pointer px-3 py-1.5 rounded-lg border transition-all`}
              onClick={() => updateFilter("type", type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
