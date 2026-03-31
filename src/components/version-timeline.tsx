"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, FileCode } from "lucide-react";

interface Version {
  id: string;
  version: number;
  content: string;
  createdAt: string;
}

interface VersionTimelineProps {
  versions: Version[];
  currentVersion: number;
}

export function VersionTimeline({
  versions,
  currentVersion,
}: VersionTimelineProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
          <FileCode className="h-5 w-5 text-white/30" />
        </div>
        <p className="text-white/40 text-sm">No version history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {versions
        .sort((a, b) => b.version - a.version)
        .map((version, index) => {
          const isCurrent = version.version === currentVersion;

          return (
            <div key={version.id} className="relative">
              {index < versions.length - 1 && (
                <div className="absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent" />
              )}
              <div
                className={`
                  glass-card rounded-xl p-4 transition-all duration-200
                  ${isCurrent ? 'border-green-500/30 bg-green-500/5' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCurrent
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}>
                    <FileCode className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${isCurrent ? 'text-white' : 'text-white/70'}`}>
                        Version {version.version}
                      </span>
                      {isCurrent && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-0.5">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <Calendar className="h-3 w-3" />
                      {new Date(version.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
