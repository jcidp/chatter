import { Skeleton } from "../ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="pt-12 flex-grow flex flex-col gap-8">
      <Skeleton className="h-72 w-72 rounded-full mx-auto" />
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
};

export default ProfileSkeleton;
