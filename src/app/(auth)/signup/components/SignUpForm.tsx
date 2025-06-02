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
import { signupPageTranslations } from "@/lib/constants";
import { useTranslations } from "next-intl";
import useSignUpForm from "../hooks/useSignUpForm";

export default function SignUpForm() {
  const { error, isPending, signUpForm, onSubmit } = useSignUpForm();
  const t = useTranslations();

  return (
    <Form {...signUpForm}>
      <form
        onSubmit={signUpForm.handleSubmit(onSubmit, (errors) => {
          console.log("Validation failed:", errors);
        })}
        className="space-y-3"
      >
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={signUpForm.control}
          name="username"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  {t(signupPageTranslations.username.label)}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(signupPageTranslations.username.placeholder)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={signUpForm.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{t(signupPageTranslations.email.label)}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(signupPageTranslations.email.placeholder)}
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={signUpForm.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  {t(signupPageTranslations.password.label)}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t(signupPageTranslations.password.placeholder)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          {t(signupPageTranslations.signup.buttonLabel)}
        </LoadingButton>
      </form>
    </Form>
  );
}
