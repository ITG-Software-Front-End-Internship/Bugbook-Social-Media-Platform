"use client";

import { logout } from "@/app/(auth)/logout/actions";
import { useSession } from "@/app/(main)/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { headerTranslations } from "@/lib/translationKeys";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Languages, LogOutIcon, Monitor, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageDropdownMenu from "../../language/LanguageDropdownMenu";
import ThemeDropdownMenu from "../../theme/ThemeDropdownMenu";
import UserAvatar from "../userAvatar/UserAvatar";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  console.log(`UserButton ...`);

  const { user } = useSession();
  const queryClient = useQueryClient();
  const t = useTranslations();
  const { direction } = useLocaleSettings();

  const onLogoutPress = async () => {
    queryClient.clear();
    await logout();
  };

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn("flex-none cursor-pointer rounded-full", className)}
        >
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="unicode">
          <bdi>
            {t(headerTranslations.userButton.loggedInAs)} @{user.username}
          </bdi>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            {t(headerTranslations.userButton.profile)}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            &nbsp;&nbsp;
            {t(headerTranslations.userButton.theme.title)}
          </DropdownMenuSubTrigger>
          <ThemeDropdownMenu />
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages className="mr-2 size-4" />
            &nbsp;&nbsp;
            {t(headerTranslations.userButton.language.title)}
          </DropdownMenuSubTrigger>
          <LanguageDropdownMenu />
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogoutPress} className="cursor-pointer">
          <LogOutIcon className="mr-2 size-4" />
          {t(headerTranslations.userButton.logout)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
