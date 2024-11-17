import { User } from "@/types";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "./ui/label";
import { Link } from "react-router-dom";
import { UserRoundIcon } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";

interface SelectUsersProps {
  users: User[];
  selectedUserIds: number[];
  setSelectedUserIds: React.Dispatch<React.SetStateAction<number[]>>;
  className?: string;
}

const SelectUsers = ({
  users,
  selectedUserIds,
  setSelectedUserIds,
  className,
}: SelectUsersProps) => {
  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCheck = (checked: CheckedState, id: number) => {
    if (checked) setSelectedUserIds((ids) => [...ids, id]);
    else
      setSelectedUserIds((ids) => ids.filter((current_id) => current_id != id));
  };

  return (
    <div
      className={`flex flex-col gap-2 overflow-y-auto max-h-80 ${className ?? ""}`}
    >
      {users.map((user) => (
        <div
          className="mx-1 grid grid-cols-[min-content_1fr] gap-x-2 items-center"
          key={user.id}
        >
          <Checkbox
            id={`checkbox-${user.id}`}
            checked={selectedUserIds.includes(user.id)}
            onCheckedChange={(checked) => handleCheck(checked, user.id)}
          />
          <Label htmlFor={`checkbox-${user.id}`}>
            <Card className="flex items-center cursor-pointer">
              <CardContent className="flex items-center gap-2 p-1">
                <Link to={`/profile/${user.id}`} onClick={handleAvatarClick}>
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>
                      <UserRoundIcon />
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <span>{user.username}</span>
              </CardContent>
            </Card>
          </Label>
        </div>
      ))}
    </div>
  );
};

export default SelectUsers;
