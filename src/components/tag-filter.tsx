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
          className="h-7 px-2"
        >
          <X className="h-3 w-3 mr-1" />
          Clear filters
        </Button>
      )}

      {currentType && (
        <Badge variant="secondary" className="gap-1">
          Type: {currentType}
          <button
            onClick={() => updateFilter("type", null)}
            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {currentTag && (
        <Badge variant="secondary" className="gap-1">
          Tag: {currentTag}
          <button
            onClick={() => updateFilter("tag", null)}
            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {currentProject && (
        <Badge variant="secondary" className="gap-1">
          Project: {currentProject}
          <button
            onClick={() => updateFilter("project", null)}
            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {!hasFilters && availableTypes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {availableTypes.slice(0, 5).map((type) => (
            <Badge
              key={type}
              variant="outline"
              className="cursor-pointer hover:bg-accent"
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
