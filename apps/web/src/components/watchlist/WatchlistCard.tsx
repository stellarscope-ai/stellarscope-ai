"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WatchlistCardProps {
  id: string;
  name: string;
  description: string | null;
  itemCount: number;
  isPublic: boolean;
  onDelete: (id: string) => void;
}

export function WatchlistCard({ id, name, description, itemCount, isPublic, onDelete }: WatchlistCardProps) {
  return (
    <Card className="hover:border-[#6366f1]/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#f8fafc]">{name}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-400">{description}</p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            {isPublic && (
              <span className="rounded-full bg-[#06b6d4]/20 px-2 py-0.5 text-[#06b6d4]">
                Public
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <a href={`/watchlists/${id}`}>
            <Button variant="outline" size="sm">View</Button>
          </a>
          <Button variant="outline" size="sm" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}