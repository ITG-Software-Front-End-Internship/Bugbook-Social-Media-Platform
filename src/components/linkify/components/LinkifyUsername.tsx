import UserLinkWithTooltip from "@/components/userTooltip/UserLinkWithTooltip";
import { ReactNode } from "react";
import { LinkIt } from "react-linkify-it";

interface LinkifyProps {
  children: ReactNode;
}

export default function LinkifyUsername({ children }: LinkifyProps) {
  const userTagRegex: RegExp = /(@[a-zA-Z0-9_-]+)/g;

  return (
    <LinkIt
      regex={userTagRegex}
      component={(match, key) => {
        const userTag = match;
        const username = userTag.slice(1);

        return (
          <UserLinkWithTooltip username={username} key={key}>
            {userTag}
          </UserLinkWithTooltip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}
