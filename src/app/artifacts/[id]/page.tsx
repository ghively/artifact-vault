import { ArtifactPreview } from "@/components/artifact-preview";
import { VersionTimeline } from "@/components/version-timeline";
import { DeleteArtifactButton } from "@/components/delete-artifact-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Edit, Star } from "lucide-react";
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

const typeStyles: Record<string, {
  color: string;
  bgGlow: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}> = {
  html: {
    color: "text-orange-500",
    bgGlow: "glow-orange",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    borderColor: "border-orange-500/20",
  },
  react: {
    color: "text-blue-500",
    bgGlow: "glow-blue",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/20",
  },
  svg: {
    color: "text-purple-500",
    bgGlow: "glow-purple",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    borderColor: "border-purple-500/20",
  },
  mermaid: {
    color: "text-pink-500",
    bgGlow: "glow-pink",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
    borderColor: "border-pink-500/20",
  },
  code: {
    color: "text-green-500",
    bgGlow: "glow-green",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    borderColor: "border-green-500/20",
  },
  markdown: {
    color: "text-gray-400",
    bgGlow: "glow-gray",
    iconBg: "bg-gray-500/10",
    iconColor: "text-gray-400",
    borderColor: "border-gray-500/20",
  },
  json: {
    color: "text-yellow-500",
    bgGlow: "glow-yellow",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
    borderColor: "border-yellow-500/20",
  },
  css: {
    color: "text-cyan-500",
    bgGlow: "glow-cyan",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
    borderColor: "border-cyan-500/20",
  },
  text: {
    color: "text-slate-400",
    bgGlow: "glow-gray",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
    borderColor: "border-slate-500/20",
  },
  python: {
    color: "text-indigo-500",
    bgGlow: "glow-indigo",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    borderColor: "border-indigo-500/20",
  },
  typescript: {
    color: "text-blue-600",
    bgGlow: "glow-blue",
    iconBg: "bg-blue-600/10",
    iconColor: "text-blue-600",
    borderColor: "border-blue-600/20",
  },
  javascript: {
    color: "text-amber-500",
    bgGlow: "glow-amber",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    borderColor: "border-amber-500/20",
  },
  shell: {
    color: "text-emerald-500",
    bgGlow: "glow-emerald",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500/20",
  },
};

const defaultStyle = typeStyles.code;

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
  const style = typeStyles[artifact.type] || defaultStyle;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 glass-card">
        <div className="container mx-auto px-6 py-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6 max-w-5xl">
          {/* Artifact header */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${style.iconBg} ${style.iconColor} flex items-center justify-center text-sm font-bold uppercase border ${style.borderColor}`}>
                    {artifact.type.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-white">{artifact.name}</h1>
                      {artifact.isFavorite && (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                {artifact.description && (
                  <p className="text-white/50 mb-4 leading-relaxed">{artifact.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`${style.iconBg} ${style.color} ${style.borderColor} border font-medium px-3 py-1`}>
                    {artifact.type}
                  </Badge>
                  {artifact.project && (
                    <Badge variant="outline" className="bg-white/5 text-white/70 border-white/10 px-3 py-1">
                      Project: {artifact.project}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/5 text-white/70 border-white/10 px-3 py-1">
                    v{artifact.version}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm text-white/40">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(artifact.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {artifact.tags && artifact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {artifact.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-white/60 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/artifacts/${id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <DeleteArtifactButton id={id} name={artifact.name} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="glass-card rounded-xl p-1 bg-white/5 border-white/10">
              <TabsTrigger
                value="preview"
                className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="versions"
                className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                Versions ({versions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-6">
              <div className="glass-card rounded-2xl p-6">
                <ArtifactPreview content={artifact.content} type={artifact.type} />
              </div>
            </TabsContent>

            <TabsContent value="versions" className="mt-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Version History</h3>
                <VersionTimeline versions={versions} currentVersion={artifact.version} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
