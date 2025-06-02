"use client";

import type { Event } from "@/lib/services/eventsService/types";

interface LastFertilizedDisplayProps {
  lastFertilizerEvent: Event | null | undefined;
  nextFertilizerDue: Date | null;
}

function formatDayMonth(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  // Ordinal suffix
  const j = day % 10, k = day % 100;
  let suffix = 'th';
  if (j === 1 && k !== 11) suffix = 'st';
  else if (j === 2 && k !== 12) suffix = 'nd';
  else if (j === 3 && k !== 13) suffix = 'rd';
  return `${day}${suffix} ${month}`;
}

function formatRelativeDay(date: Date) {
  const now = new Date();
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7 && diffDays > 1) {
    // e.g. 'Last Friday'
    return `Last ${date.toLocaleDateString(undefined, { weekday: 'long' })}`;
  }
  // Fallback to e.g. '5th January'
  return formatDayMonth(date);
}

function formatNextFertilizerDue(date: Date) {
  const now = new Date();
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((dateOnly.getTime() - nowOnly.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue!';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) {
    // e.g. 'Friday' (capitalize first letter)
    const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }
  // Fallback to e.g. '5th January'
  return formatDayMonth(date);
}

export default function LastFertilizedDisplay({ lastFertilizerEvent, nextFertilizerDue }: LastFertilizedDisplayProps) {
  if (!lastFertilizerEvent || !lastFertilizerEvent.timestamp) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">Never fertilized</span>;
  }

  // Format the timestamp
  const fertilizedDate = new Date(lastFertilizerEvent.timestamp);
  const formattedDate = formatRelativeDay(fertilizedDate);

  let nextFertilizerDueDisplay = null;
  if (nextFertilizerDue instanceof Date && !isNaN(nextFertilizerDue.getTime())) {
    const formattedNextFertilizerDate = formatNextFertilizerDue(nextFertilizerDue);
    nextFertilizerDueDisplay = (
      <div className="flex items-center">
        Fertilizer due: {formattedNextFertilizerDate}
      </div>
    );
  } else {
    nextFertilizerDueDisplay = (
      <div className="flex items-center text-gray-400 dark:text-gray-500">
        Fertilizer due: Unknown
      </div>
    );
  }

  return (
    <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400">
      Fertilized: {formattedDate}
      {nextFertilizerDueDisplay}
    </div>
  );
} 