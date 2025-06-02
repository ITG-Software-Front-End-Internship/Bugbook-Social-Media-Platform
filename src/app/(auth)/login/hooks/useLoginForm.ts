import { validationsMessages } from "@/lib/constants";
import { getLoginSchema, LoginValuesType } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";

export default function useLoginForm() {
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

  return {
    loginForm,
    onSubmit,
    error,
    isPending,
  };
}
