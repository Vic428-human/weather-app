import { Skeleton } from "@/components/ui/skeleton"; //https://ui.shadcn.com/docs/components/skeleton

function WeatherSkeleton() {
  return (
    // control the space between elements: space-x-<number>
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Using a custom value : h-[<value>]*/}
        {/* Skeleton 預設是垂直往下，所以gap也是這兩個 Skeleton 之間的垂直間距*/}
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default WeatherSkeleton;
