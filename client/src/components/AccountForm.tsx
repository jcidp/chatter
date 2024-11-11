import { useNavigate } from "react-router-dom";
import { useAuth } from "../helpers/AuthProvider";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { AxiosError } from "axios";
import { Alert, AlertDescription } from "./ui/alert";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string(),
});

const signUpFormSchema = loginFormSchema
  .extend({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(24, "Username must be at most 24 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof signUpFormSchema>;

interface AccountFormProps {
  type: "login" | "signUp";
}

const AccountForm = ({ type }: AccountFormProps) => {
  const { isAuthenticated, signUp, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const schema = type === "login" ? loginFormSchema : signUpFormSchema;

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (type === "login") {
        await login(values);
      } else {
        await signUp(values);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Object.entries(error?.response?.data).forEach(([field, messages]) => {
          const formattedFiled =
            field === "password_confirmation" ? "confirmPassword" : field;
          form.setError(formattedFiled as keyof FormValues, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        form.setError("root", {
          type: "server",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="example@email.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {type === "signUp" && (
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="johndoe123" />
                  </FormControl>
                  <FormDescription hideOnError={true}>
                    Username must be between 3 and 24 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="********" />
                </FormControl>
                {type === "signUp" && (
                  <FormDescription hideOnError={true}>
                    Password must be at least 8 characters long
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {type === "signUp" && (
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : type === "login" ? "Login" : "Sign up"}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
