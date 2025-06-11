import Link from "next/link";
import { ReactNode } from "react";
import { LinkIt } from "react-linkify-it";

interface LinkifyProps {
  children: ReactNode;
}

export default function LinkifyHashtag({ children }: LinkifyProps) {
  const hashtagRegex: RegExp = /(#[a-zA-Z0-9]+)/;

  return (
    <LinkIt
      regex={hashtagRegex}
      component={(match, key) => {
        const hashtag = match;
        const tag = hashtag.slice(1);

        return (
          <Link
            key={key}
            href={`/hashtag/${tag}`}
            className="text-primary hover:underline"
          >
            {hashtag}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}
