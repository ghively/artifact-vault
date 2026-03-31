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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground text-lg">No artifacts found</div>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first artifact to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {artifacts.map((artifact) => (
        <ArtifactCard key={artifact.id} {...artifact} />
      ))}
    </div>
  );
}
