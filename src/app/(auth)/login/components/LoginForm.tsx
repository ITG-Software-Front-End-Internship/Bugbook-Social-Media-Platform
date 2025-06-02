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
import { loginPageMessages, validationsMessages } from "@/lib/constants";
import { useTranslations } from "next-intl";
import useLoginForm from "./hooks/useLoginForm";

export default function LoginForm() {
  console.log("Login form render ...");

  const t = useTranslations();
  const { loginForm, onSubmit, error, isPending } = useLoginForm();

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
                <FormLabel> {t(loginPageMessages.username.label)} </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(loginPageMessages.username.placeholder)}
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
                <FormLabel>{t(loginPageMessages.password.label)}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t(loginPageMessages.password.placeholder)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          {t(loginPageMessages.login.buttonLabel)}
        </LoadingButton>
      </form>
    </Form>
  );
}
