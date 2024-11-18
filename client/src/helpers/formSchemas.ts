import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string(),
});

const usernameFormSchema = z.object({
  username: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .max(20, "Must be at most 20 characters long")
    .regex(
      /^[a-z0-9._-]*$/,
      "Can only contain lowercase letters, numbers, and special characters (., _, -)",
    )
    .refine(
      (val) => /^[a-z0-9].*[a-z0-9]$/.test(val),
      "Must start and end with a letter or number",
    )
    .refine((val) => !/[A-Z]/.test(val), "Cannot contain uppercase letters")
    .refine(
      (val) => !/[._-]{2}/.test(val),
      "Special characters (., _, -) cannot be consecutive",
    ),
});

const signUpFormSchema = loginFormSchema
  .extend({
    ...usernameFormSchema.shape,
    password: z.string().min(8, "Must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const groupNameFormSchema = z.object({
  name: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .max(24, "Must be at most 24 characters long"),
});

const bioFormSchema = z.object({
  bio: z.string().max(80, "Must be at most 80 characters long"),
});

const groupFormSchema = groupNameFormSchema.extend({
  description: bioFormSchema.shape.bio,
});

export {
  loginFormSchema,
  signUpFormSchema,
  usernameFormSchema,
  groupNameFormSchema,
  bioFormSchema,
  groupFormSchema,
};
