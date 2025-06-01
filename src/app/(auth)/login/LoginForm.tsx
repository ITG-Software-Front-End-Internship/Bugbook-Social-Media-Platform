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
import { loginPage, validationsMessages } from "@/lib/constants";
import { getLoginSchema, LoginValuesType } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { login } from "./actions";

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();

  const loginSchemaMessages = useMemo(() => {
    return {
      userNameInvalidChars: t(validationsMessages.userName.invalidChars),
      passwordMinLength: t(validationsMessages.password.minLength),
      required: t(validationsMessages.required),
    };
  }, [t]);

  const loginSchema = useMemo(() => {
    return getLoginSchema(loginSchemaMessages);
  }, [loginSchemaMessages]);

  const loginForm = useForm<LoginValuesType>({
    resolver: zodResolver(loginSchema),
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
        setError("Unexpected error occurred. Please try again.");
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
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={loginForm.control}
          name="userName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel> {t(loginPage.username.label)} </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(loginPage.username.placeholder)}
                    {...field}
                  />
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
                <FormLabel>{t(loginPage.password.label)}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t(loginPage.password.placeholder)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          {t(loginPage.login.buttonLabel)}
        </LoadingButton>
      </form>
    </Form>
  );
}
