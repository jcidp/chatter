import { Skeleton } from "../ui/skeleton";

const ListSkeleton = () => {
  const arr = Array.from({ length: 4 });

  return (
    <div className="pt-12 flex-grow flex flex-col gap-4">
      {arr.map((_, i) => (
        <div key={i} className="flex gap-4 py-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-11/12" />
        </div>
      ))}
    </div>
  );
};

export default ListSkeleton;
