import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from "lucide-react";

interface ArtifactCardProps {
  id: string;
  name: string;
  description: string | null;
  type: string;
  tags: string[];
  project: string | null;
  isFavorite: boolean;
  updatedAt: string;
}

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

export function ArtifactCard({
  id,
  name,
  description,
  type,
  tags,
  project,
  isFavorite,
  updatedAt,
}: ArtifactCardProps) {
  const date = new Date(updatedAt).toLocaleDateString();

  return (
    <Link href={`/artifacts/${id}`}>
      <Card className="h-full transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate flex items-center gap-2">
                {name}
                {isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              </CardTitle>
              {description && (
                <CardDescription className="line-clamp-2 mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={typeColors[type] || typeColors.code}>
              {type}
            </Badge>
            {project && (
              <Badge variant="secondary" className="text-xs">
                {project}
              </Badge>
            )}
          </div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 4}
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
