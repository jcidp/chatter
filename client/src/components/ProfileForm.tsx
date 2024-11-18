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
import {
  bioFormSchema,
  groupNameFormSchema,
  usernameFormSchema,
} from "@/helpers/formSchemas";

type FormValues =
  | z.infer<typeof usernameFormSchema>
  | z.infer<typeof bioFormSchema>
  | z.infer<typeof groupNameFormSchema>;

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
  const schema =
    fieldType === "username"
      ? type === "group"
        ? groupNameFormSchema
        : usernameFormSchema
      : bioFormSchema;
  const mappedDefaultValue =
    type === "group" && fieldType === "username"
      ? { name: defaultValue.username }
      : defaultValue;
  const mappedFieldType =
    type === "group" && fieldType === "username" ? "name" : fieldType;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: mappedDefaultValue,
  });

  useEffect(() => {
    form.reset(mappedDefaultValue);
  }, [defaultValue, form, type, fieldType]);

  const onSubmit = async (values: FormValues) => {
    try {
      await handleSubmit(values);
    } catch (error) {
      if (error instanceof AxiosError) {
        const messages = error?.response?.data[fieldType];
        form.setError(mappedFieldType, {
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

  const closeInputOnEsc = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.code === "Escape") handleActivateInput("");
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
              name={mappedFieldType}
              render={({ field }) => (
                <FormItem className="mt-2 mb-4">
                  <FormControl>
                    {fieldType === "username" ? (
                      <Input
                        {...field}
                        autoFocus
                        onKeyDown={closeInputOnEsc}
                        className="text-base"
                      />
                    ) : (
                      <Textarea
                        {...field}
                        autoFocus
                        onKeyDown={closeInputOnEsc}
                        className="text-base"
                      />
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
