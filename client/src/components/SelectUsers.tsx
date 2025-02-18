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
    <div className={`overflow-y-auto flex flex-col gap-2 ${className ?? ""}`}>
      {users.map((user) => (
        <div className="ml-1 relative" key={user.id}>
          <Checkbox
            className="absolute top-1/2 -translate-y-1/2"
            id={`checkbox-${user.id}`}
            checked={selectedUserIds.includes(user.id)}
            onCheckedChange={(checked) => handleCheck(checked, user.id)}
          />
          <Label htmlFor={`checkbox-${user.id}`}>
            <Card className="ml-6 flex items-center cursor-pointer md:ml-8">
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
