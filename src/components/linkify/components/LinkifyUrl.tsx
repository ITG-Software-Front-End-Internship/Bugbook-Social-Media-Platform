import { ReactNode } from "react";
import { LinkItUrl } from "react-linkify-it";

interface LinkifyProps {
  children: ReactNode;
}

export function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}
