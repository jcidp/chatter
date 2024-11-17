import SelectUsers from "@/components/SelectUsers";
import NewGroupSkeleton from "@/components/skeletons/NewGroupSkeleton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ApiClient from "@/helpers/ApiClient";
import { Group, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .max(24, "Must be at most 24 characters long"),
  description: z.string().max(80, "Must be at most 80 characters long"),
});

type FormValues = z.infer<typeof formSchema>;

const NewGroup = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await ApiClient.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const nameValue = form.watch("name");

  const onSubmit = async ({ name, description }: FormValues) => {
    const group: Group = {
      name,
      description,
      user_ids: selectedUserIds,
    };
    const response = await ApiClient.createGroup(group);
    if (response) navigate(`/chats/${response.id}`);
  };

  if (loading) return <NewGroupSkeleton />;

  return (
    <div className="flex flex-col overflow-y-hidden">
      <h2 className="text-2xl">New group</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col overflow-y-hidden"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="m-1">
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="My awesome group" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="m-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Here's what everyone must know..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="mt-4 mb-2">
            Add users to the group... ({selectedUserIds.length})
          </p>
          <SelectUsers
            users={users}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds}
          />
          <Button
            className="mt-4 w-full"
            disabled={!nameValue || !selectedUserIds.length}
          >
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewGroup;
