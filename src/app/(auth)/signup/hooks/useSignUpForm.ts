import { validationsMessages } from "@/lib/translationKeys";
import { getSignUpSchema, SignUpValuesType } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "../actions";

export default function useSignUpForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();

  const signUpSchemaMessages = useMemo(() => {
    return {
      emailInvalid: t(validationsMessages.email.invalid),
      userNameInvalidChars: t(validationsMessages.userName.invalidChars),
      passwordMinLength: t(validationsMessages.password.minLength),
      required: t(validationsMessages.required),
    };
  }, [t]);

  const signUpForm = useForm<SignUpValuesType>({
    resolver: zodResolver(getSignUpSchema(signUpSchemaMessages)),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValuesType) {
    console.log(`OnSubmit ......`);
    setError(undefined);
    startTransition(async () => {
      console.log(`Sign up ......`);
      try {
        const { error } = await signUp(values);
        if (error) {
          setError(error);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  return { error, isPending, signUpForm, onSubmit };
}
