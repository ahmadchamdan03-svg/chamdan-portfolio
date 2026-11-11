import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <Skeleton className="h-8 w-48 bg-stone-800 rounded-lg mb-2" />
          <Skeleton className="h-4 w-72 bg-stone-800/60 rounded" />
        </div>
        <Skeleton className="h-10 w-36 bg-stone-800 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-24 bg-stone-900/60 border border-stone-800 rounded-2xl" />
        <Skeleton className="h-24 bg-stone-900/60 border border-stone-800 rounded-2xl" />
        <Skeleton className="h-24 bg-stone-900/60 border border-stone-800 rounded-2xl" />
      </div>

      <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-stone-800/80">
          <Skeleton className="h-5 w-32 bg-stone-800" />
          <Skeleton className="h-8 w-44 bg-stone-800 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-stone-800/40">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3 bg-stone-800" />
                <Skeleton className="h-3 w-1/4 bg-stone-800/60" />
              </div>
              <Skeleton className="h-8 w-20 bg-stone-800 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
