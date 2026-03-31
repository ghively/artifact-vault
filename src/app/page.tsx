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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Artifact Vault v3</h1>
              <p className="text-sm text-muted-foreground">
                Your personal artifact library
              </p>
            </div>
            <Link href="/artifacts/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Artifact
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar />
          </div>

          <TagFilter
            availableTags={allTags}
            availableTypes={allTypes}
            availableProjects={allProjects}
          />

          <ArtifactGrid artifacts={artifacts} />
        </div>
      </main>
    </div>
  );
}
