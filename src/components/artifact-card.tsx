import Link from "next/link";
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
  const style = typeStyles[type] || defaultStyle;
  const date = new Date(updatedAt).toLocaleDateString();

  return (
    <Link href={`/artifacts/${id}`} className="block">
      <div className="group relative h-full">
        <div className={`
          glass-card rounded-xl p-5 h-full
          transition-all duration-300 ease-out
          hover:-translate-y-1 hover:shadow-xl
          ${style.bgGlow}
          hover:border-opacity-30
        `}>
          {/* Type indicator bar */}
          <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${style.color}`} />

          <div className="flex items-start gap-3 mb-3">
            {/* Type icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center ${style.color}`}>
              <span className="text-xs font-bold uppercase">{type.slice(0, 2)}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white truncate group-hover:text-white/90 transition-colors">
                  {name}
                </h3>
                {isFavorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                )}
              </div>

              {description && (
                <p className="text-sm text-white/50 line-clamp-2 mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-white/60 border border-white/10"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-white/40">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <Badge className={`${style.iconBg} ${style.color} ${style.borderColor} border font-medium`}>
              {type}
            </Badge>
            {project && (
              <span className="text-xs text-white/40">{project}</span>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-white/30">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
        </div>
      </div>
    </Link>
  );
}
