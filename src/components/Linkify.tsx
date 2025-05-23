import Link from "next/link";
import { ReactNode } from "react";
import { LinkIt, LinkItUrl } from "react-linkify-it";

interface LinkifyProps {
  children: ReactNode;
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  const userTagRegex: RegExp = /(@[a-zA-Z0-9_-]+)/g;

  return (
    <LinkIt
      regex={userTagRegex}
      component={(match, key) => {
        const userTag = match;
        const username = userTag.slice(1);

        return (
          <Link
            key={key}
            href={`/users/${username}`}
            className="text-primary hover:underline"
          >
            {userTag}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
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
