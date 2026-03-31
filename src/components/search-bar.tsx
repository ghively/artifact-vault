"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  const debouncedSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.push(`/?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      debouncedSearch(value);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, debouncedSearch]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
      <Input
        type="search"
        placeholder="Search artifacts..."
        className={`
          h-11 pl-11 pr-4
          glass-card rounded-xl
          text-white placeholder:text-white/30
          border-white/10
          focus:border-green-500/30 focus:ring-green-500/20
          transition-all duration-200
        `}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
