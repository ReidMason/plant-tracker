"use client";

import { Droplet } from "lucide-react";
import type { Event } from "@/lib/services/eventsService/types";

interface LastWateredDisplayProps {
  lastWaterEvent: Event | null | undefined;
  nextWaterDue: Date | null;
  refreshTrigger?: number; // Kept for compatibility, but not used for fetching
}

export default function LastWateredDisplay({ lastWaterEvent, nextWaterDue }: LastWateredDisplayProps) {
  if (!lastWaterEvent || !lastWaterEvent.timestamp) {
    return <span className="text-xs text-gray-400">Never watered</span>;
  }

  // Format the timestamp
  const wateredDate = new Date(lastWaterEvent.timestamp);
  const formattedDate = wateredDate.toLocaleDateString();
  const formattedTime = wateredDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let nextWaterDueDisplay = null;
  if (nextWaterDue instanceof Date && !isNaN(nextWaterDue.getTime())) {
    const formattedNextWaterDate = nextWaterDue.toLocaleDateString();
    const formattedNextWaterTime = nextWaterDue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    nextWaterDueDisplay = (
      <div className="flex items-center mt-1">
        <span className="h-3 w-3 mr-1 text-green-500">💧</span>
        Next water due: {formattedNextWaterDate} at {formattedNextWaterTime}
      </div>
    );
  } else {
    nextWaterDueDisplay = (
      <div className="flex items-center mt-1 text-gray-400">
        <span className="h-3 w-3 mr-1 text-green-500">💧</span>
        Next water due: Unknown
      </div>
    );
  }

  return (
    <div className="flex flex-col text-xs text-gray-500">
      <div className="flex items-center">
        <Droplet className="h-3 w-3 mr-1 text-blue-500" />
        Last watered: {formattedDate} at {formattedTime}
      </div>
      {nextWaterDueDisplay}
    </div>
  );
} 
