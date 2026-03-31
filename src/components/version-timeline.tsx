"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="text-center py-8 text-muted-foreground">
        No version history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions
        .sort((a, b) => b.version - a.version)
        .map((version, index) => (
          <div key={version.id} className="relative">
            {index < versions.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border" />
            )}
            <Card
              className={
                version.version === currentVersion
                  ? "border-primary"
                  : undefined
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileCode className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Version {version.version}</span>
                      {version.version === currentVersion && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(version.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
    </div>
  );
}
