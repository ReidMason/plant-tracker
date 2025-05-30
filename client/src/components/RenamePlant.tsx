"use client";
import { useState } from "react";
import { updatePlantName } from "@/lib/services/plantsService/plantsService";
import { Pencil } from "lucide-react";

interface RenamePlantProps {
  name: string;
  plantId: number | string;
  userId: number | string;
}

export default function RenamePlant({ name, plantId, userId }: RenamePlantProps) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRename = async () => {
    setLoading(true);
    setError(null);
    const result = await updatePlantName(userId, plantId, newName);
    setLoading(false);
    if (result.ok) {
      setEditing(false);
      window.location.reload();
    } else {
      setError((result.error instanceof Error ? result.error.message : result.error) || "Failed to rename plant");
    }
  };

  return editing ? (
    <div className="flex flex-col items-center w-full">
      <input
        className="border border-emerald-200 rounded-lg px-3 py-2 text-xl mb-3 w-full text-center bg-white/70 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400 dark:bg-gray-700/50 dark:border-emerald-700/50 dark:focus:border-emerald-500 dark:text-gray-200"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        disabled={loading}
        autoFocus
      />
      <div className="flex gap-3">
        <button
          className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 font-medium shadow-md transition-all duration-200"
          onClick={handleRename}
          disabled={loading || !newName.trim()}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          className="bg-white/70 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200 font-medium transition-all duration-200"
          onClick={() => { setEditing(false); setNewName(name); }}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
      {error && <div className="text-red-500 dark:text-red-400 mt-3 text-sm">{error}</div>}
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight text-center">{name}</h1>
      <button
        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 cursor-pointer transition-colors duration-200"
        onClick={() => setEditing(true)}
        aria-label="Rename plant"
      >
        <Pencil className="w-5 h-5" />
      </button>
    </div>
  );
} 