"use client";

import { User } from "@/lib/services/usersService/usersService";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  // Text size classes based on avatar size
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full transition-shadow hover:shadow-lg overflow-hidden flex items-center justify-center`}
      style={{ backgroundColor: user.colour }}
    >
      <span className={`text-white font-bold ${textSizeClasses[size]}`}>
        {user.name.charAt(0)}
      </span>
    </div>
  );
} 
