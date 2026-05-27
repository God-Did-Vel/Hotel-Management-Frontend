import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const styles: React.CSSProperties = {
    width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
  };

  const getVariantClass = () => {
    switch (variant) {
      case "circular":
        return "rounded-full";
      case "text":
        return "rounded h-4 w-full";
      case "rectangular":
      default:
        return "rounded";
    }
  };

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-[length:200%_100%] ${getVariantClass()} ${className}`}
      style={styles}
    />
  );
}

// Preset: Room Card Loading State
export function RoomCardSkeleton() {
  return (
    <div className="bg-[#0f0d0a] overflow-hidden border border-white/[0.04] rounded-lg">
      {/* Image skeleton */}
      <Skeleton className="h-64 w-full" />
      {/* Body skeleton */}
      <div className="p-7 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}

// Preset: Table Row Loading State
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/[0.04] animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-3/4 my-1" />
        </td>
      ))}
    </tr>
  );
}
