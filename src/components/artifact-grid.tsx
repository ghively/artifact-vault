import { ArtifactCard } from "./artifact-card";

interface Artifact {
  id: string;
  name: string;
  description: string | null;
  type: string;
  tags: string[];
  project: string | null;
  isFavorite: boolean;
  updatedAt: string;
}

interface ArtifactGridProps {
  artifacts: Artifact[];
}

export function ArtifactGrid({ artifacts }: ArtifactGridProps) {
  if (artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white/80 mb-1">No artifacts found</h3>
        <p className="text-sm text-white/40">
          Create your first artifact to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {artifacts.map((artifact, index) => (
        <div
          key={artifact.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ArtifactCard {...artifact} />
        </div>
      ))}
    </div>
  );
}
