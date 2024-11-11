import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { HandleProfileSubmit } from "@/types";

const usernameFormSchema = z.object({
  username: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .max(24, "Must be at most 24 characters long"),
});

const bioFormSchema = z.object({
  bio: z.string().max(80, "Must be at most 80 characters long"),
});

type FormValues =
  | z.infer<typeof usernameFormSchema>
  | z.infer<typeof bioFormSchema>;

interface ProfileFormProps {
  type: "user" | "group";
  fieldType: "username" | "bio";
  defaultValue: {
    username?: string;
    bio?: string;
  };
  activeInput: string;
  handleActivateInput: (type: string) => void;
  isEditable: boolean;
  handleSubmit: HandleProfileSubmit;
}

const ProfileForm = ({
  type,
  fieldType,
  defaultValue,
  activeInput,
  handleActivateInput,
  isEditable,
  handleSubmit,
}: ProfileFormProps) => {
  const schema = fieldType === "username" ? usernameFormSchema : bioFormSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValue,
  });

  useEffect(() => {
    form.reset(defaultValue);
  }, [defaultValue, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await handleSubmit(values);
    } catch (error) {
      if (error instanceof AxiosError) {
        const messages = error?.response?.data[fieldType];
        form.setError(fieldType, {
          type: "server",
          message: Array.isArray(messages) ? messages[0] : messages,
        });
      } else {
        form.setError("root", {
          type: "server",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <>
      <span>
        <strong>
          {fieldType === "username"
            ? type === "group"
              ? "Name"
              : "Username"
            : type === "group"
              ? "Description"
              : "Bio"}
          :
        </strong>
      </span>
      {activeInput === fieldType ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="inline">
            <button type="submit">
              <CheckIcon className="inline cursor-pointer mx-2 stroke-green-700" />
            </button>
            <XIcon
              className="inline cursor-pointer stroke-red-700"
              onClick={() => handleActivateInput(fieldType)}
            />
            <FormField
              control={form.control}
              name={fieldType}
              render={({ field }) => (
                <FormItem className="mt-2 mb-4">
                  <FormControl>
                    {fieldType === "username" ? (
                      <Input {...field} autoFocus className="text-base" />
                    ) : (
                      <Textarea {...field} autoFocus className="text-base" />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <>
          {isEditable && (
            <PencilIcon
              className="inline w-5 mx-2 cursor-pointer"
              onClick={() => handleActivateInput(fieldType)}
            />
          )}
          <p className="mt-2 mb-8">{defaultValue[fieldType] || "(Empty)"}</p>
        </>
      )}
    </>
  );
};

export default ProfileForm;
