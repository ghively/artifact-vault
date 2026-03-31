import { ArtifactGrid } from "@/components/artifact-grid";
import { SearchBar } from "@/components/search-bar";
import { TagFilter } from "@/components/tag-filter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

async function getArtifacts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/artifacts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch artifacts");
  }

  return res.json();
}

export default async function HomePage() {
  const data = await getArtifacts();
  const artifacts = data.items || [];

  const allTags: string[] = Array.from(
    new Set((artifacts as any[]).flatMap((a: any) => a.tags || []))
  ).slice(0, 20);

  const allTypes: string[] = Array.from(
    new Set(artifacts.map((a: any) => a.type))
  );

  const allProjects: string[] = Array.from(
    new Set(artifacts.map((a: any) => a.project).filter(Boolean))
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 glass-card">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Artifact Vault</h1>
                <p className="text-xs text-white/40">Your Personal Artifact Library</p>
              </div>
            </div>
            <Link href="/artifacts/new">
              <Button
                size="sm"
                className="h-9 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Artifact
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Search section */}
          <div className="flex flex-col gap-4">
            <SearchBar />
          </div>

          {/* Tag filter */}
          <TagFilter
            availableTags={allTags}
            availableTypes={allTypes}
            availableProjects={allProjects}
          />

          {/* Artifact grid */}
          <ArtifactGrid artifacts={artifacts} />
        </div>
      </main>
    </div>
  );
}
