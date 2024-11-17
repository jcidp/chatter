import { Skeleton } from "../ui/skeleton";
import ListSkeleton from "./ListSkeleton";

const NewGroupSkeleton = () => {
  return (
    <div className="pt-12 flex-grow flex flex-col gap-4">
      <Skeleton className="h-12 w-11/12" />
      <Skeleton className="h-12 w-11/12" />
      <ListSkeleton />
    </div>
  );
};

export default NewGroupSkeleton;
