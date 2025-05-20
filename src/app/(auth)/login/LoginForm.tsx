"use client";

import LoadingButton from "@/components/customComponents/LoadingButton";
import { PasswordInput } from "@/components/customComponents/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validationsMessages } from "@/lib/constants";
import {
  getLoginSchema,
  getSignUpSchema,
  LoginValuesType,
  SignUpValuesType,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { login } from "./actions";

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const t = useTranslations();
  const loginSchemaMessages = {
    userNameInvalidChars: t(validationsMessages.userName.invalidChars),
    passwordMinLength: t(validationsMessages.password.minLength),
    required: t(validationsMessages.required),
  };

  const loginForm = useForm<LoginValuesType>({
    resolver: zodResolver(getLoginSchema(loginSchemaMessages)),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValuesType) {
    setError(undefined);
    startTransition(async () => {
      try {
        const { error } = await login(values);
        if (error) {
          setError(error);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onSubmit, (errors) => {
          console.log("Validation failed:", errors);
        })}
        className="space-y-3"
      >
        {error && <p className="text-destructive text-center">{error}</p>}
        <FormField
          control={loginForm.control}
          name="userName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          Login
        </LoadingButton>
      </form>
    </Form>
  );
}
