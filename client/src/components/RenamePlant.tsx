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
        className="border rounded px-2 py-1 text-xl mb-2 w-full text-center"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        disabled={loading}
      />
      <div className="flex gap-2">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
          onClick={handleRename}
          disabled={loading || !newName.trim()}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          onClick={() => { setEditing(false); setNewName(name); }}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <h1 className="text-3xl font-extrabold text-green-900 mb-1 tracking-tight">{name}</h1>
      <button
        className="text-blue-500 underline text-sm ml-2 cursor-pointer"
        onClick={() => setEditing(true)}
        aria-label="Rename plant"
      >
        <Pencil className="w-5 h-5" />
      </button>
    </div>
  );
} 