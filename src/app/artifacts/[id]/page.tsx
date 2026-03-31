import { ArtifactPreview } from "@/components/artifact-preview";
import { VersionTimeline } from "@/components/version-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Edit, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getArtifact(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/artifacts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function getArtifactVersions(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/artifacts/${id}/versions`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function ArtifactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artifact = await getArtifact(id);

  if (!artifact) {
    notFound();
  }

  const versions = await getArtifactVersions(id);

  const typeColors: Record<string, string> = {
    html: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    react: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    svg: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    mermaid: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    code: "bg-green-500/10 text-green-500 border-green-500/20",
    markdown: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    json: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    css: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    text: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    python: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    typescript: "bg-blue-600/10 text-blue-600 border-blue-600/20",
    javascript: "bg-yellow-600/10 text-yellow-600 border-yellow-600/20",
    shell: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{artifact.name}</h1>
                  {artifact.isFavorite && (
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                {artifact.description && (
                  <p className="text-muted-foreground">{artifact.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/artifacts/${id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" form="delete-form">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Badge variant="outline" className={typeColors[artifact.type]}>
                {artifact.type}
              </Badge>
              {artifact.project && (
                <Badge variant="secondary">Project: {artifact.project}</Badge>
              )}
              <Badge variant="outline">v{artifact.version}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(artifact.updatedAt).toLocaleDateString()}
              </div>
            </div>

            {artifact.tags && artifact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {artifact.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="versions">Versions ({versions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Artifact Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ArtifactPreview content={artifact.content} type={artifact.type} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="versions">
              <Card>
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                </CardHeader>
                <CardContent>
                  <VersionTimeline versions={versions} currentVersion={artifact.version} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <form id="delete-form" action={`/api/artifacts/${id}`} method="DELETE" className="hidden">
        <button type="submit">Delete</button>
      </form>
    </div>
  );
}
