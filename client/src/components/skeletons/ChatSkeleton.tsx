import { Skeleton } from "../ui/skeleton";

const ChatSkeleton = () => {
  return (
    <div className="p-1 flex-grow flex flex-col gap-4">
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-11/12" />
      </div>
      <div className="flex-grow overflow-y-auto flex flex-col justify-end p-2 gap-4">
        <Skeleton className="h-10 w-1/2 self-end" />
        <Skeleton className="h-10 w-1/2 self-start" />
        <Skeleton className="h-10 w-1/2 self-start" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  );
};

export default ChatSkeleton;
