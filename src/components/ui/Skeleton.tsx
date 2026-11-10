import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-stone-200/80 dark:bg-stone-800/80 rounded-md ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
