"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

interface MenubarButtonProps {
  title: string;
  path: string;
  MenubarIconButton: ReactNode;
  menubarIconLabel: string;
  isBadge?: boolean;
  badgeCount?: number;
}

export default function MenubarButton({
  title,
  path,
  MenubarIconButton,
  menubarIconLabel,
  isBadge = false,
  badgeCount,
}: MenubarButtonProps) {
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title={title}
      asChild
    >
      <Link href={path}>
        <div className={cn(isBadge && "relative")}>
          {MenubarIconButton}
          {isBadge && badgeCount! > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {" "}
              {badgeCount}
            </span>
          )}
        </div>

        <span className="hidden lg:inline">{menubarIconLabel}</span>
      </Link>
    </Button>
  );
}
