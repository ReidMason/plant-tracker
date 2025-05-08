"use client";

import { useEffect, useState } from "react";
import { Droplet } from "lucide-react";
import eventsService, { Event, EventType } from "@/lib/services/eventsService";

interface LastWateredDisplayProps {
  userId: number;
  plantId: number;
  refreshTrigger?: number; // Used to trigger a refresh when a new event is added
}

export default function LastWateredDisplay({ userId, plantId, refreshTrigger = 0 }: LastWateredDisplayProps) {
  const [lastWatered, setLastWatered] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const result = await eventsService.getPlantEvents(userId, plantId);
        if (result.ok && result.value.length > 0) {
          // Find the most recent watering event
          const wateringEvents = result.value.filter(event => event.typeId === EventType.Water);

          if (wateringEvents.length > 0) {
            // Sort by date (newest first)
            wateringEvents.sort((a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setLastWatered(wateringEvents[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching plant events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId, plantId, refreshTrigger]);

  if (loading) {
    return <span className="text-xs text-gray-400">Loading watering info...</span>;
  }

  if (!lastWatered) {
    return <span className="text-xs text-gray-400">Never watered</span>;
  }

  // Format the timestamp
  const wateredDate = new Date(lastWatered.timestamp);
  const formattedDate = wateredDate.toLocaleDateString();
  const formattedTime = wateredDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-center text-xs text-gray-500">
      <Droplet className="h-3 w-3 mr-1 text-blue-500" />
      Last watered: {formattedDate} at {formattedTime}
    </div>
  );
} 
