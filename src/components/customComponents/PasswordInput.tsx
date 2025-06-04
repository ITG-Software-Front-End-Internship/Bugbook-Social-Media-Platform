"use client";

import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";

interface PasswordInputProps extends React.ComponentProps<"input"> {}

function PasswordInput({ className, type, ...props }: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { direction } = useLocaleSettings();

  return (
    <div className="relative">
      <Input
        className={cn("pe-10", className)}
        type={isPasswordVisible ? "text" : "password"}
        {...props}
      />
      <button
        title={isPasswordVisible ? "Hide password" : "Show password"}
        type="button"
        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        className={cn(
          "text-muted-forground absolute top-1/2 -translate-y-1/2 transform",
          direction === "ltr" ? "right-3" : "left-3",
        )}
      >
        {isPasswordVisible ? (
          <Eye className="size-5" />
        ) : (
          <EyeOff className="size-5" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
