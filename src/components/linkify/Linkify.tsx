import { ReactNode } from "react";
import LinkifyHashtag from "./components/LinkifyHashtag";
import { LinkifyUrl } from "./components/LinkifyUrl";
import LinkifyUsername from "./components/LinkifyUsername";

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
